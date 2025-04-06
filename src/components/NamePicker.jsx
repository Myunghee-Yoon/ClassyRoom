import React, { useState, useEffect } from 'react';
import useEscapeKey from '../hooks/useEscapeKey';

function NamePicker() {
  const [names, setNames] = useState(() => {
    const savedNames = localStorage.getItem('studentNames');
    return savedNames ? JSON.parse(savedNames) : [];
  });
  const [newName, setNewName] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionInterval, setSelectionInterval] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    localStorage.setItem('studentNames', JSON.stringify(names));
  }, [names]);

  const addName = () => {
    if (newName.trim()) {
      // First split by newline, then by comma to handle both formats
      const nameList = newName
        .split(/[\n,]/) // Split by newline or comma
        .map(name => name.trim())
        .filter(name => name !== '');

      // Add all valid names to the list
      if (nameList.length > 0) {
        setNames([...names, ...nameList]);
        setNewName('');
      }
    }
  };

  const removeName = (index) => {
    const updatedNames = [...names];
    updatedNames.splice(index, 1);
    setNames(updatedNames);
  };


  const startSelection = () => {
    if (names.length === 0) return;

    setIsSelecting(true);
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setSelectedName(names[randomIndex]);
    }, 100);

    setSelectionInterval(interval);

    // Stop after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsSelecting(false);
    }, 2000);
  };

  const clearAll = () => {
    if (window.confirm('정말 모든 이름을 지우시겠습니까?')) {
      setNames([]);
      setSelectedName('');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Use the escape key hook to exit fullscreen mode
  useEscapeKey(isFullscreen, setIsFullscreen);

  // Render the content (reused in both normal and fullscreen modes)
  const renderContent = () => (
    <>
      <div className="name-input" style={{ alignItems: 'flex-end' }}>
        <textarea
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            // Only trigger on Enter without Shift key
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              addName();
            }
          }}
          placeholder="학생 이름을 입력하세요 (콤마 또는 줄바꿈으로 구분)"
          rows="3"
        />
        <button
          className="add-name-btn"
          onClick={addName}
          style={{
            height: '40px',
            padding: '0.5rem 1.4rem',
            alignSelf: 'flex-end'
          }}
        >
          추가
        </button>
      </div>

      <div className="name-list">
        <h3>학생 목록 ({names.length})</h3>
        {names.length > 0 ? (
          <ul>
            {names.map((name, index) => (
              <li key={index}>
                {name}
                <button
                  className="remove-btn"
                  onClick={() => removeName(index)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 추가된 학생이 없습니다</p>
        )}
        {names.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            모두 지우기
          </button>
        )}
      </div>

      <div className="selection-area">
        <button
          onClick={startSelection}
          disabled={names.length === 0 || isSelecting}
          className="pick-btn"
        >
          랜덤으로 이름 선택
        </button>

        {selectedName && (
          <div className={`selected-name ${isSelecting ? 'selecting' : 'selected'}`}>
            {selectedName}
          </div>
        )}
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
                <h2 className="widget-title" style={{ color: 'var(--theme-name)' }}>이름 선택기</h2>
                <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-name)' }}>
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
        <div className="name-picker-widget">
          <div className="widget-header">
            <h2 className="widget-title" style={{ color: 'var(--theme-name)' }}>이름 선택기</h2>
            <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-name)' }}>
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

export default NamePicker;
