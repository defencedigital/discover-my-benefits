import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BenefitPropType } from '../../containers/Benefits/propTypes';
import { getBenefitEligibilityStatus, getCompleteStatus } from '../../containers/Benefits/helpers';
import { makeSelectBenefits } from '../../containers/Benefits/selectors';
import { CalculationPropType } from '../../containers/Calculations/propTypes';
import { makeSelectCalculations } from '../../containers/Calculations/selectors';
import { CategoryPropType } from '../../containers/Categories/propTypes';
import { makeSelectCategories } from '../../containers/Categories/selectors';
import { DependencyPropType } from '../../containers/Dependencies/propTypes';
import { makeSelectDependencies } from '../../containers/Dependencies/selectors';
import { OptionPropType } from '../../containers/Options/propTypes';
import { makeSelectOptions } from '../../containers/Options/selectors';
import { QuestionPropType } from '../../containers/Questions/propTypes';
import { makeSelectMultipleQuestionsById, makeSelectQuestions } from '../../containers/Questions/selectors';
import { getProfile } from '../../containers/Questions/helpers';
import { ServicePropType } from '../../containers/Services/propTypes';
import { CardWithImageProptype } from '../../containers/CardWithImage/propTypes';
import { CTAComponentPropType } from '../../containers/CTAComponents/propTypes';
import { TextComponentPropType } from '../../containers/TextComponents/propTypes';
import { TagsPropType } from '../../containers/Tags/propTypes';
import { makeSelectTags } from '../../containers/Tags/selectors';
import { makeSelectTextComponents } from '../../containers/TextComponents/selectors';
import { makeSelectCTAComponents } from '../../containers/CTAComponents/selectors';
import { FsCalculationPropType, FsCommitmentTypePropType } from '../../containers/FS/propTypes';
import { makeSelectCommitmentTypes, makeSelectFSCalculations } from '../../containers/FS/selectors';
import Card from '../Card';
import Cardcta from '../Cardcta';
import CopyCol from '../CopyCol';
import { toJS } from '../HOC/ToJS';
import { getTags } from '../../containers/CategoryPage/helpers';
import { makeSelectcardWithImageComponents } from '../../containers/CardWithImage/selectors';

export class BlockGenerator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      noQuestionsForCategory: false,
    };
  }

  getBenefitEligibilityStatus(id) {
    const {
      allQuestions,
      benefits,
      calculations,
      dependencies,
      options,
      service,
      commitmentTypes,
      allCategories,
      fsCalculations,
    } = this.props;
    const profile = getProfile(allQuestions);
    return getBenefitEligibilityStatus(
      id,
      profile,
      benefits,
      allQuestions,
      calculations,
      dependencies,
      options,
      service,
      commitmentTypes,
      allCategories,
      fsCalculations,
    );
  }

  getBenefitItem(id, imageID) {
    const { benefits, category, service, tags } = this.props;
    const benefit = benefits.find(item => item.id === id);
    const image = imageID ? this.getCardWithImageImage(imageID) : null;
    const twoCol = !!imageID;
    return (
      <Card
        key={`${category}-${benefit.id}-${benefit.title}`}
        twoCol={twoCol}
        image={image}
        status={this.getCardStatus(benefit).status}
        className={this.getCardStatus(benefit).cardClass}
        title={benefit.title}
        link={`/${service.slug}/${category.slug}/${benefit.slug}`}
        text={benefit.strapline}
        tags={getTags(benefit.benefitTags, tags, 'blockgen')}
      />
    );
  }

  getCategoryItem(id) {
    const { allCategories, service } = this.props;
    const category = allCategories.find(item => item.id === id);
    return (
      <Card
        key={`${category}-${category.id}-${category.title}`}
        title={category.name}
        link={`/${service.slug}/${category.slug}`}
        text={category.strapline}
      />
    );
  }

  getStatus = item => {
    const isCategory = item.categories;

    const { id } = item;

    return isCategory ? getCompleteStatus() : this.getBenefitEligibilityStatus(id);
  };

  getCardStatus = item => {
    const { benefits } = this.props;
    const benefitsWithQuestions = benefits.find(b => {
      if (b.additionalQuestions === null && b.internalQuestions === null) {
        return false;
      }
      return true;
    });

    if (!benefitsWithQuestions) {
      this.setState({
        noQuestionsForCategory: true,
      });
    }
    const { noQuestionsForCategory } = this.state;
    const eligibleStatus = this.getStatus(item);
    let cardClass;

    if (eligibleStatus.code === 1) {
      cardClass = 'disabled';
    } else if (eligibleStatus.code === 2) {
      cardClass = 'not-eligible';
    } else {
      cardClass = '';
    }

    let status;
    status = !noQuestionsForCategory ? eligibleStatus.code : undefined;
    if (
      item.additionalQuestions === undefined ||
      item.additionalQuestions === null ||
      item.additionalQuestions.length <= 0
    ) {
      cardClass = '';
      status = undefined;
    }

    if (item.usefulStatus) {
      cardClass = 'useful';
      status = 3;
    }

    if (noQuestionsForCategory) {
      cardClass = '';
    }

    return { cardClass, status };
  };

  getTextComponentItem(id) {
    const { textcomponents } = this.props;
    const component = textcomponents.find(item => item.id === id);
    return <p>{component.text}</p>;
  }

  getCardWithImageImage(id) {
    const { cardwithimages } = this.props;
    const component = cardwithimages.find(item => item.id === id);
    return component.image;
  }

  getCTAComponentItem(id) {
    const { ctacomponents } = this.props;
    const component = ctacomponents.find(item => item.id === id);
    return <Cardcta title={component.title} text={component.text} link={component.link}></Cardcta>;
  }

  build4ColLayout(item) {
    if (item.type === 'Category') {
      return (
        <Col xs="12" md="6" lg="3" key={item.id} style={{ marginBottom: '28px' }}>
          {this.getCategoryItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'Benefit') {
      return (
        <Col xs="12" md="6" lg="3" key={item.id} style={{ marginBottom: '28px' }}>
          {this.getBenefitItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'TextComponent') {
      const colSpan = item.data.columnSpan && item.data.columnSpan.iv === 2 ? '6' : '3';

      return (
        <Col xs="12" md="6" lg={colSpan} key={item.id} style={{ marginBottom: '28px' }}>
          {this.getTextComponentItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'Ctacomponents') {
      const colSpan = item.data.columnSpan && item.data.columnSpan.iv === 3 ? '9' : '6';
      return (
        <Col xs="12" md="6" lg={colSpan} key={item.id} style={{ marginBottom: '28px' }}>
          {this.getCTAComponentItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'Cardwithimage') {
      if (item.data.benefit.iv[0]) {
        const benefitID = item.data.benefit.iv[0].id;
        const CWIid = item.id;
        return (
          <Col xs="12" md="6" lg="6" key={benefitID} style={{ marginBottom: '28px' }}>
            {this.getBenefitItem(benefitID, CWIid)}
          </Col>
        );
      }
    }
    return null;
  }

  getTwoThirdsArea(item) {
    if (item.type === 'Category') {
      return (
        <Col xs="12" md="12" lg="6" key={item.id} style={{ marginBottom: '28px' }}>
          {this.getCategoryItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'Benefit') {
      return (
        <Col xs="12" md="12" lg="6" key={item.id} style={{ marginBottom: '28px' }}>
          {this.getBenefitItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'TextComponent') {
      const colSpan = item.data.columnSpan && item.data.columnSpan.iv === 2 ? '6' : '12';
      return (
        <Col xs="12" md="12" lg={colSpan} key={item.id} style={{ marginBottom: '28px' }}>
          {this.getTextComponentItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'Ctacomponents') {
      return (
        <Col xs="12" md="12" lg="12" key={item.id} style={{ marginBottom: '28px' }}>
          {this.getCTAComponentItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'Cardwithimage') {
      const benefitID = item.data.benefit.iv[0].id;
      const CWIid = item.id;
      return (
        <Col xs="12" md="12" lg="12" key={benefitID} style={{ marginBottom: '28px' }}>
          {this.getBenefitItem(benefitID, CWIid)}
        </Col>
      );
    }
    return null;
  }

  getOneThirdArea(item) {
    if (item.type === 'Category') {
      return (
        <Col xs="12" key={item.id} style={{ marginBottom: '28px' }}>
          {this.getCategoryItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'Benefit') {
      return (
        <Col xs="12" key={item.id} style={{ marginBottom: '28px' }}>
          {this.getBenefitItem(item.id)}
        </Col>
      );
    }
    if (item.type === 'TextComponent') {
      return (
        <Col xs="12" key={item.id} style={{ marginBottom: '28px' }}>
          {this.getTextComponentItem(item.id)}
        </Col>
      );
    }
    return null;
  }

  build3ColLayout(data) {
    const { layoutOrder, folderDisplay } = data;

    if (layoutOrder === 1) {
      return (
        <>
          <Col xs="12" md="12" lg="4">
            <Row>
              {data.oneThirdArea.length > 0 && data.oneThirdArea.map(item => this.getOneThirdArea(item))}
            </Row>
          </Col>
          <Col xs="12" md="12" lg="8" className="pl-lg-5 pb-5">
            <Col xs="12" className={`${!folderDisplay ? 'border border-primary ' : 'bg-gray-lighter'} p-5`}>
              <Row>
                <Col xs="12">
                  {data.twoThirdsColumnTitle && (
                    <h2 className="mb-3 border-bottom border-primary category-title pb-3">
                      {folderDisplay && <span className="icon icon-folder" />}
                      {data.twoThirdsColumnTitle}
                    </h2>
                  )}
                </Col>
              </Row>
              <Row>
                {data.twoThirdsArea.length > 0 && data.twoThirdsArea.map(item => this.getTwoThirdsArea(item))}
              </Row>
            </Col>
          </Col>
        </>
      );
    }
    return (
      <>
        <Col xs="12" md="12" lg="8" className="pr-lg-5 pb-5">
          <Col xs="12" className={`${!folderDisplay ? 'border border-primary ' : 'bg-gray-lighter'} p-5`}>
            <Row>
              <Col xs="12">
                {data.twoThirdsColumnTitle && (
                  <h2 className={`mb-3 ${!folderDisplay ? 'border-bottom border-primary' : ''} pb-3`}>
                    {folderDisplay && <span className="icon icon-folder" />}
                    {data.twoThirdsColumnTitle}
                  </h2>
                )}
              </Col>
            </Row>
            <Row>
              {data.twoThirdsArea.length > 0 && data.twoThirdsArea.map(item => this.getTwoThirdsArea(item))}
            </Row>
          </Col>
        </Col>
        <Col xs="12" md="12" lg="4">
          <Row>
            {data.oneThirdArea.length > 0 && data.oneThirdArea.map(item => this.getOneThirdArea(item))}
          </Row>
        </Col>
      </>
    );
  }

  render() {
    const { data, type } = this.props;
    return (
      <Row className="pt-5">
        <Col xs="12">
          {data.title && (
            <h2 className="mb-3 border-bottom border-primary category-title pb-3">{data.title}</h2>
          )}
          {data.subheading && <CopyCol className="pb-1" content={data.subheading} />}

          {data.items.length > 0 && type === 'Block4Col' && (
            <Row className="pt-5" key={data.id}>
              {data.items.map(item => this.build4ColLayout(item))}
            </Row>
          )}
          {type === 'Block3Col' && (
            <Row className="pt-5" key={data.id}>
              {this.build3ColLayout(data)}
            </Row>
          )}
        </Col>
      </Row>
    );
  }
}

BlockGenerator.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  service: ServicePropType,
  category: CategoryPropType,
  benefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  allQuestions: PropTypes.arrayOf(QuestionPropType).isRequired,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
  dependencies: PropTypes.arrayOf(DependencyPropType).isRequired,
  calculations: PropTypes.arrayOf(CalculationPropType).isRequired,
  allCategories: PropTypes.arrayOf(CategoryPropType).isRequired,
  commitmentTypes: PropTypes.arrayOf(FsCommitmentTypePropType).isRequired,
  fsCalculations: PropTypes.arrayOf(FsCalculationPropType).isRequired,
  tags: PropTypes.arrayOf(TagsPropType).isRequired,
  textcomponents: PropTypes.arrayOf(TextComponentPropType),
  ctacomponents: PropTypes.arrayOf(CTAComponentPropType),
  cardwithimages: PropTypes.arrayOf(CardWithImageProptype),
};

const mapStateToProps = state => {
  const benefits = makeSelectBenefits(state);
  const allBenefitQuestionIds = benefits.toJS().map(benefit => benefit.additionalQuestions);
  const questions = makeSelectMultipleQuestionsById(
    state,
    Array.from(new Set([].concat(...allBenefitQuestionIds))),
  );
  const allCategories = makeSelectCategories(state);
  const allQuestions = makeSelectQuestions(state);
  const options = makeSelectOptions(state);
  const dependencies = makeSelectDependencies(state);
  const calculations = makeSelectCalculations(state);
  const commitmentTypes = makeSelectCommitmentTypes(state);
  const fsCalculations = makeSelectFSCalculations(state);
  const tags = makeSelectTags(state);
  const textcomponents = makeSelectTextComponents(state);
  const ctacomponents = makeSelectCTAComponents(state);
  const cardwithimages = makeSelectcardWithImageComponents(state);

  return {
    benefits,
    questions,
    options,
    dependencies,
    calculations,
    allQuestions,
    allCategories,
    commitmentTypes,
    fsCalculations,
    tags,
    textcomponents,
    ctacomponents,
    cardwithimages,
  };
};

export default connect(mapStateToProps)(toJS(injectIntl(BlockGenerator)));
