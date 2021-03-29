import { createGlobalStyle } from 'styled-components';
import tw from 'twin.macro';

import './tailwind.css';

export default createGlobalStyle`
  body {
    ${tw`font-body text-gray-900 flex flex-col justify-center items-center`};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-font-feature-settings: "pnum";
    overflow-x: hidden;
    font-feature-settings: "pnum";
    font-variant-numeric: proportional-nums;
  }

`;
