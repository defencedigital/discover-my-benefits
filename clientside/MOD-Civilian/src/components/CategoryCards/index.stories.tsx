import React from 'react';
import { storiesOf } from '@storybook/react';
import { CategoryCards } from '@components';

storiesOf('CategoryCards', module).add('CategoryCards', () => {
  const categories = [
    {
      id: 'asdlfjkh0asdfasdf',
      flatData: {
        shortIntro: 'hi there',
        slug: '/lorem-ipsum',
        name: 'Category Name',
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
      },
    },
    {
      id: 'asdlfjkh0asdfasdf',
      flatData: {
        shortIntro: 'hi there',
        slug: '/lorem-ipsum',
        name: 'Category Name',
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
      },
    },
    {
      id: 'asdlfjkh0asdfasdf',
      flatData: {
        shortIntro: 'hi there',
        slug: '/lorem-ipsum',
        name: 'Category Name',
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
      },
    },
    {
      id: 'asdlfjkh0asdfasdf',
      flatData: {
        shortIntro: 'hi there',
        slug: '/lorem-ipsum',
        name: 'Category Name',
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
      },
    },
  ];
  return (
    <React.Fragment>
      <CategoryCards categories={categories} />
    </React.Fragment>
  );
});
