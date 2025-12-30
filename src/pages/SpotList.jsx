import { useState, useMemo } from 'react';
import { useSpots } from '../context/SpotContext';

export default function SpotList() {
  const { spots, getReinspectionSpots, needsReinspection } = useSpots();
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // 필터링된 Spot 목록
  const filteredSpots = useMemo(() => {
    let filtered = [...spots];

    // 필터 적용
    if (filterType === 'danger') {
      filtered = filtered.filter(s => s.status === 'danger');
    } else if (filterType === 'warning') {
      filtered = filtered.filter(s => s.status === 'warning');
    } else if (filterType === 'safe') {
      filtered = filtered.filter(s => s.status === 'safe');
    } else if (filterType === 'reinspect') {
      filtered = getReinspectionSpots();
    }

    // 정렬 적용
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    } else if (sortBy === 'danger') {
      const statusOrder = { danger: 3, warning: 2, safe: 1 };
      filtered.sort((a, b) => (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0));
    }

    return filtered;
  }, [spots, filterType, sortBy, getReinspectionSpots]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'danger': return 'var(--color-danger)';
      case 'warning': return 'var(--color-warning)';
      case 'safe': return 'var(--color-success)';
      default: return 'var(--color-text-light)';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'danger': return '위험';
      case 'warning': return '주의';
      case 'safe': return '안정';
      default: return '알 수 없음';
    }
  };

  const reinspectionCount = getReinspectionSpots().length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Spot 목록</h1>
        <p className="page-description">
          등록된 모든 Spot을 확인하고 필터링할 수 있습니다.
        </p>
      </div>

      {reinspectionCount > 0 && (
        <div className="info-card" style={{
          background: '#fff3e0',
          borderLeft: '4px solid var(--color-warning)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <p style={{ margin: 0, color: '#e65100', fontWeight: 600 }}>
            ⚠ {reinspectionCount}개의 Spot이 재점검이 필요합니다. (폴립 제거 완료 후 14일 경과)
          </p>
        </div>
      )}

      <div className="filter-controls">
        <div className="filter-section">
          <label>필터</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">전체</option>
            <option value="danger">위험</option>
            <option value="warning">주의</option>
            <option value="safe">안정</option>
            <option value="reinspect">재점검 필요</option>
          </select>
        </div>

        <div className="filter-section">
          <label>정렬</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">최근 제보 순</option>
            <option value="danger">위험도 높은 순</option>
          </select>
        </div>
      </div>

      <div className="list-stats">
        <span className="stat">총 {filteredSpots.length}개 Spot</span>
      </div>

      <div className="spot-list">
        {filteredSpots.map(spot => (
          <div key={spot.id} className="list-item">
            <div className="list-item-header">
              <h3>{spot.name}</h3>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(spot.status) }}
              >
                {getStatusLabel(spot.status)}
              </span>
              {needsReinspection(spot) && (
                <span className="reinspect-badge">재점검 필요</span>
              )}
            </div>

            <div className="list-item-body">
              <div className="info-row">
                <span className="label">유형</span>
                <span className="value">{spot.type}</span>
              </div>

              <div className="info-row">
                <span className="label">위치</span>
                <span className="value">{spot.location}</span>
              </div>

              <div className="info-row">
                <span className="label">제보일</span>
                <span className="value">{spot.reportedAt}</span>
              </div>

              {spot.cleanedAt && (
                <div className="info-row">
                  <span className="label">제거일</span>
                  <span className="value">{spot.cleanedAt}</span>
                </div>
              )}

              {spot.isLocked && (
                <div className="info-row">
                  <span className="label">작업자</span>
                  <span className="value">{spot.lockedBy}</span>
                </div>
              )}

              {spot.memo && (
                <div className="memo">
                  <strong>메모:</strong> {spot.memo}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredSpots.length === 0 && (
          <div className="empty-state">
            <p>조건에 맞는 Spot이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}