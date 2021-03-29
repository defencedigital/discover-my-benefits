const path = require("path");
const pathToInlineSvg = path.resolve(__dirname, "../src/assets/svgs");


module.exports = ({ config }) => {
  // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
  config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]

  // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
  config.module.rules[0].use[0].loader = require.resolve("babel-loader")

  // use @babel/preset-react for JSX and env (instead of staged presets)
  config.module.rules[0].use[0].options.presets = [
    require.resolve("@babel/preset-react"),
    require.resolve("@babel/preset-env"),
  ]

  config.module.rules[0].use[0].options.plugins = [
    // use @babel/plugin-proposal-class-properties for class arrow functions
    require.resolve("@babel/plugin-proposal-class-properties"),
    // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
    require.resolve("babel-plugin-remove-graphql-queries"),
  ]

  // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
  config.resolve.mainFields = ["browser", "module", "main"]



   config.module.rules.push({
    test: /\.css$/,
    use: [
      // Loader for webpack to process CSS with PostCSS
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          config: {
            path: './.storybook/',
          },
        },
      },
    ],

    include: path.resolve(__dirname, '../'),
  });

  const fileLoaderRule = config.module.rules.find((rule) => rule.test.test(".svg"))
  fileLoaderRule.exclude = pathToInlineSvg
  config.module.rules.push({
    test: /\.svg$/,
    include: pathToInlineSvg,
    use: [
      {
        loader: "svg-react-loader",
        options: {
          icon: true,
        },
      },
    ],
  });

    config.module.rules.push({
     test: /\.(ts|tsx)$/,
     loader: require.resolve('babel-loader'),
     options: {
       presets: [['react-app', {flow: false, typescript: true}]],
       plugins: [
         require.resolve('@babel/plugin-proposal-class-properties'),
         // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
         require.resolve('babel-plugin-remove-graphql-queries'),
         require.resolve('babel-plugin-macros'),
         require.resolve('@babel/plugin-syntax-object-rest-spread'),
         'emotion',
       ],
     },
   });

  config.module.rules[0].use[0].options.presets = [
    require.resolve('@babel/preset-react'),
    [
      '@babel/preset-env',
      {
        corejs: 2,
      },
    ],
    require.resolve('@babel/preset-typescript'),
  ]



  config.resolve.alias = {
    "@components": path.resolve(__dirname, "../src/components"),
    "@utils": path.resolve(__dirname, "../src/utils"),
    "@utils/*": path.resolve(__dirname, "../src/utils/*"),
    "@pages": path.resolve(__dirname, "../src/pages"),
    "@root": path.resolve(__dirname, "../src/"),
    "@layout": path.resolve(__dirname, "../src/layout"),
    "@images": path.resolve(__dirname, "../src/images"),
    "@svgs": path.resolve(__dirname, "../src/assets/svgs"),
  }

  config.resolve.extensions.push('.ts', '.tsx');
  return config
}