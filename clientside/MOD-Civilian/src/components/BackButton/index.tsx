import * as React from 'react';
import BackIcon from '@svgs/back.svg';

interface IBackButtonProps {
  text: string;
  layout?: string;
}

const BackButton = ({ text, layout }: IBackButtonProps) => {
  return (
    <React.Fragment>
      {layout && (
        <div className="flex w-full justify-end">
          <button
            className="bg-secondary px-3 pt-3 pb-3 text-white flex flex-row justify-center text-center text-sm font-bold"
            onClick={() => window.history.back()}
            type="button"
          >
            <BackIcon className="block m-auto h-2 mr-2" />
            <span className="block text-xs">{text}</span>
          </button>
        </div>
      )}
      {!layout && (
        <button
          className="bg-secondary px-3 pt-3 pb-2 text-white flex flex-col justify-center text-center text-sm font-bold"
          onClick={() => window.history.back()}
          type="button"
        >
          <BackIcon className="block m-auto h-2" />
          <span className="block text-xs">{text}</span>
        </button>
      )}
    </React.Fragment>
  );
};

export default BackButton;
