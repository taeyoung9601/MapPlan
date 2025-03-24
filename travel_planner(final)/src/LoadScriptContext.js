import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';

export const LoadScriptContext = createContext(null);

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
}; // calculateDistance

export const LoadScriptProvider = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [location, setLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [legs, setLegs] = useState([]);
    const [savedPlaces, setSavedPlaces] = useState([]);
    const placesService = useRef(null);
    const [selectedPlaces, setSelectedPlaces] = useState({});
    const [selectedDate, setSelectedDate] = useState(''); //  현재 선택된 날짜
    const [showCalendar, setShowCalendar] = useState(true); // 캘린더 표시 여부 상태 추가

    // 현재 선택된 날짜에 해당하는 장소를 savedPlaces에서 가져옴
    const placesForSelectedDate = savedPlaces.filter(place => place.date === selectedDate);

    // map이 준비되면 placesService 초기화
    useEffect(() => {
        if (map && !placesService.current) {
            placesService.current = new window.google.maps.places.PlacesService(map);
        }
    }, [map]);

    useEffect(() => {
        // 현재 선택된 날짜에 해당하는 장소를 savedPlaces에서 가져옴
        // const placesForSelectedDate = savedPlaces.filter(place => place.date === selectedDate);

        // 해당 날짜의 장소들을 markers로 복원
        const newMarkers = placesForSelectedDate.map(place => ({
            placeId: place.placeId,
            lat: place.coordinates.lat,
            lng: place.coordinates.lng,
            address: place.address,
            markerKey: place.markerKey,
        })); // newMarkers

        setMarkers(newMarkers); // 마커 업데이트
    }, [selectedDate, savedPlaces]); // selectedDate나 savedPlaces가 변경될 때 실행 // useEffect

    const addMarker = (marker) => {
        setMarkers((prev) => {
            const newMarker = {
                ...marker,
                markerKey: `${marker.placeId || 'manual'}-${prev.length}`,
            }; // newMarker
            return [...prev, newMarker];
        }); // setMarkers
    }; // addMarker

    const removeMarker = () => {
        setMarkers([]);
    }; // removeMarker

    const savePlaces = async () => {
        console.log("LoadScriptProvider : selectedDate: ", selectedDate);
        console.log("LoadScriptProvider : markers: ", markers);
        console.log("LoadScriptProvider : placesForSelectedDate: ", placesForSelectedDate);
        console.log("LoadScriptProvider : savedPlaces: ", savedPlaces);
        console.log("LoadScriptProvider : selectedPlaces: ", selectedPlaces);
        if (!selectedDate || selectedDate == "날짜 선택" || Object.keys(selectedDate).length === 0) {
            // if(!selectedDate || Object.keys(selectedDate).length === 0){ // selectedDate가 null이거나 {} 빈 객체일 경우
            alert('날짜를 지정해주세요!');
            return;
        } // if  // 날짜가 지정되지 않았을 경우, alert

        // if(!markers || markers.length === 0 || !selectedPlaces ||Object.keys(selectedPlaces).length === 0){
        if (!markers || markers.length === 0) {
            alert('일정을 지정해주세요!');
            return;
        } // if  // 일정이 지정되지 않았을 경우, alert

        const placesData = await Promise.all(markers.map(async (marker) => {
            let details = null;
            if (marker.placeId) {
                try {
                    details = await getPlaceDetails(marker.placeId);
                } catch (error) {
                    console.error("장소 상세 정보 조회 실패:", error);
                } // try-catch
            } // if
            return {
                placeId: marker.placeId,
                address: marker.address,
                coordinates: { lat: marker.lat, lng: marker.lng },
                markerKey: marker.markerKey,
                details: details,  // 📌 추가된 상세 정보
                date: selectedDate  // 📌 날짜 정보 추가
            }; // return
        })); // placesData

        if (placesForSelectedDate.length >= 2) {
            for (let i = 0; i < placesForSelectedDate.length - 1; i++) {
                const legDistance = calculateDistance(placesForSelectedDate[i], placesForSelectedDate[i + 1]);
                placesForSelectedDate[i].calculatedLegs = {
                    from: placesForSelectedDate[i].address,
                    to: placesForSelectedDate[i + 1].address,
                    distance: legDistance.toFixed(2),
                    travelTime: ((legDistance / 30) * 60).toFixed(2),
                }; // placesForSelectedDate
            } // for
            placesForSelectedDate[placesForSelectedDate.length - 1].calculatedLegs = null;
        } // if

        setSavedPlaces((prevSavedPlaces) => {
            // 현재 날짜에 해당하는 장소를 제외한 나머지 장소들 유지
            const otherDatesPlaces = prevSavedPlaces.filter(place => place.date !== selectedDate);

            // 새로운 장소들과 다른 날짜의 장소들을 합침
            const newSavedPlaces = [...otherDatesPlaces, ...placesData];
            console.log("savePlaces: newSavedPlaces, ", newSavedPlaces);
            return newSavedPlaces;
        }); // setSavedPlaces // 이게 필요한가?

        // setSavedPlaces([]); // savedPlaces 초기화

        // 마커 초기화  후 -> useeffect로 변경된 savedPlaces 마커 재표시 
        setMarkers([]);

        console.log("savePlaces : placesData, ", placesData);
    }; // savePlaces

    const getPlaceDetails = useCallback(async (placeId) => {
        // console.log("getPlaceDetails(", placeId, ") invoked.");

        return new Promise((resolve, reject) => {
            placesService.current.getDetails({ placeId }, (result, status) => {
                if (status === "OK") resolve(result);
                else reject(new Error("상세 정보 조회 실패")); // if-else
            }); // placesService
        }); // Promise
    }, []); // getPlaceDetails

    return (
        <LoadScriptContext.Provider value={{
            isLoaded, setIsLoaded,
            location, setLocation,
            map, setMap,
            markers, setMarkers,
            legs, setLegs,
            savedPlaces,
            addMarker,
            removeMarker,
            savePlaces, setSavedPlaces,
            getPlaceDetails,
            selectedPlaces, setSelectedPlaces,
            selectedDate, setSelectedDate,
            placesForSelectedDate,
            showCalendar, setShowCalendar,
        }}>
            {children}
        </LoadScriptContext.Provider>
    ); // return
}; // export LoadScriptProvider

export const useLoadScript = () => {
    const context = useContext(LoadScriptContext);
    if (!context) {
        throw new Error('useLoadScript must be used within a LoadScriptProvider');
    }
    return context;
}; // export useLoadScript