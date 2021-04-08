const config = require(`./config.json`);
const path = require('path');

const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';
console.log(`Using environment config: '${activeEnv}'`);

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

const { CLIENT_ID } = config.env.secrets;
const { CLIENT_SECRET } = config.env.secrets;

if (CLIENT_ID === '#{environment.clientid}#' || CLIENT_SECRET === '#{environment.clientsecret}#') {
  throw new Error('Client secrets have not been replaced!');
}

require('es6-promise').polyfill();
require('isomorphic-fetch');

const crypto = require('crypto');

const { credCache, getSquidexData, getToken, SchemaURL } = require('./src/utils/api');

exports.onPreInit = async () => {
  const data = await getToken({
    CLIENT_ID,
    CLIENT_SECRET,
  });
  credCache.set('token', `${data.token_type} ${data.access_token}`);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const contentPage = path.resolve(`src/templates/contentPage.tsx`);
  const categoryPage = path.resolve(`src/templates/categoryPage.tsx`);
  const benefitPage = path.resolve(`src/templates/benefitPage.tsx`);
  const result = await graphql(
    `
      query GetPages {
        squidex {
          queryCategorypageContents {
            id
            flatData {
              slug
              name
              subcategorisedBenefits {
                name
                benefits {
                  id
                  flatData {
                    name
                    slug
                    shortIntro
                  }
                }
              }
              popularBenefits {
                id
                flatData {
                  slug
                  name
                }
              }
              uncategorisedBenefits {
                id
                flatData {
                  slug
                  name
                }
              }
            }
          }
          queryLandingpageContents {
            id
            flatData {
              benefit {
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
            }
          }
          queryContentpageContents {
            id
            flatData {
              slug
            }
          }
          queryBenefitpageContents {
            id
            flatData {
              parentCategory {
                flatData {
                  slug
                  name
                }
              }
              slug
              name
            }
          }
        }
      }
    `,
  );
  if (result.errors) {
    throw result.errors;
  }

  // build all content pages
  result.data.squidex.queryContentpageContents.forEach(page => {
    createPage({
      path: `/${page.flatData.slug}`,
      component: contentPage,
      context: {
        id: page.id,
      },
    });
  });

  // build the featured benefit page
  result.data.squidex.queryLandingpageContents.forEach(page => {
    const FeaturedBenefitName = page.flatData.benefit[0].flatData.name;
    const FeaturedBenefitSlug = page.flatData.benefit[0].flatData.slug;

    if (page.flatData.benefit[0].flatData.parentCategory) {
      page.flatData.benefit[0].flatData.parentCategory.forEach(cat => {
        const CategorySlug = cat.flatData.slug;
        const CategoryName = cat.flatData.name;
        const PagePath = `/${CategorySlug}/${FeaturedBenefitSlug}`;
        createPage({
          path: PagePath,
          component: benefitPage,
          context: {
            id: page.id,
            categoryName: CategoryName,
            categorySlug: CategorySlug,
            benefitName: FeaturedBenefitName,
            benefitSlug: FeaturedBenefitSlug,
          },
        });
      });
    }
  });
  result.data.squidex.queryBenefitpageContents.forEach(page => {
    const BenefitSlug = page.flatData.slug;
    const BenefitName = page.flatData.name;
    const BenefitID = page.id;
    if (page.flatData.parentCategory) {
      page.flatData.parentCategory.forEach(cat => {
        const CategorySlug = cat.flatData.slug;
        const CategoryName = cat.flatData.name;
        const PagePath = `${CategorySlug}/${BenefitSlug}`;
        createPage({
          path: PagePath,
          component: benefitPage,
          context: {
            id: BenefitID,
            categoryName: CategoryName,
            categorySlug: CategorySlug,
            benefitName: BenefitName,
            benefitSlug: BenefitSlug,
          },
        });
      });
    }
  });
  result.data.squidex.queryCategorypageContents.forEach(page => {
    const CategorySlug = `/${page.flatData.slug}`;
    const CategoryName = page.flatData.name;
    const AllBenefits = [];
    createPage({
      path: CategorySlug,
      component: categoryPage,
      context: {
        id: page.id,
        categoryName: CategoryName,
        categorySlug: CategorySlug,
      },
    });
    if (page.flatData.subcategorisedBenefits) {
      page.flatData.subcategorisedBenefits.forEach(cat => {
        if (cat.benefits) {
          const catBenefits = cat.benefits;
          AllBenefits.push(catBenefits);
        }
      });
    }
    if (page.flatData.popularBenefits) {
      const popBenefits = page.flatData.popularBenefits;
      AllBenefits.push(popBenefits);
    }
    if (page.flatData.uncategorisedBenefits) {
      const uncatBenefits = page.flatData.uncategorisedBenefits;
      AllBenefits.push(uncatBenefits);
    }

    if (AllBenefits.length > 0) {
      const flattenArray = AllBenefits.reduce((acc, val) => acc.concat(val), []);
      flattenArray.forEach(benefit => {
        const BenefitSlug = benefit.flatData.slug;
        const BenefitName = benefit.flatData.name;
        const PagePath = `${CategorySlug}/${BenefitSlug}`;
        createPage({
          path: PagePath,
          component: benefitPage,
          context: {
            id: benefit.id,
            categoryName: CategoryName,
            categorySlug: CategorySlug,
            benefitName: BenefitName,
            benefitSlug: BenefitSlug,
          },
        });
      });
    }
  });
};

// Resolve webpack path alias's
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, `${process.env.ROOT_DIR}/components/`),
        '@utils': path.resolve(__dirname, `${process.env.ROOT_DIR}/utils/`),
        '@layout': path.resolve(__dirname, `${process.env.ROOT_DIR}/layout/`),
        '@graphql': path.resolve(__dirname, `${process.env.ROOT_DIR}/graphql/fragments`),
        '@svgs': path.resolve(__dirname, `${process.env.ROOT_DIR}/assets/svgs/`),
        '@pages': path.resolve(__dirname, `${process.env.ROOT_DIR}/pages/`),
        '@reducers': path.resolve(__dirname, `${process.env.ROOT_DIR}/reducers/`),
        '@root': path.resolve(__dirname, `${process.env.ROOT_DIR}/`),
        '@styles': path.resolve(__dirname, `${process.env.ROOT_DIR}/styles/`),
      },
    },
  });
};
