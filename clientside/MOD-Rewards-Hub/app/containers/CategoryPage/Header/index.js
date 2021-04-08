import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import Intro from '../../../components/Intro';
import Breadcrumb from '../../../components/Breadcrumb';
import { CategoryPropType } from '../../Categories/propTypes';

const Header = ({ breadcrumbItems, category }) => (
  <Row>
    <Col xs="12">
      <Breadcrumb items={breadcrumbItems} />
      <Intro title={category.name} tagName="h1" subtitle={category.description} />
    </Col>
  </Row>
);

Header.propTypes = {
  breadcrumbItems: PropTypes.array.isRequired,
  category: CategoryPropType,
};

export default Header;
