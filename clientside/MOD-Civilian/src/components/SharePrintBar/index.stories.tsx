import React from 'react';
import { storiesOf } from '@storybook/react';
import { SharePrintBar } from '@components';

storiesOf('SharePrintBar', module).add('SharePrintBar', () => (
  <React.Fragment>
    <div className="font-body">
      <SharePrintBar benefit="Tax Free Childcare" category="Family and Home" />
    </div>
  </React.Fragment>
));
