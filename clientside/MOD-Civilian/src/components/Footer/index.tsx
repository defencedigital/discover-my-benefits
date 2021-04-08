/* eslint-disable react/no-array-index-key */
import React from 'react';
import { graphql, useStaticQuery, Link, withPrefix } from 'gatsby';
import { chunk } from '@utils/helpers';
import CrownIcon from '@svgs/crown.svg';

const query = graphql`
  query getFooterinks {
    squidex {
      queryFooterContents {
        id
        flatData {
          categoryPageLinks {
            id
            flatData {
              name
              slug
            }
          }
          contentPageLinks {
            id
            flatData {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

const Footer = () => {
  const { squidex } = useStaticQuery(query);
  const { contentPageLinks, categoryPageLinks } = squidex.queryFooterContents[0].flatData;

  const chunkedItems = chunk(categoryPageLinks, Math.ceil(categoryPageLinks.length / 2));
  return (
    <footer className="bg-gray-200 w-screen">
      <div className="max-w-screen-lg flex flex-wrap mx-auto flex-row justify-between md:justify-around lg:justify-between pt-10 pb-5 px-3 lg:px-0 ">
        {chunkedItems.map((c: { id: string; flatData: { name: string; slug: string } }[], index: any) => (
          <nav className="w-1/3 lg:w-auto flex flew-row md:pr-6 lg:block relative last-child" key={`nav-footer-${index}`}>
            <ul>
              {c.map((item: { id: string; flatData: { name: string; slug: string } }) => (
                <li key={item.flatData.name}>
                  <Link
                    to={`/${item.flatData.slug}`}
                    className="underline"
                    data-ga-category="footer"
                    data-ga-action="click"
                    data-ga-label={item.flatData.name}
                    aria-label={item.flatData.name}
                  >
                    {item.flatData.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <span className="h-70% w-6 bg-gray-500 flex order-1 lg:hidden " />
        <div className="relative flex lg:flex-col mt-6 md:mt-0 lg:pl-6 w-full lg:w-auto justify-between items:start md:items-center lg:items-start md:justify-end">
          <span className="h-full absolute w-px bg-gray-500 left-0 top-0 bottom-0 hidden lg:block " />
          <nav className="flex md:w-auto lg:w-full flex-col">
            <ul className="flex md:w-full md:pl-12 lg:pl-0 lg:w-auto justify-end flex-col lg:flex-col md:flex-row sm:flex-col">
              {contentPageLinks.map((item: { id: string; flatData: { name: string; slug: string } }) => (
                <li className="md:pr-4" key={`footer-content-link-${item.id}`}>
                  <Link
                    to={`/${item.flatData.slug}`}
                    className="underline hover:text-primary"
                    data-ga-category="footer"
                    data-ga-action="click"
                    data-ga-label={item.flatData.name}
                    aria-label={item.flatData.name}
                  >
                    {item.flatData.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col w-1/2 md:w-auto lg:w-full md:flex-col justify-center items-end lg:pt-6 md:pt-5 my-auto ">
            <CrownIcon className="pr-2" />
            <p className="block my-auto text-xs">© Crown Copyright</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
