/*
 *
 * Links reducer
 *
 */

import { fromJS } from 'immutable';
import Images from '../../json/squidex/images.json';

export const additionalPropsPerImg = {};

export const initialState = fromJS({
  items: Images.map(b => Object.assign(b, additionalPropsPerImg)),
});

function imagesReducer(state = initialState) {
  return state;
}

export default imagesReducer;
