import React from 'react';
import { storiesOf } from '@storybook/react';
import { MastheadIntro } from '@components';

storiesOf('MastheadIntro', module).add('MastheadIntro', () => (
  <React.Fragment>
    <div className="font-body">
      <MastheadIntro
        name="My test Benefit"
        image="https://mod-squidex-dev.cloudapps.digital/api/assets/9ae0e086-f9a0-45ae-abc4-83c3fe3becb2?version=0"
        description="lorem ipsum here"
      />
    </div>
  </React.Fragment>
));
