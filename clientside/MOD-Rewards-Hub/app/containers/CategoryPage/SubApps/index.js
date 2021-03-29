import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import ExploreCta from '../../../components/ExploreCta';
import { chunk } from '../../../utils/array';

import { CategoryPropType } from '../../Categories/propTypes';
import { ServicePropType } from '../../Services/propTypes';

const SubApps = ({ allSubApps, service, category }) => (
  <>
    {chunk(allSubApps, 4).map(row => (
      <Row key={`row-${row[0].id}`}>
        {row.map(item => {
          const { id } = item;
          const { title } = item;
          const { strapline } = item;
          const link = `/${service.slug}/${category.slug}/${item.appName}`;

          return (
            <Col key={id} xs="12">
              <ExploreCta
                class="explore-cta--pullup"
                link={link}
                title={title}
                description={strapline}
                buttonText={title}
              />
            </Col>
          );
        })}
      </Row>
    ))}
  </>
);

SubApps.propTypes = {
  allSubApps: PropTypes.array.isRequired,
  service: ServicePropType,
  category: CategoryPropType,
};

export default SubApps;
