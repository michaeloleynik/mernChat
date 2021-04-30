const initState = {currentDialogId: '', currentDialogData: {}, lastMessage: {}};

export const dialogReducer = (state = initState, action) => {
  switch (action.type) {
    case 'dialog/currentDialogId': 
      return {
        ...state,
        currentDialogId: action.payload
      }
    case 'dialog/currentDialogData':
      return {
        ...state,
        currentDialogData: { ...action.payload }
      }

    case 'message/addMessage': 
      return {
        ...state,
        currentDialogMessages: { ...state.currentDialogMessages, ...action.payload },
        lastMessage: { ...action.payload }
      }
    default: 
      return state;
  }
};