import React, { useState, useEffect } from 'react';
import useEscapeKey from '../hooks/useEscapeKey';

function GroupMaker() {
  const [names, setNames] = useState(() => {
    const savedNames = localStorage.getItem('studentNames');
    return savedNames ? JSON.parse(savedNames) : [];
  });
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState([]);
  const [groupingMethod, setGroupingMethod] = useState('size'); // 'size' or 'count'
  const [groupCount, setGroupCount] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // This component uses the same student list as the NamePicker
    const handleStorageChange = () => {
      const savedNames = localStorage.getItem('studentNames');
      if (savedNames) {
        setNames(JSON.parse(savedNames));
      }
    };

    // Add event listener for storage events (when other components change localStorage)
    window.addEventListener('storage', handleStorageChange);

    // Set up an interval to check for changes more frequently
    const checkInterval = setInterval(() => {
      handleStorageChange();
    }, 300); // Check every 300ms for faster response

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkInterval);
    };
  }, []);

  // Also check for changes when component is focused
  useEffect(() => {
    const handleFocus = () => {
      const savedNames = localStorage.getItem('studentNames');
      if (savedNames) {
        setNames(JSON.parse(savedNames));
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const createGroups = () => {
    if (names.length === 0) return;

    // Create a copy of the names array and shuffle it
    const shuffledNames = [...names].sort(() => Math.random() - 0.5);
    const newGroups = [];

    if (groupingMethod === 'size') {
      // Group by size (each group has X students)
      for (let i = 0; i < shuffledNames.length; i += groupSize) {
        newGroups.push(shuffledNames.slice(i, i + groupSize));
      }
    } else {
      // Group by count (create X groups)
      const namesPerGroup = Math.ceil(shuffledNames.length / groupCount);
      for (let i = 0; i < groupCount; i++) {
        const start = i * namesPerGroup;
        const end = Math.min(start + namesPerGroup, shuffledNames.length);
        if (start < shuffledNames.length) {
          newGroups.push(shuffledNames.slice(start, end));
        }
      }
    }

    setGroups(newGroups);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Use the escape key hook to exit fullscreen mode
  useEscapeKey(isFullscreen, setIsFullscreen);

  const resetGroups = () => {
    if (window.confirm('정말로 그룹을 초기화하시겠습니까?')) {
      setGroups([]);
    }
  };

  // Render the content (reused in both normal and fullscreen modes)
  const renderContent = () => (
    <>
      <div className="group-controls">
        <div className="grouping-method">
          <label>
            <input
              type="radio"
              value="size"
              checked={groupingMethod === 'size'}
              onChange={() => setGroupingMethod('size')}
            />
            인원수로 그룹 만들기
          </label>
          <label>
            <input
              type="radio"
              value="count"
              checked={groupingMethod === 'count'}
              onChange={() => setGroupingMethod('count')}
            />
            그룹 수로 만들기
          </label>
        </div>

        {groupingMethod === 'size' ? (
          <div className="group-size-input">
            <label>그룹당 학생 수:</label>
            <input
              type="number"
              min="2"
              max={Math.max(2, names.length)}
              value={groupSize}
              onChange={(e) => setGroupSize(Math.max(2, parseInt(e.target.value) || 2))}
            />
          </div>
        ) : (
          <div className="group-count-input">
            <label>그룹 수:</label>
            <input
              type="number"
              min="2"
              max={Math.max(2, names.length)}
              value={groupCount}
              onChange={(e) => setGroupCount(Math.max(2, parseInt(e.target.value) || 2))}
            />
          </div>
        )}

        <div className="group-buttons">
          <button
            onClick={createGroups}
            disabled={names.length < 2}
          >
            그룹 만들기
          </button>
          {groups.length > 0 && (
            <button onClick={resetGroups} className="reset-btn">
              초기화
            </button>
          )}
        </div>
      </div>

      {names.length < 2 && (
        <p className="warning-message">
          그룹을 만들려면 이름 선택기에 최소 2명의 학생을 추가하세요.
        </p>
      )}

      <div className="groups-display">
        {groups.length > 0 && (
          <>
            <h3>그룹</h3>
            <div className="groups-list">
              {groups.map((group, index) => (
                <div key={index} className="group">
                  <h4>그룹 {index + 1}</h4>
                  <ul>
                    {group.map((name, nameIndex) => (
                      <li key={nameIndex}>{name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
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
                <h2 className="widget-title" style={{ color: 'var(--theme-group)' }}>그룹 만들기</h2>
                <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-group)' }}>
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
        <div className="group-maker-widget">
          <div className="widget-header">
            <h2 className="widget-title" style={{ color: 'var(--theme-group)' }}>그룹 만들기</h2>
            <button className="fullscreen-btn" onClick={toggleFullscreen} style={{ color: 'var(--theme-group)' }}>
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

export default GroupMaker;
