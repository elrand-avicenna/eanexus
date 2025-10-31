import React, { useState, useEffect, useRef } from 'react';
import './AccessScreen.css';

const AccessScreen = ({ color, onIconClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  
  const icon1Ref = useRef(null);
  const icon2Ref = useRef(null);
  const icon3Ref = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  }, []);

  const handleIconClick = (iconIndex, e) => {
    if (selectedIcon !== null) return;

    e.preventDefault(); // Prevent default touch/click behavior
    e.stopPropagation();

    const iconRefs = [icon1Ref, icon2Ref, icon3Ref];
    const clickedIcon = iconRefs[iconIndex].current;
    const rect = clickedIcon.getBoundingClientRect();

    setSelectedIcon(iconIndex);

    // Get initial cursor/finger position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Send detached icon data to parent
    const iconNames = ['anim', 'accueil', 'hourglass'];
    onIconClick({
      iconName: iconNames[iconIndex],
      position: { x: rect.left, y: rect.top },
      targetPos: { x: clientX, y: clientY },
      width: rect.width,
      height: rect.height,
      isHolding: true
    });
  };

  const getIconStyle = (iconIndex) => {
    const baseStyle = {
      backgroundImage: `url(${process.env.PUBLIC_URL}/img/${
        iconIndex === 0 ? 'anim' :
        iconIndex === 1 ? 'accueil' :
        'hourglass'
      }.png)`
    };

    if (selectedIcon === iconIndex) {
      return {
        ...baseStyle,
        opacity: 0
      };
    }

    if (selectedIcon !== null && selectedIcon !== iconIndex) {
      return {
        ...baseStyle,
        opacity: 0,
        pointerEvents: 'none'
      };
    }

    return baseStyle;
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
