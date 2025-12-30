import { useState } from 'react';
import { useSpots } from '../context/SpotContext';

export default function CheckIn() {
  const { spots, checkIn, checkOut } = useSpots();
  const [currentLocation] = useState({ lat: 35.0950, lng: 129.0350 }); // Spot A
  const [selectedSpot, setSelectedSpot] = useState(null);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const isInRange = (spot) => {
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      spot.lat,
      spot.lng
    );
    return distance <= spot.radius;
  };

  const handleCheckIn = (spot) => {
    if (spot.isLocked) return;

    if (!isInRange(spot)) {
      alert('작업 위치 반경 안으로 이동해주세요.');
      return;
    }

    checkIn(spot.id, '나');
    setSelectedSpot(spot.id);
  };

  const handleCheckOut = (spot) => {
    checkOut(spot.id);
    if (selectedSpot === spot.id) {
      setSelectedSpot(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>현장 체크인</h1>
        <p className="page-description">
          작업 위치에 체크인하여 작업을 시작하세요. 체크인한 위치는 다른 사용자가 동시에 작업할 수 없습니다.
        </p>
      </div>

      <div className="spots-grid">
        {spots.map(spot => {
          const inRange = isInRange(spot);
          const distance = Math.round(calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            spot.lat,
            spot.lng
          ));

          return (
            <div
              key={spot.id}
              className={`spot-card ${spot.isLocked ? 'locked' : ''} ${selectedSpot === spot.id ? 'selected' : ''}`}
            >
              <div className="spot-card-header">
                <h3>{spot.name}</h3>
                {spot.isLocked && (
                  <span className="lock-badge">
                    {spot.lockedBy === '나' ? '작업 중' : 'LOCK'}
                  </span>
                )}
              </div>

              <div className="spot-card-body">
                <div className="info-row">
                  <span className="label">위치</span>
                  <span className="value">{spot.location}</span>
                </div>

                <div className="info-row">
                  <span className="label">유형</span>
                  <span className="value">{spot.type}</span>
                </div>

                <div className="info-row">
                  <span className="label">거리</span>
                  <span className={`value ${inRange ? 'in-range' : 'out-range'}`}>
                    {distance}m {inRange ? '(범위 내)' : '(범위 외)'}
                  </span>
                </div>

                {spot.isLocked && spot.lockedBy !== '나' && (
                  <div className="locked-info">
                    <span className="locked-by">작업자: {spot.lockedBy}</span>
                  </div>
                )}
              </div>

              <div className="spot-card-footer">
                {!spot.isLocked && (
                  <button
                    className={`btn-primary ${!inRange ? 'disabled' : ''}`}
                    onClick={() => handleCheckIn(spot)}
                    disabled={!inRange}
                  >
                    체크인
                  </button>
                )}

                {spot.isLocked && spot.lockedBy === '나' && (
                  <button
                    className="btn-secondary"
                    onClick={() => handleCheckOut(spot)}
                  >
                    체크아웃
                  </button>
                )}

                {spot.isLocked && spot.lockedBy !== '나' && (
                  <button className="btn-disabled" disabled>
                    다른 사용자 작업 중
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}