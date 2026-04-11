import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 100); // Show button after scrolling 100px
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <StyledWrapper style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'auto' : 'none' }}>
      <button className="button" onClick={scrollToTop}>
        <svg viewBox="0 0 384 512" className="svgIcon">
          <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  transition: opacity 0.3s ease-in-out;

  .button {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background-color: #02382A;
    border: 2px double #e9e9e9;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .svgIcon {
    width: 12px;
    transition: 0.3s;
  }

  .svgIcon path {
    fill: #e9e9e9;
  }

  .button:hover {
    width: 140px;
    border-radius: 15px;
  }

  .button:hover .svgIcon {
    transform: translateY(-200%);
  }

  .button::before {
    position: absolute;
    bottom: -20px;
    content: "Back to Top";
    color: #e9e9e9;
    font-size: 0px;
  }

  .button:hover::before {
    font-family: Garet;
    font-size: 15px;
    bottom: unset;
    transition: 0.3s;
  }
`;
export default BackToTopButton;