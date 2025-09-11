import requests
import json

def fetch_and_count_api_data():
    base_url = "https://hunlex-api.onrender.com"
    
    try:
        print("Fetching lawyers from /api/lawyers...")
        lawyers_response = requests.get(f"{base_url}/api/lawyers")
        lawyers_response.raise_for_status()
        lawyers_data = lawyers_response.json()
        lawyers_count = len(lawyers_data)
        
        print("Fetching law firms from /api/firms...")
        firms_response = requests.get(f"{base_url}/api/firms")
        firms_response.raise_for_status()
        firms_data = firms_response.json()
        firms_count = len(firms_data)
        
        print(f"\n=== API Data Count Summary ===")
        print(f"Total Lawyers: {lawyers_count}")
        print(f"Total Law Firms: {firms_count}")
        print(f"Total Records: {lawyers_count + firms_count}")
        
        return lawyers_count, firms_count
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Make sure the server is running on http://localhost:3000")
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    fetch_and_count_api_data()