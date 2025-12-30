import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSpots } from '../context/SpotContext';
import { getHeatmapData } from '../services/api';

export default function Heatmap() {
  const { spots } = useSpots();
  const [isHeatmapOn, setIsHeatmapOn] = useState(true);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      setLoading(true);
      try {
        const data = await getHeatmapData();
        setHeatmapPoints(data);
      } catch (error) {
        console.error('히트맵 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, []);

  const KOREA_CENTER = [35.1028, 129.0403]; // 부산항
  const KOREA_BOUNDS = [
    [33.0, 124.5],
    [39.5, 132.0],
  ];

  const levelToStatus = (level) => {
    if (level >= 3) return 'danger';
    if (level === 2) return 'warning';
    if (level === 1) return 'safe';
    return 'unknown';
  };

  const getRiskColor = (status) => {
    switch(status) {
      case 'danger': return '#f44336';
      case 'warning': return '#ff9800';
      case 'safe': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getRiskLabel = (status) => {
    switch(status) {
      case 'danger': return '위험';
      case 'warning': return '주의';
      case 'safe': return '안정';
      default: return '알 수 없음';
    }
  };

  const getRadius = (status) => {
    switch(status) {
      case 'danger': return 100;
      case 'warning': return 70;
      case 'safe': return 40;
      default: return 30;
    }
  };

  const getRadiusFromLevel = (level) => {
    if (level >= 3) return 100;
    if (level === 2) return 70;
    if (level === 1) return 40;
    return 30;
  };

  const stats = useMemo(() => {
    return {
      total: spots.length,
      danger: spots.filter(s => s.status === 'danger').length,
      warning: spots.filter(s => s.status === 'warning').length,
      safe: spots.filter(s => s.status === 'safe').length
    };
  }, [spots]);

  return (
    <div className="page-container heatmap-page">
      <div className="heatmap-controls">
        <div className="control-header">
          <h2>위험 히트맵</h2>
          <button
            className={`toggle-btn ${isHeatmapOn ? 'active' : ''}`}
            onClick={() => setIsHeatmapOn(!isHeatmapOn)}
          >
            {isHeatmapOn ? 'ON' : 'OFF'}
          </button>
        </div>

        {isHeatmapOn && (
          <div className="legend">
            <h3>위험도 범례</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#f44336' }}></div>
                <span>위험</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#ff9800' }}></div>
                <span>주의</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#4caf50' }}></div>
                <span>안정</span>
              </div>
            </div>
          </div>
        )}

        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">총 지점</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">위험</span>
            <span className="stat-value high">{stats.danger}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">주의</span>
            <span className="stat-value medium">{stats.warning}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">안정</span>
            <span className="stat-value low">{stats.safe}</span>
          </div>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={KOREA_CENTER}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          maxBounds={KOREA_BOUNDS}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {isHeatmapOn && spots.map((spot) => (
            <CircleMarker
              key={`spot-${spot.id}`}
              center={[spot.lat, spot.lng]}
              radius={getRadius(spot.status)}
              pathOptions={{
                fillColor: getRiskColor(spot.status),
                fillOpacity: 0.5,
                color: getRiskColor(spot.status),
                weight: 2,
                opacity: 0.8
              }}
            >
              <Popup>
                <div className="heatmap-popup">
                  <strong>{spot.name}</strong>
                  <p>유형: {spot.type}</p>
                  <p>위험도: {getRiskLabel(spot.status)}</p>
                  <p>위치: {spot.location}</p>
                  {spot.memo && <p>메모: {spot.memo}</p>}
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {isHeatmapOn && heatmapPoints.map((point, index) => {
            const status = levelToStatus(point.level);
            return (
              <CircleMarker
                key={`heatmap-${index}`}
                center={[point.x_pos, point.y_pos]}
                radius={getRadiusFromLevel(point.level)}
                pathOptions={{
                  fillColor: getRiskColor(status),
                  fillOpacity: 0.3,
                  color: getRiskColor(status),
                  weight: 1,
                  opacity: 0.6
                }}
              >
                <Popup>
                  <div className="heatmap-popup">
                    <strong>폴립 발생 지점</strong>
                    <p>위험도: {getRiskLabel(status)}</p>
                    <p>레벨: {point.level}</p>
                    {point.address && <p>위치: {point.address}</p>}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}