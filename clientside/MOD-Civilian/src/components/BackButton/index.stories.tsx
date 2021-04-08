import React from 'react';
import { storiesOf } from '@storybook/react';
import { BackButton } from '@components';

storiesOf('BackButton', module).add('BackButton', () => {
  return (
    <React.Fragment>
      <BackButton />
    </React.Fragment>
  );
});
