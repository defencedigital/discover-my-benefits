/*
 * Content Page
 */

import React from 'react';
import { Row, Col } from 'reactstrap';

import { ContactsPropType } from '../Contact/propTypes';
import { ServicePropType } from '../Services/propTypes';

import Breadcrumb from '../../components/Breadcrumb';
import Intro from '../../components/Intro';
import Page from '../../components/Page';
import ContainerInner from '../../components/ContainerInner';
import CopyCol from '../../components/CopyCol';

import { getServiceSlugFromService } from '../Services/helpers';

export class ContactPage extends React.PureComponent {
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
        text: 'Contact us',
        slug: `/${getServiceSlugFromService(service)}/contact-us`,
        active: false,
        icon: 'grid',
      },
    ];
  }

  render() {
    const { service, contacts } = this.props;

    return (
      <Page title={`Contact us | ${service.name}`} service={service} description={contacts.strapline}>
        <ContainerInner class="container no-padding-lrg">
          <Row>
            <Col xs="12">
              <Breadcrumb items={this.getBreadcrumb()} />
              <Intro tagName="h1" title={contacts.title} subtitle={contacts.strapline} />
              <CopyCol content={contacts.content} />
            </Col>
          </Row>
          <Row />
        </ContainerInner>
      </Page>
    );
  }
}

ContactPage.propTypes = {
  service: ServicePropType,
  contacts: ContactsPropType,
};

export default ContactPage;
