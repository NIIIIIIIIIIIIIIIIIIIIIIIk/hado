import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Hub } from './components/Hub/Hub';
import { DuneLanding } from './components/DuneLanding/DuneLanding';
import { NepokoyLanding } from './components/NepokoyLanding/NepokoyLanding';
import { LandingPage } from './components/LandingPage/LandingPage';
import { MainApp } from './components/MainApp/MainApp';
import { loadState, getLocalState } from './utils/storage';
import './styles/globals.css';

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const state = await loadState();
        setIsUnlocked(state.isUnlocked);
      } catch (error) {
        console.warn('⚠️ Ошибка загрузки, используем локальные данные');
        const localState = getLocalState();
        setIsUnlocked(localState.isUnlocked);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem('call_sheet_unlocked', 'true');
    console.log('✅ Приложение разблокировано');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a1410',
        color: 'rgba(200, 180, 150, 0.3)',
        fontFamily: 'Courier New, monospace',
        fontSize: '12px',
        letterSpacing: '4px'
      }}>
        ЗАГРУЗКА...
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/dune" element={<DuneLanding onUnlock={handleUnlock} />} />
        <Route path="/nepokoy" element={<NepokoyLanding />} />
        <Route path="/landing" element={<LandingPage onUnlock={handleUnlock} />} />
        <Route path="/app" element={
          isUnlocked ? <MainApp /> : <Navigate to="/landing" replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;