import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import CopyCol from '../CopyCol';
import ContainerInner from '../ContainerInner';

import { formatCurrency } from '../../utils/currency';

const DepositDreakdown = props => (
  <div className="deposit-breakdown">
    <ContainerInner>
      <Row>
        <Col xs="12">
          <h3 className="deposit-breakdown-title">{props.title}</h3>
        </Col>
      </Row>
      <Row>
        <Col xs="12" lg="8">
          <CopyCol content={props.content} />
        </Col>
        <Col xs="12" md="6" lg="4">
          <span className="deposit-breakdown-total">{formatCurrency(props.total)}</span>
        </Col>
      </Row>
    </ContainerInner>
  </div>
);

DepositDreakdown.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  total: PropTypes.string,
};

export default DepositDreakdown;
