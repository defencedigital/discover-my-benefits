/* eslint-disable */
 /*
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';
// import 'react-app-polyfill/ie11';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {ConnectedRouter} from 'connected-react-router/immutable';
import createHistory from 'history/createBrowserHistory';
import 'sanitize.css/sanitize.css';
import detectIe from 'detectie';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicons/favicon-dmb.ico';
import '!file-loader?name=[name].[ext]!./images/favicons/android-chrome-512x512.png';
import '!file-loader?name=[name].[ext]!./images/favicons/android-chrome-192x192.png';
import '!file-loader?name=[name].[ext]!./images/favicons/apple-touch-icon-57x57.png';
import '!file-loader?name=[name].[ext]!./images/favicons/apple-touch-icon-60x60.png';
import '!file-loader?name=[name].[ext]!./images/favicons/apple-touch-icon-72x72.png';
import '!file-loader?name=[name].[ext]!./images/favicons/apple-touch-icon-76x76.png';
import '!file-loader?name=[name].[ext]!./images/favicons/apple-touch-icon-114x114.png';
import '!file-loader?name=[name].[ext]!./images/favicons/apple-touch-icon-120x120.png';
import '!file-loader?name=[name].[ext]!./images/favicons/apple-touch-icon-144x144.png';
import '!file-loader?name=[name].[ext]!./images/favicons/apple-touch-icon-152x152.png';
import '!file-loader?name=[name].[ext]!./images/favicons/apple-touch-icon.png';


import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

// Import root app
import App from './containers/App';

// Import Language Provider
import LanguageProvider from './containers/LanguageProvider';

import configureStore from './configureStore';
// Import i18n messages
import { translationMessages } from './i18n';

import { expand } from './utils/object';
import { checkVersionControl } from './versionControl';
// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');
const locations =[];

history.listen(() => {
  window.scrollTo(0, 0);
  locations.push(window.location.pathname);
  if(locations.length >= 6){
    window.dataLayer.push({sixPages: locations, 'event': 'sixPages' })
  }
});

checkVersionControl(store.getState().toJS());

store.subscribe(() => {
  const questionState = store.getState().toJS().questions;

  if (questionState.currentProfileType !== null) {
    const questions = questionState.items;
    const profile = {
      profile: {},
    };

    questions.forEach((question) => {
      profile[question.namespace] = question.value;
    });

    const profileToStore = expand(profile);

    localStorage.setItem(`${questionState.currentProfileType}:questions`, JSON.stringify(profileToStore));
  }
});

const render = (messages) => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time

  module.hot.accept(['./i18n', 'containers/App'], () => {
    // ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(import('intl'));
  }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
    ]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production' && detectIe() === false) {
  const runtime = require('offline-plugin/runtime'); // eslint-disable-line global-require

  const runInstall = () => {
    runtime.install({
      onUpdating: () => {
        MOUNT_NODE.innerHTML = `
          <div id="loading-app" class="loading-app" style="display:block;">
             <div class="spinner">
                <div class="cube1"></div>
                <div class="cube2"></div>
             </div>
             <p>Updating Application... Please do not reload the page.</p>
          </div>`;
      },
      onUpdateReady: () => {
        runtime.applyUpdate();
      },
      onUpdated: () => {
        window.location.reload();
      },
      onUpdateFailed: () => {
        console.log("onUpdateFailed invoked");
      },
      onInstalled: () => {
        console.log("App is ready for offline usage");
      }

    });
  };

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) {
        runInstall();
      }
    });
  }
}
