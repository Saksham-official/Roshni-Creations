// api/index.js — Vercel Serverless Function (ESM)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY || 're_M6AXt63M_6197cGKf1DDFspLBqZRyMDGb');

app.use(cors({ origin: '*' }));
app.use(express.json());

// ✅ Explicit DB name in URI — this is what was missing!
const MONGO_URI = process.env.MONGODB_URI ||
  "mongodb+srv://parv240385_db_user:malikji0002@cluster0.h0r1tl3.mongodb.net/roshni_creations?retryWrites=true&w=majority&appName=Cluster0";

// ✅ Lazy connection — reuses across warm invocations, safe for serverless
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
  console.log('✅ MongoDB connected to roshni_creations');
};

// Schemas
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  category: String,
  description: String,
  images: [String],
  rating: Number,
  stock: Number,
  isFeatured: Boolean,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

// ─── Routes ───────────────────────────────────────────────

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ status: 'OK', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', db: 'disconnected', error: err.message });
  }
});

// ✅ Products — connects to DB first, returns { products: [...] }
app.get('/api/products', async (req, res) => {
  try {
    await connectDB();
    const products = await Product.find({});
    console.log(`✅ Fetched ${products.length} products`);
    res.json({ products });
  } catch (err) {
    console.error('❌ Product fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch products', detail: err.message });
  }
});

// ─── Auth Routes ──────────────────────────────────────────

app.post('/api/register', async (req, res) => {
  try {
    await connectDB();
    const { email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ detail: 'User already exists' });
    const user = new User({ email, password, role });
    await user.save();
    res.status(201).json({ email: user.email, role: user.role, id: user._id });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ detail: 'Invalid credentials' });
    res.json({ email: user.email, role: user.role, id: user._id });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// ─── Email Routes ─────────────────────────────────────────

app.post('/api/send-confirmation', async (req, res) => {
  const { email, orderDetails, paymentId } = req.body;
  if (!orderDetails || !paymentId) {
    return res.status(400).json({ success: false, error: 'Missing orderDetails or paymentId' });
  }
  try {
    const itemsHtml = Array.isArray(orderDetails.items)
      ? orderDetails.items.map(i => `<li>${i}</li>`).join('')
      : `<li>${orderDetails.name || 'Item'}</li>`;

    const data = await resend.emails.send({
      from: 'Roshni Creations <onboarding@resend.dev>',
      to: [email || 'delivered@resend.dev'],
      subject: 'Order Confirmed ✨ - Roshni Creations',
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:30px;border:1px solid #eee;border-radius:12px;background:#fafafa;">
          <h1 style="color:#2C2C2C;border-bottom:2px solid #D1B88A;padding-bottom:12px;">💎 Order Confirmed!</h1>
          <p>Thank you for your purchase from <strong>Roshni Creations</strong>!</p>
          <div style="background:white;padding:20px;border-radius:8px;margin:20px 0;border:1px solid #f0f0f0;">
            <p><strong>Payment ID:</strong> <code>${paymentId}</code></p>
            <p><strong>Items:</strong></p>
            <ul style="padding-left:20px;color:#555;">${itemsHtml}</ul>
            <p style="font-size:18px;font-weight:bold;">Total: ₹${Number(orderDetails.price).toLocaleString('en-IN')}</p>
          </div>
          <p>Your handcrafted masterpiece is being prepared. Expect tracking within 24 hours.</p>
          <hr style="margin:25px 0;border:none;border-top:1px solid #eee;" />
          <p style="font-size:12px;color:#999;text-align:center;">Roshni Creations — Bespoke Heritage Jewellery</p>
        </div>
      `
    });
    res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/cart-notification', async (req, res) => {
  const { email, productName } = req.body;
  if (!productName) return res.status(400).json({ success: false, error: 'Missing productName' });
  try {
    await resend.emails.send({
      from: 'Roshni Creations <onboarding@resend.dev>',
      to: [email || 'delivered@resend.dev'],
      subject: `💎 ${productName} is waiting in your cart!`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:30px;border:1px solid #eee;border-radius:12px;">
          <h2 style="color:#2C2C2C;">You have great taste! 💎</h2>
          <p>You just added <strong>${productName}</strong> to your cart.</p>
          <p style="color:#888;">Don't wait — our handcrafted pieces are in limited supply!</p>
          <div style="margin-top:25px;text-align:center;">
            <a href="https://roshni-creations.vercel.app" style="background:#2C2C2C;color:white;padding:14px 28px;text-decoration:none;border-radius:50px;font-weight:500;">Complete Purchase →</a>
          </div>
        </div>
      `
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app;
