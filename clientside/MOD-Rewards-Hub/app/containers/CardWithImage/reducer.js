/*
 *
 * ctaComponent reducer
 *
 */

import { fromJS } from 'immutable';
import cardWithImageComponent from '../../json/squidex/cardWithImage.json';

export const additionalPropsPerCWIComponent = {};

export const initialState = fromJS({
  items: cardWithImageComponent.map(t => Object.assign(t, additionalPropsPerCWIComponent)),
});

function CWIComponentReducer(state = initialState) {
  return state;
}

export default CWIComponentReducer;
