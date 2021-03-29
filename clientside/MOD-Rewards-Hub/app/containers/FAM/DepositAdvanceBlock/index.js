import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import Card from '../../../components/Card';

const Block = props => (
  <Col xs="12" lg="3" md="6" style={{ marginBottom: '28px' }}>
    <Card
      link={`${props.url}/deposit-advance`}
      title="Deposit calculator"
      text="Use this calculator to find out how much you might want to request for your Deposit and One Month’s Rent Advance"
    />
  </Col>
);

Block.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Block;
