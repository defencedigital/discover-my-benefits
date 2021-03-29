import * as React from 'react';
import { BreadcrumbItem, BackButton } from '@components';

interface IBreadcrumbProps {
  items: IBreadcrumbItemProps[];
}

const Breadcrumb = ({ items }: IBreadcrumbProps) => {
  return (
    <React.Fragment>
      <nav className="breadcrumb mt-3 xs:mt-3 py-10 max-w-screen-lg flex flex-wrap lg:flex-no-wrap items-stretch mx-auto px-3 lg:px-0 justify-between">
        <ol className="flex flex-row px-2 bg-primary text-white flex-wrap h-full items-stretch">
          {items.length > 0 &&
            items.map((item, index) => (
              <BreadcrumbItem
                key={`${item.text} ${item.slug ? item.slug : ''}`}
                text={item.text}
                active={!!item.active}
                slug={item.slug ? item.slug : null}
                icon={item.icon ? item.icon : null}
              />
            ))}
        </ol>
        <BackButton text="Back" />
      </nav>
    </React.Fragment>
  );
};

export default Breadcrumb;
