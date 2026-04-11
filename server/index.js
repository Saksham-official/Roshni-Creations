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
        let products = await Product.find({});
        let logo = "https://i.imgur.com/3g7nmJC.png";

        if (products.length === 0) {
            console.log('Database is empty, seeding from JSON...');
            try {
                // Seed DB from JSON if empty
                const jsonResponse = await fetch('https://raw.githubusercontent.com/SatyawanPanchal/roshni_creations_assets_ssh01/refs/heads/main/products.json');
                const data = await jsonResponse.json();
                if (data && data.products && data.products.length > 0) {
                    await Product.insertMany(data.products);
                    products = await Product.find({});
                    if (data.logo) {
                        logo = data.logo;
                    }
                }
            } catch (seedErr) {
                console.error('Failed to seed DB from JSON:', seedErr);
            }
        }
        res.json({ products, logo });
    } catch (err) {
        console.error('API Error:', err);
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
