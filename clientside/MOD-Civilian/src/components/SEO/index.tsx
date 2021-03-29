import { useLocation } from '@reach/router';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';

interface ISEOProps {
  title: string;
  description: string;
  image: string;
  article: boolean;
}

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        oneTrust
        title
        titleTemplate
        url
        image
        description
        author
      }
    }
  }
`;

const SEO = ({ title, description, image, article }: ISEOProps): JSX.Element => {
  const { pathname } = useLocation();
  const { site } = useStaticQuery(query);
  const { defaultTitle, titleTemplate, defaultDescription, siteUrl, defaultImage, oneTrust } = site.siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
    oneTrust,
  };

  return (
    <Helmet title={seo.title} titleTemplate={titleTemplate} htmlAttributes={{ lang: 'en' }}>
      {seo.description && <meta name="description" content={seo.description} />}
      {seo.url && <meta property="og:url" content={seo.url} />}
      {(article ? true : null) && <meta property="og:type" content="article" />}
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && <meta property="og:description" content={seo.description} />}
      {seo.image && <meta property="og:image" content={seo.image} />}
      {seo.image && <meta name="twitter:card" content="summary_large_image" />}
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      {seo.oneTrust && <script type="text/javascript" src={`https://cdn.cookielaw.org/consent/${seo.oneTrust}/OtAutoBlock.js`} />}
      {seo.oneTrust && (
        <script
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          type="text/javascript"
          charSet="UTF-8"
          data-domain-script={`${seo.oneTrust}`}
        />
      )}
      {seo.oneTrust && <script type="text/javascript" innerHTML="function OptanonWrapper(){}" />}
    </Helmet>
  );
};
export default SEO;
