const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
// Priority: Environment Variable > Hardcoded Key
const resend = new Resend(process.env.RESEND_API_KEY || 're_M6AXt63M_6197cGKf1DDFspLBqZRyMDGb');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://parv240385_db_user:malikji0002@cluster0.h0r1tl3.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Cluster0!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Product Schema
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

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running and MongoDB is connected!' });
});

// Resend Email Route
app.post('/api/send-confirmation', async (req, res) => {
    const { email, orderDetails, paymentId } = req.body;
    
    try {
        const data = await resend.emails.send({
            from: 'Roshni Creations <onboarding@resend.dev>',
            to: [email || 'delivered@resend.dev'],
            subject: 'Order Confirmed - Roshni Creations',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #2C2C2C; border-bottom: 2px solid #D1B88A; padding-bottom: 10px;">Order Confirmation</h1>
                    <p>Thank you for your purchase from <strong>Roshni Creations</strong>!</p>
                    <p>Your order has been successfully placed.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Payment ID:</strong> ${paymentId}</p>
                        <p style="margin: 10px 0;"><strong>Items:</strong> ${Array.isArray(orderDetails.items) ? orderDetails.items.join(', ') : orderDetails.name}</p>
                        <p style="margin: 0;"><strong>Total Paid:</strong> ₹${orderDetails.price.toLocaleString('en-IN')}</p>
                    </div>
                    <p>We are preparing your handcrafted masterpiece for shipment. You will receive a tracking link shortly.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888; text-align: center;">Roshni Creations - Bespoke Heritage Jewellery</p>
                </div>
            `
        });
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// "Added to Cart" Notification Route
app.post('/api/cart-notification', async (req, res) => {
    const { email, productName } = req.body;
    try {
        await resend.emails.send({
            from: 'Roshni Creations <onboarding@resend.dev>',
            to: [email || 'delivered@resend.dev'],
            subject: 'Item Added to Your Cart',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2C2C2C;">Item Added to Cart! 💎</h2>
                    <p>Great choice! You just added <strong>${productName}</strong> to your bag.</p>
                    <p>Don't wait too long—our handcrafted signature pieces are in high demand.</p>
                    <div style="margin-top: 20px; text-align: center;">
                        <a href="https://roshni-creations.vercel.app" style="background: #2C2C2C; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px;">Complete Your Purchase</a>
                    </div>
                </div>
            `
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
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

// Local development server logic
if (require.main === module || process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Backend server running on port ${PORT}`));
}
