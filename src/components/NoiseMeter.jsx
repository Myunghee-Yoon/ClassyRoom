import React, { useState, useEffect, useRef } from 'react';
import useEscapeKey from '../hooks/useEscapeKey';

function NoiseMeter() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [threshold, setThreshold] = useState(50);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startMonitoring = async () => {
    try {
      // Request microphone access with specific constraints for better sensitivity
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      // Create audio context
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

      // Resume audio context (needed for Chrome's autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Connect the microphone to the analyser
      microphoneRef.current.connect(analyserRef.current);

      // Configure analyser for better sensitivity
      analyserRef.current.fftSize = 1024; // Increased for better resolution
      analyserRef.current.smoothingTimeConstant = 0.5; // Adjust for smoother readings

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsMonitoring(true);
      setPermissionDenied(false);

      const updateNoiseLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average with more weight on human voice frequencies
        let sum = 0;
        let count = 0;

        // Focus more on frequencies between 300Hz and 3400Hz (human voice range)
        for (let i = 0; i < bufferLength; i++) {
          // Apply weighting to emphasize human voice frequencies
          const frequency = i * audioContextRef.current.sampleRate / analyserRef.current.fftSize;
          if (frequency > 300 && frequency < 3400) {
            sum += dataArray[i] * 1.5; // Give more weight to voice frequencies
            count++;
          } else {
            sum += dataArray[i];
            count++;
          }
        }

        const average = sum / count;
        setNoiseLevel(Math.round(average));

        animationFrameRef.current = requestAnimationFrame(updateNoiseLevel);
      };

      updateNoiseLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setPermissionDenied(true);

      // Show a more helpful error message
      alert('마이크 액세스를 허용해주세요. 소음 측정기를 사용하려면 마이크 권한이 필요합니다.');
    }
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Clean up audio resources
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.suspend().catch(err => console.error('Error suspending audio context:', err));
      // Don't close the context, just suspend it for reuse
    }
  };

  const getNoiseLevelColor = () => {
    if (noiseLevel < threshold * 0.5) return 'green';
    if (noiseLevel < threshold) return 'yellow';
    return 'red';
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Use the escape key hook to exit fullscreen mode
  useEscapeKey(isFullscreen, setIsFullscreen);

  // Render the content (reused in both normal and fullscreen modes)
  const renderContent = () => (
    <>
      {permissionDenied ? (
        <div className="permission-error">
          <p>마이크 액세스가 거부되었습니다. 이 기능을 사용하려면 마이크 액세스를 허용해주세요.</p>
          <button onClick={startMonitoring} className="retry-btn">마이크 액세스 다시 요청</button>
        </div>
      ) : (
        <>
          <div className="noise-display">
            <div
              className="noise-level"
              style={{
                height: `${Math.min(100, (noiseLevel / 100) * 100)}%`,
                backgroundColor: getNoiseLevelColor()
              }}
            ></div>
            <div className="noise-value">{noiseLevel}</div>
          </div>

          <div className="threshold-control">
            <label>임계값: {threshold}</label>
            <input
              type="range"
              min="10"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </div>

          <div className="noise-controls">
            {!isMonitoring ? (
              <button onClick={startMonitoring}>모니터링 시작</button>
            ) : (
              <button onClick={stopMonitoring}>모니터링 중지</button>
            )}
          </div>
        </>
      )}
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
                <h2 className="widget-title" style={{ color: 'var(--theme-noise)' }}>소음 측정기</h2>
                <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-noise)' }}>
                  <i className="fas fa-compress"></i>
                </button>
              </div>
              <div className="widget-content">
                {renderContent()}
              </div>
            </div>
          </div>
        </>
      )}

      {!isFullscreen && (
        <div className="noise-meter-widget">
          <div className="widget-header">
            <h2 className="widget-title" style={{ color: 'var(--theme-noise)' }}>소음 측정기</h2>
            <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-noise)' }}>
              <i className="fas fa-expand"></i>
            </button>
          </div>
          <div className="widget-content">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}

export default NoiseMeter;
