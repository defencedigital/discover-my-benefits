import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import Error from '../Error';
import Page from '../Page';

class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <Page title="Page not found | " notFound>
          <Row center="xs">
            <Col xs="12">
              <Error
                slug="/"
                title="Oops!"
                subtitle="Something went wrong. We are working on getting this fixed as soon as we can."
              />
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            </Col>
          </Row>
        </Page>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.array,
};

export default ErrorBoundary;
