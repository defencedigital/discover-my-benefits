import { action } from "@storybook/addon-actions";
import { DocsContainer, DocsPage } from "@storybook/addon-docs/blocks";
import { addDecorator, addParameters, configure } from "@storybook/react";
import React from 'react';
import GlobalStyles from "../src/global-style";


function withGlobalStyles(storyFn) {
  return (
    <React.Fragment>
      <GlobalStyles />
      {storyFn()}
    </React.Fragment>
  )
};

addDecorator(withGlobalStyles);

// automatically import all files ending in *.stories.js
configure(require.context("../src", true, /\.stories\.tsx$/), module)

addParameters({
  options: {
      enableShortcuts: false,
  },
  docs: {
      container: DocsContainer,
      page: DocsPage,
  },
});

// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
}
// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = ""
// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = pathname => {
  action("NavigateTo:")(pathname)
}