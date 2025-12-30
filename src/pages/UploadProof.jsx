import { useState } from 'react';
import { useSpots } from '../context/SpotContext';
import { useNavigate } from 'react-router-dom';

export default function UploadProof() {
  const { spots, uploadCleaningProof } = useSpots();
  const navigate = useNavigate();

  const [selectedSpot, setSelectedSpot] = useState('');
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);

  // 체크인된 Spot만 필터링
  const checkedInSpots = spots.filter(spot => spot.isLocked && spot.lockedBy === '나');

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'before') {
        setBeforeImage(reader.result);
        setBeforePreview(reader.result);
      } else {
        setAfterImage(reader.result);
        setAfterPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSpot || !beforeImage || !afterImage) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    uploadCleaningProof(parseInt(selectedSpot), beforeImage, afterImage);

    alert('폴립 제거 인증이 완료되었습니다!');
    navigate('/compare');
  };

  const selectedSpotData = spots.find(s => s.id === parseInt(selectedSpot));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>폴립 제거 인증</h1>
        <p className="page-description">
          폴립 제거 전/후 사진을 업로드하여 작업을 완료하세요.
        </p>
      </div>

      {checkedInSpots.length === 0 && (
        <div className="info-card">
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
            체크인된 Spot이 없습니다. 먼저 Spot에 체크인해주세요.
          </p>
        </div>
      )}

      {checkedInSpots.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="spot-selector">
            <label>작업 위치 선택 *</label>
            <select
              value={selectedSpot}
              onChange={(e) => setSelectedSpot(e.target.value)}
              required
            >
              <option value="">Spot을 선택하세요</option>
              {checkedInSpots.map(spot => (
                <option key={spot.id} value={spot.id}>
                  {spot.name} - {spot.location}
                </option>
              ))}
            </select>

            {selectedSpotData && (
              <div className="spot-info-box">
                <p><strong>유형:</strong> {selectedSpotData.type}</p>
                <p><strong>위치:</strong> {selectedSpotData.location}</p>
                <p><strong>메모:</strong> {selectedSpotData.memo || '없음'}</p>
              </div>
            )}
          </div>

          <div className="upload-container">
            <div className="upload-section">
              <h3>폴립 제거 전 사진 *</h3>
              <label htmlFor="before-upload" className={`image-upload-box ${beforePreview ? 'has-image' : ''}`}>
                {!beforePreview ? (
                  <>
                    <div className="upload-icon">📷</div>
                    <p className="upload-text">클릭하여 사진 선택</p>
                  </>
                ) : (
                  <img src={beforePreview} alt="Before Preview" className="preview-image" />
                )}
              </label>
              <input
                id="before-upload"
                type="file"
                accept="image/*"
                className="file-input"
                onChange={(e) => handleImageUpload(e, 'before')}
                required
              />
              {beforePreview && (
                <div className="upload-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setBeforeImage(null);
                      setBeforePreview(null);
                      document.getElementById('before-upload').value = '';
                    }}
                  >
                    다시 선택
                  </button>
                </div>
              )}
            </div>

            <div className="upload-section">
              <h3>폴립 제거 후 사진 *</h3>
              <label htmlFor="after-upload" className={`image-upload-box ${afterPreview ? 'has-image' : ''}`}>
                {!afterPreview ? (
                  <>
                    <div className="upload-icon">📷</div>
                    <p className="upload-text">클릭하여 사진 선택</p>
                  </>
                ) : (
                  <img src={afterPreview} alt="After Preview" className="preview-image" />
                )}
              </label>
              <input
                id="after-upload"
                type="file"
                accept="image/*"
                className="file-input"
                onChange={(e) => handleImageUpload(e, 'after')}
                required
              />
              {afterPreview && (
                <div className="upload-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setAfterImage(null);
                      setAfterPreview(null);
                      document.getElementById('after-upload').value = '';
                    }}
                  >
                    다시 선택
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={!selectedSpot || !beforeImage || !afterImage}
            >
              폴립 제거 인증 완료
            </button>
          </div>
        </form>
      )}
    </div>
  );
}