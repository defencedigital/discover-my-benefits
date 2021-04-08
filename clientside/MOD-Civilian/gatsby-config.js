/* eslint-disable global-require */
const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('./tailwind.config.js');
const config = require('./config.json');

const { CLIENT_ID } = config.env.secrets;
const { CLIENT_SECRET } = config.env.secrets;
const { getToken } = require('./src/utils/api');

const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';

// eslint-disable-next-line no-console
console.log(`Using environment config: '${activeEnv}'`);

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

const fullConfig = resolveConfig(tailwindConfig);

module.exports = {
  siteMetadata: {
    title: `MOD Civilian`,
    titleTemplate: `Civilian Discover My Benefits`,
    description: `When you work for MOD, you’re entitled to more than you think. Yes, we offer all the usual benefits you’ve come to expect. But there’s also some you won’t find anywhere else. From financial allowances that improve your bank balance, to lifestyle schemes that improve your work/life balance.

    Use this site to discover which benefits suit you and start making the most of them.`,
    author: `Greatstate`,
    url: `${process.env.SITE_URL}`, // No trailing slash allowed!
    image: '/src/assets/images/civ.jpg', // Path to your image you placed in the 'static' folder
    oneTrust: `${process.env.ONE_TRUST}`,
  },
  pathPrefix: '/civilian',
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-eslint`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `MOD Civilian`,
        short_name: `MOD-Civ`,
        start_url: `/`,
        background_color: fullConfig.theme.colors.primary,
        theme_color: fullConfig.theme.colors.primary,
        display: `minimal-ui`,
        icon: `src/assets/favicons/favicon-96x96.png`,
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'Squidex',
        fieldName: 'squidex',
        url: `${process.env.CONTENT_URI}`,
        // HTTP headers alternatively accepts a function (allows async)
        headers: async () => {
          return {
            Authorization: await getToken({
              CLIENT_ID,
              CLIENT_SECRET,
            }),
          };
        },
        // Additional options to pass to node-fetch
        fetchOptions: {},
      },
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          require(`tailwindcss`)(tailwindConfig),
          require(`autoprefixer`),
          ...(process.env.NODE_ENV === `production` ? [require(`cssnano`)] : []),
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Open Sans:300,400,600,700`],
        display: 'swap',
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /svgs/,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-P5ZJCTS',

        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        defaultDataLayer: { platform: 'gatsby' },

        // Specify optional GTM environment details.
        // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",

        // Name of the event that is triggered
        // on every Gatsby route change.
        //
        // Defaults to gatsby-route-change
        routeChangeEventName: 'MOD_CIVILIAN_ROUTE_CHANGE',
      },
    },
  ],
};
