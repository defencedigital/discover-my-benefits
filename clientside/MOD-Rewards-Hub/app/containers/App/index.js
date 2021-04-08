/* eslint-disable no-underscore-dangle */
/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import Beta from '../../components/Beta';
import ChangelogFlyout from '../../components/ChangelogFlyout';
import ErrorBoundary from '../../components/ErrorBoundary';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import DeleteProfile from '../../components/HOC/DeleteProfile';
import Progress from '../../components/HOC/Progress';
import { toJS } from '../../components/HOC/ToJS';
import SetServiceSlug from '../../components/SetServiceSlug';
import { makeSelectAccordions } from '../Accordions/selectors';
import { ASPropType } from '../AS/propTypes';
import { makeSelectAS } from '../AS/selectors';
import ASPage from '../ASPage/Loadable';
import BenefitPage from '../BenefitPage/Loadable';
import { BenefitPropType } from '../Benefits/propTypes';
import { makeSelectBenefits } from '../Benefits/selectors';
import BenefitsComparatorQuestionsPage from '../BenefitsComparator/Loadable';
import { B3CPropType } from '../Block3Col/propTypes';
import { makeSelectBlock3cols } from '../Block3Col/selectors';
import { B4CPropType } from '../Block4Col/propTypes';
import { makeSelectBlock4cols } from '../Block4Col/selectors';
import { CategoryPropType } from '../Categories/propTypes';
import { makeSelectCategories } from '../Categories/selectors';
import CategoryPage from '../CategoryPage/Loadable';
import { ContactsPropType } from '../Contact/propTypes';
import { makeSelectContacts } from '../Contact/selectors';
import ContactPage from '../ContactPage/Loadable';
import { CookiesPropType } from '../Cookies/propTypes';
import { makeSelectCookies } from '../Cookies/selectors';
import CookiesPage from '../CookiesPage/Loadable';
import { CTAComponentPropType } from '../CTAComponents/propTypes';
import { makeSelectCTAComponents } from '../CTAComponents/selectors';
import { makeSelectDependencies } from '../Dependencies/selectors';
import FAM from '../FAM';
import Allowance from '../FAM/Allowance';
import Deposit from '../FAM/Deposit';
import Eligibility from '../FAM/Eligibility';
import RentalAdvance from '../FAM/RentalAdvance';
import Comparator from '../FS/Comparator';
import HomePage from '../HomePage/Loadable';
import { makeSelectImages } from '../Images/selectors';
import { changeLocale } from '../LanguageProvider/actions';
import NotFoundPage from '../NotFoundPage/Loadable';
import { makeSelectOptions } from '../Options/selectors';
import PatternsPage from '../PatternsPage/Loadable';
import ServicePage from '../ServicePage/Loadable';
import { ServicePropType } from '../Services/propTypes';
import { makeSelectServices } from '../Services/selectors';
import { SubAppPropType } from '../SubApps/propTypes';
import { makeSelectSubApps } from '../SubApps/selectors';
import { TagsPropType } from '../Tags/propTypes';
import { makeSelectTags } from '../Tags/selectors';
import { TermsPropType } from '../Terms/propTypes';
import { makeSelectTerms } from '../Terms/selectors';
import TermsPage from '../TermsPage/Loadable';
import { TextComponentPropType } from '../TextComponents/propTypes';
import { makeSelectTextComponents } from '../TextComponents/selectors';
import UpdatesPage from '../UpdatesPage/Loadable';
import { setActiveServiceSlug, updateNetworkStatus } from './actions';
import { networkStatusText } from './constants';

const internalSubApps = {
  fam: FAM,
  comparator: Comparator,
};

const subAppChildRoutes = [
  {
    appName: 'fam',
    routes: [
      {
        path: '/eligibility',
        component: Eligibility,
      },
      {
        path: '/calculate-fam-support',
        component: Allowance,
      },
      {
        path: '/calculate-tp-support',
        component: Allowance,
        props: {
          tp: true,
        },
      },
      {
        path: '/rental-advance',
        component: RentalAdvance,
      },
      {
        path: '/deposit-advance',
        component: Deposit,
      },
    ],
  },
  {
    appName: 'comparator',
    routes: [],
  },
];

export class App extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    window.addEventListener('online', () => updateNetworkStatus(networkStatusText.ONLINE));
    window.addEventListener('offline', () => updateNetworkStatus(networkStatusText.OFFLINE));
  }

  getFooterLinks(service) {
    const { categories } = this.props;

    return categories
      .filter(c => service.categories.indexOf(c.id) !== -1)
      .sort((a, b) => service.categories.indexOf(a.id) - service.categories.indexOf(b.id))
      .map(category => ({
        text: category.name,
        link: `/${service.slug}/${category.slug}`,
      }));
  }

  getServiceRoutes() {
    const { services, cookies, terms, contacts, as } = this.props;

    return services.map(service => (
      <Route
        key={service.id}
        path={`/:service(${service.slug})`}
        render={() => (
          <>
            <a href="#content" className="skip">
              Skip to content
            </a>

            <SetServiceSlug service={service} />
            <ErrorBoundary>
              <Progress service={service}>
                <DeleteProfile>
                  <Header
                    logo={service.logo}
                    link={`/${service.slug}`}
                    profileLink={`/${service.slug}/my-details`}
                    service={service}
                    modalHeader={false}
                  />
                </DeleteProfile>
              </Progress>

              {service.beta && <Beta link={service.betaLink} />}
              <span id="content">
                <Switch>
                  <Route
                    key={service.id}
                    exact
                    path={`/:service(${service.slug})`}
                    render={props => <ServicePage id={service.id} {...props} />}
                  />
                  {this.getSubApps()}
                  {this.getCategoryRoutes()}
                  {this.getBenefitRoutes()}
                  {this.getUpdatesRoute()}
                  {this.getTermsRoute()}
                  {this.getASRoute()}
                  {this.getContactRoute()}
                  {this.getCookieRoute()}
                  {this.getComparatorRoute()}
                  <Route render={props => <NotFoundPage slug={service.slug} {...props} />} />
                </Switch>
              </span>
              <Footer
                items={this.getFooterLinks(service)}
                service={service}
                hasCookies={cookies.find(c => c.service === service.id)}
                hasTerms={terms.find(c => c.service === service.id)}
                hasAS={as.find(c => c.service === service.id)}
                hasContacts={contacts.find(c => c.service === service.id)}
              />
              {service.beta && <Beta link={service.betaLink} />}
              <ChangelogFlyout service={service} />
            </ErrorBoundary>
          </>
        )}
      />
    ));
  }

  getCategoryRoutes() {
    const { services, categories, tags } = this.props;

    const routes = services.map(service => {
      const serviceCategories = categories.filter(c => service.categories.indexOf(c.id) !== -1);

      return serviceCategories.map(category => (
        <Route
          key={`${service.id}:${category.id}`}
          exact
          path={`/:service(${service.slug})/${category.slug}`}
          render={props => <CategoryPage id={category.id} tags={tags} service={service} {...props} />}
        />
      ));
    });

    return [].concat(...routes);
  }

  getAllBenefitsIncludingCategories = (benefits, category, allCategories) => {
    const categoryLinkedCategories = category.categories
      ? allCategories.filter(c => category.categories.indexOf(c.id) !== -1)
      : [];

    return categoryLinkedCategories.concat(
      benefits.sort((a, b) => category.benefits.indexOf(a.id) - category.benefits.indexOf(b.id)),
    );
  };

  getBenefitRoutes() {
    const { services, categories, benefits, tags } = this.props;

    const routes = services.map(service => {
      const serviceCategories = categories.filter(c => service.categories.indexOf(c.id) !== -1);

      return serviceCategories.map(category => {
        // we need to get all benefits references everywhere to build the routes
        const blocks =
          category.customLayout && category.pageLayout !== null
            ? category.pageLayout.filter(block => block.data.items)
            : null;

        let categoryBenefits;
        if (blocks !== null) {
          const layoutBenefits = [];
          category.pageLayout.forEach(block => {
            if (block.data.items && block.data.items.iv.length > 0) {
              if (block.data.items.iv.filter(i => i.__typename === 'Benefit').length)
                layoutBenefits.push(block.data.items.iv.filter(i => i.__typename === 'Benefit'));
              if (block.data.items.iv.filter(i => i.__typename === 'Cardwithimage').length) {
                const b = block.data.items.iv
                  .filter(i => i.__typename === 'Cardwithimage')
                  .map(item => item.data.benefit.iv[0]);
                if (b[0] !== undefined) {
                  layoutBenefits.push(b);
                }
              }
            }
            if (block.data.oneThirdArea && block.data.oneThirdArea.iv.length > 0) {
              if (block.data.oneThirdArea.iv.filter(i => i.__typename === 'Benefit').length)
                layoutBenefits.push(block.data.oneThirdArea.iv.filter(i => i.__typename === 'Benefit'));
            }
            if (block.data.twoThirdsArea && block.data.twoThirdsArea.iv.length > 0) {
              if (block.data.twoThirdsArea.iv.filter(i => i.__typename === 'Benefit').length) {
                layoutBenefits.push(block.data.twoThirdsArea.iv.filter(i => i.__typename === 'Benefit'));
              }
              if (block.data.twoThirdsArea.iv.filter(i => i.__typename === 'Cardwithimage').length) {
                const b = block.data.twoThirdsArea.iv
                  .filter(i => i.__typename === 'Cardwithimage')
                  .map(item => item.data.benefit.iv[0]);

                layoutBenefits.push(b);
              }
            }
          });

          const flattendBenefits = layoutBenefits
            .flat()
            .map(b =>
              Object.keys(b).reduce(
                (acc, key) => (key === '__typename' ? acc : { ...acc, [key]: b[key] }),
                {},
              ),
            )
            .map(b => b.id);
          const blockBenefits = benefits.filter(b => flattendBenefits.indexOf(b.id) !== -1);
          categoryBenefits = blockBenefits.concat(
            benefits.filter(b => category.benefits.indexOf(b.id) !== -1),
          );
        } else {
          categoryBenefits = benefits.filter(b => category.benefits.indexOf(b.id) !== -1);
        }

        const allBenefitsIncludingCategories = this.getAllBenefitsIncludingCategories(
          categoryBenefits,
          category,
          categories,
        );

        return allBenefitsIncludingCategories.map(benefit => (
          <Route
            exact
            key={`${service.id}:${category.id}:${benefit.id}`}
            path={`/:service(${service.slug})/${category.slug}/${benefit.slug}`}
            render={props => (
              <BenefitPage id={benefit.id} tags={tags} service={service} category={category} {...props} />
            )}
          />
        ));
      });
    });

    return [].concat([].concat(...routes));
  }

  getUpdatesRoute() {
    const { services } = this.props;
    return services.map(service => (
      <Route
        key={`${service.id}:updates`}
        exact
        path={`/${service.slug}/updates`}
        render={props => <UpdatesPage service={service} {...props} />}
      />
    ));
  }

  getTermsRoute() {
    const { services, terms } = this.props;

    return services
      .filter(service => terms.find(c => c.service === service.id))
      .map(service => {
        const serviceTerms = terms.find(term => term.service === service.id);
        return (
          <Route
            key={`${service.id}:terms-and-conditions`}
            exact
            path={`/${service.slug}/terms-and-conditions`}
            render={props => <TermsPage service={service} terms={serviceTerms} {...props} />}
          />
        );
      });
  }

  getASRoute() {
    const { services, as } = this.props;

    return services
      .filter(service => as.find(c => c.service === service.id))
      .map(service => {
        const serviceAs = as.find(s => s.service === service.id);
        return (
          <Route
            key={`${service.id}:accessibility-statement`}
            exact
            path={`/${service.slug}/accessibility-statement`}
            render={props => <ASPage service={service} as={serviceAs} {...props} />}
          />
        );
      });
  }

  getContactRoute() {
    const { services, contacts } = this.props;
    return services
      .filter(service => contacts.find(c => c.service === service.id))
      .map(service => {
        const serviceContact = contacts.find(c => c.service === service.id);

        return (
          <Route
            key={`${service.id}:contact-us`}
            exact
            path={`/${service.slug}/Contact-us`}
            render={props => <ContactPage service={service} contacts={serviceContact} {...props} />}
          />
        );
      });
  }

  getCookieRoute() {
    const { services, cookies } = this.props;
    return services
      .filter(service => cookies.find(c => c.service === service.id))
      .map(service => {
        const serviceCookie = cookies.find(c => c.service === service.id);

        return (
          <Route
            key={`${service.id}:cookies`}
            exact
            path={`/${service.slug}/Cookies`}
            render={props => <CookiesPage service={service} cookies={serviceCookie} {...props} />}
          />
        );
      });
  }

  getComparatorRoute() {
    const { services } = this.props;

    return services.map(service => (
      <Route
        key={`${service.id}:my-details`}
        exact
        path={`/${service.slug}/change-of-circumstances`}
        render={props => (
          <Progress service={service}>
            <BenefitsComparatorQuestionsPage service={service} {...props} />
          </Progress>
        )}
      />
    ));
  }

  getSubApps() {
    const { services, categories, subApps } = this.props;

    const routes = services.map(service => {
      const serviceCategories = categories.filter(c => service.categories.indexOf(c.id) !== -1);

      return serviceCategories.map(category => {
        if (!category.subApps && !category.subAppsBottom) {
          return null;
        }

        const categorySubApps = subApps.filter(
          sa =>
            (category.subApps && category.subApps.indexOf(sa.id) !== -1) ||
            (category.subAppsBottom && category.subAppsBottom.indexOf(sa.id) !== -1),
        );

        return categorySubApps.map(subApp => [
          subAppChildRoutes
            .find(childRoute => childRoute.appName === subApp.appName)
            .routes.map(childRoute => (
              <Route
                key={`${service.id}:${category.id}:${subApp.id}:${childRoute.path}`}
                path={`/:service(${service.slug})/${category.slug}/${subApp.appName}${childRoute.path}`}
                render={props => {
                  const RouteComponent = childRoute.component;
                  return (
                    <RouteComponent
                      id={subApp.id}
                      service={service}
                      category={category}
                      {...props}
                      {...(childRoute.props || {})}
                    />
                  );
                }}
              />
            )),
          [
            <Route
              key={`${service.id}:${category.id}:${subApp.id}`}
              path={`/:service(${service.slug})/${category.slug}/${subApp.appName.toLowerCase()}`}
              render={props => {
                const InternalApp = internalSubApps[subApp.appName];
                return <InternalApp id={subApp.id} service={service} category={category} {...props} />;
              }}
            />,
          ],
        ]);
      });
    });

    const routesWithoutNullRoutes = [].concat(...routes).filter(route => route !== null);
    const flattened = [].concat(...routesWithoutNullRoutes);

    return [].concat(...flattened);
  }

  render() {
    return (
      <>
        <Switch>
          <Route exact path="/" component={HomePage} />
          {this.getServiceRoutes()}
          <Route exact path="/patterns" component={PatternsPage} />
          <Route render={props => <NotFoundPage slug="" {...props} />} />
        </Switch>
      </>
    );
  }
}

App.propTypes = {
  services: PropTypes.arrayOf(ServicePropType).isRequired,
  categories: PropTypes.arrayOf(CategoryPropType).isRequired,
  benefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  subApps: PropTypes.arrayOf(SubAppPropType).isRequired,
  terms: PropTypes.arrayOf(TermsPropType).isRequired,
  as: PropTypes.arrayOf(ASPropType).isRequired,
  contacts: PropTypes.arrayOf(ContactsPropType).isRequired,
  cookies: PropTypes.arrayOf(CookiesPropType).isRequired,
  tags: PropTypes.arrayOf(TagsPropType),
  dependencies: PropTypes.array,
  options: PropTypes.array,
  block4cols: PropTypes.arrayOf(B4CPropType).isRequired,
  block3cols: PropTypes.arrayOf(B3CPropType).isRequired,
  textcomponents: PropTypes.arrayOf(TextComponentPropType).isRequired,
  ctacomponents: PropTypes.arrayOf(CTAComponentPropType).isRequired,
  networkStatus: PropTypes.string,
};

const mapStateToProps = state => {
  const services = makeSelectServices(state);
  const categories = makeSelectCategories(state);
  const benefits = makeSelectBenefits(state);
  const subApps = makeSelectSubApps(state);
  const terms = makeSelectTerms(state);
  const as = makeSelectAS(state);
  const contacts = makeSelectContacts(state);
  const cookies = makeSelectCookies(state);
  const tags = makeSelectTags(state);
  const dependencies = makeSelectDependencies(state);
  const options = makeSelectOptions(state);
  const accordions = makeSelectAccordions(state);
  const images = makeSelectImages(state);
  const block4cols = makeSelectBlock4cols(state);
  const block3cols = makeSelectBlock3cols(state);
  const textcomponents = makeSelectTextComponents(state);
  const ctacomponents = makeSelectCTAComponents(state);
  const networkStatus = state.netWorkStatus;

  return {
    services,
    categories,
    benefits,
    subApps,
    terms,
    as,
    contacts,
    cookies,
    tags,
    dependencies,
    options,
    accordions,
    images,
    block4cols,
    block3cols,
    textcomponents,
    ctacomponents,
    networkStatus,
  };
};

const mapDispatchToProps = dispatch => ({
  onChangeLocale: locale => dispatch(changeLocale(locale)),
  onChangeActiveServiceSlug: slug => dispatch(setActiveServiceSlug(slug)),
  updateNetworkStatus: status => dispatch(updateNetworkStatus(status)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(toJS(App)));
