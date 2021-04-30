const initState = {isAuth: false, userData: {}};

export const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'auth/isAuth': {
      return {
        ...state,
        isAuth: action.payload
      }
    }

    case 'auth/userData': {
      return {
        ...state,
        userData: {...action.payload}
      }
    }

    // case 'auth/token': {
    //   return {
    //     ...state,
    //     token: action.payload
    //   }
    // }

    // case 'auth/avatarColor': {
    //   return {
    //     ...state,
    //     avatarColor: action.payload
    //   }
    // }

    // case 'auth/userName': {
    //   return {
    //     ...state,
    //     userName: action.payload
    //   }
    // }
    default:
      return state;
  }
} 