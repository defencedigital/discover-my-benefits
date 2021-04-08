import React from 'react';

interface IInfographicProps {
  data: {
    mobileImage: [
      {
        url: string;
      },
    ];
    desktopImage: [
      {
        url: string;
      },
    ];
    alttext: string;
  };
}

const Infographic = ({ data }: IInfographicProps) => {
  const { mobileImage, desktopImage, alttext } = data;
  const mobileURl = mobileImage[0].url;
  const desktopURl = desktopImage[0].url;
  return (
    <React.Fragment>
      <picture className="w-full mb-6 block">
        <source media="(max-width: 649px)" srcSet={`${mobileURl}`} />
        <source media="(min-width: 650px)" srcSet={`${desktopURl}`} />
        <img className="w-full" src={`${desktopURl}`} alt={`${alttext}`} />
      </picture>
    </React.Fragment>
  );
};

export default Infographic;
