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

class CartItem(BaseModel):
    product_id: str
    name: str
    price: int
    quantity: int = 1
    image: Optional[str] = None