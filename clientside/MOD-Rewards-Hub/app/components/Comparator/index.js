import React from 'react';
import PropTypes from 'prop-types';
import Mobile from './Mobile';
import Key from './Key';
import Desktop from './Desktop';
import ContainerInner from '../ContainerInner';

export class Comparator extends React.Component {
  getClasses(commitment, mb) {
    let salaryClasses = `${mb ? 'mobile-' : ''}comparator-cell`;
    let xFactorClasses = `${mb ? 'mobile-' : ''}comparator-cell`;
    let leaveClasses = `${mb ? 'mobile-' : ''}comparator-cell`;

    if (commitment.salary.change === -1) {
      salaryClasses += ' decreased';
    } else if (commitment.salary.change === 1) {
      salaryClasses += ' increased';
    } else {
      salaryClasses += ' equal';
    }

    if (commitment.xFactor.change === -1) {
      xFactorClasses += ' decreased';
    } else if (commitment.xFactor.change === 1) {
      xFactorClasses += ' increased';
    } else if (commitment.xFactor.showIcon === true) {
      xFactorClasses += ' equal';
    }

    if (commitment.leave.change === -1) {
      leaveClasses += ' decreased';
    } else if (commitment.leave.change === 1) {
      leaveClasses += ' increased';
    } else {
      leaveClasses += ' equal';
    }

    return {
      leaveClasses,
      xFactorClasses,
      salaryClasses,
    };
  }

  render() {
    const { salary, xFactor, leave, commitmentTypes } = this.props;
    return (
      <div id="comparator" className="comparator">
        <ContainerInner className="no-padding-lrg">
          <Desktop getClasses={this.getClasses} commitmentTypes={commitmentTypes} salary={salary} xFactor={xFactor} leave={leave} slug={this.props.slug} />
        </ContainerInner>
        <Mobile getClasses={this.getClasses} commitmentTypes={commitmentTypes} salary={salary} xFactor={xFactor} leave={leave} slug={this.props.slug} />
        <ContainerInner className="no-padding-lrg">
          <Key />
        </ContainerInner>
      </div>
    );
  }
}

Comparator.propTypes = {
  salary: PropTypes.string.isRequired,
  xFactor: PropTypes.string.isRequired,
  leave: PropTypes.string.isRequired,
  commitmentTypes: PropTypes.array.isRequired,
  slug: PropTypes.string,
};

export default Comparator;
