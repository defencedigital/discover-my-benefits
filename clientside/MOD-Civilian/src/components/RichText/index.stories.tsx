import React from 'react';
import { storiesOf } from '@storybook/react';
import { RichText } from '@components';

storiesOf('RichText', module).add('RichText', () => (
  <React.Fragment>
    <div className="font-body">
      <RichText html="<p>Hi there!</p>" />
    </div>
  </React.Fragment>
));
