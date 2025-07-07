let navigate;

export const setNavigator = (navFn) => {
  navigate = navFn;
};

export const getNavigator = () => navigate;
