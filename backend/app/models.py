from pydantic import BaseModel, Field
from typing import List, Optional

class ProductModel(BaseModel):
    id: str
    name: str
    price: int
    category: str
    images: List[str]
    description: str
    rating: float
    stock: int
    isFeatured: bool
    createdAt: str

class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "customer" # "admin" or "customer"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: str

class CartItem(BaseModel):
    user_id: str
    product_id: str
    name: str
    price: int
    quantity: int = 1
    image: Optional[str] = None