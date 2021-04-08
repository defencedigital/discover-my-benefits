import React from 'react';
import { storiesOf } from '@storybook/react';
import { Alert } from '@components';

storiesOf('Alert', module).add('Alert', () => (
  <React.Fragment>
    <Alert text="test text" toggle />
  </React.Fragment>
));
