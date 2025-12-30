import { useState, useRef } from 'react';

export default function PhotoCompare() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const beforeImage = 'https://via.placeholder.com/800x500/e3f2fd/1976d2?text=Before';
  const afterImage = 'https://via.placeholder.com/800x500/c8e6c9/388e3c?text=After';

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  const updateSliderPosition = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    if (percentage >= 0 && percentage <= 100) {
      setSliderPosition(percentage);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>작업 전/후 비교</h1>
        <p className="page-description">
          슬라이더를 좌우로 드래그하여 청소 전후 상태를 비교할 수 있습니다.
        </p>
      </div>

      <div className="compare-container">
        <div
          className="compare-wrapper"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <div className="image-container">
            <img src={afterImage} alt="After" className="after-image" />

            <div
              className="before-image-wrapper"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img src={beforeImage} alt="Before" className="before-image" />
            </div>

            <div
              className="slider-handle"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className="slider-line"></div>
              <div className="slider-button">
                <span className="slider-arrow left">◀</span>
                <span className="slider-arrow right">▶</span>
              </div>
            </div>
          </div>

          <div className="compare-labels">
            <span className="label-before">작업 전</span>
            <span className="label-after">작업 후</span>
          </div>
        </div>

        <div className="compare-info">
          <div className="info-card">
            <h3>작업 정보</h3>
            <div className="info-row">
              <span className="label">위치</span>
              <span className="value">Spot A - 서울시 강남구</span>
            </div>
            <div className="info-row">
              <span className="label">작업 일시</span>
              <span className="value">2025-12-30 14:30</span>
            </div>
            <div className="info-row">
              <span className="label">작업자</span>
              <span className="value">홍길동</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}