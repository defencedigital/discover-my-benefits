/* eslint-disable react/no-danger */
/* eslint no-eval: 0 */
/*
 * BenefitPage
 *
 * This is what the user will see when visiting at the '/:service/:category/:benefit' route
 *
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Card from '../../components/Card';
import ContainerInner from '../../components/ContainerInner';
import { toJS } from '../../components/HOC/ToJS';
import { getTags } from '../CategoryPage/helpers';
import MastheadIntro from '../../components/MastheadIntro';
import CopyCol from '../../components/CopyCol';
import Page from '../../components/Page';
import ShareandPrintBar from '../../components/ShareandPrintBar';
import HowToClaim from '../../components/HowToClaim';
import EligibilityQuestions from './EligibilityQuestions';
import HomeToDutyCalculator from './HomeToDutyCalculator';
import CloseIcon from '../../images/svg/cross-white.svg';
import { chunk } from '../../utils/array';
import { benefitDetailView } from '../App/actions';
import { BenefitPropType } from '../Benefits/propTypes';
import { makeSelectBenefitById } from '../Benefits/selectors';
import { CalculationPropType } from '../Calculations/propTypes';
import { makeSelectCalculations } from '../Calculations/selectors';
import { CategoryPropType } from '../Categories/propTypes';
import { LinkPropType } from '../Links/propTypes';
import { makeSelectLinks } from '../Links/selectors';
import { getProfile } from '../Questions/helpers';
import { QuestionPropType } from '../Questions/propTypes';
import { makeSelectQuestions } from '../Questions/selectors';
import { ServicePropType } from '../Services/propTypes';
import { TagsPropType } from '../Tags/propTypes';
import { makeSelectTags } from '../Tags/selectors';

export class BenefitPage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  componentWillUnmount() {
    this.props.onBenefitDetailView();
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  componentDidMount() {
    window.dataLayer.push({ event: 'pageview' });
    document.addEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = event => {
    const { history } = this.props;
    const outerContainer = this.myRef;

    const currentElement = event.target;

    if (
      outerContainer.current.contains(currentElement) &&
      currentElement.classList.contains('container-ref')
    ) {
      history.goBack();
    }
  };

  getExternalCloseButton() {
    const { history } = this.props;

    return (
      <>
        <button type="button" className="close" onClick={history.goBack}>
          <CloseIcon />
          <span className="close-txt">Close</span>
        </button>
      </>
    );
  }

  getBenefitImage(benefit) {
    const { service } = this.props;

    switch (service.serviceType) {
      case 'navy':
        return benefit.benefitImageNavy;
      case 'army':
        return benefit.benefitImageArmy;
      case 'raf':
        return benefit.benefitImageRaf;
      case 'marines':
        return benefit.benefitImageMarines;
      case '_test_-service':
        return benefit.benefitImageMarines;
      default:
        return '';
    }
  }

  checkHomeToDuty() {
    const { service, category } = this.props;
    const windowLocation = window.location.pathname;
    const HomeToDutyURL = `/${service.slug}/${category.slug}/travel-home-to-duty-travel`;
    if (windowLocation === HomeToDutyURL) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line consistent-return
  getCantILinks(link) {
    const { benefits, service, categories } = this.props;

    const bLinks = [];
    if (link) {
      // eslint-disable-next-line array-callback-return
      link.map(id => {
        // eslint-disable-next-line array-callback-return
        benefits.map(b => {
          if (id === b.id) {
            bLinks.push(b);
          }
        });
      });

      const chunkLinks = chunk(bLinks, 4);

      return (
        <>
          {chunkLinks.map(linkGroup => (
            <Row key={`BenefitPage-row:${linkGroup[0].id}`}>
              {linkGroup.map(Blink => (
                <Col
                  key={`BenefitPage-col:${Blink.id}`}
                  xs="12"
                  md="6"
                  lg="3"
                  style={{ marginBottom: '28px' }}
                >
                  <Card
                    title={Blink.title}
                    link={`/${service.slug}/${categories
                      .filter(x => x.id === Blink.primaryCategory)
                      .map(x => x.slug)}/${Blink.slug}`}
                    text={Blink.strapline}
                  />
                </Col>
              ))}
            </Row>
          ))}
        </>
      );
    }
  }

  getBreadcrumb() {
    const { service, category, benefit } = this.props;
    return [
      {
        text: 'Home',
        slug: `/${service.slug}`,
        active: true,
        icon: 'home',
      },
      {
        text: category.name,
        slug: `/${service.slug}/${category.slug}`,
        active: true,
        icon: 'grid',
      },
      {
        text: benefit.title,
        slug: `/${service.slug}/${category.slug}/${benefit.slug}`,
        active: false,
      },
    ];
  }

  getCardImage(link) {
    const { service } = this.props;

    switch (service.serviceType) {
      case 'navy':
        return link.cardImageNavy;
      case 'army':
        return link.cardImageArmy;
      case 'raf':
        return link.cardImageRaf;
      case 'marines':
        return link.cardImageMarines;
      case '_test_-service':
        return link.cardImageMarines;
      default:
        return '';
    }
  }

  getLinks() {
    const { links, benefit } = this.props;
    if (links.length === 0) {
      return undefined;
    }
    const orderedLinks = benefit.links
      .map(link => links.find(l => link === l.id))
      .filter(el => el !== undefined);
    const chunkLinks = chunk(orderedLinks, 4);
    return (
      <>
        {chunkLinks.map(linkGroup => (
          <Row key={`BenefitPage-row:${linkGroup[0].id}`}>
            {linkGroup.map(link => (
              <Col key={`BenefitPage-col:${link.id}`} xs="12" md="6" lg="3" style={{ marginBottom: '28px' }}>
                <Card
                  openLinkInNewWindow
                  link={link.url}
                  image={this.getCardImage(link)}
                  title={link.name}
                  text={link.description}
                  modnetLink={link.modnetLink}
                  gatewayLink={link.gatewayLink}
                />
              </Col>
            ))}
          </Row>
        ))}
      </>
    );
  }

  getEntitlement() {
    const { benefit, calculations, questions } = this.props;
    const profile = getProfile(questions);

    const benefitCalculations = calculations.find(calculation => calculation.id === benefit.calculation);
    let entitlement = false;

    if (benefitCalculations && benefitCalculations.entitlement) {
      const test = eval(`(${benefitCalculations.entitlement})`);

      if (typeof test === 'function') {
        try {
          entitlement = test(profile);
        } catch (e) {
          entitlement = false;
        }
      }
    }

    return entitlement;
  }

  render() {
    const externalCloseBtn = this.getExternalCloseButton();
    const { service, benefit, questions, dependencies, options, category, tags } = this.props;
    return (
      <Page
        title={`${benefit.name} | ${service.name}`}
        service={service}
        bgColour="grey"
        description={benefit.description}
      >
        <div ref={this.myRef} className="container-ref">
          <ContainerInner className="no-padding-lrg modal-padding-top benefit-page">
            <MastheadIntro
              breadcrumbItems={this.getBreadcrumb()}
              title={benefit.title}
              description={benefit.description}
              imgSrc={this.getBenefitImage(benefit)}
              tags={getTags(benefit.benefitTags, tags, 'benefitPage')}
              closeBtn={externalCloseBtn}
              id={benefit.id}
              serviceName={service.serviceType}
            />

            <ModalBody>
              <EligibilityQuestions
                benefit={benefit}
                questions={questions}
                dependencies={dependencies}
                options={options}
                service={service}
              />
              <div className="modal-inner wysiwyg">
                <Row>
                  <Col xs="12">
                    <CopyCol content={benefit.content} />
                  </Col>
                </Row>
              </div>
              {benefit.howToClaim && <HowToClaim steps={benefit.howToClaim} />}
              {this.checkHomeToDuty() && <HomeToDutyCalculator />}
              <ShareandPrintBar category={category} benefit={benefit} service={service} />
              {this.getLinks() && this.getLinks().props.children.length > 0 && (
                <div className="modal-inner modal-bottom">
                  <Row>
                    <Col xs="12">
                      <h2>Need more information?</h2>
                    </Col>
                  </Row>
                  {this.getLinks()}
                </div>
              )}
            </ModalBody>
          </ContainerInner>
        </div>
      </Page>
    );
  }
}

BenefitPage.propTypes = {
  service: ServicePropType,
  category: CategoryPropType,
  benefit: BenefitPropType,
  tags: PropTypes.arrayOf(TagsPropType),
  calculations: PropTypes.arrayOf(CalculationPropType).isRequired,
  questions: PropTypes.arrayOf(QuestionPropType).isRequired,
  links: PropTypes.arrayOf(LinkPropType),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  benefits: PropTypes.array,
  onBenefitDetailView: PropTypes.func.isRequired,
  categories: PropTypes.array,
  dependencies: PropTypes.object,
  options: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const calculations = makeSelectCalculations(state);
  const benefit = makeSelectBenefitById(state, ownProps.id);
  const links = benefit.toJS().links ? makeSelectLinks(state) : [];

  const questions = makeSelectQuestions(state);
  const tags = makeSelectTags(state);
  return {
    calculations,
    benefit,
    links,
    questions,
    tags,
  };
};

const mapDispatchToProps = dispatch => ({
  onBenefitDetailView: () => dispatch(benefitDetailView()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(toJS(BenefitPage)));
