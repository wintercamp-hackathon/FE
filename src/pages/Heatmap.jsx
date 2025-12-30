import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Heatmap() {
  const [isHeatmapOn, setIsHeatmapOn] = useState(true);

  const heatmapData = [
    { lat: 37.5665, lng: 126.978, risk: 'high', value: 90 },
    { lat: 37.5490, lng: 126.9150, risk: 'medium', value: 60 },
    { lat: 37.5700, lng: 126.9850, risk: 'low', value: 30 },
    { lat: 37.5550, lng: 126.9700, risk: 'high', value: 85 },
    { lat: 37.5600, lng: 126.9900, risk: 'medium', value: 55 },
    { lat: 37.5750, lng: 126.9700, risk: 'low', value: 25 },
    { lat: 37.5450, lng: 126.9600, risk: 'high', value: 95 },
    { lat: 37.5650, lng: 126.9800, risk: 'medium', value: 50 }
  ];

  const KOREA_CENTER = [37.5665, 126.978];
  const KOREA_BOUNDS = [
    [33.0, 124.5],
    [39.5, 132.0],
  ];

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getRiskLabel = (risk) => {
    switch(risk) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };

  const getRadius = (value) => {
    return (value / 100) * 80 + 20;
  };

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
                <span>높음 (80-100)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#ff9800' }}></div>
                <span>보통 (50-79)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#4caf50' }}></div>
                <span>낮음 (0-49)</span>
              </div>
            </div>
          </div>
        )}

        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">총 지점</span>
            <span className="stat-value">{heatmapData.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">고위험</span>
            <span className="stat-value high">
              {heatmapData.filter(d => d.risk === 'high').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">중위험</span>
            <span className="stat-value medium">
              {heatmapData.filter(d => d.risk === 'medium').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">저위험</span>
            <span className="stat-value low">
              {heatmapData.filter(d => d.risk === 'low').length}
            </span>
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

          {isHeatmapOn && heatmapData.map((point, index) => (
            <CircleMarker
              key={index}
              center={[point.lat, point.lng]}
              radius={getRadius(point.value)}
              pathOptions={{
                fillColor: getRiskColor(point.risk),
                fillOpacity: 0.5,
                color: getRiskColor(point.risk),
                weight: 2,
                opacity: 0.8
              }}
            >
              <Popup>
                <div className="heatmap-popup">
                  <strong>위험도: {getRiskLabel(point.risk)}</strong>
                  <p>지수: {point.value}</p>
                  <p>위치: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}