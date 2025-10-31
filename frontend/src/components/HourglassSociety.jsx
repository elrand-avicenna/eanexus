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
  
  const handRef = useRef(null);

  useEffect(() => {
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

  const handleIconClick = () => {
    // Start reverse animation
    setHandState('reversing');
    
    // After animation completes, hide everything
    setTimeout(() => {
      setHandState('hidden');
    }, 3000);
  };

  const updateFingerprintMask = (circles) => {
    setFingerprintMask(circles);
  };

  if (handState === 'hidden') {
    return null;
  }

  return (
    <div className="hourglass-container">
      <BackgroundAnimation fingerprintMask={fingerprintMask} />
      
      <div 
        ref={handRef}
        className={`hand-mobile ${
          handState === 'lifting' ? 'lifting' : 
          handState === 'idle' ? 'idle' : 
          handState === 'reversing' ? 'reversing' : ''
        }`}
      >
        <div className="smartphone">
          <div className="screen">
            <div className="bg-deverouillage-top"></div>
            <div className="bg-deverouillage-bottom"></div>
            
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
    </div>
  );
};

export default HourglassSociety;
