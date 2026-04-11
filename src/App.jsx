import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QASection from './components/QASection';
import DigitalGold from './components/DigitalGold';
import Quiz from './components/Quiz';
import SearchModal from './components/SearchModal';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  
  // States for filtering and details
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [cartItems, setCartItems] = useState([]);

  // Fetch products, cart, and logo
  useEffect(() => {
    const loadData = async () => {
      try {
        const prodRes = await fetch('http://localhost:8000/products');
        const cartRes = await fetch('http://localhost:8000/cart');
        
        if (!prodRes.ok) throw new Error('Database not connected');
        
        const productsData = await prodRes.json();
        const cartData = cartRes.ok ? await cartRes.json() : [];

        setProducts(productsData || []);
        setCartItems(cartData || []);
        setLogo("https://raw.githubusercontent.com/SatyawanPanchal/roshni_creations_assets_ssh01/refs/heads/main/assets/RoshniCreationsLogo.webp");
        setLoading(false);
      } catch (error) {
        console.error('Error fetching from database:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddToCart = async (product) => {
    const cartItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || null
    };

    try {
      const res = await fetch('http://localhost:8000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItem)
      });
      if (res.ok) {
        console.log("Item added to database cart");
        setCartItems(prev => [...prev, cartItem]); // Optimistic update
      }
    } catch(err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    if (page === 'product' && params.productId) {
      setSelectedProductId(params.productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['All', 'Choker', 'Necklace', 'Mangalsutra', 'Watch'];
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  if (loading) {
    return <div className="loader" style={{color: 'var(--brand-maroon)'}}>Roshni Creations...</div>;
  }

  return (
    <div className="app">
      <Navbar onNavigate={handleNavigate} onSearchClick={() => setIsSearchOpen(true)} logo={logo} cartCount={cartItems.length} />
      
      <main>
        {currentPage === 'home' && (
          <div className="page-transition animate-fade-in">
            <Hero onNavigate={handleNavigate} />
            
            {/* Signature Collection Section */}
            <section className="section" style={{backgroundColor: 'var(--bg-white)'}}>
              <div className="container">
                <div className="reveal">
                  <h2 className="section-title" style={{fontFamily: 'var(--font-serif)', fontSize: '3.5rem', color: 'var(--brand-maroon)'}}>Signature Collection</h2>
                  <p className="section-subtitle">Exquisite pieces handpicked for your special moments.</p>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '2.5rem',
                  marginTop: '4rem'
                }}>
                  {products.filter(p => p.isFeatured).slice(0, 4).map((product, idx) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={idx} 
                      onClick={() => handleNavigate('product', { productId: product.id })} 
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
                <div style={{textAlign: 'center', marginTop: '4rem'}}>
                  <button className="btn btn-outline" onClick={() => handleNavigate('shop')}>View All Collections</button>
                </div>
              </div>
            </section>
            
            <QASection />
          </div>
        )}

        {currentPage === 'shop' && (
          <div className="section animate-fade-in" style={{paddingTop: 'calc(var(--nav-height) + 5rem)'}}>
            <div className="container">
              <h2 className="section-title" style={{fontFamily: 'var(--font-serif)', fontSize: '3.5rem', color: 'var(--brand-maroon)'}}>Our Collections</h2>
              <p className="section-subtitle">Discover the perfect piece to elevate your look.</p>
              
              {/* Category Filter */}
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem', flexWrap: 'wrap'}}>
                {categories.map(cat => (
                  <button key={cat} className="btn" 
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.6rem 1.8rem', 
                      borderRadius: '50px',
                      border: '1px solid var(--primary-gold)',
                      background: cat === selectedCategory ? 'var(--primary-gold-light)' : 'transparent',
                      color: cat === selectedCategory ? 'var(--brand-maroon)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      transition: 'all 0.3s ease'
                    }}>
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2.5rem'
              }}>
                {filteredProducts.map((product, idx) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={idx % 4} 
                    onClick={() => handleNavigate('product', { productId: product.id })}
                    onAddToCart={handleAddToCart}
                  />
                ))}
                {filteredProducts.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                     No products found in this category.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'product' && (
          <div className="animate-fade-in">
            <ProductDetail 
              product={products.find(p => p.id === selectedProductId)} 
              onNavigate={handleNavigate}
              logo={logo}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {currentPage === 'digital-gold' && (
          <div className="animate-fade-in"><DigitalGold /></div>
        )}
        
        {currentPage === 'quiz' && (
          <div className="animate-fade-in"><Quiz products={products} onNavigate={handleNavigate} onAddToCart={handleAddToCart} /></div>
        )}
      </main>

      <Footer />
      
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        products={products}
        onNavigate={handleNavigate}
      />
      
      <CartSidebar />
    </div>
  );
};

export default App;
