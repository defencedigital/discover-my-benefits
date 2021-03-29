/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const DEFAULT_LOCALE = 'en';
export const APP_NAME = 'Discover My Benefits';
export const TOGGLE_FLYOUT = 'mod/App/TOGGLE_FLYOUT';
export const TOGGLE_FIXED_NAV = 'mod/App/TOGGLE_FIXED_NAV';
export const TOGGLE_PINNED_NAV = 'mod/App/TOGGLE_PINNED_NAV';
export const CLOSE_FLYOUT = 'mod/App/CLOSE_FLYOUT';
export const TOGGLE_SEARCH = 'mod/App/TOGGLE_SEARCH';
export const SET_ACTIVE_SERVICE_SLUG = 'mod/App/SET_ACTIVE_SERVICE_SLUG';
export const OPEN_CHANGELOG = 'mod/App/OPEN_CHANGELOG';
export const CLOSE_CHANGELOG = 'mod/App/CLOSE_CHANGELOG';
export const UPDATE_CHANGELOG_HISTORY = 'mod/App/UPDATE_CHANGELOG_HISTORY';
export const DELETE_CHANGELOG_HISTORY = 'mod/App/DELETE_CHANGELOG_HISTORY';
export const CATEGORY_VIEW = 'mod/App/CATEGORY_VIEW';
export const BENEFIT_DETAIL_VIEW = 'mod/App/BENEFIT_DETAIL_VIEW';
export const ADD_FAVOURITES = 'mod/App/ADD_FAVOURITES';
export const REMOVE_FAVOURITES = 'mod/App/REMOVE_FAVOURITES';
export const DELETE_FAVOURITES = 'mod/App/DELETE_FAVOURITES';
export const SET_ACTIVE_FAVOURITES_TAB = 'mod/App/SET_ACTIVE_FAVOURITES_TAB';
export const SET_ACTIVE_ALL_TAB = 'mod/App/SET_ACTIVE_ALL_TAB';
export const UPDATE_NETWORK_STATUS = 'mod/App/UPDATE_NETWORK_STATUS';

export const networkStatusText = Object.freeze({
  OFFLINE: 'Offline',
  ONLINE: 'Online',
});

export const ELIGIBILITY_STATUS = Object.freeze({
  MISSING_INFORMATION: 'Missing information',
  NOT_APPLICABLE: 'Not applicable',
});

export const SERVING_TYPES = Object.freeze({
  SR: 'sr',
  NS: 'ns',
  NOT_APPLICABLE: 'Not applicable',
});
