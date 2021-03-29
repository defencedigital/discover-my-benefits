/*
 *
 * App actions
 *
 */

import { TOGGLE_FIXED_NAV, UPDATE_NETWORK_STATUS, TOGGLE_PINNED_NAV, CLOSE_FLYOUT, TOGGLE_FLYOUT, TOGGLE_SEARCH, SET_ACTIVE_SERVICE_SLUG, CLOSE_CHANGELOG, OPEN_CHANGELOG, UPDATE_CHANGELOG_HISTORY, DELETE_CHANGELOG_HISTORY, CATEGORY_VIEW, BENEFIT_DETAIL_VIEW, ADD_FAVOURITES, REMOVE_FAVOURITES, DELETE_FAVOURITES, SET_ACTIVE_FAVOURITES_TAB, SET_ACTIVE_ALL_TAB } from './constants';

export function categoryView() {
  return {
    type: CATEGORY_VIEW,
  };
}
export function benefitDetailView() {
  return {
    type: BENEFIT_DETAIL_VIEW,
  };
}

export function closeFlyout() {
  return {
    type: CLOSE_FLYOUT,
  };
}

export function togglePinnedNav() {
  return {
    type: TOGGLE_PINNED_NAV,
  };
}

export function toggleFixedNav() {
  return {
    type: TOGGLE_FIXED_NAV,
  };
}

export function toggleFlyout() {
  return {
    type: TOGGLE_FLYOUT,
  };
}

export function toggleSearch() {
  return {
    type: TOGGLE_SEARCH,
  };
}

export function setActiveServiceSlug(slug) {
  return {
    type: SET_ACTIVE_SERVICE_SLUG,
    slug,
  };
}

export function closeChangelog() {
  return {
    type: CLOSE_CHANGELOG,
  };
}

export function openChangelog() {
  return {
    type: OPEN_CHANGELOG,
  };
}

export function updateNetworkStatus(status) {
  return {
    type: UPDATE_NETWORK_STATUS,
    payload: status,
  };
}

export function updateChangelogHistory(history) {
  return {
    type: UPDATE_CHANGELOG_HISTORY,
    history,
  };
}

export function setActiveFavouritesTab() {
  return {
    type: SET_ACTIVE_FAVOURITES_TAB,
  };
}

export function setActiveAllTab() {
  return {
    type: SET_ACTIVE_ALL_TAB,
  };
}

export function addFavourites() {
  return {
    type: ADD_FAVOURITES,
  };
}

export function removeFavourites() {
  return {
    type: REMOVE_FAVOURITES,
  };
}

export function deleteFavourites() {
  return {
    type: DELETE_FAVOURITES,
  };
}

export function deleteChangelogHistory() {
  return {
    type: DELETE_CHANGELOG_HISTORY,
  };
}
