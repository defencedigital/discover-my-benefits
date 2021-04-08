import React, { ReactNode } from 'react';
import { Nav, Search, BetaSurvey } from '@components';

interface IHeaderProps {
  children: ReactNode;
}

const Header = ({ children }: IHeaderProps) => {
  return (
    <header className="w-screen ">
      <Nav>
        <Search />
      </Nav>
      <BetaSurvey />
      {children}
    </header>
  );
};

export default Header;
