import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './QASection.css';

const QASection = () => {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ delay: 200, threshold: 0.15 });

  const features = [
    {
      id: 1,
      icon: '↩️',
      title: '15-Day Returns',
      description: '100% refund, no questions asked. We ensure complete joy with every purchase.'
    },
    {
      id: 2,
      icon: '🏡',
      title: 'Free Try at Home',
      description: 'Select up to 5 spectacular designs and try them in the comfort of your home.'
    },
    {
      id: 3,
      icon: '💌',
      title: 'Video Postcards',
      description: 'Embed a personalized AR video message right inside your gift box using our app.'
    },
    {
      id: 4,
      icon: '💎',
      title: 'xCLusive Loyalty',
      description: 'Earn points on every purchase and unlock exclusive access to VIP collections.'
    },
    {
      id: 5,
      icon: '✨',
      title: 'Lifetime Exchange',
      description: 'Zero deduction on lifetime exchange of gold and diamonds. Your legacy retains its absolute value.'
    },
    {
      id: 6,
      icon: '📜',
      title: 'Certified Purity',
      description: 'Every piece is accompanied by a trusted hallmark certificate ensuring absolute authenticity and purity.'
    }
  ];

  return (
    <section className="section section-tint">
      <div className="container">
        <div ref={headerRef} className="reveal">
          <h2 className="section-title">The Roshni Promise</h2>
          <p className="section-subtitle">A legacy of trust, purity, and unparalleled craftsmanship.</p>
        </div>
        
        <div ref={gridRef} className="qa-grid reveal reveal-delay-1">
          {features.map((feature, idx) => (
            <div key={feature.id} className="qa-card glass" style={{ transitionDelay: `${idx * 100}ms` }}>
              <div className="qa-icon-wrapper">
                <div className="qa-icon">{feature.icon}</div>
              </div>
              <h3 className="qa-title">{feature.title}</h3>
              <p className="qa-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QASection;
