import React, { useState, useEffect, useRef, useReducer } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Recaptcha from 'react-google-invisible-recaptcha';
import { TopPanel } from '@components';
import { API } from '@utils/api';
import LoadingIcon from '@svgs/loading.svg';
import { feedbackReducer } from './feedbackReducer';

interface IFeedbackFormProps {
  data: {
    squidex: {
      querySettingsContents: [
        {
          flatData: {
            feedbackapi: string;
          };
        },
      ];
    };
  };
}

const query = graphql`
  query getSettings {
    squidex {
      querySettingsContents {
        flatData {
          feedbackapi
        }
      }
    }
  }
`;

const FeedbackForm = ({ data }: IFeedbackFormProps) => {
  const { squidex } = useStaticQuery(query);
  const { feedbackapi } = squidex.querySettingsContents[0].flatData;
  const googleRecaptcha = useRef(null);
  const [mainAnswer, setMainAnswer] = useState(null);
  const [requestid, setRequestId] = useState(null);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [requestOneComplete, setRequestOneComplete] = useState(false);
  const [requestTwoComplete, setRequestTwoComplete] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [route, setRoute] = useState('incorrect_missing_info');
  const [suggestionTextarea, setSuggestionTextarea] = useState('');
  const [bugTextareaL, setBugTextareaL] = useState('');
  const [bugTextareaR, setBugTextareaR] = useState('');
  const [incorrectTextarea, setIncorrectTextarea] = useState('');
  const [formError, setFormError] = useState('');

  const [isActive, setIsActive] = useState(false);

  const getBenefitName = () => {
    if (document.querySelector('.breadcrumb li:nth-child(3) span') !== null) {
      return document.querySelector('.breadcrumb li:nth-child(3) span').innerText;
    }
    return null;
  };

  const getCategoryName = () => {
    if (document.querySelector('.breadcrumb li:nth-child(2) span') !== null) {
      return document.querySelector('.breadcrumb li:nth-child(2) span').innerText;
    }
    return null;
  };

  const captureConsoleErrors = () => {
    let message;
    window.onerror = (msg, url, lineNo, columnNo, error) => {
      message = [`Message: ${msg}`, `URL: ${url}`, `Line: ${lineNo}`, `Column: ${columnNo}`, `Error object: ${JSON.stringify(error)}`].join(
        ' - ',
      );
    };
    return message;
  };

  const getPageData = () => {
    const windowURL = window.location.href;
    const benefitName = getBenefitName();
    const benefitCategory = getCategoryName();
    const pageData = {
      main_answer: mainAnswer,
      page_url: windowURL,
      benefit_name: benefitName,
      benefit_category: benefitCategory,
      service: 'Civilian',
      console_errors: captureConsoleErrors(),
      window_width: window.innerWidth,
      user_agent: window.navigator.userAgent,
      window_height: window.innerHeight,
      screen_height: window.screen.height,
      screen_width: window.screen.width,
      // referrer_url: previously visited page
      google_captcha: recaptchaValue,
    };

    return JSON.stringify(pageData);
  };

  const [state, dispatch] = useReducer(feedbackReducer, {
    status: 'idle',
    error: null,
  });

  const onResolved = (response: string) => {
    if (state.status === 'idle') {
      setRecaptchaValue(response);
    }
  };

  useEffect(() => {
    if (recaptchaValue && mainAnswer && !requestOneComplete) {
      const pagedata = getPageData();

      dispatch({ type: 'started' });
      API.post(`${feedbackapi}/initial`, pagedata)
        .then((data: { data: { id: string } }) => {
          dispatch({ type: 'success' });
          const { id } = data.data;
          setRequestId(id);
          if (mainAnswer === 'useful_yes') {
            setRequestTwoComplete(true);
          } else {
            setRequestOneComplete(true);
            setIsActive(true);
          }
        })
        .catch(() => {
          dispatch({ type: 'error' });
        });
    }
  }, [recaptchaValue, mainAnswer]);

  const handleSubmit = e => {
    // we need to validate the form data before we submit in here!!

    e.preventDefault();

    let feedbackObj;
    const obj = {
      id: requestid,
      feedback_type: route,
    };

    if (route === 'suggestion') {
      if (suggestionTextarea === '') {
        setFormError('Please include your feedback in the all fields provided');
        return;
      }

      feedbackObj = {
        feedback_field_1: suggestionTextarea,
      };
    }

    if (route === 'bug') {
      if (bugTextareaL === '' || bugTextareaR === '') {
        setFormError('Please include your feedback in the all fields provided');
        return;
      }

      feedbackObj = {
        feedback_field_1: bugTextareaL,
        feedback_field_2: bugTextareaR,
      };
    }

    if (route === 'incorrect_missing_info') {
      if (incorrectTextarea === '') {
        setFormError('Please include your feedback in the all fields provided');
        return;
      }
      feedbackObj = {
        feedback_field_1: incorrectTextarea,
      };
    }

    dispatch({ type: 'started' });

    const formData = JSON.stringify({ ...obj, ...feedbackObj });

    API.post(`${feedbackapi}/final`, formData)
      .then((formdata: any) => {
        if (formdata) {
          setRequestTwoComplete(true);
          dispatch({ type: 'success' });
        }
      })
      .catch(() => {
        dispatch({ type: 'error' });
      });
  };

  const setAnswer = (answer: string) => {
    setMainAnswer(answer);
  };

  useEffect(() => {
    if (googleRecaptcha.current.execute !== undefined) {
      googleRecaptcha.current.execute();
    }
  }, [mainAnswer]);

  useEffect(() => {
    if (route === 'suggestion') {
      document.getElementsByName('suggestionTextarea')[0].focus();
    }

    if (route === 'bug') {
      document.getElementsByName('bugTextareaL')[0].focus();
    }

    if (route === 'incorrect_missing_info') {
      document.getElementsByName('incorrectTextarea')[0].focus();
    }
  }, [route]);

  const onRouteChange = (value: React.SetStateAction<string>) => {
    setRoute(value);
  };

  const handleChange = e => {
    const { target } = e;
    const { value, name } = target;

    if (name === 'incorrectTextarea') {
      setIncorrectTextarea(value);
    }
    if (name === 'suggestionTextarea') {
      setSuggestionTextarea(value);
    }
    if (name === 'bugTextareaL') {
      setBugTextareaL(value);
    }
    if (name === 'bugTextareaR') {
      setBugTextareaR(value);
    }

    if (route === 'bug') {
      if (bugTextareaR !== '' && bugTextareaL !== '') {
        setIsDisabled(false);
        return;
      }
    }

    if (!value.replace(/\s/g, '').length === false) {
      setFormError('');
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const Toggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="mt-6 lg:mt-12">
      <Recaptcha
        hidden
        ref={googleRecaptcha}
        sitekey="6LcHN-kUAAAAAJCMrTjK5rBBCmNBTdRwya6ZT4Fc"
        onResolved={(response: string) => onResolved(response)}
        size="invisible"
      />
      {requestTwoComplete && (
        <div className="bg-primary">
          <div className="flex flex-col lg:flex-row p-4 content-between justify-between text-white max-w-screen-lg mx-auto">
            <p>Thanks for your feedback!</p>
          </div>
        </div>
      )}
      {!requestTwoComplete && (
        <React.Fragment>
          {!requestOneComplete && <TopPanel status={state.status} setAnswer={(e: any) => setAnswer(e)} />}
          <div className={`${requestOneComplete && mainAnswer !== 'useful_yes' ? 'h-auto' : 'hidden h-0'}`}>
            <span className="w-full pt-2 bg-primary block" />
            <div className="max-w-screen-lg mx-auto relative px-4">
              <button
                onClick={e => Toggle()}
                className="absolute top-0 right-0 bg-primary text-white py-2 px-3 rounded rounded-t-none text-sm"
                type="button"
                aria-expanded={isActive}
              >
                {!isActive && 'Show'}
                {isActive && 'Hide'}
              </button>
              <div className={`${isActive ? 'visible h-auto' : 'invisible h-0'}`}>
                <form
                  onSubmit={e => {
                    handleSubmit(e);
                  }}
                >
                  <fieldset>
                    <h3 className="font-semibold text-1xl my-6 ">Help us improve Civilian Discover my Benefits</h3>
                    <hr className="w-full bg-white h-1 mb-3" />
                    <div className="flex flex-col lg:flex-row mb-6">
                      <div className="flex-col w-full lg:w-2/6">
                        <label htmlFor="incorrect" className="flex ">
                          <input
                            data-id="incorrect"
                            name="options"
                            id="incorrect"
                            type="radio"
                            onChange={() => {
                              onRouteChange('incorrect_missing_info');
                            }}
                            checked={route === 'incorrect_missing_info' || route === ''}
                            className="mt-1"
                          />

                          <p className=" ml-2">There&rsquo;s missing or incorrect information on this page</p>
                        </label>
                        <hr className="border my-3" />
                        <label htmlFor="bug" className="flex ">
                          <input
                            data-id="bug"
                            name="options"
                            id="bug"
                            type="radio"
                            checked={route === 'bug'}
                            onChange={() => {
                              onRouteChange('bug');
                            }}
                            className="mt-1"
                          />

                          <p className=" ml-2">I came across a bug or technical issue</p>
                        </label>
                        <hr className="border my-3" />
                        <label htmlFor="suggestion" className="flex ">
                          <input
                            data-id="suggestion"
                            name="options"
                            id="suggestion"
                            type="radio"
                            checked={route === 'suggestion'}
                            onChange={() => {
                              onRouteChange('suggestion');
                            }}
                            className="mt-1"
                          />

                          <p className=" ml-2">I have another suggestion to do with this page</p>
                        </label>
                      </div>
                      <div className="flex-col w-full lg:w-4/6 pt-4 lg:pl-6 lg:pt-0">
                        {(route === 'incorrect_missing_info' || route === '') && (
                          <div className="block">
                            <label
                              htmlFor="incorrectTextarea"
                              className={`${formError ? 'text-error' : 'text-black'} block mb-2 font-semibold`}
                            >
                              Tell us about what information is missing or incorrect on this page
                              <textarea
                                name="incorrectTextarea"
                                onChange={e => handleChange(e)}
                                id="incorrectTextarea"
                                className={`border rounded w-full mt-1 p-1 ${formError ? 'border-error' : 'border-gray-600'}`}
                              />
                            </label>
                          </div>
                        )}
                        {route === 'bug' && (
                          <div className="block">
                            <div className="flex flex-row justify-between">
                              <div className="flex flex-col w-1/2 pr-2">
                                <label
                                  htmlFor="bugTextarea"
                                  className={`${formError ? 'text-error' : 'text-black'} block mb-2 font-semibold`}
                                >
                                  What were you doing?
                                  <textarea
                                    onChange={e => handleChange(e)}
                                    name="bugTextareaL"
                                    id="bugTextareaL"
                                    className={`border rounded w-full mt-1 p-1 ${formError ? 'border-error' : 'border-gray-600'}`}
                                  />
                                </label>
                              </div>
                              <div className="flex flex-col w-1/2 pl-2">
                                <label
                                  htmlFor="bugTextareaR"
                                  className={`${formError ? 'text-error' : 'text-black'} block mb-2 font-semibold`}
                                >
                                  What went wrong?
                                  <textarea
                                    onChange={e => handleChange(e)}
                                    name="bugTextareaR"
                                    id="bugTextareaR"
                                    className={`border rounded w-full mt-1 p-1 ${formError ? 'border-error' : 'border-gray-600'}`}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                        {route === 'suggestion' && (
                          <div className="block">
                            <label
                              htmlFor="suggestionTextarea"
                              className={`${formError ? 'text-error' : 'text-black'} block mb-2 font-semibold`}
                            >
                              Tell us about your suggestion on this page so we can improve the service
                              <textarea
                                name="suggestionTextarea"
                                id="suggestionTextarea"
                                onChange={e => handleChange(e)}
                                className={`border rounded w-full mt-1 p-1 ${formError ? 'border-error' : 'border-gray-600'}`}
                              />
                            </label>
                          </div>
                        )}
                        <div className="block">
                          {formError && <p className="mb-2 font-semibold">Please include your feedback in the all fields provided.</p>}
                          <button
                            className={`text-white rounded p-2 w-full lg:w-1/2 block ${isDisabled ? 'bg-gray-600' : 'bg-primary'}`}
                            type="submit"
                            disabled={isDisabled}
                          >
                            <span>
                              Send
                              {state.status === 'loading' && <LoadingIcon className="inline" />}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
            <div className={`${isActive ? 'visible h-auto' : 'invisible h-0'}`}>
              <div className="bg-black text-white">
                <div className="max-w-screen-lg mx-auto py-3">
                  <p>
                    This site is protected by reCAPTCHA, the
                    <a className="underline mx-1 inline-block" href="https://www.google.com/intl/en/policies/privacy/">
                      Google Privacy Policy
                    </a>
                    and
                    <a className="underline mx-1 inline-block" href="https://www.google.com/intl/en/policies/terms/">
                      Terms of Service
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default FeedbackForm;
