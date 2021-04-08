export const feedbackReducer = (state, action): any => {
  switch (action.type) {
    case 'error': {
      return {
        ...state,
        status: 'error',
        error: action.error,
      };
    }
    case 'success': {
      return {
        ...state,
        status: 'success',
      };
    }
    case 'started': {
      return {
        ...state,
        status: 'loading',
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
