import json
from pymongo import MongoClient
import os

def seed():
    url = "mongodb+srv://parv240385_db_user:malikji0002@cluster0.h0r1tl3.mongodb.net/?appName=Cluster0zz"
    print("Connecting to MongoDB...")
    try:
        client = MongoClient(url, serverSelectionTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        print("Connected successfully.")
        
        db = client["roshni_creations"]
        products_collection = db["products"]
        
        data_path = os.path.join(os.path.dirname(__file__), "app", "data", "products.json")
        if os.path.exists(data_path):
            with open(data_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                
            products = data.get("products", [])
            if products:
                print(f"Found {len(products)} products. Removing old ones...")
                products_collection.delete_many({})
                products_collection.insert_many(products)
                print(f"Successfully seeded {len(products)} products to the database!")
            else:
                print("No products found in the data file.")
        else:
            print(f"Data file not found at {data_path}")
            
    except Exception as e:
        print(f"Failed to connect or seed database: {e}")

if __name__ == "__main__":
    seed()
