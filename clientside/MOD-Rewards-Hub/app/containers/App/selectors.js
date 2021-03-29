import { createSelector } from 'reselect';

const selectRoute = state => state.get('router');

const makeSelectLocation = () => createSelector(selectRoute, routeState => routeState.get('location'));

/**
 * Direct selector to the app state domain
 */

const selectApp = state => state.get('app');

/**
 * Pin the Nav
 */

const makeSelectPinNav = createSelector(selectApp, appState => appState.get('pinNav'));

/**
 * Fix the Nav
 */

const makeSelectFixNav = createSelector(selectApp, appState => appState.get('fixNav'));

/**
 * Select the flyout open
 */

const makeSelectFlyoutOpen = createSelector(selectApp, appState => appState.get('flyoutOpen'));

/**
 * Select the search open
 */

const makeSelectSearchOpen = createSelector(selectApp, appState => appState.get('searchOpen'));

const makeSelectFavouritesTab = createSelector(selectApp, appState => appState.get('activeFavTab'));

const makeSelectAllTab = createSelector(selectApp, appState => appState.get('activeAllTab'));

/**
 * Select the changelog open
 */

const makeSelectChangelogOpen = createSelector(selectApp, appState => appState.get('changelogOpen'));

/**
 * Select the changelog history
 */

const makeSelectChangelogHistory = createSelector(selectApp, appState => appState.get('changelogHistory'));

/**
 * Select the categoriesViewed history
 */

const makeSelectCategoriesViewed = createSelector(selectApp, appState => appState.get('categoriesViewed'));

/**
 * Select the benefitDetailsViewed history
 */

const makeSelectBenefitDetailsViewed = createSelector(selectApp, appState => appState.get('benefitDetailsViewed'));

/**
 * check network Status
 */

const makeSelectNetworkStatus = createSelector(selectApp, appState => appState.get('networkStatus'));

const makeSelectFavourites = createSelector(selectApp, appState => appState.get('favourites'));

export { makeSelectLocation, makeSelectPinNav, makeSelectFixNav, makeSelectFlyoutOpen, makeSelectSearchOpen, makeSelectChangelogOpen, makeSelectChangelogHistory, makeSelectCategoriesViewed, makeSelectBenefitDetailsViewed, makeSelectFavourites, makeSelectFavouritesTab, makeSelectAllTab, makeSelectNetworkStatus };
