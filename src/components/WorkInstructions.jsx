import React, { useState, useEffect } from 'react';
import useEscapeKey from '../hooks/useEscapeKey';

function WorkInstructions() {
  const [instructions, setInstructions] = useState(() => {
    const savedInstructions = localStorage.getItem('workInstructions');
    return savedInstructions || '';
  });
  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem('instructionsFontSize');
    return savedFontSize ? parseInt(savedFontSize) : 24;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    localStorage.setItem('workInstructions', instructions);
  }, [instructions]);

  useEffect(() => {
    localStorage.setItem('instructionsFontSize', fontSize.toString());
  }, [fontSize]);

  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 48));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Use the escape key hook to exit fullscreen mode
  useEscapeKey(isFullscreen, setIsFullscreen);

  const resetInstructions = () => {
    if (window.confirm('정말로 모든 내용을 초기화하시겠습니까?')) {
      setInstructions('');
    }
  };

  // Render the content (reused in both normal and fullscreen modes)
  const renderContent = () => (
    <>
      <div className="instructions-controls">
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? '표시 모드' : '편집 모드'}
        </button>
        <button onClick={resetInstructions} className="reset-btn">
          초기화
        </button>
        <div className="font-size-controls">
          <button onClick={decreaseFontSize}>A-</button>
          <span>{fontSize}px</span>
          <button onClick={increaseFontSize}>A+</button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={instructions}
          onChange={handleInstructionsChange}
          placeholder="Enter instructions for students..."
          rows="6"
        />
      ) : (
        <div
          className="instructions-display"
          style={{ fontSize: `${fontSize}px` }}
        >
          {instructions ? (
            <div dangerouslySetInnerHTML={{ __html: instructions.replace(/\n/g, '<br>') }} />
          ) : (
            <p className="placeholder-text">아직 오늘의 활동이 없습니다. '편집 모드'를 클릭하여 추가하세요.</p>
          )}
        </div>
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
                <h2 className="widget-title" style={{ color: 'var(--theme-work)' }}>오늘의 활동</h2>
                <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-work)' }}>
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
        <div className="work-instructions-widget">
          <div className="widget-header">
            <h2 className="widget-title" style={{ color: 'var(--theme-work)' }}>오늘의 활동</h2>
            <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-work)' }}>
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

export default WorkInstructions;
