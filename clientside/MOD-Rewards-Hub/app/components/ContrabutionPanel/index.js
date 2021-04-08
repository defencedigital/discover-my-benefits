import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import CopyCol from '../CopyCol';
import ContainerInner from '../ContainerInner';
import ToolTip from '../ToolTip';

import { formatCurrency } from '../../utils/currency';

class ContrabutionPanel extends React.PureComponent {
  render() {
    return (
      <div className="contrabution-panel">
        <ContainerInner className="no-padding-lrg">
          <Row>
            <Col md="12" lg="8">
              <h3 className="contrabution-panel-title">{this.props.title}</h3>
            </Col>
          </Row>
          <Row>
            <Col md="12" lg="8">
              <CopyCol content={this.props.content} />
            </Col>
            <Col md="12" lg="4">
              <span
                id="fam-personal-contrabution"
                className={`contrabution-panel-figure ${
                  this.props.personalContributionChanged ? 'has-changed' : ''
                }`}
              >
                {formatCurrency(this.props.personalContribution)}{' '}
                {this.props.personalContributionChanged ? (
                  <p className="tooltip">
                    Why has this changed?
                    <ToolTip
                      content="This has changed because you have changed your monthly rental value."
                      id="tip-3"
                    />
                  </p>
                ) : null}
              </span>
            </Col>
          </Row>
        </ContainerInner>
      </div>
    );
  }
}

ContrabutionPanel.propTypes = {
  personalContributionChanged: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  personalContribution: PropTypes.number,
};

export default ContrabutionPanel;
