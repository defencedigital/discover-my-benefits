/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { injectIntl } from 'react-intl';
import notFoundPageMessages from './messages';

import { toJS } from '../../components/HOC/ToJS';
import Page from '../../components/Page';
import Error from '../../components/Error';

export class NotFound extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    window.dataLayer.push({ event: 'pageview' });
  }

  render() {
    const { slug, intl } = this.props;
    const title = intl.formatMessage({ id: notFoundPageMessages.header.id });
    const subtitle = intl.formatMessage({ id: notFoundPageMessages.header.subtitleId });

    return (
      <Page title="Page not found | " description="Page not found" notFound>
        <Row center="xs">
          <Col xs="12">
            <Error slug={`/${slug}`} title={title} subtitle={subtitle} />
          </Col>
        </Row>
      </Page>
    );
  }
}

NotFound.propTypes = {
  slug: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

export default toJS(injectIntl(NotFound));
