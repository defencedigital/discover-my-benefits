import { Breadcrumb, Footer, Header, PageWrapper, SEO, FeedbackForm } from '@components';
import React from 'react';
import GlobalStyle from '../../global-style';

interface IProps {
  children: React.ReactNode;
  data: {
    metaTitle: string;
    metaDescription: string;
    name: string;
    description?: string;
  };
  breadcrumb: IBreadcrumbItemProps[];
}

const ContentLayout = ({ children, data, breadcrumb }: IProps) => {
  const { metaTitle, metaDescription, description, introTitle } = data;
  return (
    <React.Fragment>
      <SEO title={metaTitle} description={metaDescription} />
      <GlobalStyle />
      <PageWrapper>
        <Header>
          {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
          <div className="max-w-screen-lg flex flex-col justify-start mx-auto px-3 lg:px-0">
            <h1 className="font-bold text-5xl leading-tight">{introTitle}</h1>
            <h2 className="text-2xl font-semibold mt-2">{description}</h2>
          </div>
        </Header>
        <main className="max-w-screen-lg mx-auto">{children}</main>
        <FeedbackForm />
        <Footer />
      </PageWrapper>
    </React.Fragment>
  );
};

export default ContentLayout;
