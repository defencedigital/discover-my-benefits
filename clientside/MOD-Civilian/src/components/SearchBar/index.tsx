import React, { ReactNode } from 'react';
import { Search } from '@components';

export default function SearchBar() {
  return (
    <div className="flex flex-col md:flex-row flex-no-wrap items-stretch w-full mt-8 px-4 md:px-0">
      <div className="flex flex-col self-stretch md:w-1/2 bg-primary p-6">
        <h3 className="text-white text-lg font-bold">Can&#39;t find what you&#39;re looking for?</h3>
      </div>
      <div className="flex flex-col self-stretch md:w-1/2 bg-search-icon">
        <Search />
      </div>
    </div>
  );
}
