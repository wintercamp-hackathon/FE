import { useState, useRef } from 'react';
import { useSpots } from '../context/SpotContext';

export default function PhotoCompare() {
  const { spots } = useSpots();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState('');
  const containerRef = useRef(null);

  // 사진이 업로드되고 폴립 제거 완료된 Spot만 필터링 (danger/warning → safe)
  const spotsWithPhotos = spots.filter(spot =>
    spot.beforeImage && spot.afterImage && spot.status === 'safe'
  );

  const selectedSpot = selectedSpotId ? spots.find(s => s.id === parseInt(selectedSpotId)) : null;

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
        <h1>폴립 제거 전/후 비교</h1>
        <p className="page-description">
          슬라이더를 좌우로 드래그하여 폴립 제거 전후 상태를 비교할 수 있습니다.
        </p>
      </div>

      {spotsWithPhotos.length === 0 ? (
        <div className="info-card">
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
            업로드된 폴립 제거 인증 사진이 없습니다.
          </p>
        </div>
      ) : (
        <>
          <div className="spot-selector">
            <label>비교할 Spot 선택</label>
            <select
              value={selectedSpotId}
              onChange={(e) => setSelectedSpotId(e.target.value)}
            >
              <option value="">Spot을 선택하세요</option>
              {spotsWithPhotos.map(spot => (
                <option key={spot.id} value={spot.id}>
                  {spot.name} - {spot.location}
                </option>
              ))}
            </select>
          </div>

          {!selectedSpot ? (
            <div className="compare-container">
              <div className="compare-wrapper">
                <div className="info-card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                  <p style={{ margin: 0, color: 'var(--color-text-light)', fontSize: '16px' }}>
                    사진이 없습니다
                  </p>
                </div>
              </div>
              <div className="compare-info">
                <div className="info-card">
                  <h3>폴립 제거 정보</h3>
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', color: 'var(--color-text-light)' }}>
                    Spot이 선택되지 않았습니다
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                  <img src={selectedSpot.afterImage} alt="After" className="after-image" />

                  <div
                    className="before-image-wrapper"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img src={selectedSpot.beforeImage} alt="Before" className="before-image" />
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
                  <span className="label-before">폴립 제거 전</span>
                  <span className="label-after">폴립 제거 후</span>
                </div>
              </div>

              <div className="compare-info">
                <div className="info-card">
                  <h3>폴립 제거 정보</h3>
                  <div className="info-row">
                    <span className="label">Spot 이름</span>
                    <span className="value">{selectedSpot.name || '알 수 없음'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">유형</span>
                    <span className="value">{selectedSpot.type || '알 수 없음'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">위치</span>
                    <span className="value">{selectedSpot.location || '알 수 없음'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">제거 일시</span>
                    <span className="value">{selectedSpot.uploadedAt || '알 수 없음'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">상태</span>
                    <span className="value" style={{
                      color: selectedSpot.status === 'safe' ? 'var(--color-success)' :
                             selectedSpot.status === 'warning' ? 'var(--color-warning)' :
                             'var(--color-danger)'
                    }}>
                      {selectedSpot.status === 'safe' ? '제거 완료' :
                       selectedSpot.status === 'warning' ? '주의' :
                       selectedSpot.status === 'danger' ? '위험' : '알 수 없음'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}