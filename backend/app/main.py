from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import products_collection, cart_collection
from pydantic import BaseModel


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
    async for product in product_collection.find():
        # Convert MongoDB _id to string for JSON compatibility
        product["_id"] = str(product["_id"])
        products.append(product)
    return products

@app.post("/cart")
async def add_to_cart(item: CartItem):
    await cart_collection.insert_one(item.dict())
    return {"status": "success"}