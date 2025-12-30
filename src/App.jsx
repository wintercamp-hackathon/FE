import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ClickHandler({ markers, setMarkers }) {
  useMapEvents({
    click(e) {
      setMarkers([
        ...markers,
        {
          id: Date.now(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        },
      ]);
    },
  });
  return null;
}

export default function App() {
  const [markers, setMarkers] = useState([]);

  const KOREA_CENTER = [37.5665, 126.978];
  const KOREA_BOUNDS = [
    [33.0, 124.5],
    [39.5, 132.0],
  ];

  return (
    <MapContainer
      center={KOREA_CENTER}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
      maxBounds={KOREA_BOUNDS}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler markers={markers} setMarkers={setMarkers} />

      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>
            <p>위험도 : {}</p>
            <button
              onClick={() => setTimeout(() => {setMarkers(markers.filter((x) => x.id !== m.id))}, 100)}
            >
              삭제
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
