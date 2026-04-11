from pydantic import BaseModel, Field
from typing import List, Optional

class Product(BaseModel):
    name: str
    category: str  # Rings, Necklaces, etc.
    price: float
    image_url: str
    description: str
    stock: int

class CartItem(BaseModel):
    product_id: str
    quantity: int = 1