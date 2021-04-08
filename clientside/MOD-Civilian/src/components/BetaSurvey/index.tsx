/* eslint-disable prettier/prettier */
import React from 'react';

const BetaSurvey = (props: Props) => {
  return (
    <div className="max-w-screen-lg mt-16 xs:mt-20 border-b border-secondary border-opacity-25 w-full p-3 mx-auto flex flex-row flex-no-wrap">
      <span className="rounded px-1 bg-primary text-white uppercase flex-col font-bold">Beta</span>
      <p className="text-secondary text-md flex-col ml-2">
        This is a trial service —
        <a className="underline" href="https://www.surveymonkey.com/r/T7C55XR" target="_blank">
          your feedback
        </a>
        {' '}
        will help us to improve it.
      </p>
    </div>
  );
};

export default BetaSurvey;
