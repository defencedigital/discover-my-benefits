import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import browserHistory from 'history/createBrowserHistory';
import configureStore from '../../../configureStore';

import BenefitsPackage from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  progress: {},
  service: [],
});

describe('Benefits box component', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('matches the snapshot', () => {
    const html = shallow(
      <Provider store={store}>
        <BenefitsPackage {...mockedProps.toJS()} />
      </Provider>,
    );
    expect(html).toMatchSnapshot();
  });
});
