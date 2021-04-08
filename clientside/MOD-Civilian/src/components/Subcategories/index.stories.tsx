import React from 'react';
import { storiesOf } from '@storybook/react';
import { Subcategories } from '@components';

storiesOf('Subcategories', module).add('Subcategories', () => {
  const data = [
    {
      flatData: {
        name: 'test name here',
        benefits: [
          {
            flatData: {
              name: 'benefit-1',
              shortIntro: 'lorem ipsum in here',
              slug: '/test',
            },
          },
          {
            flatData: {
              name: 'benefit-1',
              shortIntro: 'lorem ipsum in here',
              slug: '/test',
            },
          },
          {
            flatData: {
              name: 'benefit-1',
              shortIntro: 'lorem ipsum in here',
              slug: '/test',
            },
          },
        ],
      },
    },
  ];
  return (
    <div className="w-screen">
      <Subcategories data={data} />
    </div>
  );
});
