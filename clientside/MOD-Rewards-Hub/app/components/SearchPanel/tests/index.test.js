import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SearchPanel from '../index';
import { benefit, category, service } from '../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  renderInputOnly: true,
  title: 'title',
  text: 'text',
  bgColor: 'bgColor',
  history: {
    push: () => {},
  },
  benefits: [benefit],
  categories: [category],
  service,
});

describe('SearchPanel component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<SearchPanel {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
