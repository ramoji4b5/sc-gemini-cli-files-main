import pandas as pd
from flask import Flask, render_template, jsonify, request
import os

app = Flask(__name__)

# Load the cleaned dataset
DATA_PATH = os.path.join('..', 'crm_import_ready.csv')

def load_data():
    if not os.path.exists(DATA_PATH):
        return pd.DataFrame()
    return pd.read_csv(DATA_PATH)

@app.route('/')
def index():
    df = load_data()
    if df.empty:
        return "Data not found. Please run the processing script first."
    
    # Core Metrics
    total_leads = len(df)
    hot_leads = len(df[df['Priority_Segment'] == 'Hot'])
    warm_leads = len(df[df['Priority_Segment'] == 'Warm'])
    cold_leads = len(df[df['Priority_Segment'] == 'Cold'])
    
    # Top 5 Companies for Bar Chart
    top_companies = df['Company'].value_counts().head(5).to_dict()
    
    # Segment Distribution for Pie Chart
    segments = df['Priority_Segment'].value_counts().to_dict()
    
    # Top Countries
    top_countries = df['Country'].value_counts().head(10).to_dict()

    return render_template('index.html', 
                           total=total_leads, 
                           hot=hot_leads, 
                           warm=warm_leads, 
                           cold=cold_leads,
                           top_companies=top_companies,
                           segments=segments,
                           top_countries=top_countries)

@app.route('/api/leads')
def get_leads():
    df = load_data()
    # Basic filtering
    company = request.args.get('company')
    segment = request.args.get('segment')
    title = request.args.get('title')
    
    if company:
        df = df[df['Company'].str.contains(company, case=False, na=False)]
    if segment:
        df = df[df['Priority_Segment'] == segment]
    if title:
        df = df[df['Title'].str.contains(title, case=False, na=False)]
        
    return jsonify(df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)
