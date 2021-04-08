/*
 * FAM DEPOSIT
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
import RentalAdvanceBlock from '../RentalAdvanceBlock';
import DepositBreakdown from '../../../components/DepositBreakdown';

import { ServicePropType } from '../../Services/propTypes';
import { makeSelectSubAppById } from '../../SubApps/selectors';
import { SubAppPropType } from '../../SubApps/propTypes';
import { CategoryPropType } from '../../Categories/propTypes';
import { makeSelectFam } from '../selectors';
import { FamPropType } from '../propTypes';
import { BenefitPropType } from '../../Benefits/propTypes';
import { makeSelectMultipleBenefitsById } from '../../Benefits/selectors';
import { getServiceSlugFromService } from '../../Services/helpers';

export class Deposit extends React.PureComponent {
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
    deposit: '',
  };

  onFormSubmit = result => {
    const monthly = parseFloat(result['rent.monthly']);
    const deposit = parseFloat(result['rent.deposit']);

    this.setState({
      monthly: result['rent.monthly'],
      deposit: result['rent.deposit'],
      total: `£${monthly + deposit}`,
    });
  };

  getRentQuestion() {
    const { monthly } = this.state;
    const { theFAM } = this.props;
    return [
      {
        type: 'number',
        name: 'rent.monthly',
        label: theFAM.depositRentalQuestion,
        hint: theFAM.depositRentalDescription,
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

  getDepositQuestion() {
    const { deposit } = this.state;
    const { theFAM } = this.props;
    return [
      {
        type: 'number',
        name: 'rent.deposit',
        label: theFAM.depositAmountQuestion,
        hint: theFAM.depositAmountQuestionDescription,
        error: null,
        value: deposit,
        icon: '£',
        validation: [
          currentAnswer => {
            if (typeof currentAnswer === 'undefined') {
              return true;
            }

            const max = 9999;
            const min = 0;

            if (
              currentAnswer.length === 0 ||
              parseFloat(currentAnswer) < min ||
              parseFloat(currentAnswer) > max
            ) {
              return `Your deposit must be between £${min} and £${max}`;
            }

            return true;
          },
        ],
      },
    ];
  }

  getForm() {
    return [this.getRentQuestion(), this.getDepositQuestion(), Deposit.getSubmitButton()];
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
        text: theFAM.depositIntro,
        active: false,
      },
    ];
  }

  render() {
    const { service, theFAM, match, links } = this.props;
    const { total } = this.state;
    return (
      <div>
        <Page
          title={`${theFAM.depositIntro} | ${service.name}`}
          service={service}
          description={theFAM.depositDescription}
        >
          <ContainerInner className="no-padding-lrg">
            <Row>
              <Col xs="12">
                <Breadcrumb items={this.getBreadcrumb()} />
                <Intro title={theFAM.depositIntro} tagName="h1" />
                <CopyCol content={theFAM.depositDescription} />
              </Col>
            </Row>
            <Row>
              <Col xs="12" md="6">
                <FormBuilder
                  formOptions={{ className: null, questionHeading: false }}
                  id="fam-deposit"
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
            <DepositBreakdown
              title={theFAM.depositBreakdownIntro}
              content={theFAM.depositBreakdownDescription}
              total={total}
            />
          )}
          <ContainerInner className="no-padding-lrg">
            <h2 style={{ marginTop: '2rem' }}>Additional financial support for the renting process</h2>
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
              <RentalAdvanceBlock url={`${match.url.split('/fam')[0]}/fam`} />
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

Deposit.propTypes = {
  service: ServicePropType,
  category: CategoryPropType,
  fam: SubAppPropType,
  theFAM: FamPropType,
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

export default connect(mapStateToProps, mapDispatchToProps)(toJS(Deposit));
