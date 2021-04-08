import React from 'react';
import { storiesOf } from '@storybook/react';
import { Header } from '@components';

storiesOf('Header', module).add('Header', () => (
  <React.Fragment>
    <Header />
  </React.Fragment>
));
