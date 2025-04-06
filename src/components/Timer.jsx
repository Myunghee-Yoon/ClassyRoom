import React, { useState, useEffect, useRef } from 'react';
import useEscapeKey from '../hooks/useEscapeKey';

function Timer() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element for timer completion sound
    audioRef.current = new Audio('/timer-sound.mp3');
    // Preload the audio
    audioRef.current.load();

    // Try to play and immediately pause to handle autoplay restrictions
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Immediately pause the audio
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          console.log('Audio preloaded successfully');
        })
        .catch(e => {
          console.log('Audio preload failed, but this is expected:', e);
          // This error is expected and can be ignored
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) { // Check for 1 to play sound before reaching 0
            clearInterval(interval);
            setIsRunning(false);
            // Play sound when timer ends
            if (!isMuted && audioRef.current) {
              try {
                // User interaction is required for audio to play in many browsers
                // This should work because the timer button was clicked
                audioRef.current.currentTime = 0;

                // Play with user gesture
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                  playPromise.catch(e => {
                    console.log('Error playing sound:', e);
                    // Try again with a user interaction simulation
                    document.addEventListener('click', function playOnce() {
                      audioRef.current.play();
                      document.removeEventListener('click', playOnce);
                    }, { once: true });
                  });
                }

                // Add event listener to stop sound on any click
                const stopSoundOnClick = () => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                  document.removeEventListener('click', stopSoundOnClick);
                };

                // Add the event listener after a short delay to avoid immediate triggering
                setTimeout(() => {
                  document.addEventListener('click', stopSoundOnClick);
                }, 500);
              } catch (error) {
                console.error('Error playing timer sound:', error);
              }
            }
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isMuted]);

  const startTimer = () => {
    if (timer > 0) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimer(0);
    setInputMinutes('');
    setInputSeconds('');
  };

  const setCustomTimer = () => {
    const minutes = parseInt(inputMinutes) || 0;
    const seconds = parseInt(inputSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds > 0) {
      setTimer(totalSeconds);
      setIsRunning(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Use the escape key hook to exit fullscreen mode
  useEscapeKey(isFullscreen, setIsFullscreen);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Render the content (reused in both normal and fullscreen modes)
  const renderContent = () => (
    <>
      <div className="timer-display">
        <span className={`time ${timer === 0 && isRunning === false ? 'time-zero' : ''}`}>
          {formatTime(timer)}
        </span>
      </div>
      <div className="timer-controls">
        <div className="timer-inputs">
          <input
            type="number"
            placeholder="Min"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            min="0"
          />
          <input
            type="number"
            placeholder="Sec"
            value={inputSeconds}
            onChange={(e) => setInputSeconds(e.target.value)}
            min="0"
            max="59"
          />
          <button onClick={setCustomTimer}>설정</button>
        </div>
        <div className="timer-buttons">
          {!isRunning ? (
            <button onClick={startTimer} disabled={timer === 0}>
              시작
            </button>
          ) : (
            <button onClick={pauseTimer}>일시중지</button>
          )}
          <button onClick={resetTimer}>초기화</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {isFullscreen && (
        <>
          <div className="fullscreen-overlay" onClick={toggleFullscreen}></div>
          <div className="fullscreen-container">
            <div className="fullscreen">
              <div className="widget-header">
                <h2 className="widget-title" style={{ color: 'var(--theme-timer)' }}>타이머</h2>
                <div className="header-buttons">
                  <button className="sound-btn" onClick={toggleMute} style={{ color: 'var(--theme-timer)' }}>
                    <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                  </button>
                  <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-timer)' }}>
                    <i className="fas fa-compress"></i>
                  </button>
                </div>
              </div>
              <div className="widget-content">
                {renderContent()}
              </div>
            </div>
          </div>
        </>
      )}

      {!isFullscreen && (
        <div className="timer-widget">
          <div className="widget-header">
            <h2 className="widget-title" style={{ color: 'var(--theme-timer)' }}>타이머</h2>
            <div className="header-buttons">
              <button className="sound-btn" onClick={toggleMute} style={{ color: 'var(--theme-timer)' }}>
                <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
              </button>
              <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-timer)' }}>
                <i className="fas fa-expand"></i>
              </button>
            </div>
          </div>
          <div className="widget-content">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}

export default Timer;
