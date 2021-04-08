import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import BenefitsBox from '../../../components/BenefitsBox';
import BenefitsList from '../../../components/BenefitsList';
import ContainerInner from '../../../components/ContainerInner';
import ProgressHOC from '../../../components/HOC/Progress';
import StickyCompare from '../../../components/StickyCompare';
import { ServicePropType } from '../../Services/propTypes';
import TotalEligible from '../TotalEligible';

export class Comparison extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    leftProgress: null,
    rightProgress: null,
  };

  render() {
    window.scrollTo(0, 0);
    window.dataLayer.push({ event: 'pageview' });
    const {
      service,
      newProfileQuestions,
      handleRestart,
      changelogHistory,
      comparing,
      handleSave,
      history,
    } = this.props;
    const { leftProgress, rightProgress } = this.state;

    let affectedTotal = null;
    const changed = [];

    if (leftProgress && rightProgress) {
      affectedTotal = Math.abs(
        rightProgress.props.progress.totalEligible - leftProgress.props.progress.totalEligible,
      );

      const categories = [];
      Object.keys(rightProgress.props.progress.benefits).forEach((categoryKey, i) => {
        const category = rightProgress.props.progress.benefits[categoryKey];
        category.forEach((benefit, index) => {
          if (benefit.code !== leftProgress.props.progress.benefits[categoryKey][index].code) {
            changed.push(benefit.benefit);

            if (category[i] !== undefined && categories.indexOf(category[i].primaryCategory.name) < 0) {
              categories.push(category[i].primaryCategory.name);
            }
          }
        });
      });

      window.dataLayer.push({
        event: 'my_comparison',
        benefitsUpdated: changed,
        category: categories,
        benefitsAffected: affectedTotal,
        beforeCompare: rightProgress.props.progress.totalEligible,
        afterCompare: leftProgress.props.progress.totalEligible,
      });
    }

    return (
      <div>
        {affectedTotal !== null && (
          <ContainerInner className="no-padding-lrg">
            <Row>
              <Col xs="12">
                <BenefitsBox benefits={affectedTotal} />
              </Col>
            </Row>
          </ContainerInner>
        )}
        <div className="bg-gray-lightest">
          <ContainerInner className="no-padding-lrg">
            <div className="comparison-views">
              <div className="comparison-views-wrap">
                <Row>
                  <Col xs="6" md="6" className="comparison-view comparison-view-before">
                    <div className="comparison-view-header">
                      <h2 className="comparison-view-title">Your current eligibility</h2>
                      <Row className="comparison-view-row">
                        <Col xs="8">
                          <h3 className="comparison-view-subtitle">Total number of benefits</h3>
                        </Col>
                        <ProgressHOC service={service}>
                          <TotalEligible ref={child => this.setState({ leftProgress: child })} />
                        </ProgressHOC>
                      </Row>
                    </div>
                    <div className="comparison-view-content">
                      <ProgressHOC service={service}>
                        <BenefitsList bg="gray-light" changed={changed} flyout={false} />
                      </ProgressHOC>
                    </div>
                  </Col>
                  <Col xs="6" md="6" className="comparison-view comparison-view-after">
                    <div className="comparison-view-header">
                      <h2 className="comparison-view-title">Your new package</h2>
                      <Row className="comparison-view-row">
                        <Col xs="8">
                          <h3 className="comparison-view-subtitle">Total number of benefits</h3>
                        </Col>
                        <ProgressHOC service={service} questions={newProfileQuestions}>
                          <TotalEligible ref={child => this.setState({ rightProgress: child })} />
                        </ProgressHOC>
                      </Row>
                    </div>
                    <div className="comparison-view-content">
                      <ProgressHOC service={service} questions={newProfileQuestions}>
                        <BenefitsList bg="gray-lighter" changed={changed} flyout={false} />
                      </ProgressHOC>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </ContainerInner>
          <StickyCompare
            comparing={comparing}
            historyCount={changelogHistory.length}
            questions={history}
            handleRestart={handleRestart}
            handleSave={handleSave}
          />
        </div>
      </div>
    );
  }
}

Comparison.propTypes = {
  service: ServicePropType,
  newProfileQuestions: PropTypes.array.isRequired,
  changelogHistory: PropTypes.array.isRequired,
  history: PropTypes.array.isRequired,
  handleRestart: PropTypes.func,
  handleSave: PropTypes.func,
  comparing: PropTypes.bool,
};

export default Comparison;
