import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Quiz.css';
import ProductCard from './ProductCard';

const Quiz = ({ products, onNavigate, onAddToCart }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [recommendedProduct, setRecommendedProduct] = useState(null);

  const containerRef = useScrollReveal();

  const questions = [
    {
      id: 1,
      text: "Who are you shopping for?",
      options: ["Myself", "Partner", "Mother", "Friend"]
    },
    {
      id: 2,
      text: "What's the occasion?",
      options: ["Wedding", "Anniversary", "Daily Wear", "Festive"]
    },
    {
      id: 3,
      text: "What style do they prefer?",
      options: ["Traditional & Heavy", "Modern & Minimal", "Elegant & Classic"]
    }
  ];

  const handleOption = (option) => {
    setAnswers({ ...answers, [step]: option });
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      const style = option;
      let match;
      if (style.includes('Traditional') || answers[2] === 'Wedding') {
        match = products.find(p => p.category === 'choker' || p.category === 'mangalsutra');
      } else if (style.includes('Modern')) {
        match = products.find(p => p.category === 'watch');
      } else {
        match = products.find(p => p.category === 'necklace');
      }
      setRecommendedProduct(match || products[0]);
    }
  };

  return (
    <div className="section quiz-page">
      <div className="container">
        <div ref={containerRef} className="reveal">
          {!recommendedProduct ? (
            <div className="quiz-container glass">
              <h2 className="section-title" style={{fontSize: '2.5rem'}}>Find the Perfect Gift</h2>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(step / questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="quiz-content animate-fade-in" key={step}>
                <h3>{questions[step-1].text}</h3>
                <div className="options-grid">
                  {questions[step-1].options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className="quiz-option"
                      onClick={() => handleOption(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <p className="step-indicator">Question {step} of {questions.length}</p>
            </div>
          ) : (
            <div className="recommendation-container animate-fade-in">
              <h2 className="section-title">Your Perfect Match</h2>
              <p className="section-subtitle">Based on your choices, we highly recommend this stunning piece.</p>
              <div className="recommended-card-wrapper">
                <ProductCard product={recommendedProduct} onAddToCart={onAddToCart} onClick={() => onNavigate('product', { productId: recommendedProduct.id })} />
              </div>
              <div className="quiz-actions">
                <button className="btn btn-primary" onClick={() => { onAddToCart && onAddToCart(recommendedProduct); onNavigate('shop'); }}>Add to Cart & Continue</button>
                <button className="btn btn-outline" onClick={() => { setStep(1); setRecommendedProduct(null); }}>Retake Quiz</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
