/*
 *
 * TextComponent reducer
 *
 */

import { fromJS } from 'immutable';
import TextComponent from '../../json/squidex/textcomponents.json';

export const additionalPropsPerTextComponent = {};

export const initialState = fromJS({
  items: TextComponent.map(t => Object.assign(t, additionalPropsPerTextComponent)),
});

function textComponentReducer(state = initialState) {
  return state;
}

export default textComponentReducer;
