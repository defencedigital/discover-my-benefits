import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Breadcrumb from '../index';

Enzyme.configure({ adapter: new Adapter() });

describe('Breadcrumb component', () => {
  it('matches the snapshot', () => {
    const html = shallow(
      <Breadcrumb
        items={[
          {
            text: 'test',
            slug: '/',
            active: true,
          },
          {
            text: 'test 2',
            slug: '/library',
            active: true,
          },
          {
            text: 'Boostrap',
            active: false,
          },
        ]}
      />,
    );
    expect(html).toMatchSnapshot();
  });
});
