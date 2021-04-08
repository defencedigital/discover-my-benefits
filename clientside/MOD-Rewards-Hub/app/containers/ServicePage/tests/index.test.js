import React from 'react';
import { fromJS } from 'immutable';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { ServicePage } from '../index';
import { shallowWithIntl } from '../../../utils/intl-enzyme-test-helper';
import { service, category } from '../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  onChangeLocale: () => {},
  onChangeTheme: () => {},
  id: service.id,
  intl: {},
  service,
  categories: [category],
  services: [service],
  benefits: [],
  allQuestions: [],
  questions: [],
  options: [],
  dependencies: [],
  calculations: [],
  allBenefits: [],
  allCategories: [],
  commitmenttypes: [],
  fsCalculations: [],
});

describe('ServicePage component', () => {
  const MountedServicePage = shallowWithIntl(<ServicePage {...mockedProps.toJS()} />);

  it('matches the snapshot', () => {
    const html = MountedServicePage;
    expect(html).toMatchSnapshot();
  });
});
