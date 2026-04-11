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
import AuthPage from './components/AuthPage';
import IntroPreloader from './components/IntroPreloader';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  
  // States for filtering and details
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Fetch products and logo - Using production /api routes
  useEffect(() => {
    const loadData = async () => {
      try {
        const prodRes = await fetch('/api/products');
        if (!prodRes.ok) throw new Error('Database not connected');
        
        const data = await prodRes.json();
        const productsData = data.products || [];

        setProducts(productsData);
        setLogo("https://raw.githubusercontent.com/SatyawanPanchal/roshni_creations_assets_ssh01/refs/heads/main/assets/RoshniCreationsLogo.webp");
        setLoading(false);
      } catch (error) {
        console.error('Error fetching from database:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    if (page === 'product' && params.productId) {
      setSelectedProductId(params.productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['All', 'Choker', 'Necklace', 'Mangalsutra', 'Watch', 'Earrings', 'Rings', 'Bangles', 'Pendants', 'Bracelets'];
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  if (loading) {
    return <div className="loader" style={{color: 'var(--brand-maroon)'}}>Roshni Creations...</div>;
  }

  return (
    <div className="app">
      {/* Premium Entrance Preloader */}
      {showIntro && <IntroPreloader onComplete={() => setShowIntro(false)} />}
      
      {/* Site Content with synchronization state */}
      <div className={showIntro ? 'site-content-hidden' : 'site-content-visible'}>
        <Navbar 
          onNavigate={handleNavigate} 
          onSearchClick={() => setIsSearchOpen(true)} 
          logo={logo} 
          isVisible={!showIntro}
        />
        
        <main>
          {currentPage === 'home' && (
            <div className="page-transition animate-fade-in">
              <Hero onNavigate={handleNavigate} isVisible={!showIntro} />
              
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
                    {products.filter(p => p.isFeatured).slice(0, 8).map((product, idx) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        index={idx} 
                        onClick={() => handleNavigate('product', { productId: product.id })} 
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
                        transition: 'all 0.3s ease'
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
                  {filteredProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx % 4} onClick={() => handleNavigate('product', { productId: product.id })} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentPage === 'product' && (
            <div className="animate-fade-in">
              <ProductDetail product={products.find(p => p.id === selectedProductId)} onNavigate={handleNavigate} logo={logo} />
            </div>
          )}
          
          {currentPage === 'auth' && <AuthPage onNavigate={handleNavigate} />}
          {currentPage === 'digital-gold' && <div className="animate-fade-in"><DigitalGold /></div>}
          {currentPage === 'quiz' && <div className="animate-fade-in"><Quiz products={products} onNavigate={handleNavigate} /></div>}
        </main>

        <Footer />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={products} onNavigate={handleNavigate} />
        <CartSidebar onNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default App;
