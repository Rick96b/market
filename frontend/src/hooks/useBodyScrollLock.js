import { useEffect } from 'react';

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) {
      return undefined;
    }

    const scrollY = window.scrollY;
    const oldPosition = document.body.style.position;
    const oldTop = document.body.style.top;
    const oldWidth = document.body.style.width;
    const oldOverflow = document.body.style.overflow;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = oldPosition;
      document.body.style.top = oldTop;
      document.body.style.width = oldWidth;
      document.body.style.overflow = oldOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

export default useBodyScrollLock;
