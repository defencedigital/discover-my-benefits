import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { toJS } from '../HOC/ToJS';
import { openChangelog } from '../../containers/App/actions';

class StickyCompare extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      showChanges: false,
    };
  }

  toggle = () => {
    this.setState(prevState => ({ showChanges: !prevState.showChanges }));
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  handleScroll() {
    const compare = document.querySelector('.sticky-compare');
    const acc = document.querySelector('.comparator-container').getBoundingClientRect();
    const footer = document.querySelector('.footer').getBoundingClientRect();

    const top = !(acc.top <= 150);
    const bottom = footer.top <= window.innerHeight;

    if (top === false && bottom === false) {
      compare.classList.add('is-fixed');
    } else {
      compare.classList.remove('is-fixed');
    }
  }

  handleResize = () => {
    window.addEventListener('scroll', this.handleScroll);
  };

  render() {
    const { onOpenChangelogFlyout, questions, comparing, historyCount, click } = this.props;
    const { showChanges } = this.state;
    const txt = comparing && questions && !showChanges ? '+ Display your changes' : '- Hide your changes';
    return (
      <div className={`sticky-compare ${comparing ? 'comparing' : 'not-comparing'}`}>
        {!comparing && (
          <Col>
            <Row className="d-flex justify-content-center align-items-center px-md-3 px-lg-5">
              <button
                type="button"
                onClick={onOpenChangelogFlyout}
                data-ga-category="comparator"
                data-ga-action="change"
                data-ga-label="Changes"
                className="btn btn-lg btn-block-md btn-white view-changelog-btn w-50"
              >
                <span className="bg-danger text-white inline-block py-2 px-3 mr-1 rounded-circle">
                  {historyCount}
                </span>

                <span>Summary</span>
              </button>
              {historyCount > 0 && (
                <button
                  data-ga-category="comparator"
                  data-ga-action="click"
                  data-ga-label="check-new-package"
                  type="button"
                  onClick={click}
                  className="btn btn-lg btn-block-md btn-primary sticky-compare-btn w-50"
                >
                  Check your new package
                </button>
              )}
            </Row>
          </Col>
        )}
        <Col>
          <Row
            className={`d-flex justify-content-between flex-nowrap align-items-center px-md-3 px-lg-5 ${
              questions && questions.length > 0 && showChanges ? 'mb-5' : ''
            }`}
          >
            {comparing && questions && questions.length > 0 && (
              <button type="button" className="text-white" onClick={this.toggle}>
                <h3 className="h4 underline">
                  <u>{txt}</u>
                </h3>
              </button>
            )}

            {comparing && (
              <React.Fragment>
                <span className="d-flex flex-row align-items-center">
                  <button
                    data-ga-category="comparator"
                    data-ga-action="click"
                    data-ga-label="Save changes"
                    type="submit"
                    onClick={this.props.handleSave}
                    className="btn btn-lg btn-primary"
                  >
                    Save changes
                  </button>
                  <p className="text-white hide-md mw-50 ml-3">
                    Store your changes and update your benefits package in the site.
                  </p>
                </span>

                <button
                  data-ga-category="comparator"
                  data-ga-action="click"
                  data-ga-label="Start a new comparison"
                  type="submit"
                  onClick={this.props.handleRestart}
                  className="btn btn-lg btn-white"
                >
                  Start a new comparison
                </button>
              </React.Fragment>
            )}
          </Row>
        </Col>

        {showChanges &&
          questions &&
          questions.length > 0 &&
          questions.map(question => {
            let value;
            if (question.value === undefined || question.value === null) {
              return false;
            }
            if (question.id === 'profile.pay.level') {
              const val = JSON.parse(question.value).value;
              value = val;
            } else {
              value = question.value.value ? question.value.value : question.value;
            }

            if (value === 'true') {
              value = 'Yes';
            } else if (value === 'false') {
              value = 'No';
            }

            return (
              <Row center="xs" key={question.id} className="text-white justify-content-center">
                <Col
                  className="border-top border-bottom border-white justify-content-start pt-4 pb-1"
                  xs="10"
                  md="5"
                >
                  <p className="text-left">{question.title}</p>
                </Col>
                <Col className="border-top border-bottom border-white pt-4 pb-1" xs="2" md="2">
                  <p>{value}</p>
                </Col>
              </Row>
            );
          })}
      </div>
    );
  }
}

StickyCompare.propTypes = {
  click: PropTypes.func,
  handleRestart: PropTypes.func,
  handleSave: PropTypes.func,
  questions: PropTypes.arrayOf(PropTypes.object),
  onOpenChangelogFlyout: PropTypes.func.isRequired,
  comparing: PropTypes.bool,
  historyCount: PropTypes.number,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onOpenChangelogFlyout: () => dispatch(openChangelog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(StickyCompare));
