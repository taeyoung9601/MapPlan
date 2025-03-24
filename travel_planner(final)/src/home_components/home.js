import styles from './Home.module.css';
import { Navigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";


const Home = () => {
    return (
        <>
            <div className={styles.home} >
                <div className={styles.wrapper} />
                <div className={styles.content} >
                    <div className={styles.text}>
                        <h1>모든 여행일정을 계획하기 위한 하나의 서비스</h1>
                        <p>여행의 모든 것을 한 곳에서 - 맞춤 일정 계획, 실제 여행자 가이드, 간편한 예약 관리까지, 당신의 완벽한 여행을 위한 올인원 솔루션을 지금 만나보세요!</p>
                    </div>
                    <div className={styles.buttons} >
                        <NavLink to="/Create" className={({ isActive }) => isActive ? `${styles.start} active-link` : styles.start}>
                            여행일정 계획하기
                        </NavLink>
                        <button className={styles.info} >우리 사이트는요 <FontAwesomeIcon icon={faAngleRight} /></button>
                    </div>
                </div>
            </div>

            <div className={styles.video} >
                <video id="video" src='https://itin-marketing.sfo2.cdn.digitaloceanspaces.com/20240918-webflow-homepage-hero-section-video-desktop.mp4' autoPlay loop muted playsInline />
                <div className={styles.video_text}>
                    <h3>모든 여행일정을 계획하기 위한 하나의 서비스</h3>
                    <p>여행의 모든 것을 한 곳에서 - 맞춤 일정 계획, 실제 여행자 가이드, 간편한 예약 관리까지, 당신의 완벽한 여행을 위한 올인원 솔루션을 지금 만나보세요!</p>
                </div>
            </div>
        </>
    )
}

export default Home