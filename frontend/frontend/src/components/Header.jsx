// src/components/Header.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Header({ activePage, setActivePage }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header>
            <div className="header-content">
                <h1>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M18 8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v2h-2c-1.1 0-2 .9-2 2v2H6c-1.1 0-2-.9-2-2v-2H2c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h2V4h2v2h10c1.1 0 2 .9 2 2z"/></svg>
                    URL Shortener
                </h1>
                <nav>
                    <button
                        className={`nav-btn ${activePage === 'shortener' ? 'active' : ''}`}
                        onClick={() => setActivePage('shortener')}
                    >
                        Shorten URL
                    </button>
                    <button
                        className={`nav-btn ${activePage === 'stats' ? 'active' : ''}`}
                        onClick={() => setActivePage('stats')}
                    >
                        Statistics
                    </button>
                </nav>
            </div>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
        </header>
    );
}

export default Header;