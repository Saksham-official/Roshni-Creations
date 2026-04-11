from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import products_collection, cart_collection
from .models import CartItem, ProductModel
import json
import os

app = FastAPI()

# VERY IMPORTANT: This allows your React frontend to talk to your Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/products")
async def get_products():
    products = []
    async for product in products_collection.find():
        # Convert MongoDB _id to string for JSON compatibility
        product["_id"] = str(product["_id"])
        products.append(product)
    return products

@app.get("/cart")
async def get_cart():
    items = []
    async for item in cart_collection.find():
        item["_id"] = str(item["_id"])
        items.append(item)
    return items

@app.post("/cart")
async def add_to_cart(item: CartItem):
    await cart_collection.insert_one(item.dict())
    return {"status": "success"}

@app.post("/seed")
async def seed_database():
    file_path = os.path.join(os.path.dirname(__file__), "data", "products.json")
    if not os.path.exists(file_path):
        return {"status": "error", "message": "JSON file not found"}
        
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    products_to_insert = data.get("products", [])
    if not products_to_insert:
        return {"status": "error", "message": "No products to insert"}
        
    # Clear existing to avoid duplicates in this simple seed logic
    await products_collection.delete_many({})
    await products_collection.insert_many(products_to_insert)
    
    return {"status": "success", "message": f"Inserted {len(products_to_insert)} products"}