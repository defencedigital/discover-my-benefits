import React from 'react';
import ContainerInner from '../ContainerInner';

const FeedbackGoogleRecaptchaBar = () => (
  <div className="feedback-panel-recaptcha bg-primary">
    <ContainerInner>
      <div className="feedback-panel-recaptcha__inner">
        <p className="text-white">
          This site is protected by reCAPTCHA and the
          <a className="text-white" href="https://www.google.com/intl/en/policies/privacy/">
            Google Privacy Policy
          </a>
          and
          <a className="text-white" href="https://www.google.com/intl/en/policies/terms/">
            Terms of Service
          </a>
        </p>
      </div>
    </ContainerInner>
  </div>
);

export default FeedbackGoogleRecaptchaBar;
