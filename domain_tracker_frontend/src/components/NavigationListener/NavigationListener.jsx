import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useNavigationHistory from "../../hooks/useNavigationHistory";

const NavigationListener = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const history = useNavigationHistory();

  // Update the custom history when the location changes
  useEffect(() => {
    history.pushToHistory(location.pathname);
    console.log("Updated history:", history.debug);
  }, [location.pathname]);
  

  // Handle going back
  const handleGoBack = () => {
    const path = history.goBack();
    if (path) {
      navigate(path);
    }
  };

  // Handle going forward
  const handleGoForward = () => {
    const path = history.goForward();
    if (path) {
      navigate(path);
    }
  };

  return children({
    goBack: handleGoBack,
    goForward: handleGoForward,
    canGoBack: history.canGoBack,
    canGoForward: history.canGoForward,
  });
};

export default NavigationListener;
