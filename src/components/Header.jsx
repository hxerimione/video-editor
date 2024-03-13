import { useContext } from 'react';
import { DarkModeStateContext } from '../App';
import './header.css';
// import logo from '../assets/icons/logo.png';
const Header = () => {
    const env = process.env;
    const { handleDarkMode, isDark } = useContext(DarkModeStateContext);
    env.PUBLIC_URL = env.PUBLIC_URL || '';
    // const navigate = useNavigate();
    const logo = require('../assets/icons/logo.png');
    const dark = require('../assets/icons/dark.png');
    const light = require('../assets/icons/light.png');

    return (
        <header>
            <div className="header-container">
                <img
                    src={logo}
                    alt="로고"
                    width="100px"
                />
                <button
                    onClick={handleDarkMode}
                    className="theme-button"
                >
                    {isDark ? (
                        <img
                            src={dark}
                            alt="dark mode"
                            width="30px"
                        />
                    ) : (
                        <img
                            src={light}
                            alt="light mode"
                            width="30px"
                        />
                    )}
                </button>
            </div>
            <div className="header-line"></div>
        </header>
    );
};
export default Header;
