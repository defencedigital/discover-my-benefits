/*
 *
 * ctaComponent reducer
 *
 */

import { fromJS } from 'immutable';
import ctaComponent from '../../json/squidex/ctaComponents.json';

export const additionalPropsPerctaComponent = {};

export const initialState = fromJS({
  items: ctaComponent.map(t => Object.assign(t, additionalPropsPerctaComponent)),
});

function ctaComponentReducer(state = initialState) {
  return state;
}

export default ctaComponentReducer;
