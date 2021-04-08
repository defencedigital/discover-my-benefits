import React from 'react';
import { storiesOf } from '@storybook/react';
import { Breadcrumb } from '@components';

storiesOf('Breadcrumb', module).add('Breadcrumb', () => {
  const breadcrumb = [
    {
      text: 'Home',
      slug: `/`,
      active: true,
      icon: 'home',
    },
    {
      text: 'test',
      slug: '/test-page',
      active: false,
    },
  ];
  return (
    <React.Fragment>
      <Breadcrumb items={breadcrumb} />
    </React.Fragment>
  );
});
