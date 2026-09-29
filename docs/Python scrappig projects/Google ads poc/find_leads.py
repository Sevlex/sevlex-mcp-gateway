import pandas as pd
from serpapi import GoogleSearch
import time

# --- CONFIGURATION ---
SERP_API_KEY = "1351f6fc23e1e408e20d8086c7482c58bb171ba3689a463e3e1a803c6700be5b"  # <--- Put your key inside the quotes
INPUT_FILE = "Missing_Fintech_POCs.csv"
OUTPUT_FILE = "Fintech_LinkedIn_Accounts.csv"

# 1. Load the missing companies
df = pd.read_csv(INPUT_FILE)
results = []

print(f"🚀 Starting search for {len(df)} companies...")

# 2. Loop through each company and search Google
for index, row in df.iterrows():
    company = row['Company Names']
    print(f"🔍 Searching for POC at: {company}")
    
    # We target the specific persona you need for Verseodin
    search_query = f"site:linkedin.com/in/ '{company}' (Head of Growth OR VP Marketing OR SEO Manager)"
    
    params = {
        "engine": "google",
        "q": search_query,
        "api_key": SERP_API_KEY
    }
    
    try:
        search = GoogleSearch(params)
        res = search.get_dict()
        
        if "organic_results" in res and len(res["organic_results"]) > 0:
            top_result = res["organic_results"][0]
            results.append({
                "Company": company,
                "POC Name": top_result.get("title", "").split(" - ")[0], # Cleans the name
                "LinkedIn URL": top_result.get("link"),
                "Snippet": top_result.get("snippet")
            })
        else:
            results.append({"Company": company, "POC Name": "Not Found", "LinkedIn URL": "N/A"})
            
    except Exception as e:
        print(f"❌ Error searching for {company}: {e}")
    
    # Small delay to keep things smooth
    time.sleep(1)

# 3. Save the results to a new CSV
final_df = pd.DataFrame(results)
final_df.to_csv(OUTPUT_FILE, index=False)

print(f"✅ Finished! Your leads are in {OUTPUT_FILE}")