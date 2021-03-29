import React from 'react';
import { BenefitLink } from '@components';

const Subcategories = ({ data }) => {
  const { subcategorisedBenefits, slug } = data;
  return (
    <div className="mt-8 md:px-4 lg:px-0">
      {subcategorisedBenefits.length > 0 &&
        subcategorisedBenefits.map((item: { name: string; benefits: [] }) => {
          const { name, benefits } = item;
          return (
            <React.Fragment key={`subcat-${name}`}>
              <h3 className="text-3xl font-bold mb-3 tracking-tight line-height-1">{name}</h3>
              <hr className="border-solid mb-5" />
              {benefits.length > 0 &&
                benefits.map((benefitItem: { flatData: any; id: string }) => {
                  const benefitData = benefitItem.flatData;
                  return <BenefitLink key={`subcat-${benefitItem.id}`} data={benefitData} />;
                })}
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default Subcategories;
