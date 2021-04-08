import React from 'react';
import { Col, Row } from 'reactstrap';
import sortBy from 'lodash/sortBy';
import drop from 'lodash/drop';
import PropTypes from 'prop-types';

class Changelog extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showExtra: false,
    };
  }

  toggleExtra = () => {
    this.setState(prevState => ({ showExtra: !prevState.showExtra }));
  };

  getBenefits = benefit => {
    let iconStatus;
    switch (benefit.benefitStatus) {
      case 'Eligible':
        iconStatus = 'icon-eligible';
        break;
      case 'Not Eligible':
        iconStatus = 'icon-not-eligible';
        break;
      default:
        iconStatus = 'icon-missing';
        break;
    }

    return (
      <Row
        key={benefit.id}
        className="flex flex-row flex-nowrap justify-content-lg-between  align-content-center border-top border-white py-2"
      >
        <Col className="flex-column" xs={8}>
          <p>{benefit.benefitTitle}</p>
        </Col>
        <Col className="flex-column">
          <p className={`icon ${iconStatus}`}>{benefit.benefitStatus}</p>
        </Col>
      </Row>
    );
  };

  render() {
    const { showExtra } = this.state;
    const { click } = this.props;
    const BenefitsOrderedByStatus =
      this.props.benefits && this.props.benefits.length > 0
        ? sortBy(this.props.benefits, [
            function(benefit) {
              return benefit.benefitStatus;
            },
          ])
        : false;

    const txt = showExtra ? '- Hide' : '+ Show';

    const BenefitsAfter10 =
      BenefitsOrderedByStatus && BenefitsOrderedByStatus.length > 10
        ? drop(BenefitsOrderedByStatus, 10)
        : false;
    return (
      <div className="changelog">
        {BenefitsOrderedByStatus && (
          <div className="changelog-header">
            <h2>After your changes</h2>
          </div>
        )}
        {!BenefitsOrderedByStatus && <h3 className="mb-3">You haven{`'`}t made any changes yet.</h3>}
        {BenefitsOrderedByStatus &&
          BenefitsOrderedByStatus.map((benefit, index) => {
            if (index < 10) {
              return this.getBenefits(benefit);
            }
          })}

        {BenefitsOrderedByStatus && BenefitsOrderedByStatus.length > 10 && (
          <div className="flex flew-row">
            <Col>
              <p>
                <button type="button" onClick={this.toggleExtra}>
                  {txt} {BenefitsAfter10.length} More
                </button>
              </p>
            </Col>
          </div>
        )}

        {showExtra && BenefitsAfter10 && BenefitsAfter10.map(benefit => this.getBenefits(benefit))}

        {click && (
          <button
            data-ga-category="comparator"
            data-ga-action="click"
            data-ga-label="check-new-package"
            type="button"
            onClick={this.props.click}
            className="btn btn-lg btn-block-md btn-primary sticky-compare-btn"
          >
            Check your new package
          </button>
        )}
      </div>
    );
  }
}

Changelog.propTypes = {
  benefits: PropTypes.array,
  click: PropTypes.func,
};

export default Changelog;
