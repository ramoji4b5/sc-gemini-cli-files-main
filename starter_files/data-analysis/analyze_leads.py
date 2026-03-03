import pandas as pd
import collections

def deep_analysis():
    df = pd.read_csv('crm_import_ready.csv')
    
    # 1. Audience Insights
    top_5_companies = df['Company'].value_counts().head(5).to_dict()
    top_5_countries = df['Country'].value_counts().head(5).to_dict()
    top_5_titles = df['Title'].value_counts().head(5).to_dict()
    
    # 2. Conference Insights
    # Explode Session IDs
    all_sessions = []
    for sessions in df['Session ID'].dropna():
        all_sessions.extend([s.strip() for s in str(sessions).split(';')])
    
    session_counts = collections.Counter(all_sessions)
    top_5_sessions = session_counts.most_common(5)
    
    # Session Type Analysis (Prefix extraction)
    session_types = collections.defaultdict(list)
    for sess, count in session_counts.items():
        prefix = sess.split('-')[0] if '-' in sess else sess[:3]
        session_types[prefix].append((sess, count))
    
    top_per_type = {}
    for stype, sessions in session_types.items():
        top_per_type[stype] = sorted(sessions, key=lambda x: x[1], reverse=True)[0]

    # Keyword Analysis for Topics (simplified)
    all_notes = " ".join(df['Notes'].dropna().str.lower())
    keywords = ['kubernetes', 'ai', 'machine learning', 'security', 'rust', 'cloud', 'data warehouse', 'ci/cd', 'microservices', 'gdpr', 'graphql', 'edge computing']
    topic_counts = {kw: all_notes.count(kw) for kw in keywords}
    top_topics = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:5]

    # 3. Key Metrics (re-calculating for consistency)
    metrics = {
        "Unique Leads": len(df),
        "Hot": len(df[df['Priority_Segment'] == 'Hot']),
        "Warm": len(df[df['Priority_Segment'] == 'Warm']),
        "Cold": len(df[df['Priority_Segment'] == 'Cold'])
    }

    # Print results for report construction
    print("--- AUDIENCE INSIGHTS ---")
    print(f"Top Companies: {top_5_companies}")
    print(f"Top Countries: {top_5_countries}")
    print(f"Top Titles: {top_5_titles}")
    
    print("\n--- CONFERENCE INSIGHTS ---")
    print(f"Top 5 Sessions: {top_5_sessions}")
    print(f"Top Session per Type: {top_per_type}")
    print(f"Popular Topics: {top_topics}")
    
    print("\n--- KEY METRICS ---")
    print(metrics)

if __name__ == "__main__":
    deep_analysis()
