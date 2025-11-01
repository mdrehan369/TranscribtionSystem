import { useCallback, useState } from "react";

const useDebounce = (callback: (...args: any[]) => any, delay: number) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  return useCallback((...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);
    setTimer(newTimer);
  }, [callback, delay, timer]);
};

export default useDebounce
