import React from 'react';
import Select from 'react-select';
import { graphql, useStaticQuery, navigate } from 'gatsby';
import { getAllUsedBenefits } from '@utils/helpers';

const query = graphql`
  query getSearchBenefits {
    squidex {
      queryLandingpageContents {
        id
        flatData {
          categories {
            id
            flatData {
              shortIntro
              name
              slug
              popularBenefits {
                flatData {
                  name
                  slug
                  shortIntro
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
                benefits {
                  flatData {
                    name
                    slug
                    shortIntro
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

const getoptions = (benefits: [IBenefits], categories: any[]) => {
  const Benefitdata = benefits.map(benefit => {
    const { name, slug, shortIntro } = benefit.flatData;

    const categorySlug = benefit.flatData.parentCategory[0].flatData.slug;
    const label = shortIntro ? `${name} | ${shortIntro}` : `${name}`;
    return Object.assign({
      value: `/${categorySlug}/${slug}`,
      label,
    });
  });
  const Categorydata = categories.map((category: { flatData: { slug: any; name: any } }, index: any) => {
    const { slug, name } = category.flatData;
    return Object.assign({
      value: `${slug}`,
      label: `${name}`,
    });
  });
  return [...Benefitdata, ...Categorydata];
};

const handleChange = (e: { value: any }) => {
  const { value } = e;
  navigate(value);
};

const Search = () => {
  const { squidex } = useStaticQuery(query);
  const { categories } = squidex.queryLandingpageContents[0].flatData;
  const benefits = getAllUsedBenefits(categories);

  const options = getoptions(benefits, categories);
  return (
    <div className="bg-secondary p-2 h-16 h-full">
      <Select
        className="searchable-dropdown max-w-1110 h-full m-auto"
        classNamePrefix="searchable-dropdown"
        onChange={handleChange}
        options={options}
        isSearchable
        placeholder="Search Benefits &amp; Categories"
      />
    </div>
  );
};

export default Search;
