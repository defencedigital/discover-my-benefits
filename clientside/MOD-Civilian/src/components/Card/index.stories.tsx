import React from 'react';
import { storiesOf } from '@storybook/react';
import { Card } from '@components';

storiesOf('Card', module).add('Card', () => {
  const data = {
    name: 'Category Name',
    slug: '/lorem-ipsum',
    headerImage: [
      {
        url: 'https://mod-squidex-dev.cloudapps.digital/api/assets/f4936a47-f9c8-47bf-93e7-0c665daba0b6?version=0',
      },
    ],
    popularBenefits: [
      {
        flatData: {
          name: 'Flexible working',
          slug: '/flexible-working',
        },
        id: 'asdf',
      },
    ],
  };
  return (
    <React.Fragment>
      <Card data={data} />
    </React.Fragment>
  );
});
