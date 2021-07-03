const storageName = 'isDarkTheme';

const dark = JSON.parse(localStorage.getItem(storageName)) ? JSON.parse(localStorage.getItem(storageName)).isDark : true;

const initState = {dark};

export const themeReducer = (state = initState, action) => {
  switch (action.type) {
    case 'theme/switch-theme': {
      localStorage.setItem(storageName, JSON.stringify({isDark: !state.dark}));
      return {
        ...state,
        dark: !state.dark
      }
    }
    default:
      return state;
  }
} 