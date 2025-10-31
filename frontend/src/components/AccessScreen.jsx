import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
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

      // Smooth lerp animation (much smoother than spring)
      let currentX = iconPosition.x;
      let currentY = iconPosition.y;
      const lerpFactor = 0.15; // Higher = faster response, Lower = smoother

      const animate = () => {
        const halfW = iconPosition.width / 2;
        const halfH = iconPosition.height / 2;
        const desiredX = targetPos.x - halfW;
        const desiredY = targetPos.y - halfH;

        // Lerp (linear interpolation) for smooth movement
        currentX += (desiredX - currentX) * lerpFactor;
        currentY += (desiredY - currentY) * lerpFactor;

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
    const baseStyle = {
      backgroundImage: `url(${process.env.PUBLIC_URL}/img/${
        iconIndex === 0 ? 'anim' :
        iconIndex === 1 ? 'accueil' :
        'hourglass'
      }.png)`
    };

    if (selectedIcon === null) {
      return baseStyle;
    }
    
    if (selectedIcon === iconIndex) {
      return {
        ...baseStyle,
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
        ...baseStyle,
        opacity: 0,
        pointerEvents: 'none'
      };
    }
  };

  // Render selected icon in a portal (outside of hand-mobile) so it stays visible
  const selectedIconElement = selectedIcon !== null && (
    <div
      className="pickable-icon-detached"
      style={getIconStyle(selectedIcon)}
    />
  );

  return (
    <>
      <div className={`access-screen ${isVisible ? 'active' : ''}`}>
        <div className="access-screen-content">
          <div
            ref={icon1Ref}
            className="access-screen-icon1 pickable-icon"
            style={selectedIcon === 0 ? { opacity: 0 } : getIconStyle(0)}
            onMouseDown={(e) => handleIconClick(0, e)}
            onTouchStart={(e) => handleIconClick(0, e)}
          />
          <div
            ref={icon2Ref}
            className="access-screen-icon2 pickable-icon"
            style={selectedIcon === 1 ? { opacity: 0 } : getIconStyle(1)}
            onMouseDown={(e) => handleIconClick(1, e)}
            onTouchStart={(e) => handleIconClick(1, e)}
          />
          <div
            ref={icon3Ref}
            className="access-screen-icon3 pickable-icon"
            style={selectedIcon === 2 ? { opacity: 0 } : getIconStyle(2)}
            onMouseDown={(e) => handleIconClick(2, e)}
            onTouchStart={(e) => handleIconClick(2, e)}
          />
        </div>
      </div>
      {selectedIcon !== null && ReactDOM.createPortal(
        selectedIconElement,
        document.body
      )}
    </>
  );
};

export default AccessScreen;
