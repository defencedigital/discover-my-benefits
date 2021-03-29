/* eslint-disable no-return-assign */
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row, Button, FormGroup, Input, Label, Alert } from 'reactstrap';
import Recaptcha from 'react-google-invisible-recaptcha';
import { connect } from 'react-redux';

import { fetchData } from '../../containers/Feedback/actions';
import { makeSelectFeedbackStatus, makeSelectRouterStatus } from '../../containers/Feedback/selectors';
import { makeSelectNetworkStatus } from '../../containers/App/selectors';
import { ServicePropType } from '../../containers/Services/propTypes';
import { getProfile } from '../../containers/Questions/helpers';
import { QuestionPropType } from '../../containers/Questions/propTypes';
import { makeSelectQuestions } from '../../containers/Questions/selectors';
import LoadingSVG from '../../images/svg/loading.svg';
import FeedbackInitialBar from './TopPanel';
import ContainerInner from '../ContainerInner';
import FeedbackGoogleRecaptchaBar from './reCaptcha';

import { toJS } from '../HOC/ToJS';
import { API } from '../../utils/api';
import Status from '../Status';
import { networkStatusText } from '../../containers/App/constants';
export class FeedbackPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.panelRef = React.createRef();
    this.state = {
      requestOneComplete: false,
      requestTwoComplete: false,
      recaptchaValue: null,
      mainAnswer: null,
      id: null,
      route: 'suggestion',
      suggestionTextarea: '',
      bugTextareaL: '',
      bugTextareaR: '',
      incorrectTextarea: '',
      panelHidden: false,
      isEnabled: false,
      formError: null,
      currentProfile: getProfile(this.props.allQuestions),
    };
  }

  getCurrentEligibility() {
    // Responses

    // eligible, not eligible, missing information, no questions, not applicable

    const { location, progress } = this.props;
    // I've wrapped the feedback panel in the progress HOC component which stores what benefits the user is eligible for based on the questions they've answered.
    const eligibilityItems = Object.keys(progress.benefits).map(id => {
      const category = progress.benefits[id];
      return {
        category: category[0].primaryCategory.name,
        benefits: category.map(b => ({
          title: b.benefit,
          link: `/${category[0].serviceSlug}/${b.primaryCategory.slug}/${b.benefitSlug}`, // here
          status: b.status, // this is eligibility status you need
        })),
      };
    });

    // Check if user matches benefit to benefit page
    let eligibilityStatus = '';

    eligibilityItems.forEach(item => {
      item.benefits.reduce(b =>
        b.link === location.pathname
          ? (eligibilityStatus = b.status)
          : (eligibilityStatus = 'not_applicable'),
      );
    });

    return eligibilityStatus;
  }

  getURLPathLevel(pathname, level) {
    const windowLocation = pathname.split('/');
    if (windowLocation[level]) {
      return windowLocation[level].replace(/-/g, ' ');
    }
    return null;
  }

  getPageMastheadTitle(selector, attribute) {
    if (document.querySelector(`${selector}`)) {
      const title = document
        .querySelector(`${selector}`)
        .getAttribute(`${attribute}`)
        .trim();
      return title;
    }
    return null;
  }

  getCategoryName() {
    if (this.getURLPathLevel(window.location.pathname, 2)) {
      return this.getPageMastheadTitle('h1[data-title]', 'data-title');
    }
    return null;
  }

  componentDidMount() {
    const { allQuestions } = this.props;

    const profile = getProfile(allQuestions);

    this.setState({
      currentCommitmentType: profile.servingtype,
      currentProfile: profile,
    });
  }

  getCurrentProfile = () => this.state.currentProfile;

  getRank() {
    const profile = this.getCurrentProfile();

    return JSON.stringify(profile.rank);
  }

  captureConsoleErrors = () => {
    let message;
    window.onerror = (msg, url, lineNo, columnNo, error) => {
      message = [
        `Message: ${msg}`,
        `URL: ${url}`,
        `Line: ${lineNo}`,
        `Column: ${columnNo}`,
        `Error object: ${JSON.stringify(error)}`,
      ].join(' - ');
    };
    return message;
  };

  getPageData = () => {
    const { recaptchaValue, mainAnswer, currentCommitmentType } = this.state;

    const { name } = this.props.service;
    const windowURL = window.location.href;

    const benefitName = this.getURLPathLevel(window.location.pathname, 3);
    const benefitCategory = this.getCategoryName();

    const data = {
      main_answer: mainAnswer,
      page_url: windowURL,
      benefit_name: benefitName,
      benefit_category: benefitCategory,
      service: name,
      service_commitment: currentCommitmentType,
      rank: this.getRank(),
      current_eligibility: this.getCurrentEligibility(), // possible values - eligible, not eligible, missing information, no questions, not applicable
      eligibility_responses: '', // if applicable - all the responses given by the user for the current page in JSON format
      console_errors: this.captureConsoleErrors(),
      window_width: window.innerWidth,
      user_agent: window.navigator.userAgent,
      window_height: window.innerHeight,
      screen_height: window.screen.height,
      screen_width: window.screen.width,
      // referrer_url: previously visited page
      google_captcha: recaptchaValue,
    };

    return JSON.stringify(data);
  };

  onSubmit = e => {
    // we need to validate the form data before we submit in here!!
    const { route, suggestionTextarea, bugTextareaL, bugTextareaR, incorrectTextarea, id } = this.state;
    const { onFetchData, service } = this.props;
    e.preventDefault();
    let data;

    if (route === 'suggestion') {
      data = {
        id,
        feedback_type: route,
        feedback_field_1: suggestionTextarea,
      };
    }

    if (route === 'bug') {
      if (bugTextareaL === '' || bugTextareaR === '') {
        this.setState({ formError: 'Please include your feedback in the two fields provided' });
        return;
      }
      data = {
        id,
        feedback_type: route,
        feedback_field_1: bugTextareaL,
        feedback_field_2: bugTextareaR,
      };
    }

    if (route === 'incorrect') {
      data = {
        id,
        feedback_type: 'incorrect_missing_info',
        feedback_field_1: incorrectTextarea,
      };
    }

    const formData = JSON.stringify(data);

    onFetchData('loading');
    API.post(`${service.feedbackLink}/api/dmb/feedback/final`, formData)
      .then(formdata => {
        if (formdata) {
          this.setState({
            requestTwoComplete: true,
          });
          onFetchData('success');
        }
      })
      .catch(() => {
        onFetchData('failure');
      });

    onFetchData('idle');
  };

  handleChange = e => {
    const { route, bugTextareaR, bugTextareaL } = this.state;

    if (e.target.dataset.route === route) {
      const { target } = e;
      const { value, name } = target;

      if (route === 'bug') {
        if (bugTextareaR !== '' && bugTextareaL !== '') {
          this.setState({
            [name]: value,
            formError: null,
            isEnabled: true,
          });
          return;
        }
      }
      if (value !== '') {
        this.setState({
          [name]: value,
          isEnabled: true,
        });
      } else {
        this.setState({
          isEnabled: false,
        });
      }
    }
  };

  handleOptionChange = e => {
    const { suggestionTextarea, bugTextareaL, bugTextareaR, incorrectTextarea } = this.state;
    if (e.target.dataset.id) {
      const { id } = e.target.dataset;
      if (this.state.route !== id) {
        this.setState(
          {
            route: id,
          },
          () => {
            switch (id) {
              case 'bug':
                if (bugTextareaL === '' && bugTextareaR === '') {
                  this.setState({
                    isEnabled: false,
                    formError: null,
                  });
                }

                break;
              case 'suggestion':
                if (suggestionTextarea === '') {
                  this.setState({
                    isEnabled: false,
                  });
                }
                break;
              case 'incorrect':
                if (incorrectTextarea === '') {
                  this.setState({
                    isEnabled: false,
                  });
                }
                break;

              default:
                break;
            }
          },
        );
      }
    }
  };

  handleHide = () => {
    this.setState(prevState => ({ panelHidden: !prevState.panelHidden }));
  };

  showThanksMessage = () => (
    <Row>
      <Col xs="12">
        <p>Thank you for your feedback</p>
      </Col>
    </Row>
  );

  showErrorMessage = () => (
    <Row>
      <Col xs="12">
        <p>Oops something went wrong! Try again in a few minutes.</p>
      </Col>
    </Row>
  );

  handleFetch = answer => {
    // use Callback version of setState
    this.setState(
      {
        mainAnswer: answer,
      },
      () => this.recaptcha.execute(),
    );
  };

  onResolved = () => {
    const { onFetchData, service } = this.props;
    this.setState({
      recaptchaValue: this.recaptcha.getResponse(),
    });

    const pagedata = this.getPageData();
    onFetchData('loading');

    API.post(`${service.feedbackLink}/api/dmb/feedback/initial`, pagedata)

      .then(data => {
        onFetchData('success');
        const { id } = data.data;
        this.setState({
          id,
          requestOneComplete: true,
        });
      })
      .catch(() => {
        onFetchData('failure');
      });
    onFetchData('idle');
  };

  render() {
    const { service, feedbackStatus, networkStatus } = this.props;
    const {
      requestOneComplete,
      requestTwoComplete,
      route,
      mainAnswer,
      panelHidden,
      isEnabled,
      formError,
    } = this.state;

    return (
      <div className="feedback-panel text-white">
        <div className="feedback-panel-stage-1 bg-secondary-beta ">
          <Recaptcha
            hidden
            ref={ref => (this.recaptcha = ref)}
            sitekey="6LcHN-kUAAAAAJCMrTjK5rBBCmNBTdRwya6ZT4Fc"
            onResolved={this.onResolved}
          />
          <ContainerInner className="no-padding-lrg">
            {networkStatus === networkStatusText.OFFLINE && (
              <Status statusText="Come back online to send feedback about this page" />
            )}

            {networkStatus !== networkStatusText.OFFLINE &&
              requestOneComplete &&
              mainAnswer === 'useful_yes' &&
              this.showThanksMessage()}
            {networkStatus !== networkStatusText.OFFLINE && requestTwoComplete && this.showThanksMessage()}
            {networkStatus !== networkStatusText.OFFLINE && !requestTwoComplete && !requestOneComplete && (
              <FeedbackInitialBar status={feedbackStatus} handleInitialFeedback={this.handleFetch} />
            )}
          </ContainerInner>
        </div>
        {requestOneComplete && mainAnswer !== 'useful_yes' && !requestTwoComplete && (
          <div className="feedback-panel-stage-2-wrapper">
            <ContainerInner className="no-padding-lrg">
              <Button
                className="btn-tab hide"
                type="button"
                onClick={() => {
                  this.handleHide();
                }}
              >
                {!panelHidden && 'Hide'}
                {panelHidden && 'Show'}
              </Button>
            </ContainerInner>
            <div
              className={`feedback-panel-stage-2 bg-primary ${panelHidden ? 'is-hidden' : ''}`}
              ref={this.panelRef}
            >
              <form onSubmit={this.handleSubmit} className="mw-100">
                <ContainerInner className="no-padding-lrg">
                  <Row className="border-bottom py-5 mb-3">
                    <Col xs="12">
                      <h5 className="font-weight-bold">{`Help us Improve ${service.name} Discover my Benefits`}</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup tag="fieldset" className="fieldset-radio-choices">
                        <FormGroup check className="py-3 border-bottom">
                          <Label check>
                            <Input
                              type="radio"
                              defaultChecked
                              data-id="incorrect"
                              name="radio1"
                              id="incorrect"
                              onChange={e => this.handleOptionChange(e)}
                            />{' '}
                            <p>There{`'`}s missing or incorrect information on this page</p>
                          </Label>
                        </FormGroup>
                        <FormGroup check className="py-3 border-bottom">
                          <Label check>
                            <Input
                              type="radio"
                              name="radio1"
                              data-id="bug"
                              id="bug"
                              onChange={e => this.handleOptionChange(e)}
                            />{' '}
                            <p>I came across a technical bug or issue</p>
                          </Label>
                        </FormGroup>
                        <FormGroup check className="py-3 border-bottom">
                          <Label check>
                            <Input
                              type="radio"
                              name="radio1"
                              data-id="suggestion"
                              id="suggestion"
                              onChange={e => this.handleOptionChange(e)}
                            />{' '}
                            <p>I have another suggestion to do with this page</p>
                          </Label>
                        </FormGroup>
                      </FormGroup>
                    </Col>
                    <Col lg="8">
                      {route === 'suggestion' && (
                        <FormGroup>
                          <Label for="suggestionTextarea">
                            Tell us about your suggestion on this page so we can improve the service
                          </Label>
                          <Input
                            onChange={e => this.handleChange(e)}
                            type="textarea"
                            name="suggestionTextarea"
                            data-route="suggestion"
                            id="suggestionTextarea"
                          />
                        </FormGroup>
                      )}
                      {route === 'bug' && (
                        <FormGroup>
                          <Row>
                            <Col lg="6">
                              <Label for="bugTextarea">What were you doing?</Label>
                              <Input
                                onChange={e => this.handleChange(e)}
                                type="textarea"
                                data-route="bug"
                                name="bugTextareaL"
                                id="bugTextareaL"
                              />
                            </Col>
                            <Col lg="6">
                              <Label for="bugTextareaR">What went wrong?</Label>
                              <Input
                                onChange={e => this.handleChange(e)}
                                type="textarea"
                                data-route="bug"
                                name="bugTextareaR"
                                id="bugTextareaR"
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      )}
                      {route === 'incorrect' && (
                        <FormGroup>
                          <Row>
                            <Col lg="12">
                              <Label for="incorrectTextarea">
                                Tell us about what information is missing or incorrect on this page
                              </Label>
                              <Input
                                onChange={e => this.handleChange(e)}
                                type="textarea"
                                data-route="incorrect"
                                name="incorrectTextarea"
                                id="incorrectTextarea"
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      )}

                      {formError && (
                        <Alert color="danger">Please include your feedback in the two fields provided</Alert>
                      )}
                      <FormGroup>
                        <Row>
                          <Col lg="6">
                            <Button
                              type="submit"
                              disabled={!isEnabled}
                              className="btn-lg btn-block"
                              onClick={e => this.onSubmit(e)}
                            >
                              Send {feedbackStatus === 'loading' && <LoadingSVG />}
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  </Row>
                </ContainerInner>
              </form>
              <FeedbackGoogleRecaptchaBar />
            </div>
          </div>
        )}
      </div>
    );
  }
}

FeedbackPanel.propTypes = {
  service: ServicePropType,
  location: PropTypes.object,
  feedbackStatus: PropTypes.string,
  onFetchData: PropTypes.func.isRequired,
  allQuestions: PropTypes.arrayOf(QuestionPropType),
  progress: PropTypes.object.isRequired,
  networkStatus: PropTypes.string,
};

const mapStateToProps = state => {
  const feedbackStatus = makeSelectFeedbackStatus(state);
  const location = makeSelectRouterStatus(state);
  const allQuestions = makeSelectQuestions(state);
  const networkStatus = makeSelectNetworkStatus(state);

  return {
    feedbackStatus,
    allQuestions,
    location,
    networkStatus,
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchData: status => dispatch(fetchData(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(FeedbackPanel));
