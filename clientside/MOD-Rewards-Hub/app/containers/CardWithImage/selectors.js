import { createSelector } from 'reselect';

/**
 * Direct selector to the cardWithImageComponents state domain
 */
const selectcardWithImageComponents = state => state.get('cardwithimage');

/**
 * Select the cardWithImageComponent items
 */

const makeSelectcardWithImageComponents = createSelector(selectcardWithImageComponents, cardWithImageComponentState => cardWithImageComponentState.get('items'));

/**
 * Select a cardWithImageComponent by ID
 */

const makeSelectcardWithImageById = createSelector([makeSelectcardWithImageComponents, (state, id) => id], (cardWithImageComponents, id) => cardWithImageComponents.find(cardWithImageComponent => cardWithImageComponent.get('id') === id) || false);

/**
 * Select a multiple cardWithImageComponents by ID
 */

const makeSelectMultiplecardWithImageComponentsById = createSelector([makeSelectcardWithImageComponents, (state, ids) => ids], (cardWithImageComponents, ids) => cardWithImageComponents.filter(cardWithImageComponent => ids.indexOf(cardWithImageComponent.get('id')) !== -1));

export { selectcardWithImageComponents, makeSelectcardWithImageComponents, makeSelectcardWithImageById, makeSelectMultiplecardWithImageComponentsById };
