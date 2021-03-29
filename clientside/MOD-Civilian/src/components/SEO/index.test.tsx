import React from 'react';
import renderer from 'react-test-renderer';
import { StaticQuery } from '../../../__mocks__/gatsby.js';
import SEO from './index';

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      site: {
        siteMetadata: {
          title: `Default Starter`,
        },
      },
    }),
  );
});

describe('SEO', () => {
  const data = {
    site: {
      siteMetadata: {
        title: 'Test Site Title',
        description: 'Lorem ipsum',
      },
    },
  };
  it('renders correctly', () => {
    const tree = renderer.create(<SEO title={data.site.siteMetadata.title} description={data.site.siteMetadata.description} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
