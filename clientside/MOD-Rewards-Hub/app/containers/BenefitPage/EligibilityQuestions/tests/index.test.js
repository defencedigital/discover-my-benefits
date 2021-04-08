import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import browserHistory from 'history/createBrowserHistory';
import configureStore from '../../../../configureStore';

import Header from '../index';
import { category } from '../../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  breadcrumbItems: [],
  category,
});

describe('Header component', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('matches the snapshot', () => {
    const html = shallow(
      <Provider store={store}>
        <Header {...mockedProps.toJS()} />
      </Provider>,
    );
    expect(html).toMatchSnapshot();
  });
});
