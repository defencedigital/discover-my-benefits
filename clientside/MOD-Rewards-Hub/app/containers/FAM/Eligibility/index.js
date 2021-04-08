/*
 * FAM Eligibility
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { toJS } from '../../../components/HOC/ToJS';

import Intro from '../../../components/Intro';
import Page from '../../../components/Page';
import ContainerInner from '../../../components/ContainerInner';
import Breadcrumb from '../../../components/Breadcrumb';
import FeatureList from '../../../components/FeatureList';
import CopyCol from '../../../components/CopyCol';

import { ServicePropType } from '../../Services/propTypes';
import { makeSelectSubAppById } from '../../SubApps/selectors';
import { SubAppPropType } from '../../SubApps/propTypes';
import { CategoryPropType } from '../../Categories/propTypes';
import { makeSelectFam, makeSelectTp, makeSelectFamStatements, makeSelectTpStatements } from '../selectors';
import { FamPropType, FamStatementsPropType, TpPropType, TpStatementsPropType } from '../propTypes';
import { getServiceSlugFromService } from '../../Services/helpers';

export class Eligibility extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  getBreadcrumb() {
    const { service, category, fam, theFAM } = this.props;

    return [
      {
        text: 'Home',
        slug: `/${getServiceSlugFromService(service)}`,
        active: true,
      },
      {
        text: category.name,
        slug: `/${getServiceSlugFromService(service)}/${category.slug}`,
        active: true,
      },
      {
        text: fam.appName,
        slug: `/${getServiceSlugFromService(service)}/${category.slug}/${fam.appName}`,
        active: true,
      },
      {
        text: theFAM.eligibleIntro,
        active: false,
      },
    ];
  }

  render() {
    const { service, theFAM, famStatements, tpStatements, tp } = this.props;

    return (
      <div>
        <Page
          title={`${theFAM.eligibleIntro} | ${service.name}`}
          service={service}
          description={theFAM.depositDescription}
        >
          <ContainerInner className="no-padding-lrg">
            <Row>
              <Col xs="12">
                <Breadcrumb items={this.getBreadcrumb()} />
                <Intro title={theFAM.eligibleIntro} tagName="h1" />
                <CopyCol content={theFAM.eligibleDescription} />
              </Col>
            </Row>
            <Row>
              <Col md={tp ? '6' : '12'} xs="12">
                <FeatureList
                  link="calculate-fam-support"
                  title={theFAM.eligibleTitle}
                  items={famStatements.map(s => s.title)}
                  buttonText="Calculate my FAM support"
                />
              </Col>
              {tp && (
                <Col md="6" xs="12">
                  <FeatureList
                    link="calculate-tp-support"
                    title={tp.eligibleTitle}
                    items={tpStatements.map(s => s.title)}
                    buttonText="Calculate my TP support"
                  />
                </Col>
              )}
            </Row>
          </ContainerInner>
        </Page>
      </div>
    );
  }
}

Eligibility.propTypes = {
  service: ServicePropType,
  category: CategoryPropType,
  tp: TpPropType,
  fam: SubAppPropType,
  theFAM: FamPropType,
  famStatements: PropTypes.arrayOf(FamStatementsPropType),
  tpStatements: PropTypes.arrayOf(TpStatementsPropType),
};

const mapStateToProps = (state, ownProps) => {
  const fam = makeSelectSubAppById(state, ownProps.id);
  const theFAM = makeSelectFam(state);
  const tp = makeSelectTp(state);

  const famStatements = makeSelectFamStatements(state);
  const tpStatements = makeSelectTpStatements(state);

  const theFAMToJS = theFAM.toJS();
  const tpToJS = tp ? tp.toJS() : null;
  const filteredFamStatements = famStatements
    .toJS()
    .filter(s => theFAMToJS.eligibleStatements.indexOf(s.id) !== -1)
    .sort(
      (a, b) => theFAMToJS.eligibleStatements.indexOf(a.id) - theFAMToJS.eligibleStatements.indexOf(b.id),
    );

  // eslint-disable-next-line prettier/prettier
  const filteredTpStatements = tpToJS ? tpStatements.toJS().filter(s => tpToJS.eligibleStatements.indexOf(s.id) !== -1).sort((a, b) => tpToJS.eligibleStatements.indexOf(a.id) - tpToJS.eligibleStatements.indexOf(b.id)): [];

  return {
    fam,
    theFAM,
    tp,
    famStatements: filteredFamStatements,
    tpStatements: filteredTpStatements,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(Eligibility));
