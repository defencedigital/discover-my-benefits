/*
 * FAM CASH FLOW
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { toJS } from '../../../components/HOC/ToJS';

import Intro from '../../../components/Intro';
import Page from '../../../components/Page';
import ContainerInner from '../../../components/ContainerInner';
import Breadcrumb from '../../../components/Breadcrumb';
import FormBuilder from '../../../components/FormBuilder';
import Card from '../../../components/Card';
import CopyCol from '../../../components/CopyCol';
import CashflowBreakdown from '../../../components/CashflowBreakdown';
import DepositAdvanceBlock from '../DepositAdvanceBlock';

import { ServicePropType } from '../../Services/propTypes';
import { makeSelectSubAppById } from '../../SubApps/selectors';
import { SubAppPropType } from '../../SubApps/propTypes';
import { CategoryPropType } from '../../Categories/propTypes';
import { makeSelectFam } from '../selectors';
import { FamPropType } from '../propTypes';
import { BenefitPropType } from '../../Benefits/propTypes';
import { formatCurrency } from '../../../utils/currency';
import { makeSelectMultipleBenefitsById } from '../../Benefits/selectors';
import { getServiceSlugFromService } from '../../Services/helpers';
import { formatDate } from '../../../utils/date';

export class CashFlow extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  static getSubmitButton() {
    return [
      {
        type: 'button',
        value: 'Calculate your advance',
      },
    ];
  }

  state = {
    total: null,
    monthly: '',
    date: null,
    // invalidMonthly: false,
    invalidDate: false,
  };

  onFormSubmit = result => {
    const monthly = parseFloat(result['rent.monthly']);

    this.setState({
      monthly: result['rent.monthly'],
      date: result['rent.date'],
      total: formatCurrency(monthly * 3),
    });
  };

  getRentQuestion() {
    const { monthly } = this.state;
    const { theFAM } = this.props;
    return [
      {
        type: 'number',
        name: 'rent.monthly',
        label: theFAM.cashflowRentalQuestion,
        hint: theFAM.cashflowRentalDescription,
        error: null,
        value: monthly,
        icon: '£',
        validation: [
          currentAnswer => {
            if (typeof currentAnswer === 'undefined') {
              return true;
            }

            const max = 5000;
            const min = 0;

            if (
              currentAnswer.length === 0 ||
              parseFloat(currentAnswer) < min ||
              parseFloat(currentAnswer) > max
            ) {
              return `Your rent must be between £${min} and £${max}`;
            }

            return true;
          },
        ],
      },
    ];
  }

  getDateQuestion() {
    const { date, invalidDate } = this.state;
    const { theFAM } = this.props;

    return [
      {
        type: 'date',
        name: 'rent.date',
        label: theFAM.cashflowRentalStartQuestion,
        hint: theFAM.cashflowRentalStartDescription,
        error: invalidDate ? 'Invalid Date' : null,
        value: date,
        placeholder: 'DD/MM/YYYY',
        validation: [
          currentAnswer => {
            if (typeof currentAnswer === 'undefined') {
              return true;
            }

            const dateInvalid = currentAnswer === null || typeof currentAnswer !== 'object';

            if (dateInvalid) {
              return 'The date must be in the format DD/MM/YYYY';
            }

            return true;
          },
        ],
      },
    ];
  }

  getForm() {
    return [this.getRentQuestion(), this.getDateQuestion(), CashFlow.getSubmitButton()];
  }

  getBreadcrumb() {
    const { service, category, fam, theFAM } = this.props;

    return [
      {
        text: 'Home',
        slug: `/${getServiceSlugFromService(service)}`,
        active: true,
        icon: 'home',
      },
      {
        text: category.name,
        slug: `/${getServiceSlugFromService(service)}/${category.slug}`,
        active: true,
        icon: 'grid',
      },
      {
        text: fam.appName,
        slug: `/${getServiceSlugFromService(service)}/${category.slug}/${fam.appName}`,
        active: true,
      },
      {
        text: theFAM.cashflowIntro,
        active: false,
      },
    ];
  }

  render() {
    const { service, theFAM, match, links } = this.props;

    const { total, monthly, date } = this.state;

    const jsDate = new Date(date);
    const month = jsDate.getMonth();

    const firstMonth = formatDate(new Date(jsDate.getFullYear(), month + 4, 0), true);
    const secondMonth = formatDate(new Date(jsDate.getFullYear(), month + 5, 0), true);
    const thirdMonth = formatDate(new Date(jsDate.getFullYear(), month + 6, 0), true);
    return (
      <div>
        <Page
          title={`${theFAM.cashflowIntro} | ${service.name}`}
          service={service}
          description={theFAM.cashflowDescription}
        >
          <ContainerInner className="no-padding-lrg">
            <Row>
              <Col xs="12">
                <Breadcrumb items={this.getBreadcrumb()} />
                <Intro title={theFAM.cashflowIntro} tagName="h1" />
                <CopyCol content={theFAM.cashflowDescription} />
              </Col>
            </Row>
            <Row>
              <Col xs="12" md="6">
                <FormBuilder
                  formOptions={{ className: null, questionHeading: false }}
                  id="fam-rental-advance"
                  form={this.getForm()}
                  options={[]}
                  dependencies={[]}
                  onSubmit={this.onFormSubmit}
                  chunkBy={1}
                />
              </Col>
            </Row>
          </ContainerInner>
          {total && (
            <CashflowBreakdown
              title={theFAM.cashflowBreakdownTitle}
              total={total}
              titleHint={theFAM.cashflowBreakdownTitleHint}
              content={theFAM.cashflowBreakdownDescription}
              firstMonth={firstMonth}
              secondMonth={secondMonth}
              thirdMonth={thirdMonth}
              monthly={monthly}
            />
          )}
          <ContainerInner className="no-padding-lrg">
            <Row>
              <Col xs="12">
                <Intro title="Additional financial support for the renting process" tagName="h2" />
              </Col>
            </Row>
            <Row>
              {links[0] && (
                <Col xs="12" md="6" lg="3" style={{ marginBottom: '28px' }}>
                  <Card
                    link={`${match.url.split('/fam')[0]}/${links[0].slug}`}
                    title={links[0].title}
                    text={links[0].strapline}
                  />
                </Col>
              )}
              {links[1] && (
                <Col xs="12" md="6" lg="3" style={{ marginBottom: '28px' }}>
                  <Card
                    link={`${match.url.split('/fam')[0]}/${links[1].slug}`}
                    title={links[1].title}
                    text={links[1].strapline}
                  />
                </Col>
              )}
              <DepositAdvanceBlock url={`${match.url.split('/fam')[0]}/fam`} />
              {links.map((l, index) => {
                if (index > 1) {
                  return (
                    <Col xs="12" md="6" lg="3" style={{ marginBottom: '28px' }} key={l.id}>
                      <Card
                        link={`${match.url.split('/fam')[0]}/${l.slug}`}
                        title={l.title}
                        text={l.strapline}
                      />
                    </Col>
                  );
                }

                return null;
              })}
            </Row>
          </ContainerInner>
        </Page>
      </div>
    );
  }
}

CashFlow.propTypes = {
  service: ServicePropType,
  category: CategoryPropType,
  fam: SubAppPropType,
  theFAM: PropTypes.arrayOf(FamPropType),
  links: PropTypes.arrayOf(BenefitPropType),
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const fam = makeSelectSubAppById(state, ownProps.id);
  const theFAM = makeSelectFam(state);

  const linkIds = theFAM.toJS().depositAndRentalLinks;
  const links = linkIds
    ? makeSelectMultipleBenefitsById(state, linkIds).sort(
        (a, b) => linkIds.indexOf(a.toJS().id) - linkIds.indexOf(b.toJS().id),
      )
    : [];

  return {
    fam,
    theFAM,
    links,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(CashFlow));
