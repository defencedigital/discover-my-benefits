import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import EligiblePanel from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  corePaymentChanged: false,
  rentalPaymentChanged: false,
  geographicalPaymentChanged: false,
  title: 'title',
  coreTitle: 'coreTitle',
  coreContent: 'coreContent',
  corePayment: 1,
  rentTitle: 'rentTitle',
  rentContent: 'rentContent',
  rentPayment: 'rentPayment',
  rentalTitle: 'rentalTitle',
  rentalContent: 'rentalContent',
  geographicalPayment: 1,
  totalTitle: 'totalTitle',
  totalContent: 'totalContent',
  totalPayment: 1,
});

describe('EligiblePanel component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<EligiblePanel {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
