import React, { ReactNode, useState } from 'react';
import { Link } from 'gatsby';
import { UpdatesCounter } from '@components';
import CloseIcon from '@svgs/close.svg';
import ViewAllIcon from '@svgs/eye.svg';
import Logo from '@svgs/logo.svg';
import SearchIcon from '@svgs/search.svg';
import UpdatesIcon from '@svgs/updates.svg';

interface INav {
  children: ReactNode;
}

const Nav = ({ children }: INav) => {
  const [toggleClass, setToggleClass] = useState(false);

  return (
    <nav role="navigation" className="bg-white w-screen z-10 fixed top-0 justify-end items-center items-stretch border-b print:hidden">
      <ul className="w-screen flex flex-row min-h-full relative md:px-4">
        <li className="flex w-6/12 justify-start p-1 sm:p-2">
          <Link data-ga-category="header" aria-label="Home" data-ga-action="click" data-ga-label="Home" className="w-5/12 md:w-full" to="/">
            <Logo />
          </Link>
        </li>
        <li className="w-3/12 md:w-2/12 h-80px sm:h-100px ">
          <button
            type="button"
            className={`${
              toggleClass ? `bg-secondary text-white` : ``
            }  group h-full text-grey flex flex-col p-2 md:p-3 items-center justify-center hover:text-white hover:bg-secondary relative w-full text-center border-none focus:border-none focus:outline-none`}
            data-ga-category="header"
            data-ga-action="click"
            data-ga-label="Search"
            aria-label="Search"
            onClick={() => setToggleClass(prevState => !prevState)}
          >
            <span
              className={`h-70% my-auto border-gray absolute w-px left-0 group-hover:bg-secondary block top-10px ${
                toggleClass ? `bg-secondary` : ` bg-gray-400 `
              } `}
            />
            {!toggleClass && <SearchIcon className="md:mt-2 md:mx-auto" />}
            {toggleClass && <CloseIcon className="md:mt-3 md:mx-auto w-5" />}

            {!toggleClass && (
              <span className="mt-2 hidden sm:inline">
                Search
                <span className="hidden lg:inline "> Benefits</span>
              </span>
            )}
            {toggleClass && <span className="mt-2 hidden sm:inline">Close</span>}
            <span
              className={`h-70% my-auto border-gray absolute right-0 w-px  group-hover:bg-secondary block top-10px ${
                toggleClass ? `bg-secondary` : ` bg-gray-400 `
              } `}
            />
          </button>
        </li>
        <li className="w-3/12 md:w-2/12 h-80px sm:h-100px relative">
          <Link
            className="group h-full text-grey flex flex-col p-2 md:p-3 items-center justify-center hover:text-white hover:bg-secondary w-full text-center"
            data-ga-category="header"
            data-ga-action="click"
            data-ga-label="Updates"
            aria-label="Updates"
            to="/updates"
          >
            <UpdatesCounter />
            <UpdatesIcon className="md:mt-2" />
            <span className="mt-1 hidden sm:block">Updates</span>
            <span className="h-70% my-auto border-gray absolute right-0 w-px bg-gray-400 group-hover:bg-secondary block top-10px" />
          </Link>
        </li>
        <li className="w-3/12 md:w-2/12 h-80px sm:h-100px">
          <Link
            className="group h-full text-grey flex flex-col p-2 md:p-3 items-center justify-center hover:text-white hover:bg-secondary relative w-full text-center "
            data-ga-category="header"
            data-ga-action="click"
            data-ga-label="View All"
            aria-label="View All"
            to="/all-benefits"
          >
            <ViewAllIcon className="md:mt-2" />
            <span className="mt-3 hidden sm:block">View all</span>
            <span className="h-70% my-auto border-gray absolute right-0 w-px bg-gray-400 group-hover:bg-secondary hidden md:block top-10px" />
          </Link>
        </li>
      </ul>
      <ul className={`${toggleClass ? `block transition-all ` : `hidden`}  w-full`}>
        <li>{children}</li>
      </ul>
    </nav>
  );
};

export default Nav;
