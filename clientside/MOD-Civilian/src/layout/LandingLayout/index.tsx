import { Footer, Header, HeaderIntro, PageWrapper, SEO, FeedbackForm } from '@components';
import React from 'react';
import GlobalStyle from '../../global-style';

interface IProps {
  children: React.ReactNode;
  data: {
    metaTitle: string;
    metaDescription: string;
    title?: string;
    subtitle?: string;
    introTitle?: string;
    description?: string;
    featuredBenefitCaption?: string;
    benefit?: IBenefitProps[];
    featuredBenefitTag?: string;
  };
}

const LandingLayout = ({ children, data }: IProps) => {
  const {
    title,
    subtitle,
    metaTitle,
    metaDescription,
    introTitle,
    description,
    featuredBenefitCaption,
    benefit,
    featuredBenefitTag,
  } = data;
  const featuredBenefitData = { featuredBenefitCaption, benefit, featuredBenefitTag };

  return (
    <React.Fragment>
      <SEO title={metaTitle} description={metaDescription} />
      <GlobalStyle />
      <PageWrapper>
        <Header>
          <HeaderIntro
            title={title.length ? title : null}
            subtitle={subtitle.length ? subtitle : null}
            introTitle={introTitle || null}
            description={description || null}
            featuredBenefit={featuredBenefitData || null}
          />
        </Header>

        <main className="max-w-screen-lg mx-auto">{children}</main>
        <FeedbackForm />
        <Footer />
      </PageWrapper>
    </React.Fragment>
  );
};

export default LandingLayout;
