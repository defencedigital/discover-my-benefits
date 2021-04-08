/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import RichText from '@components/RichText';

interface IHTDProps {
  data: [
    {
      id: string;
      flatData: {
        name: string;
        richText: string;
        steps: [
          {
            stepText: string;
          },
        ];
      };
    },
  ];
}

const HTD = ({ data }: IHTDProps) => {
  const { id } = data[0];
  const { steps, richText } = data[0].flatData;
  return (
    <React.Fragment>
      <RichText html={richText} />
      {steps.map((step: { stepText: string }, index: number) => {
        return (
          <div className="flex flex-no-wrap w-full px-4 lg:px-0" key={`steps-${id}-${index}`}>
            <div className="flex items-stretch justify-center  mb-5 w-full relative">
              <div className="self-stretch bg-primary text-white font-bold text-6xl leading-normal w-3/12 sm:w-1/12 h-full text-center justify-center self-stretch px-3">
                {index + 1}
              </div>
              <div
                className="bg-secondary self-stretch p-4 text-white w-9/12 sm:w-11/12 h-full richtext dark"
                dangerouslySetInnerHTML={{ __html: step.stepText }}
              />
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default HTD;
