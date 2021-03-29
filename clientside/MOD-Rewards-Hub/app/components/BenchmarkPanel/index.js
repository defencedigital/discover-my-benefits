import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import CopyCol from '../CopyCol';
import ContainerInner from '../ContainerInner';

import { formatCurrency } from '../../utils/currency';

const BenchmarkPanel = props => (
  <div className="benchmark-panel">
    <ContainerInner className="no-padding-lrg">
      <Row>
        <Col xs="12"></Col>
      </Row>
      <Row>
        <Col md="12" lg="8">
          <h3 className="h2 benchmark-panel-title">{props.title}</h3>
          {props.content && <CopyCol content={props.content} />}
        </Col>
        <Col md="12" lg="4">
          <span className="benchmark-panel-figure">{formatCurrency(props.benchmark)}</span>
        </Col>
      </Row>
    </ContainerInner>
  </div>
);

BenchmarkPanel.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  benchmark: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default BenchmarkPanel;
