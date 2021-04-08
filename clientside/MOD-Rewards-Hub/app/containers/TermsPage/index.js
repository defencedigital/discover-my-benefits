/*
 * Content Page
 */

import React from 'react';
import { Row, Col } from 'reactstrap';

import { TermsPropType } from '../Terms/propTypes';
import { ServicePropType } from '../Services/propTypes';

import Breadcrumb from '../../components/Breadcrumb';
import Intro from '../../components/Intro';
import Page from '../../components/Page';
import ContainerInner from '../../components/ContainerInner';
import CopyCol from '../../components/CopyCol';

import { getServiceSlugFromService } from '../Services/helpers';

export class TermsPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

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
        text: 'Terms and conditions',
        slug: `/${getServiceSlugFromService(service)}/terms-and-conditions`,
        active: false,
        icon: 'grid',
      },
    ];
  }

  render() {
    const { service, terms } = this.props;

    return (
      <Page title={`Terms and conditions | ${service.name}`} service={service}>
        <ContainerInner className="container no-padding-lrg">
          <Row>
            <Col xs="12">
              <Breadcrumb items={this.getBreadcrumb()} />
              <Intro tagName="h1" title={terms.title} subtitle={terms.strapline} />
              <CopyCol content={terms.content} />
            </Col>
          </Row>
          <Row />
        </ContainerInner>
      </Page>
    );
  }
}

TermsPage.propTypes = {
  service: ServicePropType,
  terms: TermsPropType,
};

export default TermsPage;
