const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://parv240385_db_user:malikji0002@cluster0.h0r1tl3.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Cluster0!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Example Schema
const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    category: String,
    description: String,
    images: [String],
    rating: Number,
    stock: Number,
    isFeatured: Boolean
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Example API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running and MongoDB is connected!' });
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Export for Serverless Deployment (Vercel)
module.exports = app;

// Only start the server locally if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Backend server running on port ${PORT}`));
}
