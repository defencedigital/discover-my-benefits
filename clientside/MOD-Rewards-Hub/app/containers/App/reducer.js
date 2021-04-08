/*
 *
 * App reducer
 *
 */

import { fromJS } from 'immutable';
import {
  UPDATE_NETWORK_STATUS,
  networkStatusText,
  TOGGLE_PINNED_NAV,
  TOGGLE_FIXED_NAV,
  TOGGLE_SEARCH,
  TOGGLE_FLYOUT,
  SET_ACTIVE_SERVICE_SLUG,
  OPEN_CHANGELOG,
  CLOSE_CHANGELOG,
  UPDATE_CHANGELOG_HISTORY,
  DELETE_CHANGELOG_HISTORY,
  CLOSE_FLYOUT,
  CATEGORY_VIEW,
  BENEFIT_DETAIL_VIEW,
  ADD_FAVOURITES,
  REMOVE_FAVOURITES,
  DELETE_FAVOURITES,
  SET_ACTIVE_ALL_TAB,
  SET_ACTIVE_FAVOURITES_TAB,
} from './constants';

export const initialState = fromJS({
  flyoutOpen: false,
  searchOpen: false,
  activeServiceSlug: null,
  version: 1,
  changelogOpen: false,
  changelogHistory: [],
  categoriesViewed: 0,
  benefitDetailsViewed: 0,
  detailsCompleted: 0,
  eligibleBenefits: 0,
  pinNav: false,
  fixNav: true,
  favourites: 0,
  activeFavTab: true,
  activeAllTab: false,
  networkStatus: networkStatusText.ONLINE,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case CATEGORY_VIEW: {
      return state.merge({
        categoriesViewed: state.toJS().categoriesViewed + 1,
      });
    }
    case BENEFIT_DETAIL_VIEW: {
      return state.merge({
        benefitDetailsViewed: state.toJS().benefitDetailsViewed + 1,
      });
    }

    case TOGGLE_FLYOUT: {
      return state.merge({
        flyoutOpen: !state.toJS().flyoutOpen,
        searchOpen: !state.toJS().flyoutOpen === true ? false : state.toJS().searchOpen,
      });
    }
    case CLOSE_FLYOUT: {
      return state.merge({
        flyoutOpen: false,
      });
    }
    case TOGGLE_PINNED_NAV: {
      return state.merge({
        pinNav: !state.toJS().pinNav,
      });
    }
    case TOGGLE_FIXED_NAV: {
      return state.merge({
        fixNav: !state.toJS().fixNav,
      });
    }
    case TOGGLE_SEARCH: {
      return state.merge({
        searchOpen: !state.toJS().searchOpen,
        flyoutOpen: !state.toJS().searchOpen === true ? false : state.toJS().flyoutOpen,
      });
    }
    case SET_ACTIVE_SERVICE_SLUG: {
      return state.merge({
        activeServiceSlug: action.slug,
      });
    }
    case OPEN_CHANGELOG: {
      return state.merge({
        searchOpen: false,
        flyoutOpen: false,
        changelogOpen: true,
      });
    }
    case CLOSE_CHANGELOG: {
      return state.merge({
        changelogOpen: false,
      });
    }
    case UPDATE_CHANGELOG_HISTORY: {
      return state.merge({
        changelogHistory: action.history,
      });
    }
    case ADD_FAVOURITES: {
      return state.merge({
        favourites: state.toJS().favourites + 1,
        fixNav: true,
        pinNav: true,
      });
    }
    case REMOVE_FAVOURITES: {
      return state.merge({
        favourites: state.toJS().favourites - 1,
      });
    }
    case DELETE_FAVOURITES: {
      return state.merge({
        favourites: 0,
      });
    }
    case DELETE_CHANGELOG_HISTORY: {
      return state.merge({
        changelogHistory: [],
      });
    }

    case SET_ACTIVE_FAVOURITES_TAB: {
      return state.merge({
        activeFavTab: true,
        activeAllTab: false,
      });
    }
    case SET_ACTIVE_ALL_TAB: {
      return state.merge({
        activeFavTab: false,
        activeAllTab: true,
      });
    }
    case UPDATE_NETWORK_STATUS: {
      return state.merge({
        ...state,
        networkStatus: action.payload,
      });
    }
    default:
      return state;
  }
}

export default appReducer;
