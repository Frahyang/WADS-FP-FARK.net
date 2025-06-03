import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/text-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { authService } from '../api/api'

const DashboardHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/signin');
    };

    const styles = {
        container: 'flex flex-row justify-between items-center px-5 py-3 mb-3 border-b-2 border-neutral-200',
        logo_image: 'w-70',
        button_container: 'flex items-center gap-4',
        profile_btn: 'hover:scale-110 text-3xl text-white bg-indigo-500 hover:bg-indigo-600 rounded-full w-15 h-15 transition-all',
        logout_btn: 'flex items-center gap-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors'
    }

    return (
        <header className={styles.container}>
            <img className={styles.logo_image} src={logo} alt="" />
            <div className={styles.button_container}>
                <button 
                    onClick={handleLogout}
                    className={styles.logout_btn}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    )
}

export default DashboardHeader