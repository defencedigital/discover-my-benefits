import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Header from '../index';
import { category } from '../../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  breadcrumbItems: [],
  category,
});

describe('Header component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Header {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
  //  it('contains col element', () => {
  //    const html = mount(<Header {...mockedProps.index()} />);
  //    expect(html.find('.col-xs-12')).to.have.length(1);
  //  });
});
