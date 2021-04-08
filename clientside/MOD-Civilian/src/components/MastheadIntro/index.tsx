import * as React from 'react';

interface IMastheadIntroProps {
  name: string;
  image: string;
  description: string;
}

const MastheadIntro = ({ name, image, description }: IMastheadIntroProps) => (
  <div className="max-w-screen-lg flex flex-col md:flex-row justify-start mx-auto px-3 lg:px-0">
    <React.Fragment>
      <div className={`${image && 'md:w-1/2'} bg-secondary text-white w-full p-6`}>
        <h1 className="font-bold text-5xl leading-tight">{name}</h1>
        <h2 className="text-2xl font-semibold mt-2">{description}</h2>
      </div>
      {image && (
        <div className="md:w-1/2 w-full ">
          <picture className="w-full object-cover h-full print:hidden">
            <source srcSet={image} />
            <img className="w-full object-cover h-full" src={image} alt={name} />
          </picture>
        </div>
      )}
    </React.Fragment>
  </div>
);
export default MastheadIntro;
