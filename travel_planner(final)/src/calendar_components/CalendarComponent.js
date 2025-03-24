import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import styles from './CalendarComponent.module.css'; 
import { useLoadScript } from '../LoadScriptContext';


const CalendarComponent = ({ dateRange, setDateRange }) => {
  const [startDate, endDate] = dateRange;
  const { showCalendar, setShowCalendar } = useLoadScript(); // 캘린더 표시 여부 상태 추가

  const handleDateChange = (update) => {
    setDateRange(update);
  }; 

  // "설정 완료" 버튼 클릭 시 캘린더 숨기기
  const handleConfirm = () => {    
    if(endDate == null) {
    alert("시작 날짜와 마지막 날짜를 지정해주세요");
    return;
  } // endDate값이 없을 때, 설정완료 버튼을 눌렀다면 팝업창

  if (startDate && endDate) setShowCalendar(false); // 둘다 값이 있을 경우, false로 바꿈
  };

  // "날짜 수정" 버튼 클릭 시 캘린더 다시 열기
  const handleEdit = () => {
    setShowCalendar(true);
  };

  return (
    <div className={styles.datePicker}>

      {showCalendar ?
        <>
          <h1>여행 일정 선택</h1>
          <div>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange} // 변화감지 속성으로 필수
              inline                      // 달력을 표시
              locale={ko}                 // 한국어로 표시
              calendarStartDay={0}        // 시작요일 지정
              monthsShown={2}             // 화면에 달력 2개 표시
              minDate={new Date()}        // 현재 날짜 이후로 선택 가능 
              maxDate={(startDate ? new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000) : null) &&
                // 출발일정만 선택 시, 여행일정을 최대 10일까지만 선택하도록 함
                (endDate ? null : new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000))
                // 출발일정, 도착일정 둘다 선택 시 모든 데이터 선택가능
              }
            />
          </div>

          <button className={styles.confirm_btn} onClick={handleConfirm}>
            날짜 설정완료
          </button>
        </>
        :
        <>
          <h1>상세여행 계획하기</h1>
          <button className={styles.edit_btn} onClick={handleEdit}>
            날짜 수정하기
          </button>
        </>
      }

    </div>
  );
};

export default CalendarComponent;
