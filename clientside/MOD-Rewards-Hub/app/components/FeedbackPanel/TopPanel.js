import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Row } from 'reactstrap';

import LoadingSVG from '../../images/svg/loading.svg';

const FeedbackInitialBar = ({ handleInitialFeedback, status }) => {
  const isDisabled = !!(status === 'loading' || status === 'success' || status === 'error');
  return (
    <Row className="justify-content-between top-panel contrast-text">
      <Col xs="12" lg="5">
        <p>
          {status === 'loading' && (
            <span className="loading">
              <LoadingSVG />
            </span>
          )}
          Is this page useful?
          <Button
            className="contrast-text btn-inline btn-sm"
            color="link"
            type="button"
            value="useful_yes"
            disabled={isDisabled}
            onClick={e => {
              handleInitialFeedback(e.target.value);
            }}
          >
            Yes
          </Button>
          <Button
            className="contrast-text btn-inline btn-sm"
            color="link"
            onClick={e => {
              handleInitialFeedback(e.target.value);
            }}
            disabled={isDisabled}
            type="button"
            value="useful_no"
          >
            No
          </Button>
        </p>
      </Col>
      <Col xs="12" lg="5" className="align-self-end">
        <p className="text-right">
          <Button
            className="contrast-text  btn-inline btn-sm"
            type="button"
            color="link"
            value="something_wrong"
            disabled={isDisabled}
            onClick={e => {
              handleInitialFeedback(e.target.value);
            }}
          >
            Is there anything we can improve on this page?
          </Button>
        </p>
      </Col>
    </Row>
  );
};
FeedbackInitialBar.propTypes = {
  handleInitialFeedback: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};
export default FeedbackInitialBar;
