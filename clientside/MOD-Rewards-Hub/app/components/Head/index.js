import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { APP_NAME } from '../../containers/App/constants';

const Head = ({ service, title, notFound, description }) => (
  <>
    <Helmet>
      <meta charSet="utf-8" />
      {service && <title>{`${title} | ${APP_NAME}`}</title>}
      {service && <meta name="twitter:card" content="summary" />}
      {service && <meta property="og:title" content={`${title} | ${APP_NAME}`} />}
      {service && description && <meta property="og:description" content={`${description}`} />}
      {service && <meta property="og:url" content={`${window.location}`} />}
      {service && <meta property="og:type" content="website" />}
      {service && service.facebookImage !== null && <meta property="og:image" content={`${window.location.origin}${service.facebookImage}`} />}
      {notFound && <title>{`${title} ${APP_NAME}`}</title>}
      {notFound && <meta property="og:title" content={`${title} ${APP_NAME}`} />}
      {service === undefined && notFound === false && <title>{APP_NAME}</title>}
      {service && <meta name="theme-color" content={service.themeColor} />}
      {service === undefined && <meta name="theme-color" content="#000000" />}
    </Helmet>
  </>
);

Head.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  notFound: PropTypes.bool.isRequired,
  service: PropTypes.object,
};

export default Head;
