from motor.motor_asyncio import AsyncIOMotorClient
import os

# Connects to MongoDB (Local or Atlas)
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.jewelry_store
products_collection = db.products
cart_collection = db.cart