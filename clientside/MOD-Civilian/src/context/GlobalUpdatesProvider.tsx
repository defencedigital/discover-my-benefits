import React from 'react';
import { getNumOfUpdates } from '@utils/helpers';
import { graphql, useStaticQuery } from 'gatsby';

const initialState = {
  updates: false,
};

export const GlobalUpdatesContext = React.createContext();
export const GlobalUpdatesDispatchContext = React.createContext();

const query = graphql`
  query getUpatesCounter {
    squidex {
      queryUpdatesContents {
        flatData {
          updates {
            date
          }
        }
        id
      }
    }
  }
`;

const getUpdates = updates => {
  return getNumOfUpdates(updates);
};

function reducer(state, action) {
  switch (action.type) {
    case 'RESET_UPDATES': {
      return {
        updates: 0,
      };
    }
    case 'GET_UPDATES': {
      return {
        updates: action.payload,
      };
    }
    default:
      return state;
  }
}

const GlobalUpdatesProvider = ({ children }) => {
  const { squidex } = useStaticQuery(query);
  const { updates } = squidex.queryUpdatesContents[0].flatData;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { NewUpdates } = getUpdates(updates);
  if (state.updates === false) {
    dispatch({ type: 'GET_UPDATES', payload: NewUpdates });
  }

  return (
    <GlobalUpdatesContext.Provider value={state}>
      <GlobalUpdatesDispatchContext.Provider value={dispatch}>{children}</GlobalUpdatesDispatchContext.Provider>
    </GlobalUpdatesContext.Provider>
  );
};

export default GlobalUpdatesProvider;
