import React from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NotFoundPage from '../index';
import messages from '../messages';

Enzyme.configure({ adapter: new Adapter() });

describe('<NotFoundPage />', () => {
  it('should render the page message', () => {
    shallow(<NotFoundPage />);
    shallow(
      <IntlProvider defaultLocale="en" messages={messages}>
        <FormattedMessage {...messages.header} />
      </IntlProvider>,
    );
  });
});
