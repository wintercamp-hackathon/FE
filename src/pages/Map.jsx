import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSpots } from "../context/SpotContext";

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function Map() {
  const { spots, addSpot } = useSpots();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '폴립 발생',
    location: '',
    memo: ''
  });

  const KOREA_CENTER = [35.1028, 129.0403]; // 부산항
  const KOREA_BOUNDS = [
    [33.0, 124.5],
    [39.5, 132.0],
  ];

  const spotTypes = ['폴립 발생', '폴립 군집', '대량 발생', '기타'];

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLocation || !formData.name || !formData.location) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    addSpot({
      ...formData,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      radius: 100
    });

    setShowForm(false);
    setSelectedLocation(null);
    setFormData({
      name: '',
      type: '폴립 발생',
      location: '',
      memo: ''
    });

    alert('폴립 발생 지점이 등록되었습니다!');
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedLocation(null);
    setFormData({
      name: '',
      type: '폴립 발생',
      location: '',
      memo: ''
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'danger': return '#f44336';
      case 'warning': return '#ff9800';
      case 'safe': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 73px)' }}>
      <MapContainer
        center={KOREA_CENTER}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        maxBounds={KOREA_BOUNDS}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationPicker onLocationSelect={handleLocationSelect} />

        {spots.map((spot) => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]}>
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#283593' }}>{spot.name}</h3>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>유형:</strong> {spot.type}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>위치:</strong> {spot.location}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <strong>상태:</strong>
                  <span style={{
                    color: getStatusColor(spot.status),
                    fontWeight: '600',
                    marginLeft: '4px'
                  }}>
                    {spot.status === 'danger' ? '위험' : spot.status === 'warning' ? '주의' : '안정'}
                  </span>
                </p>
                {spot.memo && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#757575' }}>
                    {spot.memo}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <strong>선택한 위치</strong>
              <p style={{ fontSize: '12px', margin: '4px 0' }}>
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </p>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {showForm && (
        <div className="map-form-overlay">
          <div className="map-form-container">
            <h2>폴립 발생 지점 등록</h2>
            <p className="form-subtitle">
              선택한 위치: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </p>
            <p className="form-subtitle" style={{ color: '#ff9800', fontWeight: 600 }}>
              ⚠ 폴립은 해상/수역에서만 발생합니다. 육지 영역은 등록이 적절하지 않을 수 있습니다.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Spot 이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="예: Spot A"
                  required
                />
              </div>

              <div className="form-group">
                <label>유형 *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  {spotTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>위치 설명 *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="예: 인천 앞바다, 제주 연안"
                  required
                />
              </div>

              <div className="form-group">
                <label>메모</label>
                <textarea
                  value={formData.memo}
                  onChange={(e) => setFormData({...formData, memo: e.target.value})}
                  placeholder="폴립 발생 상세 설명을 입력하세요"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  취소
                </button>
                <button type="submit" className="btn-primary">
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="map-instruction">
        <p>지도를 클릭하여 폴립 발생 지점을 등록하세요</p>
      </div>
    </div>
  );
}