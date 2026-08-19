import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParallaxLayer } from '../DuneLanding/ParallaxLayer';
import { DarkNetTransition } from '../UI/DarkNetTransition';
import { EasterEggModal } from '../UI/EasterEggModal';
import { EasterEgg } from '../../types';
import { checkEasterEgg } from '../../utils/easterEggs';
import { trackVisit } from '../../utils/analytics';
import { unlockApp } from '../../utils/storage';
import styles from './NepokoyLanding.module.css';

export const NepokoyLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEgg, setEasterEgg] = useState<EasterEgg | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isFullyClosed, setIsFullyClosed] = useState(false);
  const [isCrashing, setIsCrashing] = useState(false);
  const [crashStage, setCrashStage] = useState<'idle' | 'crash' | 'bsod' | 'terminal' | 'reboot' | 'done'>('idle');
  const [terminalText, setTerminalText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const isUnlockingRef = useRef(false);

  const terminalLines = [
    'ОШИБКА ЯДРА: НЕОБРАБОТАННОЕ ИСКЛЮЧЕНИЕ',
    'ВЫПОЛНЯЕТСЯ ДАМП ПАМЯТИ',
    'ИНИЦИАЛИЗИРОВАНА ПЕРЕЗАГРУЗКА СИСТЕМЫ',
    'ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ СИСТЕМЫ...',
    'СИСТЕМА ВОССТАНОВЛЕНА'
  ];

  useEffect(() => {
    const fadeInInterval = setInterval(() => {
      setBgOpacity(prev => {
        if (prev < 1) {
          return Math.min(prev + 0.02, 1);
        }
        clearInterval(fadeInInterval);
        return prev;
      });
    }, 30);

    setTimeout(() => {
      const contentInterval = setInterval(() => {
        setContentOpacity(prev => {
          if (prev < 1) {
            return Math.min(prev + 0.03, 1);
          }
          clearInterval(contentInterval);
          return prev;
        });
      }, 30);
    }, 500);

    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => {
      clearInterval(fadeInInterval);
    };
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleConfirm = () => {
    if (isUnlockingRef.current) return;
    isUnlockingRef.current = true;
    
    setIsClosing(true);
    
    setTimeout(() => {
      setIsFullyClosed(true);
    }, 800);
    
    const egg = checkEasterEgg('unlock');
    if (egg) {
      setEasterEgg(egg);
      setShowEasterEgg(true);
    }
    
    trackVisit('unlock');
    unlockApp();
    
    setTimeout(() => {
      setShowTransition(true);
    }, 2000);
  };

  const handleReject = () => {
    if (isUnlockingRef.current) return;
    isUnlockingRef.current = true;
    
    setIsCrashing(true);
    setCrashStage('crash');
    
    setTimeout(() => {
      setCrashStage('bsod');
    }, 300);
    
    setTimeout(() => {
      setCrashStage('terminal');
      let index = 0;
      const interval = setInterval(() => {
        if (index < terminalLines.length) {
          setTerminalText(terminalLines[index]);
          index++;
        } else {
          clearInterval(interval);
          setCrashStage('done');
          setTimeout(() => {
            setIsCrashing(false);
            setCrashStage('idle');
            isUnlockingRef.current = false;
            navigate('/');
          }, 1500);
        }
      }, 700);
    }, 2500);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    navigate('/app');
  };

  return (
    <>
      <div 
        className={`${styles.container} ${isLoaded ? styles.loaded : ''} ${isClosing ? styles.closing : ''} ${isFullyClosed ? styles.fullyClosed : ''} ${isCrashing ? styles.crashing : ''}`} 
        ref={containerRef}
      >
        {isCrashing && (
          <div className={styles.crashOverlay}>
            {crashStage === 'crash' && (
              <div className={styles.crashFlash}>
                <div className={styles.crashLines}>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className={styles.crashLine} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
                  ))}
                </div>
                <div className={styles.crashMessage}>С Б О Й   С И С Т Е М Ы</div>
                <div className={styles.crashSub}>&gt; ОШИБКА ЯДРА</div>
              </div>
            )}

            {crashStage === 'bsod' && (
              <div className={styles.bsodScreen}>
                <div className={styles.bsodContent}>
                  <div className={styles.bsodTitle}>КРИТИЧЕСКАЯ ОШИБКА</div>
                  <div className={styles.bsodCode}>0x0000007E</div>
                  <div className={styles.bsodText}>НЕОБРАБОТАННОЕ ИСКЛЮЧЕНИЕ</div>
                  <div className={styles.bsodDump}>
                    <span>ДАМП ПАМЯТИ: 0x00FF1A2B</span>
                    <span>СТЕК: 0x7F00B1A0</span>
                    <span>РЕГИСТР: EAX=0x00000000</span>
                  </div>
                  <div className={styles.bsodFooter}>
                    ВЫПОЛНЯЕТСЯ ДАМП ПАМЯТИ...
                  </div>
                </div>
              </div>
            )}

            {crashStage === 'terminal' && (
              <div className={styles.terminalScreen}>
                <div className={styles.terminalContent}>
                  <div className={styles.terminalHeader}>
                    <span>WINDOWS NT [ВЕРСИЯ 10.0.19045]</span>
                    <span>ВОССТАНОВЛЕНИЕ СИСТЕМЫ</span>
                  </div>
                  <div className={styles.terminalBody}>
                    <div className={styles.terminalLine}>&gt; {terminalText}</div>
                    {terminalText && (
                      <div className={styles.terminalCursor}>_</div>
                    )}
                  </div>
                  <div className={styles.terminalProgress}>
                    <div className={styles.terminalProgressBar}>
                      <div className={styles.terminalProgressFill} style={{ width: `${Math.min((terminalLines.findIndex(l => l === terminalText) + 1) / terminalLines.length * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {crashStage === 'done' && (
              <div className={styles.rebootScreen}>
                <div className={styles.rebootContent}>
                  <div className={styles.rebootIcon}>◈</div>
                  <div className={styles.rebootText}>СИСТЕМА ВОССТАНОВЛЕНА</div>
                  <div className={styles.rebootSub}>возвращение в хаб</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.screenClose}>
          <div className={styles.screenCloseTop} />
          <div className={styles.screenCloseBottom} />
        </div>
        
        <div className={styles.blackScreen} />
        <div className={styles.staticOverlay} />
        
        {isFullyClosed && (
          <div className={styles.closedMessage}>
            <div className={styles.messageText}>ИНИЦИАЛИЗАЦИЯ ПЕРЕХОДА</div>
            <div className={styles.messageDots}>
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}

        <div 
          className={styles.parallaxScene}
          style={{ 
            opacity: isClosing ? 0 : bgOpacity,
            transition: 'opacity 0.4s ease'
          }}
        >
          <ParallaxLayer 
            imageUrl="/image/hub/textures/nepokoy-2.jpg"
            speed={0.15}
            className={styles.layerTop}
            initialOffset={0}
          />
          
          <ParallaxLayer 
            imageUrl="/image/hub/textures/nepokoy-bg.jpg"
            speed={0.05}
            className={styles.layerBase}
            initialOffset={0}
          />

          <div className={styles.particles}>
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={i}
                className={styles.particle}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  animationDuration: `${10 + Math.random() * 20}s`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.overlay} />

        <div 
          className={`${styles.content} ${isLoaded ? styles.loaded : ''}`}
          style={{ 
            opacity: isClosing ? 0 : contentOpacity,
            transition: 'opacity 0.3s ease'
          }}
        >
          <button className={styles.backButton} onClick={handleBack}>
            ← НАЗАД
          </button>
          
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>НЕПОКОЙ</h1>
            <div className={styles.subtitle}>АБСУРДИСТСКИЙ АНИМАЦИОННЫЙ ТРИЛЛЕР</div>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.credits}>
              <div className={styles.creditLine}>
                <span className={styles.label}>режиссёр</span>
                <span className={styles.value}>ЛЕОНИД ШМЕЛЬКОВ</span>
              </div>
              <div className={styles.creditLine}>
                <span className={styles.label}>музыка</span>
                <span className={styles.value}>СЕРГЕЙ КУРЁХИН</span>
              </div>
              <div className={styles.creditLine}>
                <span className={styles.label}>статус</span>
                <span className={styles.value}>В РАЗРАБОТКЕ</span>
              </div>
            </div>

            <div className={styles.description}>
              <p>
                Абсурдистский анимационный триллер о том, как реальность 
                перестаёт подчиняться законам логики.
              </p>
              <p className={styles.quote}>
                «Тишина — это самый громкий звук»
              </p>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.confirmButton}
                onClick={handleConfirm}
                disabled={isUnlockingRef.current}
              >
                <span className={styles.btnIcon}>◈</span>
                ПРИНЯТЬ
                <span className={styles.btnIcon}>◈</span>
              </button>
              <button 
                className={styles.rejectButton}
                onClick={handleReject}
                disabled={isUnlockingRef.current}
              >
                <span className={styles.btnIcon}>◈</span>
                ОТКАЗАТЬ
                <span className={styles.btnIcon}>◈</span>
              </button>
            </div>
          </div>

          <div className={styles.footer}>
            <span className={styles.comingSoon}>С К О Р О</span>
          </div>
        </div>
      </div>
      
      {showTransition && (
        <DarkNetTransition onComplete={handleTransitionComplete} />
      )}
      
      {showEasterEgg && easterEgg && (
        <EasterEggModal egg={easterEgg} onClose={() => setShowEasterEgg(false)} />
      )}
    </>
  );
};