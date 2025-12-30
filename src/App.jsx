import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SpotProvider } from './context/SpotContext';
import Map from './pages/Map';
import CheckIn from './pages/CheckIn';
import PhotoCompare from './pages/PhotoCompare';
import Heatmap from './pages/Heatmap';
import UploadProof from './pages/UploadProof';
import SpotList from './pages/SpotList';
import logo from './assets/logo.svg';
import './styles/styles.css';

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // 실제 로그인 로직은 여기에 구현
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSignup = () => {
    // 실제 회원가입 로직은 여기에 구현
    alert('회원가입 페이지로 이동합니다.');
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <img src={logo} alt="Polyp Logo" className="nav-logo" />
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">지도</Link>
          </li>
          <li>
            <Link to="/list" className="nav-link">목록</Link>
          </li>
          <li>
            <Link to="/checkin" className="nav-link">체크인</Link>
          </li>
          <li>
            <Link to="/upload" className="nav-link">폴립 제거</Link>
          </li>
          <li>
            <Link to="/compare" className="nav-link">사진 비교</Link>
          </li>
          <li>
            <Link to="/heatmap" className="nav-link">히트맵</Link>
          </li>
        </ul>
        <div className="nav-auth">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="auth-btn logout-btn">
              로그아웃
            </button>
          ) : (
            <>
              <button onClick={handleLogin} className="auth-btn login-btn">
                로그인
              </button>
              <button onClick={handleSignup} className="auth-btn signup-btn">
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <SpotProvider>
      <Router>
        <div className="app-container">
          <Navigation />
          <Routes>
            <Route path="/" element={<Map />} />
            <Route path="/list" element={<SpotList />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/upload" element={<UploadProof />} />
            <Route path="/compare" element={<PhotoCompare />} />
            <Route path="/heatmap" element={<Heatmap />} />
          </Routes>
        </div>
      </Router>
    </SpotProvider>
  );
}