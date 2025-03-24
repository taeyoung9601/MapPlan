// components/Map_Marker.js
import { useEffect, useState } from 'react';
import { Marker, MarkerF, geocoder, InfoWindow } from '@react-google-maps/api';
import { useLoadScript } from '../LoadScriptContext';

import './Map_Marker.css';

const Map_Marker = () => {
  const { map, markers, addMarker, removeMarker, getPlaceDetails } = useLoadScript();
  const [activeMarker, setActiveMarker] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);


  // 📌 좌표를 받아 place_id를 반환하는 함수
  const getPlaceIdFromCoords = async (lat, lng) => {
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].place_id);
        } else {
          resolve(null); // place_id가 없을 경우 null 반환
        }
      });
    });
  };

  // 📌 지도 클릭 이벤트 리스너[삭제]
  // useEffect(() => {
  //   if (!map) return;

  //   const clickListener = map.addListener("click", async (e) => {
  //     const lat = e.latLng.lat();
  //     const lng = e.latLng.lng();

  //     // place_id 가져오기
  //     const placeId = await getPlaceIdFromCoords(lat, lng);
  //     console.log("클릭한 위치의 place_id:", placeId); // 클릭한 좌표의 장소 Id 확인 콘솔

  //     // 마커 추가
  //     addMarker({
  //       lat,
  //       lng,
  //       placeId,
  //       address: placeId ? "검색된 위치" : "직접 선택한 위치",
  //     });
  //   });

  //   return () => clickListener.remove(); // 언마운트 시 이벤트 리스너를 제거하여 누수 방지 
  // }, [map, addMarker]);

  // 마커 클릭시 상세 정보 안내
  const handleMarkerClick = async (marker, index) => {
    setActiveMarker(index);

    if (marker.placeId) {
      try {
        const details = await getPlaceDetails(marker.placeId);
        setPlaceDetails(details);
      } catch (error) {
        console.error("장소 상세 정보 조회 실패:", error);
        setPlaceDetails(null);
      }
    }
  };

  // 정보창 내용 컴포넌트
  const InfoWindowContent = ({ details }) => {
    // console.log("InfoWindowContent() invoked.");

    return details && (
      <div className='place_info'>

        {details && (
          <>
            <h3>장소이름: {details.name}</h3>
            {/* <p>{details.types[0]}</p> */}
            {details.formatted_address && <p>주소: {details.formatted_address}</p>}
            {details.formatted_phone_number && <p>전화: {details.formatted_phone_number}</p>}
            {details.website && <p>웹사이트: <a style={{ textDecoration: 'none', color: '#212529' }} target='_blank' href={details.website}>{details.website}</a></p>}
            {details.rating && <p>평점: {details.rating}</p>}
            {details.opening_hours?.weekday_text && (
              <>
                <p>영업시간:</p>
                {details.opening_hours.weekday_text.map((day, index) => <p key={index} style={{ paddingLeft: '30px', }}>{day}</p>)}
              </>
            )}
            <br />
            <p>
              <a style={{ textDecoration: 'none', color: '#212529' }} target='_blank' href={details.url}>google지도로 보기</a>
            </p>
          </>
        )}
      </div>
    );
  };


  return (markers.map((marker, index) => {
    const MarkerKey = `${marker.placeId || 'manual'}-${index}`;
    return (
      <div key={MarkerKey}>
        <MarkerF
          // key={`${marker.placeId || 'manual'}-${index}`} // 리스트 렌더링 시 key 속성을 설정하는 코드
          position={{ lat: marker.lat, lng: marker.lng }}
          label={(index + 1).toString()} // 마커에 번호를 매김
          animation={window.google.maps.Animation.DROP}
          onClick={() => handleMarkerClick(marker, index)} // 마커 클릭시 infowindow 창 열기
        />
        <button onClick={() => removeMarker(index)}>초기화</button>

        {activeMarker === index && (
          <>
            {/* <InfoWindow
            position={{ lat: marker.lat, lng: marker.lng }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div>
              <p>장소 ID: {marker.placeId || '수동 추가'}</p>
              <p><strong>이름:</strong> {placeDetails?.name || '정보 없음'}</p>
              <p><strong>주소:</strong> {placeDetails?.formatted_address || '정보 없음'}</p>
              <p><strong>평점:</strong> {placeDetails?.rating || 'N/A'}</p>
            </div>
          </InfoWindow> */}

            <div className="infoBox">
              <InfoWindowContent details={placeDetails} activeMarker={activeMarker} />
            </div>
          </>
        )}
      </div>
    );
  }));
}
export default Map_Marker;

// key={`${marker.placeId || 'manual'}-${index}`}
// key 속성은 react가 리스트를 효율적으로 업데이트 할 수 있도록 돕는 역할을 함
// key 속성이 없을 경우?
// -> 어떤 항목이 변경되었는지 , 추가되었는지 명확히 알기 어려워 불 필요한 렌더링이 발생하거나
//    예상치 못한 UI 버그가 생길 수도 있음

// ${index} = 마커 배열에서 현재 요소의 인덱스 를 추가하여 고유한 키를 만든다.
// Ex. 마커가 3개 있고 placeId 값이 각각 다르다면 Key 값을 각각 다르게 형성해서 저장함.
// 사용자가 수동으로 추가한 마커는 placeId 가 없기에 'manual' 이라는 기본 값을 사용함.