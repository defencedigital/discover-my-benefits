import React from 'react';
import PropTypes from 'prop-types';

export class MyBenefitsNumber extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      number: props.progress.totalEligible || 0,
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const beforeCount = this.props.progress.totalEligible;
    const afterCount = nextProps.progress.totalEligible;

    if (beforeCount !== afterCount) {
      const difference = Math.abs(afterCount - beforeCount);
      const up = afterCount > beforeCount;

      this.setState(
        {
          open: true,
        },
        () => {
          [...Array(difference).keys()].forEach((item, index) => {
            setTimeout(() => {
              let num = null;

              if (up) {
                num = this.state.number + 1;
              } else {
                num = this.state.number - 1;
              }

              this.setState(
                {
                  number: num,
                },
                () => {
                  if (this.state.number === afterCount) {
                    setTimeout(() => {
                      this.setState({
                        open: false,
                      });
                    }, 1000);
                  }
                },
              );
            }, 1000 + (1000 / difference) * (index + 1));
          });
        },
      );
    }
  }

  render() {
    const { open } = this.state;
    const { class: cssClass, status } = this.props;
    const { number } = this.state;

    return (
      <div className={`my-benefits-number ${open ? 'my-benefits-number--open' : ''}`}>
        <div className="my-benefits-number__inner">
          <div className="h2">{number}</div>
          <div className="h6">My benefits</div>
        </div>
        <div className="my-benefits-number__bottom">
          <p className={`tab-status-text icon-${cssClass}`}>{status}</p>
        </div>
      </div>
    );
  }
}

MyBenefitsNumber.propTypes = {
  class: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  progress: PropTypes.object,
};

export default MyBenefitsNumber;
