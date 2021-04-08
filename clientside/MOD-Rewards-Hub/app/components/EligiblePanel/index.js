import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import CopyCol from '../CopyCol';
import ContainerInner from '../ContainerInner';
import ToolTip from '../ToolTip';

import { formatCurrency } from '../../utils/currency';

const BenchmarkPanel = props => (
  <div id="eligibility-panel" className="eligibility-panel">
    <ContainerInner className="no-padding-lrg">
      <Row>
        <Col xs="12" lg="8">
          <h3 className="eligibility-panel-title">{props.title}</h3>
        </Col>
        {props.rentPayment && (
          <>
            <Col md="12" lg="8">
              <h4>{props.rentTitle}</h4>
              <CopyCol content={props.rentContent} />
            </Col>
            <Col md="12" lg="4">
              <span id="fam-rp" className="eligibility-panel-figure">
                {formatCurrency(props.rentPayment)}
              </span>
            </Col>
          </>
        )}
        <Col md="12" lg="8">
          <h4>{props.coreTitle}</h4>
          <CopyCol content={props.coreContent} />
        </Col>
        <Col md="12" lg="4">
          <span
            id="fam-cp"
            className={`eligibility-panel-figure ${props.corePaymentChanged ? 'has-changed' : ''}`}
          >
            {formatCurrency(props.corePayment)}{' '}
            {props.corePaymentChanged ? (
              <p className="tooltip">
                Why has this changed?{' '}
                <ToolTip
                  content="This has changed because you have changed your monthly rental value."
                  id="tip-4"
                />
              </p>
            ) : null}
          </span>
        </Col>
        <Col md="12" lg="8">
          <h4>{props.rentalTitle}</h4>
          <CopyCol content={props.rentalContent} />
        </Col>
        <Col md="12" lg="4">
          <span
            id="fam-gp"
            className={`eligibility-panel-figure ${props.geographicalPaymentChanged ? 'has-changed' : ''}`}
          >
            {formatCurrency(props.geographicalPayment)}{' '}
            {props.geographicalPaymentChanged ? (
              <p className="tooltip">
                Why has this changed?{' '}
                <ToolTip
                  content="This has changed because you have changed your monthly rental value."
                  id="tip-1"
                />
              </p>
            ) : null}
          </span>
        </Col>
        <hr className="eligibility-panel-separator" />
        <Col md="12" lg="8">
          <h4>{props.totalTitle}</h4>
          <CopyCol content={props.totalContent} />
        </Col>
        <Col md="12" lg="4">
          <span
            id="fam-total"
            className={`eligibility-panel-figure ${props.rentalPaymentChanged ? 'has-changed' : ''}`}
          >
            {formatCurrency(props.totalPayment)}{' '}
            {props.rentalPaymentChanged ? (
              <p className="tooltip">
                Why has this changed?{' '}
                <ToolTip
                  content="This has changed because you have changed your monthly rental value."
                  id="tip-2"
                />
              </p>
            ) : null}
          </span>
        </Col>
      </Row>
    </ContainerInner>
  </div>
);

BenchmarkPanel.propTypes = {
  corePaymentChanged: PropTypes.bool.isRequired,
  rentalPaymentChanged: PropTypes.bool.isRequired,
  geographicalPaymentChanged: PropTypes.bool.isRequired,
  title: PropTypes.string,
  coreTitle: PropTypes.string,
  coreContent: PropTypes.string,
  corePayment: PropTypes.number,
  rentTitle: PropTypes.string,
  rentContent: PropTypes.string,
  rentPayment: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rentalTitle: PropTypes.string,
  rentalContent: PropTypes.string,
  geographicalPayment: PropTypes.number,
  totalTitle: PropTypes.string,
  totalContent: PropTypes.string,
  totalPayment: PropTypes.number,
};

export default BenchmarkPanel;
