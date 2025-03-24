import React from 'react';
import styles from './Complate_page.module.css';
import { NavLink } from 'react-router-dom';

const Complete_page = () => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <div className={styles.wrapper} />
                <div>일정계획이 완료되었습니다!<br />
                    즐거운 여행 되세요!</div>
                <NavLink to="/" className={styles.homeBtn}>홈으로</NavLink>
            </div>
        </div>
    )
}

export default Complete_page;