import React from 'react';
import { Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { chunk } from '../../utils/array';

import CrownIcon from '../../images/svg/crown.svg';

import ContainerInner from '../ContainerInner';
import { ServicePropType } from '../../containers/Services/propTypes';

const Footer = props => {
  const { history, items, service, hasContacts, hasCookies, hasTerms, hasAS } = props;
  const chunkedItems = chunk(items, Math.ceil(items.length / 2));
  return (
    <footer className="footer">
      <ContainerInner className="no-padding-lrg">
        <Row>
          {chunkedItems.map(c => (
            <Col key={Math.random()} xs="12" md="4">
              <Nav vertical>
                {c.map(item => (
                  <NavItem key={item.link} className="nav-item-lrg">
                    <NavLink
                      onClick={e => {
                        e.preventDefault();
                        history.push(item.link);
                      }}
                      href={item.link}
                    >
                      {item.text}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </Col>
          ))}
          <Col className="footer-col-last" xs="12" md="4">
            <Nav vertical>
              <NavItem className="nav-item-lrg">
                {hasAS && (
                  <NavLink
                    onClick={e => {
                      e.preventDefault();
                      history.push(`/${service.slug}/accessibility-statement`);
                    }}
                    href={`/${service.slug}/accessibility-statement`}
                  >
                    Accessibility statement
                  </NavLink>
                )}
                {hasCookies && (
                  <NavLink
                    onClick={e => {
                      e.preventDefault();
                      history.push(`/${service.slug}/cookies`);
                    }}
                    href={`/${service.slug}/cookies`}
                  >
                    Cookies
                  </NavLink>
                )}
                {hasContacts && (
                  <NavLink
                    onClick={e => {
                      e.preventDefault();
                      history.push(`/${service.slug}/contact-us`);
                    }}
                    href={`/${service.slug}/contact-us`}
                  >
                    Contact us
                  </NavLink>
                )}
                {hasTerms && (
                  <NavLink
                    onClick={e => {
                      e.preventDefault();
                      history.push(`/${service.slug}/terms-and-conditions`);
                    }}
                    href={`/${service.slug}/terms-and-conditions`}
                  >
                    Terms and conditions
                  </NavLink>
                )}
              </NavItem>
              <NavItem className="nav-item-logos">
                <span className="footer-crown-logo">
                  <CrownIcon />
                  <span className="nav-copyright">© Crown Copyright</span>
                </span>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      </ContainerInner>
    </footer>
  );
};

Footer.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  service: ServicePropType,
  hasTerms: PropTypes.any,
  hasAS: PropTypes.any,
  hasContacts: PropTypes.any,
  hasCookies: PropTypes.any,
};

export default withRouter(Footer);
