/*
 *
 * App actions
 *
 */

import { FETCH_DATA } from './constants';

export function fetchData(status) {
  return {
    type: FETCH_DATA,
    status,
  };
}
