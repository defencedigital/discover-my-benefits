import { Footer, PageWrapper, BackButton, Header } from '@components';
import React from 'react';
import GlobalStyle from '../../global-style';

const ErrorLayout = () => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <PageWrapper>
        <Header />
        <main className="max-w-screen-lg mx-auto">
          <section className="w-full pt-12 text-center">
            <div className="richtext">
              <h1>Page not found</h1>
              <p>Oops! The page you are looking for has been moved or relocated.</p>
              <div className="mt-4 flex flex-row justify-center items-center">
                <BackButton text="Back" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </PageWrapper>
    </React.Fragment>
  );
};

export default ErrorLayout;
