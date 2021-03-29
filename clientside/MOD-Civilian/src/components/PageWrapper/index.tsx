import React, { ReactNode } from 'react';

interface IPageWrapperProps {
  children: ReactNode;
}

const PageWrapper = ({ children }: IPageWrapperProps) => {
  return <div className="w-screen font-body">{children}</div>;
};

export default PageWrapper;
