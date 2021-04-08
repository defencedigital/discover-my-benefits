import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import GridIcon from '../../images/svg/grid.svg';
import HomeIcon from '../../images/svg/home.svg';

const BC = ({ history, items }) => (
  <Breadcrumb item="a" tag="nav">
    {items.length > 0 &&
      items.map(item => (
        <BreadcrumbItem
          key={`${item.text} ${item.slug ? item.slug : ''}`}
          tag={item.active ? 'a' : 'span'}
          onClick={e => {
            e.preventDefault();
            if (item.active) {
              history.push(item.slug);
            }
          }}
          href={item.active ? item.slug : null}
        >
          {item.icon === 'home' && (
            <span className="breadcrumb-icon breadcrumb-icon--home">
              <HomeIcon />
            </span>
          )}
          {item.icon === 'grid' && (
            <span className="breadcrumb-icon breadcrumb-icon--grid">
              <GridIcon />
            </span>
          )}
          {item.text}
        </BreadcrumbItem>
      ))}
  </Breadcrumb>
);

BC.displayName = 'Breadcrumb';

BC.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      active: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
      icon: PropTypes.string,
    }),
  ).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(BC);
