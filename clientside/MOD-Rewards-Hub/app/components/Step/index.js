import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';

const Step = ({ step, index }) => {
  const [setActive, setActiveState] = useState('');
  const content = useRef(null);

  const Toggle = () => {
    setActiveState(setActive === '' ? 'active' : '');
  };

  return (
    <div className="px-4 m-auto step" style={{ maxWidth: '1024px' }} key="steps-">
      <div className="d-flex w-100 items-stretch justify-space-between  mb-5 w-full relative">
        <div className=" d-flex flex-column text-white bg-primary  font-bold text-6xl leading-normal h-full text-center p-5 mb-0 h2 step-num ">
          <span>{index + 1}</span>
        </div>
        <div
          className={` w-100 mw-75 d-flex flex-column items-start ${
            !setActive ? 'text-white bg-gray-darker step-closes' : 'bg-white text-black step-open'
          } `}
          ref={content}
        >
          <button
            className={`btn btn-link p-0 d-flex flex-row align-items-center text-left ${
              !setActive ? 'text-white' : 'text-black'
            }`}
            onClick={() => {
              Toggle();
            }}
            type="button"
          >
            <h3 className="p-5 w-75 d-inline-block mb-0">{step.stepTitle}</h3>
            <span className="d-inline-block text-right position-relative">
              {!setActive && (
                <React.Fragment>
                  <span className="d-none d-md-inline-block h4 mb-0">Show</span>
                  <span className="bg-white text-black ml-md-3 text-right acc-icon plus"></span>
                </React.Fragment>
              )}
              {setActive && (
                <React.Fragment>
                  <span className="d-none d-md-inline-block h4 mb-0">Hide</span>
                  <span className="bg-gray-darker text-white ml-md-3 text-right acc-icon minus"></span>
                </React.Fragment>
              )}
            </span>
          </button>
          {setActive && (
            <div className="px-4">
              <hr />
              <div className="bg-white p-4">
                <div className="w-100 d-block copy-col" dangerouslySetInnerHTML={{ __html: step.stepText }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Step.propTypes = {
  step: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default Step;
