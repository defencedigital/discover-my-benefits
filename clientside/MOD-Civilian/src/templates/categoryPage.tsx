import React from 'react';
import { graphql } from 'gatsby';
import { BenefitLink, ExternalResources, Subcategories, SearchBar } from '@components';
import MainLayout from '@layout/MainLayout';

interface ICategoryPageProps {
  data: {
    squidex: {
      findCategorypageContent: {
        flatData: {
          metaTitle: string;
          metaDescription: string;
          description: string;
          slug: string;
          name: string;
          headerImage?: [
            {
              url?: string;
            },
          ];
          subcategorisedBenefits: [
            {
              name: string;
              benefits: [
                {
                  flatData: {
                    name: string;
                    shortIntro: string;
                    slug: string;
                  };
                },
              ];
            },
          ];
          uncategorisedBenefits: [
            {
              id: string;
              flatData: {
                slug: string;
                name: string;
              };
            },
          ];
          otherresources: [
            {
              id: string;
              flatData: {
                description: string;
                name: string;
                icon: number;
                link: string;
              };
            },
          ];
        };
      };
    };
  };
  breadcrumb: IBreadcrumbItemProps[];
  pageContext: {
    categoryName: string;
    categorySlug: string;
  };
}

const CategoryPages = ({ data, pageContext }: ICategoryPageProps) => {
  const pagedata = data.squidex.findCategorypageContent.flatData;
  const { subcategorisedBenefits, uncategorisedBenefits } = pagedata;

  const otherResources = pagedata.otherresources ? pagedata.otherresources : null;

  const { categoryName, categorySlug } = pageContext;

  const breadcrumb = [
    {
      text: 'Home',
      slug: `/`,
      active: true,
      icon: 'home',
    },
    {
      text: categoryName,
      slug: categorySlug,
      active: false,
    },
  ];

  return (
    <MainLayout breadcrumb={breadcrumb} data={pagedata}>
      {subcategorisedBenefits && <Subcategories data={pagedata} />}
      {uncategorisedBenefits && (
        <div className="mt-8 md:px-4 lg:px-0">
          {uncategorisedBenefits.map(benefit => (
            <BenefitLink key={`category-benefit-link-${benefit.id}`} categorySlug={`${categorySlug}`} data={benefit.flatData} />
          ))}
        </div>
      )}
      {otherResources && <ExternalResources data={otherResources} />}
      <SearchBar />
    </MainLayout>
  );
};

export default CategoryPages;

export const query = graphql`
  query getCategoryPages($id: String!) {
    squidex {
      findCategorypageContent(id: $id) {
        flatData {
          description
          metaDescription
          metaImage
          metaTitle
          name
          slug
          headerImage {
            url
          }
          popularBenefits {
            flatData {
              name
              slug
              parentCategory {
                flatData {
                  name
                  slug
                }
                id
              }
            }
            id
          }
          subcategorisedBenefits {
            name
            benefits {
              flatData {
                name
                shortIntro
                slug
                parentCategory {
                  flatData {
                    name
                    slug
                  }
                  id
                }
              }
              id
            }
          }
          uncategorisedBenefits {
            id
            flatData {
              name
              slug
              shortIntro
              parentCategory {
                id
                flatData {
                  slug
                  name
                }
              }
            }
          }
          otherresources {
            id
            flatData {
              description
              icon
              link
              name
            }
          }
        }
      }
    }
  }
`;
