import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import Card from '../../../components/Card';

const Block = props => (
  <Col xs="12" lg="3" md="6" style={{ marginBottom: '28px' }}>
    <Card
      link={`${props.url}/rental-advance`}
      title="Rental Advance calculator"
      text="Use this calculator to find out how much of a Rental Advance you may also need in addition to your Deposit and One Month’s Rent Advance"
    />
  </Col>
);

Block.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Block;
