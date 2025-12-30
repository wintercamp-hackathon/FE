import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Map from './pages/Map';
import CheckIn from './pages/CheckIn';
import PhotoCompare from './pages/PhotoCompare';
import Heatmap from './pages/Heatmap';
import './styles/styles.css';

function Navigation() {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <h1 className="nav-logo">Polyp</h1>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">지도</Link>
          </li>
          <li>
            <Link to="/checkin" className="nav-link">체크인</Link>
          </li>
          <li>
            <Link to="/compare" className="nav-link">사진 비교</Link>
          </li>
          <li>
            <Link to="/heatmap" className="nav-link">히트맵</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/compare" element={<PhotoCompare />} />
          <Route path="/heatmap" element={<Heatmap />} />
        </Routes>
      </div>
    </Router>
  );
}