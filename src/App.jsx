import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SpotProvider } from './context/SpotContext';
import Map from './pages/Map';
import CheckIn from './pages/CheckIn';
import PhotoCompare from './pages/PhotoCompare';
import Heatmap from './pages/Heatmap';
import UploadProof from './pages/UploadProof';
import SpotList from './pages/SpotList';
import logo from './assets/해파리젤리버거.png';
import { login as apiLogin, signup as apiSignup } from './services/api';
import './styles/styles.css';

function AuthModal({ isOpen, onClose, mode, onSuccess }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await apiLogin(name, password);
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('userName', name);
        onSuccess(name);
      } else {
        const response = await apiSignup(name, password);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('userName', response.name);
        onSuccess(response.name);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="이름을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '처리중...' : (mode === 'login' ? '로그인' : '회원가입')}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');
    if (userId && storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    }
  }, []);

  const handleLoginClick = () => {
    setModalMode('login');
    setModalOpen(true);
  };

  const handleSignupClick = () => {
    setModalMode('signup');
    setModalOpen(true);
  };

  const handleAuthSuccess = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <>
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
              <>
                <span className="user-name">{userName}님</span>
                <button onClick={handleLogout} className="auth-btn logout-btn">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLoginClick} className="auth-btn login-btn">
                  로그인
                </button>
                <button onClick={handleSignupClick} className="auth-btn signup-btn">
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        onSuccess={handleAuthSuccess}
      />
    </>
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