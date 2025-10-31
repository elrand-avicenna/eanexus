import React, { useState, useEffect, useRef } from 'react';
import './HourglassSociety.css';
import BackgroundAnimation from './BackgroundAnimation';
import DragCircle from './DragCircle';
import Fingerprint from './Fingerprint';
import AccessScreen from './AccessScreen';

const HourglassSociety = () => {
  const [handState, setHandState] = useState('lifting'); // lifting, idle, reversing, hidden
  const [showDragCircle, setShowDragCircle] = useState(true);
  const [showFingerprint, setShowFingerprint] = useState(false);
  const [showAccessScreen, setShowAccessScreen] = useState(false);
  const [circleColor, setCircleColor] = useState(null);
  const [fingerprintMask, setFingerprintMask] = useState([]);
  const [detachedIcon, setDetachedIcon] = useState(null);
  
  const handRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Set background images
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/img/accueil-wallpaper.png)`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    // After hand lifts, transition to idle
    const timer = setTimeout(() => {
      if (handState === 'lifting') {
        setHandState('idle');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [handState]);

  const handleCircleInHole = (color) => {
    setCircleColor(color);
    setShowDragCircle(false);
    setTimeout(() => {
      setShowFingerprint(true);
    }, 300);
  };

  const handleFingerprintComplete = () => {
    setShowFingerprint(false);
    setTimeout(() => {
      setShowAccessScreen(true);
    }, 300);
  };

  const handleIconClick = (iconData) => {
    // Set detached icon data
    setDetachedIcon(iconData);
    
    // Start reverse animation
    setHandState('reversing');
    
    // After animation completes, hide hand-mobile
    setTimeout(() => {
      setHandState('hidden');
    }, 3000);
  };

  const updateFingerprintMask = (circles) => {
    setFingerprintMask(circles);
  };

  // Handle detached icon movement
  useEffect(() => {
    if (!detachedIcon || !detachedIcon.isHolding) return;

    let currentX = detachedIcon.position.x;
    let currentY = detachedIcon.position.y;
    const lerpFactor = 0.2; // Un peu plus rapide pour meilleure réactivité

    const animate = () => {
      if (!detachedIcon || !detachedIcon.isHolding) return;
      
      const halfW = detachedIcon.width / 2;
      const halfH = detachedIcon.height / 2;
      const desiredX = detachedIcon.targetPos.x - halfW;
      const desiredY = detachedIcon.targetPos.y - halfH;

      currentX += (desiredX - currentX) * lerpFactor;
      currentY += (desiredY - currentY) * lerpFactor;

      setDetachedIcon(prev => prev ? ({
        ...prev,
        position: { x: currentX, y: currentY }
      }) : null);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [detachedIcon?.isHolding, detachedIcon?.targetPos.x, detachedIcon?.targetPos.y]);

  const handleGlobalMove = (e) => {
    if (!detachedIcon || !detachedIcon.isHolding) return;
    e.preventDefault(); // Prevent scrolling on mobile
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDetachedIcon(prev => ({
      ...prev,
      targetPos: { x: clientX, y: clientY }
    }));
  };

  const handleGlobalUp = () => {
    if (!detachedIcon) return;
    setDetachedIcon(prev => ({
      ...prev,
      isHolding: false
    }));
  };

  useEffect(() => {
    if (detachedIcon && detachedIcon.isHolding) {
      const moveOptions = { passive: false }; // Allow preventDefault
      document.addEventListener('mousemove', handleGlobalMove, moveOptions);
      document.addEventListener('touchmove', handleGlobalMove, moveOptions);
      document.addEventListener('mouseup', handleGlobalUp);
      document.addEventListener('touchend', handleGlobalUp);
      document.addEventListener('touchcancel', handleGlobalUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalUp);
      document.removeEventListener('touchend', handleGlobalUp);
      document.removeEventListener('touchcancel', handleGlobalUp);
    };
  }, [detachedIcon?.isHolding]);

  const handStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/img/hand-mobile.png)`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="hourglass-container">
      <BackgroundAnimation fingerprintMask={fingerprintMask} />
      
      {handState !== 'hidden' && (
        <div 
          ref={handRef}
          className={`hand-mobile ${
            handState === 'lifting' ? 'lifting' : 
            handState === 'idle' ? 'idle' : 
            handState === 'reversing' ? 'reversing' : ''
          }`}
          style={handStyle}
        >
          <div className="smartphone">
            <div className="screen">
              <div 
                className="bg-deverouillage-top"
                style={{backgroundImage: `url(${process.env.PUBLIC_URL}/img/bg-deverouillage.png)`}}
              ></div>
              <div 
                className="bg-deverouillage-bottom"
                style={{backgroundImage: `url(${process.env.PUBLIC_URL}/img/bg-deverouillage.png)`}}
              ></div>
              
              <canvas id="world"></canvas>
              
              {showDragCircle && (
                <DragCircle onCircleInHole={handleCircleInHole} />
              )}
              
              {showFingerprint && (
                <Fingerprint 
                  color={circleColor} 
                  onComplete={handleFingerprintComplete}
                  onMaskUpdate={updateFingerprintMask}
                />
              )}
              
              {showAccessScreen && (
                <AccessScreen 
                  color={circleColor} 
                  onIconClick={handleIconClick}
                />
              )}
            </div>
            
            <div className="erase erase2"></div>
            <div className="erase"></div>
          </div>
        </div>
      )}

      {/* Detached icon - completely independent of hand-mobile */}
      {detachedIcon && (
        <div
          className="detached-icon-global"
          style={{
            position: 'fixed',
            left: `${detachedIcon.position.x}px`,
            top: `${detachedIcon.position.y}px`,
            width: `${detachedIcon.width}px`,
            height: `${detachedIcon.height}px`,
            backgroundImage: `url(${process.env.PUBLIC_URL}/img/${detachedIcon.iconName}.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 9999999,
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
            willChange: 'transform',
            cursor: detachedIcon.isHolding ? 'grabbing' : 'grab'
          }}
        />
      )}
    </div>
  );
};

export default HourglassSociety;
