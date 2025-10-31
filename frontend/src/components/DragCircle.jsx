import React, { useState, useRef, useEffect } from 'react';
import './DragCircle.css';

const DragCircle = ({ onCircleInHole }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLifting, setIsLifting] = useState(false);
  const [position, setPosition] = useState({ x: null, y: null });
  const [circleColor, setCircleColor] = useState(null);
  const [isLanding, setIsLanding] = useState(false);
  
  const circleRef = useRef(null);
  const holeRef = useRef(null);
  const liftTimeoutRef = useRef(null);

  useEffect(() => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
      '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
      '#48dbfb', '#0abde3', '#ff9f43', '#ee5a52'
    ];
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    setCircleColor(selectedColor);
  }, []);

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const B = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const G = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + R * 0x10000 + B * 0x100 + G).toString(16).slice(1);
  };

  const getRelativePos = (e) => {
    const screen = document.querySelector('.screen');
    if (!screen) return { x: 0, y: 0 };
    
    const screenRect = screen.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - screenRect.left,
      y: clientY - screenRect.top
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLifting(true);
    const pos = getRelativePos(e);
    setPosition(pos);
    
    liftTimeoutRef.current = setTimeout(() => {
      setIsLifting(false);
      setIsDragging(true);
    }, 200);
  };

  const handleMove = (e) => {
    if (isLifting || isDragging) {
      e.preventDefault();
      const pos = getRelativePos(e);
      setPosition(pos);
    }
  };

  const handleEnd = () => {
    if (!isDragging && !isLifting) return;
    
    setIsDragging(false);
    setIsLifting(false);
    
    if (liftTimeoutRef.current) {
      clearTimeout(liftTimeoutRef.current);
    }
    
    if (isCircleInHole()) {
      onCircleInHole(circleColor);
    } else {
      setIsLanding(true);
      setTimeout(() => {
        setIsLanding(false);
        setPosition({ x: null, y: null });
      }, 500);
    }
  };

  const isCircleInHole = () => {
    if (!circleRef.current || !holeRef.current) return false;
    
    const circleRect = circleRef.current.getBoundingClientRect();
    const holeRect = holeRef.current.getBoundingClientRect();
    
    const circleCenterX = circleRect.left + circleRect.width / 2;
    const circleCenterY = circleRect.top + circleRect.height / 2;
    const holeCenterX = holeRect.left + holeRect.width / 2;
    const holeCenterY = holeRect.top + holeRect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(circleCenterX - holeCenterX, 2) +
      Math.pow(circleCenterY - holeCenterY, 2)
    );
    
    return distance < 100;
  };

  const getCircleStyle = () => {
    if (!circleColor) return {};
    
    const lighterColor = lightenColor(circleColor, 20);
    const style = {
      background: `linear-gradient(135deg, ${circleColor}, ${lighterColor})`
    };
    
    if (position.x !== null && (isDragging || isLifting)) {
      const screen = document.querySelector('.screen');
      if (screen) {
        const screenRect = screen.getBoundingClientRect();
        const circleRadius = 75;
        const x = Math.max(circleRadius, Math.min(screenRect.width - circleRadius, position.x));
        const y = Math.max(circleRadius, Math.min(screenRect.height - circleRadius, position.y));
        
        style.left = `${x - circleRadius}px`;
        style.top = `${y - circleRadius}px`;
      }
    }
    
    return style;
  };

  useEffect(() => {
    const handleGlobalMove = (e) => handleMove(e);
    const handleGlobalEnd = () => handleEnd();

    if (isDragging || isLifting) {
      document.addEventListener('mousemove', handleGlobalMove);
      document.addEventListener('touchmove', handleGlobalMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalEnd);
      document.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, isLifting, position]);

  return (
    <>
      <div
        ref={circleRef}
        className={`drag-circle ${
          isLifting ? 'lifting' :
          isDragging ? 'dragging' :
          isLanding ? 'landing' : ''
        }`}
        style={getCircleStyle()}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      />
      <div ref={holeRef} className="target-hole" />
    </>
  );
};

export default DragCircle;
