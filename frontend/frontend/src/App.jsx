
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Foooter';
import Shortener from './components/Shortener';
import Statistic from './components/Statistic';
import { ThemeProvider } from './context/ThemeContext';

function Layout() {
    const [activePage, setActivePage] = useState('shortener');
    const [shortenedUrls, setShortenedUrls] = useState([]);

    useEffect(() => {
        try {
            const storedStats = JSON.parse(localStorage.getItem('shortenedUrls'));
            if (storedStats) {
                setShortenedUrls(storedStats);
            }
        } catch (error) {
            console.error("Failed to parse stats from localStorage", error);
        }
    }, []);

   
    useEffect(() => {
        localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
    }, [shortenedUrls]);

    const handleAddShortenedUrls = (newUrls) => {
        const urlsWithClickData = newUrls.map(url => ({
            ...url,
            clicks: 0,
            generatedClickData: [] 
        }));
        setShortenedUrls(prevUrls => [...urlsWithClickData, ...prevUrls]); 
        setActivePage('stats'); 
    };

    return (
        <>
            <Header activePage={activePage} setActivePage={setActivePage} />
            <main>
                {activePage === 'shortener' && <Shortener onShorten={handleAddShortenedUrls} />}
                {activePage === 'stats' && <Statistic stats={shortenedUrls} onNavigateToShortener={() => setActivePage('shortener')} />}
            </main>
            <Footer />
        </>
    );
}


function App() {
    return (
        <ThemeProvider>
            <Layout />
        </ThemeProvider>
    );
}

export default App;