
require('@babel/polyfill');

const Services = require('../../../app/json/squidex/services.json');
const Categories = require('../../../app/json/squidex/categories.json');
const Benefits = require('../../../app/json/squidex/benefits.json');
const SubApps = require('../../../app/json/squidex/subApps.json');

const urls = [];

const subAppChildRoutes = [{
  appName: 'fam',
  routes: [{
    path: '/eligibility',
  }, {
    path: '/calculate-fam-support',
  }, {
    path: '/calculate-tp-support',
  }, {
    path: '/rental-advance',
  }, {
    path: '/deposit-advance',
  }],
}, {
  appName: 'comparator',
  routes: [],
}];

Services.forEach((service) => {
  urls.push(service.slug);
  urls.push(`${service.slug}/change-of-circumstances`);
  urls.push(`${service.slug}/updates`);

  urls.push(`${service.slug}/accessibility-statement`);
  urls.push(`${service.slug}/terms-and-conditions`);
  urls.push(`${service.slug}/contact-us`);
  urls.push(`${service.slug}/cookies`);

  const serviceCategories = Categories.filter((c) => service.categories.indexOf(c.id) !== -1);

  serviceCategories.forEach((category) => {
    urls.push(`${service.slug}/${category.slug}`);
    urls.push(`${service.slug}/.htaccess.bin`);

    const blocks = category.customLayout && category.pageLayout !== null ? category.pageLayout.filter(block => block.data.items) : null;

    let categoryBenefits;
    if (blocks !== null) {
      const layoutBenefits = [];
      category.pageLayout.forEach(block => {
        if (block.data.items && block.data.items.iv.length > 0) {
          if (block.data.items.iv.filter(i => i.__typename === 'Benefit').length) layoutBenefits.push(block.data.items.iv.filter(i => i.__typename === 'Benefit'));
        }
        if (block.data.oneThirdArea && block.data.oneThirdArea.iv.length > 0) {
          if (block.data.oneThirdArea.iv.filter(i => i.__typename === 'Benefit').length) layoutBenefits.push(block.data.oneThirdArea.iv.filter(i => i.__typename === 'Benefit'));
        }
        if (block.data.twoThirdsArea && block.data.twoThirdsArea.iv.length > 0) {
          if (block.data.twoThirdsArea.iv.filter(i => i.__typename === 'Benefit').length) layoutBenefits.push(block.data.oneThirdArea.iv.filter(i => i.__typename === 'Benefit'));
        }
      });

      categoryBenefits = layoutBenefits.reduce((acc, val) => acc.concat(val), []);
    } else {
      categoryBenefits = Benefits.filter(b => category.benefits.indexOf(b.id) !== -1);
    }
    const categorySubApps = SubApps.filter((sa) => category.subApps && category.subApps.indexOf(sa.id) !== -1);

    categoryBenefits.forEach((benefit) => {
      urls.push(`${service.slug}/${category.slug}/${benefit.slug}`);
    });

    categorySubApps.forEach((subApp) => {
      urls.push(`${service.slug}/${category.slug}/${subApp.appName.toLowerCase()}`);

      subAppChildRoutes.find((childRoute) => childRoute.appName === subApp.appName).routes.forEach((childRoute) => {
        urls.push(`${service.slug}/${category.slug}/${subApp.appName}${childRoute.path}`);
      });
    });
  });
});

module.exports = urls.map((url) => `/${url}`);
