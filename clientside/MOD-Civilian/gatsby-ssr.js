const React = require('react');
const GlobalUpdatesProvider = require('./src/context/GlobalUpdatesProvider').default;

export const wrapRootElement = ({ element }) => {
  return <GlobalUpdatesProvider>{element}</GlobalUpdatesProvider>;
};
