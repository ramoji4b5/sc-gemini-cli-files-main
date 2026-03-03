import pandas as pd
import glob
import os
import re

def clean_and_process():
    # 1. Consolidate & Deduplicate
    all_files = glob.glob(os.path.join('lead-scan', '*.csv'))
    
    if not all_files:
        print("No CSV files found in 'lead-scan' directory.")
        return

    dfs = []
    total_raw_records = 0
    for file in all_files:
        df = pd.read_csv(file)
        total_raw_records += len(df)
        dfs.append(df)
    
    consolidated_df = pd.concat(dfs, ignore_index=True)

    # 4. Validate (Pre-cleaning check for Email)
    def is_valid_email(email):
        if pd.isna(email):
            return False
        # Simple regex for @ and domain extension
        return bool(re.match(r"[^@]+@[^@]+\.[^@]+", str(email)))

    valid_mask = consolidated_df['Email'].apply(is_valid_email)
    invalid_records = len(consolidated_df) - valid_mask.sum()
    consolidated_df = consolidated_df[valid_mask]

    # Sort by Timestamp to handle conflict resolution (most recent last)
    consolidated_df['Timestamp'] = pd.to_datetime(consolidated_df['Timestamp'], format='ISO8601')
    consolidated_df = consolidated_df.sort_values(by='Timestamp')

    # 2. Conflict Resolution & 3. Aggregation
    # Custom aggregation logic
    agg_dict = {
        'First Name': 'last',
        'Last Name': 'last',
        'Company': 'last',
        'Phone': 'last',
        'Title': 'last',
        'Address': 'last',
        'City': 'last',
        'State': 'last',
        'Postal Code': 'last',
        'Country': 'last',
        'Lead Score': 'max',
        'Timestamp': 'last'
    }

    # Group by Email
    grouped = consolidated_df.groupby('Email')

    # Custom aggregation for Notes and Session ID
    def aggregate_notes(notes):
        notes_list = [str(n) for n in notes if pd.notna(n)]
        return " | ".join(notes_list) if notes_list else ""

    def aggregate_sessions(sessions):
        sessions_list = list(set([str(s) for s in sessions if pd.notna(s)]))
        return "; ".join(sorted(sessions_list)) if sessions_list else ""

    # Perform aggregation
    final_df = grouped.agg(agg_dict)
    final_df['Notes'] = grouped['Notes'].apply(aggregate_notes)
    final_df['Session ID'] = grouped['Session ID'].apply(aggregate_sessions)
    
    # Reset index to bring Email back as a column
    final_df = final_df.reset_index()

    # 5. Score & Segment
    def get_priority_segment(score):
        if pd.isna(score):
            return 'Cold'
        if score > 75:
            return 'Hot'
        elif 40 <= score <= 75:
            return 'Warm'
        else:
            return 'Cold'

    final_df['Priority_Segment'] = final_df['Lead Score'].apply(get_priority_segment)

    # Save final cleaned dataset
    final_df.to_csv('crm_import_ready.csv', index=False)

    # Report metrics
    print(f"Total Raw Records: {total_raw_records}")
    print(f"Unique Leads: {len(final_df)}")
    print(f"Invalid Records (Bad Email): {invalid_records}")
    
    segment_counts = final_df['Priority_Segment'].value_counts()
    print("\nPriority Segment Breakdown:")
    for segment in ['Hot', 'Warm', 'Cold']:
        count = segment_counts.get(segment, 0)
        print(f"{segment}: {count}")

if __name__ == "__main__":
    clean_and_process()
