import * as React from 'react';
import ChevronIcon from '@svgs/chevron-right.svg';
import PdfIcon from '@svgs/pdf.svg';
import ExternalLinkIcon from '@svgs/external-link.svg';

export interface IResourceCardComponentProps {
  data: {
    name: string;
    description: string;
    link: string;
    icon: number;
  };
}

function ResourceCard({ data }: IResourceCardComponentProps) {
  const { link, name, description, icon } = data;

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 lg:px-6 mb-4">
      <div className="bg-gray-200 overflow-hidden flex-1 flex flex-col h-full justify-start p-6 pb-10">
        <div className="h-full flex flex-col justify-between">
          <a
            data-ga-category="category-card-title-a"
            data-ga-action="click"
            data-ga-label={name}
            className="hover:underline hover:text-primary"
            href={link}
            target="_blank"
          >
            <div className="w-8 flex flex-col justify-center h-60px mb-2">
              {icon === 1 && <PdfIcon />}
              {icon === 2 && <ExternalLinkIcon />}
            </div>
            <h3 className="font-bold text-lg pb-2 max-w-xs">
              {name}
              <ChevronIcon className="ml-2 inline-flex" />
            </h3>
            {description && <p>{description}</p>}
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResourceCard;
