import React from 'react';
import PropTypes from 'prop-types';
import ContainerInner from '../ContainerInner';

const Beta = ({ link }) => (
  <ContainerInner className="no-padding-lrg">
    <div className="beta">
      <div className="beta--inner">
        <p>
          <span>Beta</span>
        </p>
        <p>
          This is a trial service —{' '}
          <a href={link} target="_link">
            your feedback
          </a>{' '}
          will help us to improve it.
        </p>
      </div>
    </div>
  </ContainerInner>
);

Beta.propTypes = {
  link: PropTypes.string.isRequired,
};

export default Beta;
