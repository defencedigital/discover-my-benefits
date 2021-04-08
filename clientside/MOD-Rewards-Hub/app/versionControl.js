export const checkVersionControl = state => {
  const questionState = state.questions;

  const appState = state.app;
  const currentVersion = appState.version || 0;
  const userVersion = localStorage.getItem(`${questionState.currentProfileType}:version`) || 0;

  if (currentVersion === 1 && userVersion < 1) {
    localStorage.removeItem('questions');
  }
};
