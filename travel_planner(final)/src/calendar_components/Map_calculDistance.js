import { useEffect, useState } from 'react';
import { useLoadScript } from '../LoadScriptContext';
import { Polyline } from '@react-google-maps/api';

const calculateDistance = (place1, place2) => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (place2.coordinates.lat - place1.coordinates.lat) * Math.PI / 180;
  const dLon = (place2.coordinates.lng - place1.coordinates.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(place1.coordinates.lat * Math.PI / 180) *
    Math.cos(place2.coordinates.lat * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const Map_calculDistance = () => {
  // const { savedPlaces } = useLoadScript();
  const [legs, setLegs] = useState([]);
  const [path, setPath] = useState([]);

  const { placesForSelectedDate } = useLoadScript();

  const AVERAGE_SPEED_KMH = 30;

  useEffect(() => {
    if (placesForSelectedDate.length < 2) {
      setLegs([]);
      setPath([]); // 선을 지우기
      return;
    }

    console.log("📌 저장된 장소 확인:", placesForSelectedDate);

    const calculatedLegs = [];
    const newPath = [];

    for (let i = 0; i < placesForSelectedDate.length - 1; i++) {
      const legDistance = calculateDistance(
        { coordinates: { lat: placesForSelectedDate[i].coordinates.lat, lng: placesForSelectedDate[i].coordinates.lng } },
        { coordinates: { lat: placesForSelectedDate[i + 1].coordinates.lat, lng: placesForSelectedDate[i + 1].coordinates.lng } }
      );
      const travelTime = (legDistance / AVERAGE_SPEED_KMH * 60).toFixed(2);

      calculatedLegs.push({
        from: placesForSelectedDate[i].address,
        to: placesForSelectedDate[i + 1].address,
        distance: legDistance.toFixed(2),
        travelTime,
      });

      newPath.push({
        lat: placesForSelectedDate[i].coordinates.lat,
        lng: placesForSelectedDate[i].coordinates.lng,
      });
    }

    // 마지막 지점 추가
    newPath.push({
      lat: placesForSelectedDate[placesForSelectedDate.length - 1].coordinates.lat,
      lng: placesForSelectedDate[placesForSelectedDate.length - 1].coordinates.lng,
    });

    console.log("🛤 Polyline Path:", newPath);

    setLegs(calculatedLegs);
    setPath(newPath);
  }, [placesForSelectedDate]);

  return (
    <>
      {/* 저장된 장소가 2개 이상일 때만 선을 그림 */}
      {path.length > 1 && (
        <Polyline
          path={path}
          options={{
            strokeColor: 'red',
            strokeOpacity: 1,
            strokeWeight: 3,
          }}
        />
      )}
      <div className="distance-info">
        {legs.length > 0 ? (
          legs.map((leg, index) => (
            <div key={index} className="leg-info">
              <p>{index + 1}번째 구간: {leg.from} 에서 {leg.to}까지</p>
              <p>거리: {leg.distance} km</p>
              <p>예상 소요시간: {leg.travelTime} 분</p>
            </div>
          ))
        ) : (
          <p>최소 두 개 이상의 장소를 등록해주세요.</p>
        )}
      </div>
    </>
  );
};

export default Map_calculDistance;
