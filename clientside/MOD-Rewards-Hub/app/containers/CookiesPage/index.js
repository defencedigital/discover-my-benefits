/*
 * Content Page
 */

import React from 'react';
import { Row, Col } from 'reactstrap';

import { CookiesPropType } from '../Cookies/propTypes';
import { ServicePropType } from '../Services/propTypes';

import Breadcrumb from '../../components/Breadcrumb';
import Intro from '../../components/Intro';
import Page from '../../components/Page';
import ContainerInner from '../../components/ContainerInner';
import CopyCol from '../../components/CopyCol';

import { getServiceSlugFromService } from '../Services/helpers';

export class CookiePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    window.dataLayer.push({ event: 'pageview' });
  }

  getBreadcrumb() {
    const { service } = this.props;
    return [
      {
        text: 'Home',
        slug: `/${getServiceSlugFromService(service)}`,
        active: true,
        icon: 'home',
      },
      {
        text: 'Cookies',
        slug: `/${getServiceSlugFromService(service)}/Cookies`,
        active: false,
        icon: 'grid',
      },
    ];
  }

  render() {
    const { service, cookies } = this.props;

    return (
      <Page title={`Cookies | ${service.name}`} service={service} description={cookies.strapline}>
        <ContainerInner class="container no-padding-lrg">
          <Row>
            <Col xs="12">
              <Breadcrumb items={this.getBreadcrumb()} />
              <Intro tagName="h1" title={cookies.title} subtitle={cookies.strapline} />
              <CopyCol content={cookies.content} />
            </Col>
          </Row>
          <Row />
        </ContainerInner>
      </Page>
    );
  }
}

CookiePage.propTypes = {
  service: ServicePropType,
  cookies: CookiesPropType,
};

export default CookiePage;
