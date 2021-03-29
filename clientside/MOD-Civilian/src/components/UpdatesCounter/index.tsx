/* eslint-disable react/no-array-index-key */

import React, { useContext } from 'react';
import { GlobalUpdatesContext } from '../../context/GlobalUpdatesProvider';

interface IUpdatesCounterProps {
  updates: number;
}

const UpdatesCounter = () => {
  const state = useContext(GlobalUpdatesContext);

  return (
    <React.Fragment>
      {state.updates > 0 && (
        <span className="px-1 absolute text-white bg-secondary rounded block z-10 counter top-4 right-2 xl:right-16 lg:right-12 md:right-8 sm:right-6 xs:right-4">
          {state.updates}
        </span>
      )}
    </React.Fragment>
  );
};

export default UpdatesCounter;
