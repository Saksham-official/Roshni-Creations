import { useEffect, useRef } from 'react';

export const useScrollReveal = (options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          // Optional: Stop observing once revealed
          if (!options.persist) {
            observer.unobserve(entry.target);
          }
        } else if (options.persist) {
          entry.target.classList.remove('reveal-active');
        }
      });
    }, defaultOptions);

    const el = elementRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [options.persist, options.threshold, options.rootMargin]);

  return elementRef;
};
