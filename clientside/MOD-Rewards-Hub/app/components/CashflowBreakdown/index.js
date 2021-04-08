import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import CopyCol from '../CopyCol';
import ContainerInner from '../ContainerInner';

import { formatCurrency } from '../../utils/currency';

const CashflowBreakdown = props => (
  <div className="cashflow-breakdown">
    <ContainerInner>
      <Row>
        <Col xs="12" md="9">
          <h3 className="h2 cashflow-breakdown-title">{props.title}:</h3>
        </Col>
        <Col xs="12" md="3">
          <span className="cashflow-breakdown-title-figure">{formatCurrency(props.total)}</span>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <CopyCol content={props.content} />
          <h4>{props.titleHint}</h4>
        </Col>
      </Row>
      <Row>
        <Col xs="12" md="9">
          <p className="cashflow-breakdown-txt">Pay back on {props.firstMonth}: </p>
        </Col>
        <Col xs="12" md="3">
          <span className="cashflow-breakdown-figure">{formatCurrency(props.monthly)}</span>
        </Col>
      </Row>
      <hr className="cashflow-breakdown-separator" />
      <Row>
        <Col xs="12" md="9">
          <p className="cashflow-breakdown-txt">Pay back on {props.secondMonth}: </p>
        </Col>
        <Col xs="12" md="3">
          <span className="cashflow-breakdown-figure">{formatCurrency(props.monthly)}</span>
        </Col>
      </Row>
      <hr className="cashflow-breakdown-separator" />
      <Row>
        <Col xs="12" md="9">
          <p className="cashflow-breakdown-txt">Pay back on {props.thirdMonth}: </p>
        </Col>
        <Col xs="12" md="3">
          <span className="cashflow-breakdown-figure">{formatCurrency(props.monthly)}</span>
        </Col>
      </Row>
    </ContainerInner>
  </div>
);

CashflowBreakdown.propTypes = {
  title: PropTypes.string,
  titleHint: PropTypes.string,
  content: PropTypes.string,
  total: PropTypes.string,
  firstMonth: PropTypes.string,
  secondMonth: PropTypes.string,
  thirdMonth: PropTypes.string,
  monthly: PropTypes.string,
};

export default CashflowBreakdown;
