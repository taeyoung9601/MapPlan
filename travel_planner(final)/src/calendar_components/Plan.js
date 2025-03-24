import { Schedule, Map, Calendar, Complete } from './index';
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { eachDayOfInterval, format } from 'date-fns';
import { useLoadScript } from '../LoadScriptContext';
import { ko } from 'date-fns/locale';
import styles from './Plan.module.css';

function Plan() {
  // const [selectedPlaces, setSelectedPlaces] = useState({}); // useLoadScript와 중복되어 주석처리함
  const [dateRange, setDateRange] = useState([null, null]);
  const navigate = useNavigate();
  const { setSelectedDate, selectedDate, setMarkers, savedPlaces, setSavedPlaces, selectedPlaces, setSelectedPlaces, markers, placesForSelectedDate, showCalendar } = useLoadScript();

  const startDate = dateRange[0];
  const endDate = dateRange[1];

  useEffect(() => {
    // savedPlaces를 날짜별로 분배하여 selectedPlaces 업데이트
    const newSelectedPlaces = {};

    savedPlaces.forEach(place => {
      const placeDate = place.date;  // 장소의 날짜 정보가 있다고 가정

      if (!newSelectedPlaces[placeDate]) {
        newSelectedPlaces[placeDate] = [];
      }
      newSelectedPlaces[placeDate].push(place);
    });
    // console.log('place.date:', place.date)
    console.log('newSelectedPlaces:', newSelectedPlaces);
    setSelectedPlaces(newSelectedPlaces);
    console.log('selectedPlaces:', selectedPlaces); // 왜 값이 없지? 
    // console.log('selectedPlaces:', selectedPlaces[placeDate]);
  }, [savedPlaces]);  // savedPlaces가 변경될 때마다 실행

  useEffect(() => {
    const dateList = getDateList();
    if (dateList.length > 0 && !selectedDate) {
      setSelectedDate(dateList[0]);
    }
  }, [startDate]); // startDate 변경될 때마다 (기존의 날짜 일정 변경 시) 실행 => selectedDate 를 새 일정의 첫날로 변경


  useEffect(() => {

    // setSelectedPlaces({});  // SavedPlaces가 비워지면 selectedPlaces도 비워짐 -> 19~36번 라인
    setSavedPlaces([]);
    setSelectedDate(getDateList()[0]);

  }, [dateRange]); //  dateRange가 바뀔 때 실행


  const getDateList = () => {
    if (!startDate || !endDate) return [];
    return eachDayOfInterval({ start: startDate, end: endDate }).map(date =>
      format(date, 'yyyy-MM-dd', { locale: ko })
    );
  };      // startDate ~ endDate 사이의 날짜 배열 생성

  const handlePlaceDelete = (date, id) => {

    setSelectedPlaces(prevPlaces => {
      const newPlaces = { ...prevPlaces };
      if (newPlaces[date]) { newPlaces[date] = newPlaces[date].filter(place => place.id !== id); }

      // if(newPlaces[date].length === 0){
      if (Array.isArray(newPlaces[date]) && newPlaces[date].length === 0) { // Array가 있거나, 빈 Array거나
        delete newPlaces[date];
      } // if // 빈 배열일 경우 삭제

      console.log("업데이트된 newPlaces:", newPlaces);
      return newPlaces;
    }); // setSelectedPlaces

    setMarkers([]); // 지도에 찍혀있는 마커 초기화
    // setSelectedDate({}); // 선택된 날짜 초기화
    setSavedPlaces(prevPlaces => prevPlaces.filter(place => place.date !== date));
    // setSelectedDate(null);

    console.log("Plan : selectedDate: ", selectedDate);
    console.log("Plan : markers: ", markers);
    console.log("Plan : placesForSelectedDate: ", placesForSelectedDate);
    console.log("Plan : savedPlaces: ", savedPlaces);
    console.log("Plan : selectedPlaces: ", selectedPlaces);
  };

  const handleComplete = (e) => {
    e.preventDefault(); // 기본 네비게이션 동작 방지
    if (Object.keys(selectedPlaces).length === 0) {
      alert("일정을 하나 이상 추가해주세요!");
      return;
    }
    navigate('/Complete');
  };  // handleComplete

  const handleDateRangeChange = (newRange) => {
    // 기존에 일정이 있을 경우 경고창 띄우기
    if (selectedDate && selectedPlaces[selectedDate] && selectedPlaces[selectedDate].length > 0) {
      const confirmChange = window.confirm("기존에 입력된 일정들이 전부 삭제됩니다. 그래도 날짜를 변경하시겠습니까?");

      if (confirmChange) {
        setDateRange(newRange); // 날짜 범위 변경
        setSelectedPlaces({});  // 기존 일정 초기화
        setMarkers([]);  // 지도 마커 초기화
      }
    } else {
      setDateRange(newRange); // 일정이 없으면 그냥 날짜 범위 변경
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.map_container}>
        <Map />
      </div>

      <div className={styles.plan_window}>
        <div className={styles.calendar_container}>

          <Calendar dateRange={dateRange} setDateRange={handleDateRangeChange} />


          {showCalendar ? <></> : // showCalendar가 true일 경우, <></> 반환, false일 경우, 아래 반환. 
            // 날짜설정 전후를 구별한다.
            <>
              <select className={styles.dropdown} onChange={(e) => { setSelectedDate(e.target.value) }} value={selectedDate}>
                <option>날짜 선택</option>
                {getDateList()
                  .map(date => (<option key={date} value={date}>{date}</option>))}
              </select>

              <div className={styles.list}>
                {getDateList().map(date => (
                  <Schedule
                    key={date}
                    date={date}
                    selectedPlaces={selectedPlaces[date] || []}
                    onPlaceDelete={handlePlaceDelete}
                  />
                ))}
              </div>

              <button className={styles.completeBtn} onClick={handleComplete}>
                계획 완료하기
              </button>
            </>
          }

        </div>
      </div>
    </div>
  );
}

export default Plan;
