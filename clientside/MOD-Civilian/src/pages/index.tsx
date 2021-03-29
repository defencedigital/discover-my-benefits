import React from 'react';
import LandingLayout from '@layout/LandingLayout';
import { graphql } from 'gatsby';
import { SearchBar, CategoryCards } from '@components';
import { Global } from '@emotion/core';

interface ILandingPageProps {
  flatData: any;
  data: {
    squidex: {
      queryLandingpageContents: [ILandingPageProps];
    };
  };
}

export const query = graphql`
  query LandingPageQuery {
    squidex {
      queryLandingpageContents {
        id
        flatData {
          description
          featuredBenefitCaption
          featuredBenefitTag
          introTitle
          metaDescription
          metaImage
          metaTitle
          name
          subtitle
          title
          benefit {
            id
            flatData {
              headerImage {
                url
              }
              name
              slug
              parentCategory {
                flatData {
                  slug
                }
              }
            }
          }
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

const LandingPage = ({ data }: ILandingPageProps) => {
  const landingpageData = data.squidex.queryLandingpageContents[0].flatData;
  const { categories } = landingpageData;

  return (
    <LandingLayout data={landingpageData}>
      {categories.length > 0 && <CategoryCards categories={categories} />}
      <SearchBar />
    </LandingLayout>
  );
};

export default LandingPage;
