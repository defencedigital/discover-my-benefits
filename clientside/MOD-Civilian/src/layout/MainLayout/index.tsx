import { Breadcrumb, FeedbackForm, Footer, Header, MastheadIntro, PageWrapper, SEO } from '@components';
import React from 'react';
import GlobalStyle from '../../global-style';

interface IProps {
  children: React.ReactNode;
  data: {
    metaTitle: string;
    metaDescription: string;
    name: string;
    description?: string;
    headerImage?: [
      {
        url?: string;
      },
    ];
  };
  breadcrumb: IBreadcrumbItemProps[];
}

const MainLayout = ({ children, data, breadcrumb }: IProps) => {
  const { metaTitle, metaDescription, description, name, headerImage } = data;
  const image = headerImage ? headerImage[0].url : null;
  return (
    <React.Fragment>
      <SEO title={metaTitle} description={metaDescription} />
      <GlobalStyle />
      <PageWrapper>
        <Header>
          {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
          {name && <MastheadIntro name={name} description={description || null} image={image} />}
        </Header>
        <main className="max-w-screen-lg mx-auto">{children}</main>
        <FeedbackForm />
        <Footer />
      </PageWrapper>
    </React.Fragment>
  );
};

export default MainLayout;
