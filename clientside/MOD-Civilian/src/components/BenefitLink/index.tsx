import React from 'react';
import { Link } from 'gatsby';
import ChevronIcon from '@svgs/chevron-right.svg';

interface IBenefitLinkProps {
  data: {
    name: string;
    slug: string;
    shortIntro: string;
    parentCategory: [
      {
        shortIntro: string;
        slug: string;
      },
    ];
  };
  categorySlug?: string;
}

const BenefitLink = ({ data, categorySlug }: IBenefitLinkProps) => {
  const { slug, name, shortIntro } = data;
  const link = categorySlug ? `/${categorySlug}/${slug}` : `/${slug}`;
  const correctedLink = link.indexOf('/') === 0 ? link.substring(1) : link;

  return (
    <React.Fragment>
      <Link className="text-primary group" to={correctedLink}>
        <h4 className="text-xl font-bold block group-hover:underline hover:underline">
          {name}
          <span className="inline-block w-2 h-3">
            <ChevronIcon className="ml-3" />
          </span>
        </h4>
        <p className="text-black">{shortIntro}</p>
      </Link>
      <hr className="border-solid my-5" />
    </React.Fragment>
  );
};

export default BenefitLink;
