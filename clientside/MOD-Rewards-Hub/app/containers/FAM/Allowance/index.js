/*
 * FAM ALLOWANCE
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
import CopyCol from '../../../components/CopyCol';
import BenchmarkPanel from '../../../components/BenchmarkPanel';
import EligiblePanel from '../../../components/EligiblePanel';
import Card from '../../../components/Card';
import ContrabutionPanel from '../../../components/ContrabutionPanel';
import DepositAdvanceBlock from '../DepositAdvanceBlock';
import RentalAdvanceBlock from '../RentalAdvanceBlock';

import { ServicePropType } from '../../Services/propTypes';
import { makeSelectSubAppById } from '../../SubApps/selectors';
import { SubAppPropType } from '../../SubApps/propTypes';
import { CategoryPropType } from '../../Categories/propTypes';
import { makeSelectFam, makeSelectTp } from '../selectors';
import { FamPropType } from '../propTypes';
import { BenefitPropType } from '../../Benefits/propTypes';
import { makeSelectMultipleBenefitsById } from '../../Benefits/selectors';
import { getServiceSlugFromService } from '../../Services/helpers';

import FamBenchmarkTable from '../../../json/fam/benchmark.json';
import TpBenchmarkTable from '../../../json/tp/benchmark.json';

import FamPaymentTable from '../../../json/fam/payment.json';
import TpPaymentTable from '../../../json/tp/payment.json';

import { chunk } from '../../../utils/array';
import Jumbatron from '../../../components/Jumbotron';

const benchmarkTables = {
  fam: FamBenchmarkTable,
  tp: TpBenchmarkTable,
};

const paymentTables = {
  fam: FamPaymentTable,
  tp: TpPaymentTable,
};

export class Allowance extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  static getSubmitButton() {
    return [
      {
        type: 'button',
        value: 'Re-Calculate',
      },
    ];
  }

  static scrollEligibilityPanelIntoView() {
    const panel = document.getElementById('eligibility-panel');

    if (panel) {
      panel.scrollIntoView();
    }
  }

  state = {
    // total: null,
    renting: null,
    base: null,
    dependants: null,
    benchmark: null,
    corePayment: null,
    corePaymentChanged: false,
    geographicalPayment: null,
    geographicalPaymentChanged: false,
    rentalPayment: null,
    rentalPaymentChanged: false,
    personalContribution: null,
    personalContributionChanged: false,
    expectedMonthlyRentalPayment: null,
  };

  onTopFormUpdate = result => {
    let { benchmark } = this.state;
    let { corePayment } = this.state;
    let { geographicalPayment } = this.state;
    let { rentalPayment } = this.state;
    let { personalContribution } = this.state;
    let famPaymentIndex = null;

    if (result.dependants === '-1') return;

    if (result.base && result.dependants) {
      famPaymentIndex = this.getFamPaymentIndexFromPaymentTable(result.dependants);
      corePayment = this.getCorePaymentFromPaymentTable(famPaymentIndex, result.base);
      geographicalPayment = this.getGeographicalPaymentFromPaymentTable(
        result.renting,
        famPaymentIndex,
        result.base,
      );
      benchmark = this.getBenchmarkFromBenchmarkTable(result.dependants, result.base);

      rentalPayment = corePayment + geographicalPayment;
      personalContribution = benchmark - rentalPayment;
    }

    this.setState(
      {
        corePayment,
        geographicalPayment,
        benchmark,
        rentalPayment,
        personalContribution,
        renting: result.renting,
        base: result.base,
        dependants: result.dependants,
      },
      () => {
        if (this.state.personalContribution && result.base && result.dependants) {
          this.onBottomFormUpdate(
            {
              'rent.expectedMonthlyRentalPayment': this.state.expectedMonthlyRentalPayment,
            },
            false,
          );
        }
      },
    );
  };

  onBottomFormUpdate = (result, scroll) => {
    const { benchmark, dependants, base, renting } = this.state;

    const famPaymentIndex = this.getFamPaymentIndexFromPaymentTable(dependants);
    const corePayment = this.getCorePaymentFromPaymentTable(famPaymentIndex, base);
    const geographicalPayment = this.getGeographicalPaymentFromPaymentTable(renting, famPaymentIndex, base);
    const rent = parseFloat(result['rent.expectedMonthlyRentalPayment']);

    if (Number.isNaN(rent)) {
      const rentalPayment = corePayment + geographicalPayment;
      const personalContribution = benchmark - rentalPayment;

      return this.setState(
        prevState => ({
          expectedMonthlyRentalPayment: null,
          benchmark,
          corePayment,
          corePaymentChanged: prevState.corePayment !== corePayment,
          geographicalPayment,
          geographicalPaymentChanged: prevState.geographicalPayment !== geographicalPayment,
          personalContribution,
          personalContributionChanged: prevState.personalContribution !== personalContribution,
          rentalPayment,
          rentalPaymentChanged: prevState.rentalPayment !== rentalPayment,
        }),
        () => {
          if (scroll) {
            Allowance.scrollEligibilityPanelIntoView();
          }
        },
      );
    }

    let personalContribution = 0;

    if (scroll !== false) {
      Allowance.scrollEligibilityPanelIntoView();
    }

    if (rent >= benchmark) {
      const rentalPayment = corePayment + geographicalPayment;
      personalContribution = rent - (corePayment + geographicalPayment);

      return this.setState(prevState => ({
        personalContribution,
        personalContributionChanged: prevState.personalContribution !== personalContribution,
        expectedMonthlyRentalPayment: rent,
        corePayment,
        corePaymentChanged: prevState.corePayment !== corePayment,
        geographicalPayment,
        geographicalPaymentChanged: prevState.geographicalPayment !== geographicalPayment,
        rentalPayment,
        rentalPaymentChanged: prevState.rentalPayment !== rentalPayment,
      }));
    }

    if (rent < benchmark) {
      const rentalPayment = rent * ((corePayment + geographicalPayment) / benchmark);

      if (rentalPayment > corePayment) {
        const newGP = rentalPayment - corePayment;

        personalContribution = rent - (corePayment + newGP);

        return this.setState(prevState => ({
          personalContribution,
          personalContributionChanged: prevState.personalContribution !== personalContribution,
          geographicalPayment: newGP,
          geographicalPaymentChanged: prevState.geographicalPayment !== newGP,
          expectedMonthlyRentalPayment: rent,
          corePayment,
          corePaymentChanged: prevState.corePayment !== corePayment,
          rentalPayment,
          rentalPaymentChanged: prevState.rentalPayment !== rentalPayment,
        }));
      }

      if (rentalPayment <= corePayment) {
        const newGP = 0;
        const newCorePayment = rentalPayment;

        personalContribution = rent - (newCorePayment + newGP);

        return this.setState(prevState => ({
          personalContribution,
          personalContributionChanged: prevState.personalContribution !== personalContribution,
          geographicalPayment: newGP,
          geographicalPaymentChanged: prevState.geographicalPayment !== newGP,
          corePayment: newCorePayment,
          corePaymentChanged: prevState.corePayment !== newCorePayment,
          expectedMonthlyRentalPayment: rent,
          rentalPayment,
          rentalPaymentChanged: prevState.rentalPayment !== rentalPayment,
        }));
      }
    }

    return true;
  };

  getFamPaymentIndexFromPaymentTable = dependants =>
    paymentTables[this.props.dataTableType].findIndex(column => column.band === dependants);

  getCorePaymentFromPaymentTable = (famPaymentIndex, base) =>
    paymentTables[this.props.dataTableType][famPaymentIndex][base];

  getGeographicalPaymentFromPaymentTable = (renting, famPaymentIndex, base) =>
    renting === true ? paymentTables[this.props.dataTableType][famPaymentIndex + 1][base] : 0;

  getBenchmarkFromBenchmarkTable = (dependants, base) =>
    benchmarkTables[this.props.dataTableType].find(column => column.band === dependants)[base];

  getRentQuestion() {
    const { renting } = this.state;
    const { theFAM } = this.props;

    return [
      {
        id: 'renting',
        name: 'renting',
        type: 'radio',
        label: theFAM.allowanceRentingQuestion,
        options: [
          {
            id: '1',
            value: true,
            name: 'Yes',
          },
          {
            id: '2',
            value: false,
            name: 'No',
          },
        ],
        value: renting,
        onChangeReset: ['base', 'dependants', 'rent.expectedMonthlyRentalPayment'],
      },
    ];
  }

  getBaseQuestion() {
    const { base } = this.state;
    const { theFAM, dataTableType } = this.props;

    const locations = Object.assign({}, benchmarkTables[dataTableType][0]);
    delete locations.band;

    return [
      {
        id: 'base',
        name: 'base',
        type: 'select',
        label: theFAM.allowanceBaseQuestion,
        hint: theFAM.allowanceBaseQuestionDescription,
        options: Object.keys(locations).map(key => ({
          id: key,
          value: key,
          name: key,
        })),
        value: base,
        dependencies: [
          {
            key: 'fam:allowance:1',
            id: 'renting',
            question: 'renting',
            value: currentAnswer => currentAnswer === true,
          },
        ],
      },
    ];
  }

  getDependantsQuestion() {
    const { dependants } = this.state;
    const { theFAM, dataTableType } = this.props;
    const dependantTypes = chunk(paymentTables[dataTableType], 2);

    return [
      {
        id: 'dependants',
        name: 'dependants',
        type: 'select',
        label: theFAM.allowanceDependantsQuestion,
        hint: theFAM.allowanceDependantsQuestionDescription,
        options: dependantTypes.map(type => ({
          id: type[0].band,
          value: type[0].band,
          name: type[0][dataTableType === 'fam' ? 'Number of dependants' : 'band'],
        })),
        value: dependants,
        dependencies: [
          {
            key: 'fam:allowance:2',
            id: 'base',
            question: 'base',
            value: currentAnswer => currentAnswer !== null,
          },
        ],
      },
    ];
  }

  getExpectedMonthlyRentalPaymentQuestion() {
    const { expectedMonthlyRentalPayment } = this.state;
    const { theFAM } = this.props;
    return [
      {
        id: 'rent.expectedMonthlyRentalPayment',
        name: 'rent.expectedMonthlyRentalPayment',
        type: 'number',
        label: theFAM.allowanceRentPayTitle,
        hint: theFAM.allowanceRentPayDescription,
        value: expectedMonthlyRentalPayment,
        icon: '£',
        validation: [
          currentAnswer => {
            if (typeof currentAnswer === 'undefined') {
              return true;
            }

            const min = 50;
            const max = 5000;

            if (
              !currentAnswer ||
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

  getNoJumbotronQuestion() {
    return [
      {
        type: 'jumbotron',
        // eslint-disable-next-line no-multi-str
        value:
          "If you already rent a property within 50 miles of work, you will receive a 'Core Payment' and a 'Geographic Payment'.<br><br> \
       If you are planning on renting a property more than 50 miles from work, you could receive the Core Payment of £125 per month. <br><br> \
       If you are planning on buying a property, or if you already own a property more than 50 miles from work, you could receive the Core Payment of £125 per month. <br><br> \
       Please check the FAM website to make sure your circumstances qualify.",
        dependencies: [
          {
            key: 'fam:allowance:3',
            id: 'renting',
            question: 'renting',
            value: currentAnswer => currentAnswer === false,
          },
        ],
      },
    ];
  }

  getYesJumbotronQuestion() {
    return [
      {
        type: 'jumbotron',
        value:
          "Eligible personnel will receive a 'Core Payment' and a 'Geographic Payment', as well as access to the 'Deposit and One Month’s Rent Advance' and 'Rental Advance' if required.",
        dependencies: [
          {
            key: 'fam:allowance:4',
            id: 'renting',
            question: 'renting',
            value: currentAnswer => currentAnswer === true,
          },
        ],
      },
    ];
  }

  getMainForm() {
    return [
      this.getRentQuestion(),
      this.getNoJumbotronQuestion(),
      this.getYesJumbotronQuestion(),
      this.getBaseQuestion(),
      this.getDependantsQuestion(),
    ];
  }

  getBottomForm() {
    return [this.getExpectedMonthlyRentalPaymentQuestion(), Allowance.getSubmitButton()];
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
        text: theFAM.allowanceIntro,
        active: false,
      },
    ];
  }

  render() {
    const { service, theFAM, match, links } = this.props;
    const {
      renting,
      base,
      dependants,
      benchmark,
      corePayment,
      geographicalPayment,
      rentalPayment,
      personalContribution,
      expectedMonthlyRentalPayment,
      corePaymentChanged,
      geographicalPaymentChanged,
      rentalPaymentChanged,
      personalContributionChanged,
    } = this.state;

    return (
      <div>
        <Page
          title={`${theFAM.allowanceIntro} | ${service.name}`}
          service={service}
          description={theFAM.allowanceDescription}
        >
          <ContainerInner className="no-padding-lrg">
            <Row>
              <Col xs="12">
                <Breadcrumb items={this.getBreadcrumb()} />
                <Intro title={theFAM.allowanceIntro} tagName="h1" />
                <CopyCol content={theFAM.allowanceDescription} />
              </Col>
            </Row>
            <Row>
              <Col xs="12" md="8">
                <FormBuilder
                  formOptions={{ className: null, questionHeading: false }}
                  id="fam-allowance-top"
                  form={this.getMainForm()}
                  options={[]}
                  dependencies={[]}
                  onUpdate={this.onTopFormUpdate}
                  chunkBy={1}
                />
              </Col>
            </Row>
          </ContainerInner>
          {renting !== null && base !== null && dependants !== null && benchmark !== null && (
            <>
              <Row>
                <Col xs="12" md="12">
                  <BenchmarkPanel
                    title={theFAM.allowanceBenchmarkTitle}
                    coreTitle={theFAM.allowanceBreakdownCoreTitle}
                    benchmark={benchmark}
                  />
                  <EligiblePanel
                    title={theFAM.allowanceBreakdownTitle}
                    coreTitle={theFAM.allowanceBreakdownCoreTitle}
                    coreContent={theFAM.allowanceBreakdownCoreDescription}
                    corePayment={corePayment}
                    corePaymentChanged={corePaymentChanged}
                    rentTitle={theFAM.allowanceBreakdownRentTitle}
                    rentContent={theFAM.allowanceBreakdownRentDescription}
                    rentPayment={expectedMonthlyRentalPayment}
                    rentalPaymentChanged={rentalPaymentChanged}
                    rentalTitle={theFAM.allowanceBreakdownRentalTitle}
                    rentalContent={theFAM.allowanceBreakdownRentalDescription}
                    geographicalPayment={geographicalPayment}
                    geographicalPaymentChanged={geographicalPaymentChanged}
                    totalTitle={theFAM.allowanceBreakdownTotalTitle}
                    totalContent={theFAM.allowanceBreakdownTotalDescription}
                    totalPayment={rentalPayment}
                  />
                  <ContrabutionPanel
                    title={theFAM.allowancePersonalTitle}
                    content={theFAM.allowancePersonalDescription}
                    personalContribution={personalContribution}
                    personalContributionChanged={personalContributionChanged}
                  />
                </Col>
              </Row>
            </>
          )}
          {renting !== null && base !== null && dependants !== null && benchmark !== null && (
            <ContainerInner className="no-padding-lrg">
              <Row>
                <Col xs="12" md="8">
                  <FormBuilder
                    formOptions={{ className: null, questionHeading: false }}
                    id="fam-allowance-bottom"
                    form={this.getBottomForm()}
                    options={[]}
                    dependencies={[]}
                    onSubmit={this.onBottomFormUpdate}
                    chunkBy={1}
                  />
                </Col>
              </Row>
            </ContainerInner>
          )}
          {renting !== null && base !== null && dependants !== null && benchmark === null && (
            <ContainerInner className="no-padding-lrg">
              <Row>
                <Col xs="12" md="8">
                  <br />
                  <Jumbatron>
                    <p id="bespoke-message">
                      You will be eligible for a bespoke rate for your FAM accommodation payment. Please
                      contact your local FAM cell for further information on bespoke rates.
                    </p>
                  </Jumbatron>
                </Col>
              </Row>
            </ContainerInner>
          )}
          <ContainerInner className="no-padding-lrg">
            <hr className="eligibility-panel-separator" />
            <Row>
              <Col xs="12">
                <Intro title="Additional financial support for the renting process" tagName="h2" />
              </Col>
            </Row>
            <Row>
              {links.map(l => (
                <Col xs="12" md="6" lg="3" style={{ marginBottom: '28px' }} key={`${l.id}/${l.slug}`}>
                  <Card link={`${match.url.split('/fam')[0]}/${l.slug}`} title={l.title} text={l.strapline} />
                </Col>
              ))}
              <DepositAdvanceBlock url={`${match.url.split('/fam')[0]}/fam`} />
              <RentalAdvanceBlock url={`${match.url.split('/fam')[0]}/fam`} />
            </Row>
          </ContainerInner>
        </Page>
      </div>
    );
  }
}

Allowance.propTypes = {
  service: ServicePropType,
  category: CategoryPropType,
  fam: SubAppPropType,
  theFAM: FamPropType,
  dataTableType: PropTypes.oneOf(['tp', 'fam']),
  links: PropTypes.arrayOf(BenefitPropType),
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const fam = makeSelectSubAppById(state, ownProps.id);

  const theFAM = ownProps.tp === true ? makeSelectTp(state) : makeSelectFam(state);
  const linkIds = theFAM.toJS().calculateSupportLinks;
  const links = linkIds
    ? makeSelectMultipleBenefitsById(state, linkIds).sort(
        (a, b) => linkIds.indexOf(a.toJS().id) - linkIds.indexOf(b.toJS().id),
      )
    : [];
  return {
    fam,
    theFAM,
    links,
    dataTableType: ownProps.tp === true ? 'tp' : 'fam',
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(Allowance));
