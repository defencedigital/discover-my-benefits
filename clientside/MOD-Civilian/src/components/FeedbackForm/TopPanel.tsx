import React from 'react';
import LoadingIcon from '@svgs/loading.svg';

interface IProps {
  status: string;
  setAnswer(answer: string): any;
}

const TopPanel = ({ status, setAnswer }: IProps) => {
  const isDisabled = !!(status === 'loading' || status === 'success' || status === 'error');
  return (
    <div className="bg-primary">
      <div className="flex flex-col lg:flex-row p-3 content-between justify-between text-white max-w-screen-lg mx-auto">
        <div className="flex flex-col lg:items-start items-center pb-3 lg:pb-0">
          <p>
            Is this page useful?
            <button
              className="underline px-2"
              type="button"
              value="useful_yes"
              disabled={isDisabled}
              onClick={e => {
                setAnswer(e.target.value);
              }}
            >
              Yes
            </button>
            <button
              className="underline px-2"
              type="button"
              value="useful_no"
              disabled={isDisabled}
              onClick={e => {
                setAnswer(e.target.value);
              }}
            >
              No
            </button>
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">{status === 'loading' && <LoadingIcon />}</div>
        <div className="flex flex-col">
          <button
            className="underline"
            type="button"
            value="something_wrong"
            disabled={isDisabled}
            onClick={e => {
              setAnswer(e.target.value);
            }}
          >
            Is there anything we can improve on this page?
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopPanel;
