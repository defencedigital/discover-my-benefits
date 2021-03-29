import * as React from 'react';
import Card from '@components/Card';
import { Link } from 'gatsby';

export interface ICategoryCardsComponentProps {
  categories: ICategoryLandingpageProps[];
}

const CategoryCards = ({ categories }: ICategoryCardsComponentProps) => {
  return (
    <section className="w-full pt-12">
      <div className="flex items-center justify-between flex-row pb-4 px-4 lg:px-0">
        <h2 className="font-bold text-2xl">Browse Benefits</h2>
        <Link
          data-ga-category="Browse Benefits"
          data-ga-action="click"
          data-ga-label="view-all-benefits"
          className="underline text-primary hover:text-secondary"
          to="/all-benefits"
        >
          View all benefits
        </Link>
      </div>
      <div className="flex flex-wrap lg:-mx-4">
        {categories.map(category => {
          return <Card key={`cat-card-${category.id}`} data={category.flatData} />;
        })}
      </div>
    </section>
  );
};

export default CategoryCards;
