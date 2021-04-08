import * as React from 'react';
import { Link, withPrefix } from 'gatsby';

export interface IFeaturedBenefitComponentProps {
  tag: string;
  caption: string;
  benefit: IBenefitProps[];
}

const FeaturedBenefit = ({ benefit, tag, caption }: IFeaturedBenefitComponentProps) => {
  const { slug, name, headerImage, parentCategory } = benefit[0].flatData;
  const catSlug = parentCategory[0].flatData.slug;

  return (
    <Link
      to={`/${catSlug}/${slug}`}
      className="w-full justify-between relative flex flex-row"
      data-ga-category="featured-Benefit"
      data-ga-action="click"
      data-ga-label={name}
    >
      <picture className="w-full object-cover masthead-img print:hidden">
        <source srcSet={`${headerImage[0].url}`} type="" />
        <img className="w-full object-cover h-full" src={`${headerImage[0].url}`} alt={name} />
      </picture>
      {tag && <p className="absolute top-0 right-0 bg-primary  text-white block py-1 px-2 font-bold">{tag}</p>}
      {caption && (
        <div className="absolute left-0 bottom-0 w-full block bg-black bg-opacity-75 p-3">
          <h3 className="text-white text-lg font-bold max-w-sm">{caption}</h3>
        </div>
      )}
    </Link>
  );
};

export default FeaturedBenefit;
