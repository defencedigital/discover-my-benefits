/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { APP_NAME } from '../App/constants';

// This page will move to static html page in deployment so tried to use static html and css so it can be easily ported to new repo with html/css/images

const HomePage = () => (
  <div>
    <title>{APP_NAME}</title>

    <ul>
      <li>
        <a href="/royal-navy">Royal Navy</a>
      </li>
      <li>
        <a href="/army">Army</a>
      </li>
      <li>
        <a href="/raf">Raf</a>
      </li>
      <li>
        <a href="/royal-marines">Marines</a>
      </li>
    </ul>
  </div>
);

export default HomePage;
