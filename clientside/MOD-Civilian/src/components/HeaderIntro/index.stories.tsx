import React from 'react';
import { storiesOf } from '@storybook/react';
import { HeaderIntro } from '@components';

storiesOf('HeaderIntro', module).add('HeaderIntro', () => (
  <React.Fragment>
    <div className="font-body">
      <HeaderIntro
        title="Civilian"
        subtitle="Discover My Benefits"
        introTitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt cumque culpa enim, quis fugiat doloribus rem quia architecto illo magni!"
        description="lorem ipsum here"
        featuredBenefit={{}}
      />
    </div>
  </React.Fragment>
));
