import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Card from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  title: 'title',
  subtitle: 'subtitle',
  text: 'text',
  image: 'image',
  link: 'link',
  openLinkInNewWindow: true,
  className: 'className',
  status: 1,
  onClick: () => {},
});

describe('Card component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Card {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
