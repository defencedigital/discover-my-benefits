import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

const Status = ({ statusText }) => (
  <Row>
    <Col xs="12">
      <p>{statusText}</p>
    </Col>
  </Row>
);

Status.propTypes = {
  statusText: PropTypes.string,
};

export default Status;
