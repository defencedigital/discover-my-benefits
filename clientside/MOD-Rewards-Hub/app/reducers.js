// eslint-disable-next-line import/no-unresolved
/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import languageProviderReducer from './containers/LanguageProvider/reducer';
import questionsReducer from './containers/Questions/reducer';
import calculationsReducer from './containers/Calculations/reducer';
import optionsReducer from './containers/Options/reducer';
import benefitsReducer from './containers/Benefits/reducer';
import servicesReducer from './containers/Services/reducer';
import dependenciesReducer from './containers/Dependencies/reducer';
import categoriesReducer from './containers/Categories/reducer';
import linksReducer from './containers/Links/reducer';
import tagsReducer from './containers/Tags/reducer';
import profileCategoriesReducer from './containers/ProfileCategories/reducer';
import CoCCategoriesReducer from './containers/CoCCategories/reducer';
import subAppsReducer from './containers/SubApps/reducer';
import famReducer from './containers/FAM/reducer';
import fsReducer from './containers/FS/reducer';
import appReducer from './containers/App/reducer';
import updatesReducer from './containers/Updates/reducer';
import termsReducer from './containers/Terms/reducer';
import asReducer from './containers/AS/reducer';
import contactsReducer from './containers/Contact/reducer';
import cookiesReducer from './containers/Cookies/reducer';
import accordionsReducer from './containers/Accordions/reducer';
import imagesReducer from './containers/Images/reducer';
import block4colsReducer from './containers/Block4Col/reducer';
import block3colsReducer from './containers/Block3Col/reducer';
import textcomponentsReducer from './containers/TextComponents/reducer';
import ctacomponentsReducer from './containers/CTAComponents/reducer';
import CWIComponentReducer from './containers/CardWithImage/reducer';
import fetchDataReducer from './containers/Feedback/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

/**
 * Creates the main reducer with the dynamically injected ones
 */
const rootReducer = history =>
  combineReducers({
    app: appReducer,
    feedback: fetchDataReducer,
    language: languageProviderReducer,
    router: connectRouter(history),
    questions: questionsReducer,
    options: optionsReducer,
    calculations: calculationsReducer,
    benefits: benefitsReducer,
    services: servicesReducer,
    dependencies: dependenciesReducer,
    categories: categoriesReducer,
    links: linksReducer,
    profileCategories: profileCategoriesReducer,
    cocCategories: CoCCategoriesReducer,
    subApps: subAppsReducer,
    fam: famReducer,
    fs: fsReducer,
    updates: updatesReducer,
    terms: termsReducer,
    as: asReducer,
    contacts: contactsReducer,
    cookies: cookiesReducer,
    tags: tagsReducer,
    accordions: accordionsReducer,
    images: imagesReducer,
    block4cols: block4colsReducer,
    block3cols: block3colsReducer,
    textcomponents: textcomponentsReducer,
    ctacomponents: ctacomponentsReducer,
    cardwithimage: CWIComponentReducer,
    // ...injectedReducers,
  });

export default rootReducer;
