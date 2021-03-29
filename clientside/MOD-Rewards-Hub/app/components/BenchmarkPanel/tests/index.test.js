import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import BenchmarkPanel from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  title: 'title',
  content: 'content',
  benchmark: 'benchmark',
});

describe('BenchmarkPanel component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<BenchmarkPanel {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
