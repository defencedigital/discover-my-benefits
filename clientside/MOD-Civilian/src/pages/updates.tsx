import ContentLayout from '@layout/ContentLayout';
import { SearchBar, Updates } from '@components';
import { graphql } from 'gatsby';
import React, { useContext } from 'react';
import { GlobalUpdatesDispatchContext, GlobalUpdatesContext } from '@root/context/GlobalUpdatesProvider';

interface IProps {
  data: {
    squidex: {
      queryUpdatesContents: [
        {
          flatData: {
            metaTitle: string;
            metaDescription: string;
            description: string;
            slug: string;
            introTitle: string;
            name: string;
            updates: [
              {
                date: string;
                description: string;
                link: [
                  {
                    id: string;
                  },
                ];
                title: string;
              },
            ];
          };
        },
      ];
    };
  };
  breadcrumb: [IBreadcrumbItemProps];
}

const UpdatesPage = ({ data }: IProps) => {
  const dispatch = useContext(GlobalUpdatesDispatchContext);
  const state = useContext(GlobalUpdatesContext);
  const pagedata = data.squidex.queryUpdatesContents[0].flatData;
  const { updates } = pagedata;
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
  if (state.updates > 0) {
    dispatch({ type: 'RESET_UPDATES' });
  }

  return (
    <ContentLayout breadcrumb={breadcrumb} data={pagedata}>
      {updates && <Updates updates={updates} />}
      <SearchBar />
    </ContentLayout>
  );
};

export default UpdatesPage;

export const query = graphql`
  query MyQuery {
    squidex {
      queryUpdatesContents {
        flatData {
          description
          introTitle
          metaDescription
          metaImage
          metaTitle
          name
          slug
          updates {
            date
            description
            link {
              ... on Squidex_Categorypage {
                id
                flatData {
                  name
                  slug
                }
              }
              ... on Squidex_Benefitpage {
                id
                flatData {
                  name
                  slug
                  parentCategory {
                    flatData {
                      name
                      slug
                    }
                  }
                }
              }
              ... on Squidex_Externallinks {
                id
                flatData {
                  name
                  url
                }
              }
            }
            title
          }
        }
      }
    }
  }
`;
