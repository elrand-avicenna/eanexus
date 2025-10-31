import React, { useState, useEffect, useRef } from 'react';
import './Fingerprint.css';

const Fingerprint = ({ color, onComplete, onMaskUpdate }) => {
  const [clickCount, setClickCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const fingerprintRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
      updateMask();
    }, 100);

    const canvas = document.getElementById('world');
    if (canvas) {
      canvas.style.opacity = '1';
    }
  }, []);

  useEffect(() => {
    updateMask();
  }, [clickCount]);

  const updateMask = () => {
    if (!fingerprintRef.current) return;

    const layers = fingerprintRef.current.querySelectorAll('.fingerprint-layer:not(.disappearing)');
    const canvas = document.getElementById('world');
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const circles = [];

    layers.forEach(layer => {
      const rect = layer.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const cx = rect.left + rect.width / 2 - canvasRect.left;
        const cy = rect.top + rect.height / 2 - canvasRect.top;
        const radius = Math.min(rect.width, rect.height) / 2;
        circles.push({ cx, cy, r: radius });
      }
    });

    onMaskUpdate(circles);
  };

  const handleClick = () => {
    if (clickCount >= 6) return;

    setClickCount(prev => prev + 1);

    if (clickCount + 1 >= 6) {
      setTimeout(() => {
        onComplete();
        onMaskUpdate([]);
      }, 600);
    }
  };

  return (
    <div
      ref={fingerprintRef}
      className={`fingerprint ${isVisible ? 'active' : ''}`}
      style={{ '--fingerprint-color': color }}
      onClick={handleClick}
    >
      <div className="fingerprint-pattern">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`fingerprint-layer ${
              i === clickCount ? 'next-to-disappear' : ''
            } ${
              i < clickCount ? 'disappearing' : ''
            }`}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div key={`detail-${i}`} className="fingerprint-detail" />
        ))}
      </div>
    </div>
  );
};

export default Fingerprint;
