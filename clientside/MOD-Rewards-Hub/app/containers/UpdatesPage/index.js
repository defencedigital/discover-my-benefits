/*
 * Updates Page
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import R from 'ramda/src/groupBy';
import moment from 'moment';
import { toJS } from '../../components/HOC/ToJS';
import { monthNames, formatDate } from '../../utils/date';

import Breadcrumb from '../../components/Breadcrumb';
import Intro from '../../components/Intro';
import Page from '../../components/Page';
import ContainerInner from '../../components/ContainerInner';

import UpdateBlock from '../../components/UpdateBlock';

import { getServiceSlugFromService } from '../Services/helpers';
import { ServicePropType } from '../Services/propTypes';
import { UpdatePropType } from '../Updates/propTypes';
import { makeSelectUpdates } from '../Updates/selectors';

import { makeSelectLinks } from '../Links/selectors';
import { LinkPropType } from '../Links/propTypes';
import { makeSelectCategories } from '../Categories/selectors';
import { CategoryPropType } from '../Categories/propTypes';
import { makeSelectBenefits } from '../Benefits/selectors';
import { BenefitPropType } from '../Benefits/propTypes';

export class UpdatesPage extends React.PureComponent {
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
        text: 'Updates',
        slug: `/${getServiceSlugFromService(service)}/updates`,
        active: false,
      },
    ];
  }

  getBenefitLinks = linkedBenefits => {
    if (!linkedBenefits) {
      return [];
    }

    const { service, categories, benefits } = this.props;

    const availableBenefits = benefits
      .filter(c => linkedBenefits.indexOf(c.id) !== -1)
      .sort((a, b) => linkedBenefits.indexOf(a.id) - linkedBenefits.indexOf(b.id))
      .map(benefit =>
        Object.assign({}, benefit, {
          primaryCategory: categories.find(c => c.id === benefit.primaryCategory),
        }),
      );

    return availableBenefits.map(benefit => ({
      id: benefit.id,
      url: `/${service.slug}/${benefit.primaryCategory.slug}/${benefit.slug}`,
      name: benefit.name,
    }));
  };

  getCategoryLinks = linkedCategories => {
    if (!linkedCategories) {
      return [];
    }

    const { service, categories } = this.props;
    const availableCategories = service.categories
      .filter(c => linkedCategories.indexOf(c) !== -1)
      .sort((a, b) => linkedCategories.indexOf(a) - linkedCategories.indexOf(b));
    return availableCategories
      .map(aCategory => categories.find(bCategory => bCategory.id === aCategory))
      .map(cCategory => ({
        id: cCategory.id,
        url: `/${service.slug}/${cCategory.slug}`,
        name: cCategory.name,
      }));
  };

  render() {
    const { service, updates, links } = this.props;

    const updatesForThisService = updates
      .filter(update => update.service === service.id)
      .map(update => {
        let formattedDate = formatDate(new Date(update.published));

        if (formattedDate === formatDate(new Date())) {
          if (new Date(update.published).getTime() > new Date().getTime()) {
            // test
          } else {
            formattedDate = moment(update.published).fromNow();
          }
        }

        return Object.assign({}, update, {
          date: formattedDate,
        });
      });

    const byMonth = R(update => {
      const month = monthNames[new Date(update.published).getMonth()];
      if (month === monthNames[new Date().getMonth()]) {
        return 'This Month';
      }
      return `${monthNames[new Date(update.published).getMonth()]} ${new Date(
        update.published,
      ).getFullYear()}`;
    });

    const ranges = byMonth(updatesForThisService);

    const formattedUpdates = Object.keys(ranges)
      .sort((a, b) => new Date(ranges[b][0].published) - new Date(ranges[a][0].published))
      .map(monthKey => [
        {
          date: monthKey,
          changes: ranges[monthKey]
            .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
            .map(update => ({
              time: update.date,
              title: update.title,
              description: update.description,
              links: links
                .filter(link => update.links && update.links.indexOf(link.id) !== -1)
                .sort((a, b) => update.links.indexOf(a.id) - update.links.indexOf(b.id)),
              benefitLinks: this.getBenefitLinks(update.benefitLinks),
              categoryLinks: this.getCategoryLinks(update.categoryLinks),
            })),
        },
      ]);

    return (
      <Page
        title={`Updates | ${service.name}`}
        service={service}
        description="From time to time, the rules surrounding your benefits and entitlements may change. The MOD may also add new benefits or remove them. You can keep up to date with the latest changes and developments here."
      >
        <ContainerInner className="no-padding-lrg">
          <Row>
            <Col xs="12">
              <Breadcrumb items={this.getBreadcrumb()} />
              <Intro
                tagName="h1"
                title="Updates"
                subtitle="From time to time, the rules surrounding your benefits and entitlements may change. The MOD may also add new benefits or remove them. You can keep up to date with the latest changes and developments here."
              />
            </Col>
          </Row>
        </ContainerInner>
        <UpdateBlock service={service} updates={formattedUpdates} />
      </Page>
    );
  }
}

UpdatesPage.propTypes = {
  service: ServicePropType,
  updates: PropTypes.arrayOf(UpdatePropType),
  links: PropTypes.arrayOf(LinkPropType),
  categories: PropTypes.arrayOf(CategoryPropType),
  benefits: PropTypes.arrayOf(BenefitPropType),
};

const mapStateToProps = state => {
  const updates = makeSelectUpdates(state);
  const links = makeSelectLinks(state);
  const categories = makeSelectCategories(state);
  const benefits = makeSelectBenefits(state);

  return {
    updates,
    links,
    categories,
    benefits,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(UpdatesPage));
