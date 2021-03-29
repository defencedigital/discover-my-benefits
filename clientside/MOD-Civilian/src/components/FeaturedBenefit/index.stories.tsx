import React from 'react';
import { storiesOf } from '@storybook/react';
import { FeaturedBenefit } from '@components';

storiesOf('FeaturedBenefit', module).add('FeaturedBenefit', () => {
  const benefit = [
    {
      id: 'cf57619f-a3ba-46de-8696-f15e4023812f',
      flatData: {
        headerImage: [
          {
            url: 'https://mod-squidex-dev.cloudapps.digital/api/assets/4bb120b2-2d5b-4f46-8b77-29ba63a7335c?version=0',
          },
        ],
        name: 'Shared Parental Leave',
        slug: 'shared-parental-leave',
      },
    },
  ];
  return (
    <React.Fragment>
      <FeaturedBenefit caption="test caption here" tag="test tag" benefit={benefit} />
    </React.Fragment>
  );
});
