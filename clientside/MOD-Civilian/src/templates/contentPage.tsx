import ContentLayout from '@layout/ContentLayout';
import { RichText, SearchBar } from '@components';
import { graphql } from 'gatsby';
import React from 'react';

interface IProps {
  data: {
    squidex: {
      findContentpageContent: {
        flatData: {
          metaTitle: string;
          metaDescription: string;
          description: string;
          slug: string;
          name: string;
          introTitle: string;
          richText: string;
        };
      };
    };
  };
  breadcrumb: [IBreadcrumbItemProps];
}

const ContentPages = ({ data }: IProps) => {
  const pagedata = data.squidex.findContentpageContent.flatData;
  const breadcrumb = [
    {
      text: 'Home',
      slug: `/`,
      active: true,
      icon: 'home',
    },
    {
      text: pagedata.name,
      slug: `/${pagedata.slug}`,
      active: false,
    },
  ];

  return (
    <ContentLayout breadcrumb={breadcrumb} data={pagedata}>
      {pagedata.richText && pagedata.richText.length > 0 && <RichText html={pagedata.richText} />}
      <SearchBar />
    </ContentLayout>
  );
};

export default ContentPages;

export const query = graphql`
  query getcontentPages($id: String!) {
    squidex {
      findContentpageContent(id: $id) {
        flatData {
          description
          metaDescription
          metaImage
          metaTitle
          name
          introTitle
          slug
          richText
        }
      }
    }
  }
`;
