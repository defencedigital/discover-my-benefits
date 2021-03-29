import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SubApps from '../index';
import { subApp, service, category } from '../../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  allSubApps: [subApp],
  service,
  category,
});

describe('SubApps component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<SubApps {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
