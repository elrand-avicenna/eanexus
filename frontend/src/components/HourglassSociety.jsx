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

  const handStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/img/hand-mobile.png)`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

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
    </div>
  );
};

export default HourglassSociety;
