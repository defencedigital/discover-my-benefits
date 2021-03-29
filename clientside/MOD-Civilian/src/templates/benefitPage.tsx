/* eslint-disable react/no-array-index-key */
import React from 'react';
import MainLayout from '@layout/MainLayout';
import { graphql } from 'gatsby';
import { RichText, ExternalResources, BenefitLink, HowToClaim, SearchBar, BackButton, Accordion, Infographic } from '@components';
import ShareandPrintBar from '@components/SharePrintBar';

interface IProps {
  data: {
    squidex: {
      findBenefitpageContent: {
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
          relatedBenefits: [
            {
              id: string;
              flatData: {
                slug: string;
                name: string;
                parentCategory: [
                  {
                    id: string;
                    flatData: {
                      slug: string;
                    };
                  },
                ];
              };
            },
          ];

          componentLayout: [
            {
              richText: string;
              accordions: [
                {
                  id: string;
                },
              ];
              howtoclaim: [
                {
                  id: string;
                },
              ];
              infographics: [
                {
                  id: string;
                },
              ];
            },
          ];
        };
      };
    };
  };
  pageContext: {
    categoryName: string;
    categorySlug: string;
    benefitName: string;
    benefitSlug: string;
  };
}

const BenefitPage = ({ data, pageContext }: IProps) => {
  const { categoryName, categorySlug, benefitName, benefitSlug } = pageContext;
  const pagedata = data.squidex.findBenefitpageContent.flatData;
  const { relatedBenefits, otherresources, componentLayout } = pagedata;

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
      active: true,
    },
    {
      text: benefitName,
      slug: benefitSlug,
      active: false,
    },
  ];

  const getComponents = (type: { accordions: any; howtoclaim: any; richText?: any; infographics?: any }[]): JSX.Element[] => {
    const arr: JSX.Element[] = [];

    type.forEach((el: { accordions: any; howtoclaim: any; richText?: any; infographics?: any }, index: any) => {
      const { richText, accordions, howtoclaim, infographics } = el;
      if (richText && richText.length > 0) {
        arr.push(<RichText intro={false} key={`benefit-component-${index}-richText`} html={richText} />);
      }

      if (el.accordions && el.accordions.length > 0) {
        const accData = accordions[0].flatData;
        arr.push(<Accordion key={`benefit-component-${index}-${accordions[0].id}`} data={accData} />);
      }
      if (infographics && infographics.length > 0) {
        const infoData = infographics[0].flatData;
        arr.push(<Infographic key={`benefit-component-${index}-${infographics[0].id}`} data={infoData} />);
      }
      if (el.howtoclaim && el.howtoclaim.length > 0) {
        arr.push(<HowToClaim key={`benefit-component-${index}-${howtoclaim[0].id}`} data={howtoclaim} />);
      }
    });

    return arr;
  };

  return (
    <MainLayout breadcrumb={breadcrumb} data={pagedata}>
      {componentLayout && componentLayout.length > 0 && getComponents(componentLayout)}
      <ShareandPrintBar category={categoryName} benefit={benefitName} />
      {relatedBenefits && relatedBenefits.length > 0 && (
        <div className="mt-8 px-4 lg:px-0">
          <h3 className="text-3xl font-bold mb-3 tracking-tight line-height-1">Related Benefits</h3>
          <hr className="border-solid mb-5" />
          {relatedBenefits.map(benefit => {
            const { slug } = benefit.flatData.parentCategory[0].flatData;
            return <BenefitLink key={`category-benefit-link-${benefit.id}`} categorySlug={`/${slug}`} data={benefit.flatData} />;
          })}
        </div>
      )}
      {otherresources && otherresources.length > 0 && <ExternalResources data={otherresources} />}
      <div className="pt-4 lg:pt-0 pr-4 lg:pr-0">
        <BackButton text="Back to previous page" layout="inline" />
      </div>
      <SearchBar />
    </MainLayout>
  );
};

export default BenefitPage;

export const query = graphql`
  query getBenefitPage($id: String!) {
    squidex {
      findBenefitpageContent(id: $id) {
        flatData {
          metaTitle
          metaDescription
          metaImage
          name
          description
          headerImage {
            url
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
          relatedBenefits {
            id
            flatData {
              slug
              name
              parentCategory {
                flatData {
                  slug
                }
              }
            }
          }
          componentLayout {
            accordions {
              id
              flatData {
                content
                title
              }
            }
            howtoclaim {
              id
              flatData {
                name
                richText
                steps {
                  stepText
                }
              }
            }
            infographics {
              id
              flatData {
                mobileImage {
                  url
                }
                desktopImage {
                  url
                }
              }
            }
            richText
          }
        }
      }
    }
  }
`;
