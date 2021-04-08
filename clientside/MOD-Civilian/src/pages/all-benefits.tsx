import React from 'react';
import MainLayout from '@layout/MainLayout';
import { BenefitLink, SearchBar } from '@components';
import { graphql } from 'gatsby';
import { getAllUsedBenefits } from '@utils/helpers';

interface IAllBenefitsPageProps {
  data: {
    squidex: {
      queryLandingpageContents: [
        {
          id: string;
          slug: string;
          name: string;
          flatData: {
            name: string;
            categories: ICategoryLandingpageProps[];
          };
        },
      ];
    };
  };
  breadcrumb: IBreadcrumbItemProps[];
}

const getBenefitbyCategory = (category: { flatData: { name: any } }, benefits: any[]) => {
  // return only the benefits that have the same category and parent category name (to avoid duplication)
  return benefits.filter(benefit => {
    if (benefit.flatData.parentCategory[0].flatData.name === category.flatData.name) {
      return benefit;
    }
    return false;
  });
};

const CategoryPages = ({ data }: IAllBenefitsPageProps) => {
  const landingpageData = data.squidex.queryLandingpageContents[0].flatData;
  const { categories } = landingpageData;
  const benefits = getAllUsedBenefits(categories).sort((a, b) => a.flatData.name.localeCompare(b.flatData.name));

  const pageData = {
    metaTitle: 'All Benefits',
    metaDescription: 'All Benefits',
    description: 'View all Civilian Benefits',
    slug: '/all-benefits',
    name: '',
  };

  const breadcrumb = [
    {
      text: 'Home',
      slug: `/`,
      active: true,
      icon: 'home',
    },
    {
      text: 'All Benefits',
      slug: '/all-benefits',
      active: false,
    },
  ];

  return (
    <MainLayout breadcrumb={breadcrumb} data={pageData}>
      <section className="mt-4 px-4 lg:px-0 ">
        {benefits.map((benefit: { flatData: { parentCategory: { flatData: { slug: any } }[] }; id: any }) => {
          const catSlug = `/${benefit.flatData.parentCategory[0].flatData.slug}`;
          return <BenefitLink key={`all-benefits-${benefit.id}`} categorySlug={catSlug} data={benefit.flatData} />;
        })}
      </section>
      <SearchBar />
    </MainLayout>
  );
};

export default CategoryPages;

export const query = graphql`
  query getAllBenefits {
    squidex {
      queryLandingpageContents {
        id
        flatData {
          categories {
            id
            flatData {
              shortIntro
              slug
              name
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
            }
          }
        }
      }
    }
  }
`;
