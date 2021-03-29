import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FormCta from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  link: 'link',
});

describe('FormCta component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<FormCta {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
