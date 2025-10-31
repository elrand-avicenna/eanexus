import React, { useState, useEffect, useRef } from 'react';
import './AccessScreen.css';

const AccessScreen = ({ color, onIconClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [isHolding, setIsHolding] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  
  const icon1Ref = useRef(null);
  const icon2Ref = useRef(null);
  const icon3Ref = useRef(null);
  const animationRef = useRef(null);
  const velocityRef = useRef({ vx: 0, vy: 0 });

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  }, []);

  const handleIconClick = (iconIndex, e) => {
    if (selectedIcon !== null) return;

    const iconRefs = [icon1Ref, icon2Ref, icon3Ref];
    const clickedIcon = iconRefs[iconIndex].current;
    const rect = clickedIcon.getBoundingClientRect();

    setSelectedIcon(iconIndex);
    setIconPosition({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });

    // Start following cursor
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setTargetPos({ x: clientX, y: clientY });
    setIsHolding(true);

    // Trigger smartphone reverse animation after a delay
    setTimeout(() => {
      onIconClick();
    }, 1000);
  };

  const handleGlobalMove = (e) => {
    if (!isHolding) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setTargetPos({ x: clientX, y: clientY });
  };

  const handleGlobalUp = () => {
    setIsHolding(false);
  };

  useEffect(() => {
    if (selectedIcon !== null && isHolding) {
      document.addEventListener('mousemove', handleGlobalMove);
      document.addEventListener('touchmove', handleGlobalMove);
      document.addEventListener('mouseup', handleGlobalUp);
      document.addEventListener('touchend', handleGlobalUp);

      // Spring animation
      const freqHz = 2.2;
      const dampingRatio = 1.05;
      const omega = 2 * Math.PI * freqHz;
      const z = dampingRatio;
      let lastT = null;

      let currentX = iconPosition.x;
      let currentY = iconPosition.y;

      const animate = (t) => {
        if (lastT === null) lastT = t;
        const dt = Math.max(0.001, Math.min(0.032, (t - lastT) / 1000));
        lastT = t;

        const halfW = iconPosition.width / 2;
        const halfH = iconPosition.height / 2;
        const desiredX = targetPos.x - halfW;
        const desiredY = targetPos.y - halfH;

        const ax = -2 * z * omega * velocityRef.current.vx - (omega * omega) * (currentX - desiredX);
        const ay = -2 * z * omega * velocityRef.current.vy - (omega * omega) * (currentY - desiredY);

        velocityRef.current.vx += ax * dt;
        velocityRef.current.vy += ay * dt;
        currentX += velocityRef.current.vx * dt;
        currentY += velocityRef.current.vy * dt;

        setIconPosition(prev => ({
          ...prev,
          x: currentX,
          y: currentY
        }));

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalUp);
      document.removeEventListener('touchend', handleGlobalUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedIcon, isHolding, targetPos, iconPosition.width, iconPosition.height]);

  const getIconStyle = (iconIndex) => {
    if (selectedIcon === null) {
      return {};
    }
    
    if (selectedIcon === iconIndex) {
      return {
        position: 'fixed',
        left: `${iconPosition.x}px`,
        top: `${iconPosition.y}px`,
        width: `${iconPosition.width}px`,
        height: `${iconPosition.height}px`,
        zIndex: 999999,
        pointerEvents: 'none',
        margin: 0
      };
    } else {
      return {
        opacity: 0,
        pointerEvents: 'none'
      };
    }
  };

  return (
    <div className={`access-screen ${isVisible ? 'active' : ''}`}>
      <div className="access-screen-content">
        <div
          ref={icon1Ref}
          className="access-screen-icon1 pickable-icon"
          style={getIconStyle(0)}
          onMouseDown={(e) => handleIconClick(0, e)}
          onTouchStart={(e) => handleIconClick(0, e)}
        />
        <div
          ref={icon2Ref}
          className="access-screen-icon2 pickable-icon"
          style={getIconStyle(1)}
          onMouseDown={(e) => handleIconClick(1, e)}
          onTouchStart={(e) => handleIconClick(1, e)}
        />
        <div
          ref={icon3Ref}
          className="access-screen-icon3 pickable-icon"
          style={getIconStyle(2)}
          onMouseDown={(e) => handleIconClick(2, e)}
          onTouchStart={(e) => handleIconClick(2, e)}
        />
      </div>
    </div>
  );
};

export default AccessScreen;
