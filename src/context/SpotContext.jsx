import { createContext, useContext, useState } from 'react';

const SpotContext = createContext();

export function useSpots() {
  const context = useContext(SpotContext);
  if (!context) {
    throw new Error('useSpots must be used within SpotProvider');
  }
  return context;
}

export function SpotProvider({ children }) {
  const [spots, setSpots] = useState([
    {
      id: 1,
      name: 'Spot A',
      type: '폴립 발생',
      location: '부산 남항',
      lat: 35.0950,
      lng: 129.0350,
      radius: 100,
      status: 'danger',
      memo: '대량의 폴립 발생 탐지',
      beforeImage: null,
      afterImage: null,
      uploadedAt: null,
      cleanedAt: null,
      isLocked: false,
      lockedBy: null,
      reportedAt: '2025-12-20'
    },
    {
      id: 2,
      name: 'Spot B',
      type: '폴립 군집',
      location: '부산 북항',
      lat: 35.1100,
      lng: 129.0450,
      radius: 100,
      status: 'warning',
      memo: '폴립 군집 발견',
      beforeImage: null,
      afterImage: null,
      uploadedAt: null,
      cleanedAt: '2025-12-15',
      isLocked: true,
      lockedBy: '홍길동',
      reportedAt: '2025-12-18'
    },
    {
      id: 3,
      name: 'Spot C',
      type: '폴립 발생',
      location: '부산 해역',
      lat: 35.1050,
      lng: 129.0500,
      radius: 100,
      status: 'safe',
      memo: '폴립 제거 완료',
      beforeImage: 'https://via.placeholder.com/800x500/e3f2fd/1976d2?text=Before',
      afterImage: 'https://via.placeholder.com/800x500/c8e6c9/388e3c?text=After',
      uploadedAt: '2025-12-28 14:30',
      cleanedAt: '2025-12-28',
      isLocked: false,
      lockedBy: null,
      reportedAt: '2025-12-10'
    }
  ]);

  // Spot 추가
  const addSpot = (spotData) => {
    const newSpot = {
      id: Date.now(),
      ...spotData,
      status: 'danger',
      beforeImage: null,
      afterImage: null,
      uploadedAt: null,
      cleanedAt: null,
      isLocked: false,
      lockedBy: null,
      reportedAt: new Date().toISOString().split('T')[0]
    };
    setSpots([...spots, newSpot]);
    return newSpot;
  };

  // Spot 업데이트
  const updateSpot = (id, updates) => {
    setSpots(spots.map(spot =>
      spot.id === id ? { ...spot, ...updates } : spot
    ));
  };

  // 청소 인증 업로드
  const uploadCleaningProof = (spotId, beforeImage, afterImage) => {
    const now = new Date();
    const uploadedAt = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    const cleanedAt = now.toISOString().split('T')[0];

    setSpots(spots.map(spot =>
      spot.id === spotId
        ? {
            ...spot,
            beforeImage,
            afterImage,
            uploadedAt,
            cleanedAt,
            status: 'safe'
          }
        : spot
    ));
  };

  // 체크인
  const checkIn = (spotId, userName) => {
    setSpots(spots.map(spot =>
      spot.id === spotId
        ? { ...spot, isLocked: true, lockedBy: userName }
        : spot
    ));
  };

  // 체크아웃
  const checkOut = (spotId) => {
    setSpots(spots.map(spot =>
      spot.id === spotId
        ? { ...spot, isLocked: false, lockedBy: null }
        : spot
    ));
  };

  // 재점검 필요 여부 확인
  const needsReinspection = (spot) => {
    if (!spot.cleanedAt) return false;
    const cleanedDate = new Date(spot.cleanedAt);
    const today = new Date();
    const daysDiff = Math.floor((today - cleanedDate) / (1000 * 60 * 60 * 24));
    return daysDiff >= 14;
  };

  // 재점검 필요한 Spot 목록
  const getReinspectionSpots = () => {
    return spots.filter(spot => needsReinspection(spot));
  };

  const value = {
    spots,
    addSpot,
    updateSpot,
    uploadCleaningProof,
    checkIn,
    checkOut,
    needsReinspection,
    getReinspectionSpots
  };

  return <SpotContext.Provider value={value}>{children}</SpotContext.Provider>;
}