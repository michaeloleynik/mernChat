const initState = {dark: true};

export const themeReducer = (state = initState, action) => {
  switch (action.type) {
    case 'theme/switch-theme': {
      return {
        ...state,
        dark: !state.dark
      }
    }
    default:
      return state;
  }
} 