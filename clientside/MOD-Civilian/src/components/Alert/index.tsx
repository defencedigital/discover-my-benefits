import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import AlertIcon from '@svgs/exclamation.svg';

interface IAlertProps {
  data: {
    text: string;
    toggle: string;
  };
}

const query = graphql`
  query getAlertData {
    squidex {
      queryAlertContents {
        flatData {
          text
          toggle
        }
        id
      }
    }
  }
`;

const Alert = ({ data }: IAlertProps): JSX.Element => {
  const { squidex } = useStaticQuery(query);
  const { text, toggle } = squidex.queryAlertContents[0].flatData;
  return (
    <React.Fragment>
      {toggle && (
        <div className="flex flex-row justify-start items-center bg-gray-200 p-2 lg:p-4 mb-4 xs:-mt-4 md:-mt-8 lg:-mt-7">
          <div className="flex-col bg-primary relative transform rotate-45">
            <AlertIcon className="w-6 md:w-12 transform -rotate-45 text-white" />
          </div>
          <div className="flex-col">{text && <p className="text-md md:text-lg font-medium pl-4">{text}</p>}</div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Alert;
