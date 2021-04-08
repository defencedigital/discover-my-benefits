const React = require('react');
const GlobalUpdatesProvider = require('./src/context/GlobalUpdatesProvider').default;

const locations = [];

// Logs when the client route changes
export const onRouteUpdate = ({ location }) => {
  // custom push event for analytics
  locations.push(location.pathname);
  if (typeof window !== 'undefined' && window.dataLayer && locations.length >= 6) {
    window.dataLayer.push({ sixPages: locations, 'event': 'sixPages' });
  }
};

export const wrapRootElement = ({ element }) => {
  return <GlobalUpdatesProvider>{element}</GlobalUpdatesProvider>;
};
