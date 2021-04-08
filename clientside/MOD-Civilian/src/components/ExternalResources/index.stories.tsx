import React from 'react';
import { storiesOf } from '@storybook/react';
import { ExternalResources } from '@components';

storiesOf('ExternalResources', module).add('ExternalResources', () => {
  const otherResources = [
    {
      id: 'asdfasdfasdf',
      flatData: {
        description: 'Go to the Pension Calculator to get a pension forecast',
        icon: 2,
        link: 'https://www.google.co.uk',
        name: 'Pension Calculator',
      },
    },
    {
      id: 'asdfawertwsdfasdf',
      flatData: {
        description: 'Lorem ipsum in here that wil go over 2 lines',
        icon: 1,
        link: 'https://www.google.co.uk',
        name: 'lorem ipsum',
      },
    },
  ];

  return (
    <React.Fragment>
      <ExternalResources data={otherResources} />
    </React.Fragment>
  );
});
