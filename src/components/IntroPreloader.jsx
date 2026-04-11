import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './IntroPreloader.css';

const IntroPreloader = ({ onComplete }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Initial State: Dark & Elegant
    tl.set(".preloader-logo", { opacity: 0, scale: 0.8, y: 20 })
      .set(".preloader-text", { opacity: 0, letterSpacing: "15px" })
      .set(".preloader-bg", { y: "0%" });

    // 2. Reveal Logo with Glow
    tl.to(".preloader-logo", {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out"
    })
    .to(".preloader-logo", {
      filter: "drop-shadow(0 0 15px rgba(209, 184, 138, 0.6))",
      repeat: 1,
      yoyo: true,
      duration: 0.8
    }, "-=0.4");

    // 3. Spaced Typography Reveal
    tl.to(".preloader-text", {
      opacity: 1,
      letterSpacing: "4px",
      duration: 1.5,
      ease: "expo.out"
    }, "-=0.8");

    // 4. Premium Swipe Exit
    tl.to(".preloader-logo, .preloader-text", {
      opacity: 0,
      y: -50,
      duration: 0.6,
      ease: "power2.in"
    })
    .to(".preloader-bg", {
      y: "-100%",
      duration: 1,
      ease: "expo.inOut"
    }, "-=0.2");

  }, { scope: containerRef });

  return (
    <div className="intro-preloader" ref={containerRef}>
      <div className="preloader-bg"></div>
      <div className="preloader-content">
        <div className="preloader-logo">
           <img src="https://raw.githubusercontent.com/SatyawanPanchal/roshni_creations_assets_ssh01/refs/heads/main/assets/RoshniCreationsLogo.webp" alt="Logo" />
        </div>
        <h1 className="preloader-text">ROSHNI CREATIONS</h1>
        <div className="preloader-tagline">HERITAGE MEETS MODERNITY</div>
      </div>
    </div>
  );
};

export default IntroPreloader;
