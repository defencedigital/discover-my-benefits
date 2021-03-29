import * as React from 'react';
import { ResourceCard } from '@components';

export interface IExternalResourcesProps {
  data: [
    {
      id: string;
      flatData: {
        description: string;
        icon: number;
        link: string;
        name: string;
      };
    },
  ];
}

export default function ExternalResources({ data }: IExternalResourcesProps) {
  return (
    <React.Fragment>
      {data.length > 0 && (
        <section className="px-4 lg:px-0">
          <h3 className="text-3xl font-bold mb-5 tracking-tight line-height-1">Other Resources</h3>
          <div className="flex flex-wrap lg:-mx-6">
            {data.map(
              (resource: {
                id: string;
                flatData: {
                  name: string;
                  description: string;
                  link: string;
                  icon: number;
                };
              }) => {
                return <ResourceCard key={`cat-card-${resource.id}`} data={resource.flatData} />;
              },
            )}
          </div>
        </section>
      )}
    </React.Fragment>
  );
}
