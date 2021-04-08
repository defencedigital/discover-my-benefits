import * as React from 'react';
import { Link } from 'gatsby';
import HomeIcon from '@svgs/home.svg';

const BreadcrumbItem = ({ text, slug, active, icon }: IBreadcrumbItemProps) => {
  const link = slug.includes('/') ? slug : `/${slug}`;

  return (
    <li className="px-2 py-3 box-dec-break inline-block w-auto right-inherit  font-bold last:font-normal flex flex-row items-center underline last:no-underline">
      {active && (
        <React.Fragment>
          <Link className="inline-block" to={link} data-ga-category="breadcrumb-item" data-ga-action="click" data-ga-label={text}>
            {icon === 'home' && (
              <span className="inline-block w-3 3 mr-2 h-2">
                <HomeIcon className="w-full text-white" />
              </span>
            )}
            <span>{text}</span>
            <span className="ml-3 breadcrumb-slash inline-block">/</span>
          </Link>
        </React.Fragment>
      )}
      {!active && <span>{text}</span>}
    </li>
  );
};

export default BreadcrumbItem;
