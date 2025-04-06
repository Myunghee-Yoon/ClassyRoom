import { useEffect } from 'react';

/**
 * A custom hook that handles the ESC key press to exit fullscreen mode
 * @param {boolean} isFullscreen - Current fullscreen state
 * @param {Function} setIsFullscreen - Function to update fullscreen state
 */
function useEscapeKey(isFullscreen, setIsFullscreen) {
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    // Add event listener when in fullscreen mode
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscKey);
    }

    // Clean up the event listener when component unmounts or fullscreen changes
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen, setIsFullscreen]);
}

export default useEscapeKey;
