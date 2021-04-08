import * as React from 'react';
import { Link, withPrefix } from 'gatsby';

export interface ICardComponentProps {
  data: {
    name: string;
    slug: string;
    headerImage: [
      {
        url: string;
      },
    ];
    popularBenefits: [
      {
        flatData: {
          name: string;
          slug: string;
        };
        id: string;
      },
    ];
  };
}

const PopularBenefitList = ({ url, benefits }) => {
  return (
    <div className="flex flex-col justify-start flex-grow">
      <h4 className="font-bold pb-1">Popular Benefits:</h4>
      {benefits.map(item => {
        return (
          <Link
            data-ga-category="category-card-popular-benefit-link"
            data-ga-action="click"
            data-ga-label={item.flatData.name}
            className="underline text-sm pb-1 hover:text-primary"
            key={item.id}
            to={`/${url}/${item.flatData.slug}`}
          >
            {item.flatData.name}
          </Link>
        );
      })}
    </div>
  );
};

function Card({ data }: ICardComponentProps) {
  const { slug, name, headerImage, popularBenefits } = data;
  const { url } = headerImage[0];

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-4">
      <div className="rounded border-solid border border-gray-300 overflow-hidden flex-1 flex flex-col h-full justify-start">
        <Link to={`/${slug}`} data-ga-category="category-card" data-ga-action="click" data-ga-label={name} className="w-full">
          <picture className="w-full object-cover print:hidden">
            <source srcSet={`${url}&width=300`} type="" />
            <img className="w-full object-cover h-full" src={`${url}&width=300`} alt={name} />
          </picture>
        </Link>
        <div className="p-2 h-full flex flex-col justify-start">
          <Link
            data-ga-category="category-card-title-link"
            data-ga-action="click"
            data-ga-label={name}
            className="hover:underline hover:text-primary"
            to={`/${slug}`}
          >
            <h3 className="font-bold text-xl pb-2 underline">{name}</h3>
          </Link>
          {popularBenefits && <PopularBenefitList url={slug} benefits={popularBenefits} />}
          <Link
            data-ga-category="category-card-more-link"
            data-ga-action="click"
            data-ga-label={name}
            className="underline text-primary hover:text-secondary flex pt-3 text-sm "
            to={`/${slug}`}
            aria-label={`See more links under ${name}`}
          >
            more...
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
