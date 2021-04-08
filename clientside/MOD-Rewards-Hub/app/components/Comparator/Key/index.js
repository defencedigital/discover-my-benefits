import React from 'react';
import { Row, Col } from 'reactstrap';

const Mobile = () => (
  <div className="comparator-key">
    <Row>
      <Col className="col" xs="2" lg>
        {' '}
        <span>Key</span>{' '}
      </Col>
      <Col className="col" xs="4" lg>
        {' '}
        <span className="increased">Increase</span>{' '}
      </Col>
      <Col className="col" xs="4" lg>
        {' '}
        <span className="decreased">Decrease</span>{' '}
      </Col>
      <Col className="col" xs="2" lg>
        {' '}
        <span className="equal">Equal</span>{' '}
      </Col>
    </Row>
  </div>
);

export default Mobile;
