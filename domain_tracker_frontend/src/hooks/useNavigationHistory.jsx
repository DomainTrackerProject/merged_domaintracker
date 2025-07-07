import { useState, useCallback } from "react";

const useNavigationHistory = () => {
  const [historyStack, setHistoryStack] = useState(["/"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return historyStack[newIndex];
    }
    return null;
  }, [historyIndex, historyStack]);

  const goForward = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      return historyStack[newIndex];
    }
    return null;
  }, [historyIndex, historyStack]);

  const pushToHistory = useCallback((path) => {
    setHistoryStack((prev) => {
      const next = [...prev.slice(0, historyIndex + 1), path];
      return next;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  return {
    goBack,
    goForward,
    pushToHistory,
    canGoBack: historyIndex > 0,
    canGoForward: historyIndex < historyStack.length - 1,
    debug: {
      historyStack,
      historyIndex,
    },
  };
};

export default useNavigationHistory;
