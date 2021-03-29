import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';

export class TotalEligible extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { progress } = this.props;
    return (
      <Col xs="4" className="comparison-view-col-right">
        <h3 className="comparison-view-subtitle">{progress.totalEligible}</h3>
      </Col>
    );
  }
}

TotalEligible.propTypes = {
  progress: PropTypes.object,
};

export default TotalEligible;
