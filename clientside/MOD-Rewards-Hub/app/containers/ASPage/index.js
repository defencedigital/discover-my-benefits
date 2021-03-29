/*
 * Content Page for Accessibility Statement
 */

import React from 'react';
import { Row, Col } from 'reactstrap';

import { ASPropType } from '../AS/propTypes';
import { ServicePropType } from '../Services/propTypes';

import Breadcrumb from '../../components/Breadcrumb';
import Intro from '../../components/Intro';
import Page from '../../components/Page';
import ContainerInner from '../../components/ContainerInner';
import CopyCol from '../../components/CopyCol';

import { getServiceSlugFromService } from '../Services/helpers';

export class ASPage extends React.PureComponent {
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
        text: 'Accessibility statement',
        slug: `/${getServiceSlugFromService(service)}/accessibility-statement`,
        active: false,
        icon: 'grid',
      },
    ];
  }

  render() {
    const { service, as } = this.props;

    return (
      <Page title={`Accessibility statement | ${service.name}`} service={service} description={as.strapline}>
        <ContainerInner className="container no-padding-lrg">
          <Row>
            <Col xs="12">
              <Breadcrumb items={this.getBreadcrumb()} />
              <Intro tagName="h1" title={as.title} subtitle={as.strapline} />
              <CopyCol content={as.content} />
            </Col>
          </Row>
          <Row />
        </ContainerInner>
      </Page>
    );
  }
}

ASPage.propTypes = {
  service: ServicePropType,
  as: ASPropType,
};

export default ASPage;
