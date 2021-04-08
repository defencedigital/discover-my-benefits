/*
 * FAM
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { toJS } from '../../components/HOC/ToJS';

import Intro from '../../components/Intro';
import Card from '../../components/Card';
import Page from '../../components/Page';
import ContainerInner from '../../components/ContainerInner';
import Breadcrumb from '../../components/Breadcrumb';
import ExploreCta from '../../components/ExploreCta';

import { ServicePropType } from '../Services/propTypes';
import { makeSelectSubAppById } from '../SubApps/selectors';
import { SubAppPropType } from '../SubApps/propTypes';
import { CategoryPropType } from '../Categories/propTypes';
import { makeSelectFam } from './selectors';
import { FamPropType } from './propTypes';
import { makeSelectMultipleBenefitsById } from '../Benefits/selectors';
import { BenefitPropType } from '../Benefits/propTypes';
import { getServiceSlugFromService } from '../Services/helpers';

import DepositAdvanceBlock from './DepositAdvanceBlock';
import RentalAdvanceBlock from './RentalAdvanceBlock';

export class FAM extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  getBreadcrumb() {
    const { service, category, fam } = this.props;

    return [
      {
        text: 'Home',
        slug: `/${getServiceSlugFromService(service)}`,
        active: true,
        icon: 'grid',
      },
      {
        text: category.name,
        slug: `/${getServiceSlugFromService(service)}/${category.slug}`,
        active: true,
        icon: 'home',
      },
      {
        text: fam.title,
        active: false,
      },
    ];
  }

  render() {
    const { service, match, fam, theFAM, links } = this.props;
    const { title } = fam;

    return (
      <div>
        <Page title={`${title} | ${service.name}`} service={service} description={theFAM.exploreDescription}>
          <ContainerInner className="no-padding-lrg">
            <Row>
              <Col xs="12">
                <Breadcrumb items={this.getBreadcrumb()} />
                <Intro title={theFAM.exploreIntro} tagName="h1" text={theFAM.exploreDescription} />
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <ExploreCta
                  title={theFAM.exploreCtaIntro}
                  desc={theFAM.exploreCtaDescription}
                  buttonText={theFAM.exploreCtaIntro}
                  link={`${match.url}/eligibility`}
                />
              </Col>
            </Row>
            <Row>
              {links[0] && (
                <Col xs="12" md="6" lg="3" style={{ marginBottom: '28px' }}>
                  <Card link={`${links[0].slug}`} title={links[0].title} text={links[0].strapline} />
                </Col>
              )}
              {links[1] && (
                <Col xs="12" md="6" lg="3" style={{ marginBottom: '28px' }}>
                  <Card link={`${links[1].slug}`} title={links[1].title} text={links[1].strapline} />
                </Col>
              )}
              <DepositAdvanceBlock url={match.url} />
              <RentalAdvanceBlock url={match.url} />
              {links.map((l, index) => {
                if (index > 1) {
                  return (
                    <Col xs="12" md="6" lg="3" style={{ marginBottom: '28px' }} key={l.id}>
                      <Card link={`${l.slug}`} title={l.title} text={l.strapline} />
                    </Col>
                  );
                }

                return null;
              })}
            </Row>
          </ContainerInner>
        </Page>
      </div>
    );
  }
}

FAM.propTypes = {
  service: ServicePropType,
  category: CategoryPropType,
  fam: SubAppPropType,
  theFAM: FamPropType,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
  links: PropTypes.arrayOf(BenefitPropType),
};

const mapStateToProps = (state, ownProps) => {
  const fam = makeSelectSubAppById(state, ownProps.id);
  const theFAM = makeSelectFam(state);

  const linkIds = theFAM.toJS().links;
  const links = linkIds
    ? makeSelectMultipleBenefitsById(state, linkIds).sort(
        (a, b) => linkIds.indexOf(a.toJS().id) - linkIds.indexOf(b.toJS().id),
      )
    : [];

  return {
    fam,
    theFAM,
    links,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(FAM));
