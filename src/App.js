import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import VideoEditor from './pages/videoEditor/VideoEditor';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

export const DarkModeStateContext = React.createContext();
function App() {
    const [isDark, setIsDark] = useState(
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    const handleDarkMode = () => {
        setIsDark(!isDark);
        document.documentElement.setAttribute(
            'color-mode',
            isDark ? 'dark' : 'light'
        );
        console.log(isDark);
    };
    useEffect(() => {
        handleDarkMode();
    }, []);
    return (
        <DarkModeStateContext.Provider value={{ handleDarkMode, isDark }}>
            <div className="layout">
                <Header />
                <VideoEditor />
                <Footer />
            </div>
        </DarkModeStateContext.Provider>
    );
}

export default App;
