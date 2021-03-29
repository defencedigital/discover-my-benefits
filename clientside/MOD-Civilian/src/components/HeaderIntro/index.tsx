import * as React from 'react';
import FeaturedBenefit from '@components/FeaturedBenefit';
import { RichText, Alert } from '@components';

interface IHeaderIntroProps {
  title: string;
  subtitle: string;
  introTitle: string;
  description: string;
  featuredBenefit: IFeaturedBenefitProps;
}

const HeaderIntro = ({ title, subtitle, introTitle, description, featuredBenefit }: IHeaderIntroProps) => {
  const { featuredBenefitCaption, benefit, featuredBenefitTag } = featuredBenefit;
  return (
    <div className="mt-3 xs:mt-3 max-w-screen-lg flex flex-col justify-start mx-auto px-3 lg:px-0">
      {title && subtitle && (
        <h1 className="font-bold text-3xl md:text-4xl lg:text-6xl py-4 md:py-8 lg:py-10">
          <span className="px-3 lg:px-6 py-1 bg-primary box-dec-break text-white inline-block w-auto right-inherit lg:right-auto lg:inline">
            {title}
          </span>
          <span className="bg-secondary text-white font-bold tracking-tight px-3 lg:px-6 py-1 box-dec-break inline-block w-auto right-inherit lg:right-auto lg:inline">
            {subtitle}
          </span>
        </h1>
      )}
      <Alert />
      {introTitle && <h2 className="font-bold text-2xl lg:text-3xl tracking-tight line-height-1">{introTitle}</h2>}
      <div className="flex flex-col md:flex-row justify-evenly md:mt-6 lg:mt-8 mt-2">
        <div className="w-full md:w-1/2 md:pr-3 md:pb-0 pb-3 -mt-10">{description && <RichText intro html={description} />}</div>
        <div className="w-full md:w-1/2">
          {benefit && <FeaturedBenefit caption={featuredBenefitCaption || null} tag={featuredBenefitTag} benefit={benefit} />}
        </div>
      </div>
    </div>
  );
};

export default HeaderIntro;
