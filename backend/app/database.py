from motor.motor_asyncio import AsyncIOMotorClient

# Your connection string
MONGO_DETAILS = "mongodb+srv://parv240385_db_user:malikji0002@cluster0.h0r1tl3.mongodb.net/?appName=Cluster0zz"

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.roshni_creations
products_collection = database.get_collection("products")
cart_collection = database.get_collection("cart")
users_collection = database.get_collection("users")