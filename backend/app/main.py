from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import products_collection, cart_collection, users_collection
from .models import CartItem, ProductModel, UserCreate, UserLogin, UserResponse
import bcrypt
import json
import os

app = FastAPI()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    
    result = await users_collection.insert_one(user_dict)
    return {"id": str(result.inserted_id), "email": user.email, "role": user.role}

@app.post("/login", response_model=UserResponse)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"id": str(db_user["_id"]), "email": db_user["email"], "role": db_user.get("role", "customer")}

@app.get("/products")
async def get_products():
    products = []
    async for product in products_collection.find():
        product["_id"] = str(product["_id"])
        products.append(product)
    return products

@app.get("/cart/{user_id}")
async def get_cart(user_id: str):
    items = []
    async for item in cart_collection.find({"user_id": user_id}):
        item["_id"] = str(item["_id"])
        items.append(item)
    return items

@app.post("/cart")
async def add_to_cart(item: CartItem):
    existing = await cart_collection.find_one({"user_id": item.user_id, "product_id": item.product_id})
    if existing:
        await cart_collection.update_one(
            {"_id": existing["_id"]},
            {"$inc": {"quantity": item.quantity}}
        )
    else:
        await cart_collection.insert_one(item.dict())
    return {"status": "success"}

@app.delete("/cart/{user_id}/{product_id}")
async def remove_from_cart(user_id: str, product_id: str):
    await cart_collection.delete_one({"user_id": user_id, "product_id": product_id})
    return {"status": "success"}

@app.put("/cart/{user_id}/{product_id}")
async def update_cart_quantity(user_id: str, product_id: str, payload: dict):
    await cart_collection.update_one(
        {"user_id": user_id, "product_id": product_id},
        {"$set": {"quantity": payload.get("quantity", 1)}}
    )
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