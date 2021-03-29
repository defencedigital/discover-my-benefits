/* eslint-disable no-underscore-dangle */
const axios = require('axios');

const fs = require('fs');
const pLimit = require('p-limit');
const queries = require('./queries');
const {removeDuplicates} = require('../../../app/utils/array');

const base64 = require('./modules/Base64');
const Base64 = new base64();

const {slugify} = require('../../../app/utils/string');

const promises = [];

const {chunk} = require('../../../app/utils/array');



const service = process.env.SERVICE;

const detectService = (slug) => {
  if (slug.indexOf('navy') !== -1) {
    return 'navy';
  }

  if (slug.indexOf('marine') !== -1) {
    return 'marines';
  }

  if (slug.indexOf('army') !== -1) {
    return 'army';
  }

  if (slug.indexOf('raf') !== -1 || slug.indexOf('airforce') !== -1) {
    return 'raf';
  }

  if (slug.indexOf('test') !== -1) {
    return '_test_-service';
  }

  return null;
};

const imageCache = {};

async function base64convertRetry(imageUrl, retryCount = 1) {
  if (imageCache[imageUrl] !== undefined) {
    return imageCache[imageUrl];
  }

  try {
    const data = await Base64.convert(imageUrl);
    imageCache[imageUrl] = data;

    return data;
  } catch (error) {
    if (retryCount >= 3) {
      throw error;
    } else {
      console.log(`Base64 convert ${imageUrl} failed, retrying (attempt ${retryCount + 1})`);
      return base64convertRetry(imageUrl, retryCount + 1);
    }
  }
}

const getThumbnailUrl = (x) => (x && x.iv && x.iv.length > 0 && x.iv[0].thumbnailUrl) ? x.iv[0].thumbnailUrl.split('?')[0] : null;
const getFirst = (x) => (x && x.iv && x.iv.length > 0) ? x.iv[0] : null;
const getFirstId = (x) => (x && x.iv && x.iv.length > 0) ? x.iv[0].id : null;

const getAllIds = (x) => (x && x.iv) ? x.iv.map((y) => y.id) : null;

const getAllLinkedItems = (a,b) => {
  if(a.length > 0 && b.length > 0) {
    // const obj1 = new Object(a);
    // const obj2 = new Object(b);
    const arr =  [];

    b.forEach((i) =>{
      arr.push(i)
    });
    a.forEach((i) =>{
      arr.push(i)
    });

    return arr;
  }
  return null;
};

async function fetchRetry(query, retryCount) {
  let axiosResponse;
  try {
    console.log(`Quering ${query} [${retryCount}/3]...`);
    axiosResponse = await axios(process.env.SQUIDEX_URI, {
      method: 'POST',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        authorization: process.env.SQUIDEX_TOKEN,
      },
      data: JSON.stringify({ query: queries[query] }),
    });
  } catch (e) {
    console.log(`Query ${query} [${retryCount}/3] failed`);
    if (e.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(' The request was made and the server responded with a status code that falls out of the range of 2xx');

    } else if (e.request) {
      console.log('The request was made but no response was received `e.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js');
      console.log(e.request);
    } else {
      // Something happened in setting up the request that triggered an e
      console.log('e', e.message);
    }
    console.log(e);

    if (retryCount === 3) {
      throw e;
    } else {
      return fetchRetry(query, retryCount + 1);
    }
  }

  console.log(`Query ${query} [${retryCount}/3] returned response`);
  const response = axiosResponse.data.data;

  return new Promise((resolve) => {
    switch (query) {

      case 'ctaComponents': {
        const ctacomponents = response.queryCtacomponentsContents.map((cta) => ({
          id: cta.id,
          link: (cta.data.link) ? cta.data.link.iv.map(item => Object.assign(item,{
            id:item.id,
            type: item.__typename,
            name: item.name,
            url:item.url
          })): null,
          title: (cta.data.title) ? cta.data.title.iv : null,
          text: (cta.data.text) ? cta.data.text.iv : null,
          name: (cta.data.name) ? cta.data.name.iv : null,
        }));

        resolve(ctacomponents);
      }
        break;


      case 'services': {

        const logoImages = [];
        const headerImages = [];
        const facebookImages = [];

        let services = response.queryServiceContents.map((service) => {
          const logoImage = service.data.logo;
          const {headerImage} = service.data;
          const {facebookImage} = service.data;
          logoImages.push(getThumbnailUrl(logoImage));
          headerImages.push(getThumbnailUrl(headerImage));
          facebookImages.push(getThumbnailUrl(facebookImage));

          return {
            id: service.id,
            name: service.data.name.iv,
            themeColor: service.data.themeColor.iv,
            slug: slugify(service.data.name.iv),
            categories: getAllIds(service.data.categories),
            beta: (service.data.beta) ? service.data.beta.iv : null,
            feedbackLink: (service.data.feedbackLink) ? service.data.feedbackLink.iv : null,
            betaLink: (service.data.betaLink) ? service.data.betaLink.iv : null,
            serviceType: detectService(slugify(service.data.name.iv)),
          };
        });


        const limit = pLimit(1);

        Promise.resolve()
          .then(() => { console.log(`Service: Downloading logoImages (${logoImages.length})`); })
          .then(() => Promise.all(logoImages.map((logoImageUrl) => limit(() => base64convertRetry(logoImageUrl)))))
          .then((logoImages) => {
            services = services.map((service, index) => Object.assign(service, {
              logo: logoImages[index],
            }));
          })
          .then(() => { console.log('Service: Downloading logoImages complete'); })
          .then(() => { console.log(`Service: Downloading headerImages (${headerImages.length})`); })
          .then(() => Promise.all(headerImages.map((headerImageUrl) => limit(() => base64convertRetry(headerImageUrl)))))
          .then((headerImages) => {
            services = services.map((service, index) => Object.assign(service, {
              headerImage: headerImages[index],
            }));
          })
          .then(() => { console.log('Service: Downloading headerImages complete'); })
          .then(() => { console.log(`Service: Downloading facebookImages (${facebookImages.length})`); })
          .then(() => Promise.all(facebookImages.map((faceBookImageUrl) => limit(() => base64convertRetry(faceBookImageUrl)))))
          .then((facebookImages) => {
            services = services.map((service, index) => Object.assign(service, {
              facebookImage: facebookImages[index],
            }));
          })
          .then(() => { console.log('Service: Downloading facebookImages complete'); })
          .then(() => {
            resolve(services);
          });
      }
        break;
      case 'block3col': {
        const block3col = response.queryBlock3ColContents.map((block3col) => ({
          id: block3col.id,
          type: block3col.__typename,
          oneThirdArea: (block3col.data.oneThirdArea) ? block3col.data.oneThirdArea.iv.map((item, index) => Object.assign(item,{
            id:item.id,
            type: item.__typename,
          })): null,
          twoThirdsArea: (block3col.data.twoThirdsArea) ? block3col.data.twoThirdsArea.iv.map((item, index) => Object.assign(item,{
            id:item.id,
            type: item.__typename,
          })): null,
          items: (block3col.data.oneThirdArea && block3col.data.twoThirdsArea) ? getAllLinkedItems(block3col.data.oneThirdArea.iv, block3col.data.twoThirdsArea.iv ) :  null,
          layoutOrder: (block3col.data.layoutOrder) ? block3col.data.layoutOrder.iv : null,
          title: (block3col.data.title) ? block3col.data.title.iv : null,
          twoThirdsColumnTitle: (block3col.data.twoThirdsColumnTitle) ? block3col.data.twoThirdsColumnTitle.iv : null,
          name: (block3col.data.name) ? block3col.data.name.iv : null,
          subheading: (block3col.data.subheading) ? block3col.data.subheading.iv : null,
          folderDisplay: (block3col.data.folderDisplay) ? block3col.data.folderDisplay.iv : null,
        }));

        resolve(block3col);
      }
        break;

      case 'categories': {
        const cardImages = [];
        const catImages = [];
        let categories = response.queryCategoryContents.map((category) => {
          const {cardImageNavy} = category.data;
          const {cardImageArmy} = category.data;
          const {cardImageMarines} = category.data;
          const {cardImageRaf} = category.data;

          const {catImageNavy} = category.data;
          const {catImageArmy} = category.data;
          const {catImageMarines} = category.data;
          const {catImageRaf} = category.data;

          cardImages.push(getThumbnailUrl(cardImageNavy));
          cardImages.push(getThumbnailUrl(cardImageArmy));
          cardImages.push(getThumbnailUrl(cardImageMarines));
          cardImages.push(getThumbnailUrl(cardImageRaf));

          catImages.push(getThumbnailUrl(catImageNavy));
          catImages.push(getThumbnailUrl(catImageArmy));
          catImages.push(getThumbnailUrl(catImageMarines));
          catImages.push(getThumbnailUrl(catImageRaf));



          return {
            id: category.id,
            name: category.data.name.iv,
            slug: slugify(category.data.name.iv),
            strapline: (category.data.strapline) ? category.data.strapline.iv : null,
            description: (category.data.description) ? category.data.description.iv : null,
            benefits: getAllIds(category.data.benefits),
            categories: getAllIds(category.data.categories) || [],
            subApps: getAllIds(category.data.subApps),
            subAppsBottom: getAllIds(category.data.subAppsBottom),
            showAll: (category.data.showAll) ? (!!category.data.showAll.iv) : false,
            tags: getAllIds(category.data.tags && category.data.tags.iv),
            pageLayout: (category.data.pageLayout) ? category.data.pageLayout.iv : null,
            customLayout: (category.data.customLayout) ? (!!category.data.customLayout.iv) : false,

          };
        });


        const limit = pLimit(1);

        Promise.resolve()
          .then(() => { console.log(`Categories: Downloading cardImages (${cardImages.length})...`); })
          .then(() => Promise.all(cardImages.map((cardImageUrl) => limit(() => base64convertRetry(cardImageUrl)))))
          .then((cardImages) => {
            const convertedCardImagesChunks = chunk(cardImages, 4);

            categories = categories.map((category, index) => Object.assign(category, {
              cardImageNavy: convertedCardImagesChunks[index][0],
              cardImageArmy: convertedCardImagesChunks[index][1],
              cardImageMarines: convertedCardImagesChunks[index][2],
              cardImageRaf: convertedCardImagesChunks[index][3],
            }));
          })
          .then(() => { console.log('Categories: Downloading cardImages complete'); })
          .then(() => { console.log(`Categories: Downloading catImages ${catImages.length}...`); })
          .then(() => Promise.all(catImages.map((catImageUrl) => limit(() => base64convertRetry(catImageUrl)))))
          .then((catImages) => {
            const convertedCatImagesChunks = chunk(catImages, 4);
            categories = categories.map((category, index) => Object.assign(category, {
              catImageNavy: convertedCatImagesChunks[index][0],
              catImageArmy: convertedCatImagesChunks[index][1],
              catImageMarines: convertedCatImagesChunks[index][2],
              catImageRaf: convertedCatImagesChunks[index][3],
            }));
          })
          .then(() => { console.log('Categories: Downloading catImages complete'); })
          .then(() => { console.log('Categories: Downloading commitmentImages complete'); })
          .then(() => {
            resolve(categories);
          });
      }
        break;
      case 'benefits': {
        const benefitImages = [];

        let benefits = response.queryBenefitContents.map((benefit) => {
          const {benefitImageNavy} = benefit.data;
          const {benefitImageArmy} = benefit.data;
          const {benefitImageMarines} = benefit.data;
          const {benefitImageRaf} = benefit.data;

          benefitImages.push(getThumbnailUrl(benefitImageNavy));
          benefitImages.push(getThumbnailUrl(benefitImageArmy));
          benefitImages.push(getThumbnailUrl(benefitImageMarines));
          benefitImages.push(getThumbnailUrl(benefitImageRaf));

          const primaryCategoryIds = getAllIds(benefit.data.primaryCategory);
          let primaryCategoryId = null;
          if (primaryCategoryIds.length === 1) {
            // console.log('one benefit', benefit.data.name.iv);
            primaryCategoryId = primaryCategoryIds[0];
          } else if (primaryCategoryIds.length > 1) {
            switch (service) {
              case 'royal-navy':
                primaryCategoryId = primaryCategoryIds[0];
                break;
              case 'royal-marines':
                primaryCategoryId = primaryCategoryIds[1];
                break;
              case 'army':
                primaryCategoryId = primaryCategoryIds[2];
                break;
              case 'raf':
                primaryCategoryId = primaryCategoryIds[3];
                break;
            }
          }
          if (primaryCategoryId === null) {
            console.log('Unlinked benefit', benefit.data.name);
          }

          return {
            id: benefit.id,
            name: benefit.data.name.iv,
            title: benefit.data.title.iv,
            slug: slugify(benefit.data.name.iv),
            strapline: (benefit.data.strapline) ? benefit.data.strapline.iv : null,
            description: (benefit.data.description) ? benefit.data.description.iv : null,
            content: (benefit.data.content) ? benefit.data.content.iv : null,
            calculation: getFirstId(benefit.data.calculation),
            primaryCategory: primaryCategoryId,
            additionalQuestions: getAllIds(benefit.data.additionalQuestions),
            internalQuestions: (benefit.data.internalQuestions) ? benefit.data.internalQuestions.iv : null,
            links: getAllIds(benefit.data.links),
            benefitTags: getAllIds(benefit.data.benefitTags),
            howToClaim: (benefit.data.howToClaim) ? benefit.data.howToClaim.iv : null,
            usefulStatus: (benefit.data.usefulStatus) ? benefit.data.usefulStatus.iv : null,
            disclaimer: (benefit.data.disclaimer) ? benefit.data.disclaimer.iv : null,
          };
        });

        const limit = pLimit(1);


        Promise.resolve()
          .then(() => { console.log(`Benefit: Downloading images (${benefitImages.length})...`); })
          .then(() => Promise.all(benefitImages.map((benefitImageUrl) => limit(() => base64convertRetry(benefitImageUrl)))))
          .then((benefitImages) => {
            const convertedImagesChunks = chunk(benefitImages, 4);
            benefits = benefits.map((benefit, index) => Object.assign(benefit, {
              benefitImageNavy: convertedImagesChunks[index][0],
              benefitImageArmy: convertedImagesChunks[index][1],
              benefitImageMarines: convertedImagesChunks[index][2],
              benefitImageRaf: convertedImagesChunks[index][3],
            }));
          })
          .then(() => { console.log('Benefit: Downloading images complete'); })
          .then(() => {
            resolve(benefits);
          });
      }
        break;
      case 'calculations': {
        const calculations = response.queryCalculationContents.map((calculation) => {
          const functions = {};

          if (calculation.data.functions) {
            Object.keys(calculation.data.functions.iv).forEach((functionName) => {
              if (functionName === 'eligible') {
                functions[functionName] = calculation.data.functions.iv[functionName].toLowerCase();
              } else {
                functions[functionName] = calculation.data.functions.iv[functionName];
              }
            });
          }

          return {
            id: calculation.id,
            ...functions,
          };
        });

        resolve(calculations);
      }
        break;
      case 'textcomponents': {
        const textcomponents = response.queryTextComponentContents.map((tc) => ({
          id: tc.id,
          title: (tc.data.title) ? tc.data.title.iv : null,
          text: (tc.data.text) ? tc.data.text.iv : null,
          columnSpan: (tc.data.columnSpan) ? tc.data.columnSpan.iv : null,
        }));
        resolve(textcomponents);
      }
        break;

      case 'cardWithImage': {

        const ImageUrls = [];
        let cardWithImage = response.queryCardwithimageContents.map((c) => {
          const imgUrl = (c.data.image) ? ImageUrls.push(getThumbnailUrl(c.data.image)) : null;


          return {
            id: c.id,
            benefit: (c.data.benefit) ? c.data.benefit.iv : null,
            image:imgUrl
          };
        });

        const limit = pLimit(1);

        Promise.resolve()
          .then(() => { console.log(`Service: Downloading cardwithimage images`); })
          .then(() => Promise.all(ImageUrls.map((imgUrl) => limit(() => base64convertRetry(imgUrl)))))
          .then((ImageUrls) => {
            cardWithImage = cardWithImage.map((card,index) => Object.assign(card,{
              image: ImageUrls[index],
            }));
          })

          .then(() => {
            resolve(cardWithImage);
          });
      }

        break;
      case 'questions': {
        const questions = response.queryQuestionContents.map((question) => ({
          id: question.id,
          name: question.data.name.iv,
          namespace: question.data.namespace.iv.toLowerCase(),
          title: question.data.title.iv,
          type: question.data.type.iv,
          hint: (question.data.hint) ? question.data.hint.iv : null,
          options: getAllIds(question.data.options),
          dependencies: getAllIds(question.data.dependancies),
        }));

        resolve(questions);
      }
        break;
      case 'options': {
        const options = response.queryOptionContents.map((option) => ({
          id: option.id,
          name: (option.data.name) ? option.data.name.iv : null,
          value: (option.data.value) ? option.data.value.iv : null,
        }));

        resolve(options);
      }
        break;
      case 'dependencies': {
        const dependencies = response.queryDependencyContents.map((dependency) => ({
          id: dependency.id,
          question: getFirstId(dependency.data.question),
          value: getAllIds(dependency.data.value),
        }));

        resolve(dependencies);
      }
        break;

      case 'links': {
        const links = response.queryLinkContents.map((link) => ({
          id: link.id,
          name: (link.data.name) ? link.data.name.iv : null,
          internalLink: (link.data.internalLink) ? link.data.internalLink.iv : null,
          modnetLink: (link.data.modnetLink) ? link.data.modnetLink.iv : null,
          gatewayLink: (link.data.gatewayLink) ? link.data.gatewayLink.iv : null,
          url: (link.data.url) ? link.data.url.iv : null,
          description: (link.data.description) ? link.data.description.iv : null,
        }));

        resolve(links);
      }
        break;
      case 'profileCategories': {
        const profileCategories = response.queryProfileCategoryContents.map((category) => ({
          id: category.id,
          name: (category.data.name) ? category.data.name.iv : null,
          title: (category.data.title) ? category.data.title.iv : null,
          questions: getAllIds(category.data.questions),
        }));

        resolve(profileCategories);
      }
        break
      case 'cocCategories': {
        const imageUrls = [];

        let cocCategories = response.queryCocCategoriesContents.map((data) => {
          return data.data.category.iv.map((category,index) => {

            const imgUrl = (category.data.image) ? imageUrls.push(getThumbnailUrl(category.data.image)): null;


            return {
              id: category.id,
              title: (category.data.title) ? category.data.title.iv : null,
              namespace: (category.data.namespace) ? category.data.namespace.iv : null,
              subheading: (category.data.subheading) ? category.data.subheading.iv : null,
              benefits: getAllIds(category.data.benefits),
            }
        });
      })

        const limit = pLimit(1);
        // flatten array so we can add images below
        cocCategories =  [].concat(...cocCategories)

        Promise.resolve()
          .then(() => { console.log(`Service: Downloading coc Category images`); })
          .then(() => Promise.all(imageUrls.map((imgUrl) => limit(() => base64convertRetry(imgUrl)))))
          .then((imageUrls) => {
            cocCategories = cocCategories.map((card,index) => Object.assign(card,{
              image: imageUrls[index],
            }));
          })
          .then(() => resolve(cocCategories));
      }
        break;
      case 'subApps': {
        const subApps = response.querySubappContents.map((subApp) => ({
          id: subApp.id,
          name: (subApp.data.name) ? subApp.data.name.iv : null,
          title: (subApp.data.title) ? subApp.data.title.iv : null,
          appName: (subApp.data.appname) ? subApp.data.appname.iv : null,
          strapline: (subApp.data.strapline) ? subApp.data.strapline.iv : null,
          xFactor: getFirst(subApp.data.xfactor),
        }));
        resolve(subApps);
      }
        break;
      case 'accessibilityStatement': {
        const accessibilityStatement = response.queryAccessibilityStatementContents.map((as) => ({
          id: as.id,
          title: (as.data.title) ? as.data.title.iv : null,
          strapline: (as.data.strapline) ? as.data.strapline.iv : null,
          service: getFirstId(as.data.service),
          content: (as.data.content) ? as.data.content.iv : null,
        }));

        resolve(accessibilityStatement);
      }
        break;
      case 'terms': {
        const terms = response.queryTermsContents.map((term) => ({
          id: term.id,
          title: (term.data.title) ? term.data.title.iv : null,
          strapline: (term.data.strapline) ? term.data.strapline.iv : null,
          service: getFirstId(term.data.service),
          content: (term.data.content) ? term.data.content.iv : null,
        }));

        resolve(terms);
      }
        break;
      case 'cookies': {
        const cookies = response.queryCookiesContents.map((cookie) => ({
          id: cookie.id,
          title: (cookie.data.title) ? cookie.data.title.iv : null,
          strapline: (cookie.data.strapline) ? cookie.data.strapline.iv : null,
          service: getFirstId(cookie.data.service),
          content: (cookie.data.content) ? cookie.data.content.iv : null,
        }));

        resolve(cookies);
      }
        break;
      case 'contact': {
        const contact = response.queryContactContents.map((c) => ({
          id: c.id,
          title: (c.data.title) ? c.data.title.iv : null,
          strapline: (c.data.strapline) ? c.data.strapline.iv : null,
          service: getFirstId(c.data.service),
          content: (c.data.content) ? c.data.content.iv : null,
        }));

        resolve(contact);
      }
        break;
      case 'fam': {
        const fams = response.queryFamContents.map((f) => {
          const fam = f.data;

          return {
            exploreIntro: fam.exploreIntro.iv,
            exploreDescription: fam.exploreDescription.iv,
            exploreCtaIntro: fam.exploreCtaIntro.iv,
            exploreCtaDescription: fam.exploreCtaDescription.iv,
            allowanceIntro: fam.allowanceIntro.iv,
            allowanceDescription: fam.allowanceDescription.iv,
            allowanceRentingQuestion: fam.allowanceRentingQuestion.iv,
            allowanceBaseQuestion: fam.allowanceBaseQuestion.iv,
            allowanceBaseQuestionDescription: fam.allowanceBaseQuestionDescription.iv,
            allowanceDependantsQuestion: fam.allowanceDependantsQuestion.iv,
            allowanceDependantsQuestionDescription: fam.allowanceDependantsQuestionDescription.iv,
            allowanceBenchmarkTitle: fam.allowanceBenchmarkTitle.iv,
            allowanceBenchmarkDescription: fam.allowanceBenchmarkDescription.iv,
            allowanceBreakdownTitle: fam.allowanceBreakdownTitle.iv,
            allowanceBreakdownRentTitle: fam.allowanceBreakdownRentTitle.iv,
            allowanceBreakdownRentDescription: fam.allowanceBreakdownRentDescription.iv,
            allowanceBreakdownCoreTitle: fam.allowanceBreakdownCoreTitle.iv,
            allowanceBreakdownCoreDescription: fam.allowanceBreakdownCoreDescription.iv,
            allowanceBreakdownRentalTitle: fam.allowanceBreakdownRentalTitle.iv,
            allowanceBreakdownRentalDescription: fam.allowanceBreakdownRentalDescription.iv,
            allowanceBreakdownTotalTitle: fam.allowanceBreakdownTotalTitle.iv,
            allowanceBreakdownTotalDescription: fam.allowanceBreakdownTotalDescription.iv,
            allowancePersonalTitle: fam.allowancePersonalTitle.iv,
            allowancePersonalDescription: fam.allowancePersonalDescription.iv,
            allowanceRentPayTitle: fam.allowanceRentPayTitle.iv,
            allowanceRentPayDescription: fam.allowanceRentPayDescription.iv,
            depositIntro: fam.depositIntro.iv,
            depositDescription: fam.depositDescription.iv,
            depositRentalQuestion: fam.depositRentalQuestion.iv,
            depositRentalDescription: fam.depositRentalDescription.iv,
            depositAmountQuestion: fam.depositAmountQuestion.iv,
            depositAmountQuestionDescription: fam.depositAmountQuestionDescription.iv,
            depositBreakdownIntro: fam.depositBreakdownIntro.iv,
            depositBreakdownDescription: fam.depositBreakdownDescription.iv,
            cashflowIntro: fam.cashflowIntro.iv,
            cashflowDescription: fam.cashflowDescription.iv,
            cashflowRentalQuestion: fam.cashflowRentalQuestion.iv,
            cashflowRentalDescription: fam.cashflowRentalDescription.iv,
            cashflowRentalStartQuestion: fam.cashflowRentalStartQuestion.iv,
            cashflowRentalStartDescription: fam.cashflowRentalStartDescription.iv,
            cashflowBreakdownTitle: fam.cashflowBreakdownTitle.iv,
            cashflowBreakdownTitleHint: fam.cashflowBreakdownTitleHint.iv,
            cashflowBreakdownDescription: fam.cashflowBreakdownDescription.iv,
            eligibleIntro: fam.eligibleIntro.iv,
            eligibleDescription: fam.eligibleDescription.iv,
            eligibleTitle: fam.eligibleTitle.iv,
            eligibleStatements: getAllIds(fam.eligibleStatements),
            links: getAllIds(fam.links),
            calculateSupportLinks: getAllIds(fam.calculateSupportLinks),
            depositAndRentalLinks: getAllIds(fam.depositAndRentalLinks),
          };
        });

        resolve(fams);
      }
        break;
      case 'tp': {
        const tps = response.queryTpContents.map((t) => {
          const tp = t.data;

          return {
            exploreIntro: tp.exploreIntro.iv,
            exploreDescription: tp.exploreDescription.iv,
            exploreCtaIntro: tp.exploreCtaIntro.iv,
            exploreCtaDescription: tp.exploreCtaDescription.iv,
            allowanceIntro: tp.allowanceIntro.iv,
            allowanceDescription: tp.allowanceDescription.iv,
            allowanceRentingQuestion: tp.allowanceRentingQuestion.iv,
            allowanceBaseQuestion: tp.allowanceBaseQuestion.iv,
            allowanceBaseQuestionDescription: tp.allowanceBaseQuestionDescription.iv,
            allowanceDependantsQuestion: tp.allowanceDependantsQuestion.iv,
            allowanceDependantsQuestionDescription: tp.allowanceDependantsQuestionDescription.iv,
            allowanceBenchmarkTitle: tp.allowanceBenchmarkTitle.iv,
            allowanceBenchmarkDescription: tp.allowanceBenchmarkDescription.iv,
            allowanceBreakdownTitle: tp.allowanceBreakdownTitle.iv,
            allowanceBreakdownRentTitle: tp.allowanceBreakdownRentTitle.iv,
            allowanceBreakdownRentDescription: tp.allowanceBreakdownRentDescription.iv,
            allowanceBreakdownCoreTitle: tp.allowanceBreakdownCoreTitle.iv,
            allowanceBreakdownCoreDescription: tp.allowanceBreakdownCoreDescription.iv,
            allowanceBreakdownRentalTitle: tp.allowanceBreakdownRentalTitle.iv,
            allowanceBreakdownRentalDescription: tp.allowanceBreakdownRentalDescription.iv,
            allowanceBreakdownTotalTitle: tp.allowanceBreakdownTotalTitle.iv,
            allowanceBreakdownTotalDescription: tp.allowanceBreakdownTotalDescription.iv,
            allowancePersonalTitle: tp.allowancePersonalTitle.iv,
            allowancePersonalDescription: tp.allowancePersonalDescription.iv,
            allowanceRentPayTitle: tp.allowanceRentPayTitle.iv,
            allowanceRentPayDescription: tp.allowanceRentPayDescription.iv,
            depositIntro: tp.depositIntro.iv,
            depositDescription: tp.depositDescription.iv,
            depositRentalQuestion: tp.depositRentalQuestion.iv,
            depositRentalDescription: tp.depositRentalDescription.iv,
            depositAmountQuestion: tp.depositAmountQuestion.iv,
            depositAmountQuestionDescription: tp.depositAmountQuestionDescription.iv,
            depositBreakdownIntro: tp.depositBreakdownIntro.iv,
            depositBreakdownDescription: tp.depositBreakdownDescription.iv,
            cashflowIntro: tp.cashflowIntro.iv,
            cashflowDescription: tp.cashflowDescription.iv,
            cashflowRentalQuestion: tp.cashflowRentalQuestion.iv,
            cashflowRentalDescription: tp.cashflowRentalDescription.iv,
            cashflowRentalStartQuestion: tp.cashflowRentalStartQuestion.iv,
            cashflowRentalStartDescription: tp.cashflowRentalStartDescription.iv,
            cashflowBreakdownTitle: tp.cashflowBreakdownTitle.iv,
            cashflowBreakdownTitleHint: tp.cashflowBreakdownTitleHint.iv,
            cashflowBreakdownDescription: tp.cashflowBreakdownDescription.iv,
            eligibleIntro: tp.eligibleIntro.iv,
            eligibleDescription: tp.eligibleDescription.iv,
            eligibleTitle: tp.eligibleTitle.iv,
            eligibleStatements: getAllIds(tp.eligibleStatements),
          };
        });

        resolve(tps);
      }
        break;
      case 'fs': {
        const allFSItems = response.queryFsContents.map((f) => {
          const singleFS = f.data;

          return {
            title: singleFS.title.iv,
            description: singleFS.description.iv,
            details: singleFS.details.iv,
          };
        });

        resolve(allFSItems);
      }
        break;
      case 'tags': {
        const Tags = response.queryTagsContents.map((t) => ({
          id: t.id,
          name: (t.data.name) ? t.data.name.iv : null,
          globalFamilyTag: (t.data.globalFamilyTag) ? t.data.globalFamilyTag.iv : null,
        }));
        resolve(Tags);
      }
        break;
      case 'famEligibleStatement': {
        const famEligibleStatements = response.queryFamEligibleStatementContents.map((statement) => ({
          id: statement.id,
          title: statement.data.title.iv,
        }));

        resolve(famEligibleStatements);
      }
        break;
      case 'tpEligibleStatement': {
        const tpEligibleStatements = response.queryTpEligibleStatementContents.map((statement) => ({
          id: statement.id,
          title: statement.data.title.iv,
        }));

        resolve(tpEligibleStatements);
      }
        break;
      case 'fsCommitmentTypes': {
        const fsCommitmentTypes = response.queryFsCommitmentTypeContents.map((type) => ({
          id: type.id,
          xFactor: type.data.xFactor.iv,
          xFactorOF5AndAboveCalculation: getFirstId(type.data.xFactorOF5AndAboveCalculation),
          xFactorOF5AndAboveLeaveFigure: (type.data.xFactorOF5AndAboveLeaveFigure) ? type.data.xFactorOF5AndAboveLeaveFigure.iv : null,
          xFactorOF5AndAboveXFactorMessage: (type.data.xFactorOF5AndAboveXFactorMessage) ? type.data.xFactorOF5AndAboveXFactorMessage.iv : null,
          percentage: type.data.percentage.iv,
          option: getFirstId(type.data.option),
          commitmentTypes: getAllIds(type.data.commitmentTypes),
          benefit: getFirstId(type.data.benefit),
          dailyRate: (type.data.dailyRate) ? type.data.dailyRate.iv : null,
          maxDays: (type.data.maxDays) ? type.data.maxDays.iv : null,
          salaryTooltip: (type.data.salaryTooltip) ? type.data.salaryTooltip.iv : null,
          leaveMessage: (type.data.leaveMessage) ? type.data.leaveMessage.iv : null,
          expressLeaveAsHalfDay: (type.data.expressLeaveAsHalfDay) ? type.data.expressLeaveAsHalfDay.iv : null,
        }));

        resolve(fsCommitmentTypes);
      }
        break;
      case 'fsCalculations': {
        const fsCalculations = response.queryFsCalculationContents.map((type) => ({
          id: type.id,
          percentageOne: type.data.percentageOne.iv,
          commitmentTypeOne: getFirstId(type.data.commitmentTypeOne),
          commitmentTypeTwo: getFirstId(type.data.commitmentTypeTwo),
        }));

        resolve(fsCalculations);
      }
        break;
      case 'updates': {
        const updates = response.queryUpdatesContents.map((update) => ({
          id: update.id,
          published: update.data.published.iv,
          title: update.data.title.iv,
          description: update.data.description.iv,
          service: getFirstId(update.data.service),
          links: getAllIds(update.data.links),
          benefitLinks: getAllIds(update.data.benefitLinks),
          categoryLinks: getAllIds(update.data.categoryLinks),
        }));

        resolve(updates);
      }
        break;
      case 'accordions': {
        const accordions = response.queryAccordionContents.map((acc) => ({
          id: acc.id,
          identifier: (acc.data.id) ? acc.data.id.iv : null,
          title: (acc.data.title) ? acc.data.title.iv : null,
          content: (acc.data.content) ? acc.data.content.iv : null,
        }));

        resolve(accordions);
      }
        break;
      case 'block4col': {
        const block4col = response.queryBlock4ColContents.map((block4col) => ({
          id: block4col.id,
          items: (block4col.data.items) ? block4col.data.items.iv.map((item, index) => Object.assign(item,{
            id:item.id,
            type: item.__typename,
          })): null,
          title: (block4col.data.title) ? block4col.data.title.iv : null,
          name: (block4col.data.name) ? block4col.data.name.iv : null,
          subheading: (block4col.data.subheading) ? block4col.data.subheading.iv : null,
        }));

        resolve(block4col);
      }
        break;

      case 'images': {
        const desktopImage = [];
        const mobileImage = [];
        let images = response.queryImagesContents.map((img) => {
          const desktopImageUrl = (img.data.desktopImage) ? desktopImage.push(getThumbnailUrl(img.data.desktopImage)) : null;
          const mobileImageUrl = (img.data.mobileImage) ? mobileImage.push(getThumbnailUrl(img.data.mobileImage)) : null;
          return {
            id: img.id,
            identifier: (img.data.id) ? img.data.id.iv : null,
          };
        });

        const limit = pLimit(1);

        Promise.resolve()
          .then(() => { console.log(`Service: Downloading desktopImages`); })
          .then(() => Promise.all(desktopImage.map((desktopImageUrl) => limit(() => base64convertRetry(desktopImageUrl)))))
          .then((desktopImage) => {
            images = images.map((image,index) => Object.assign(image,{
              desktopImage: desktopImage[index],
            }));
          })
          .then(() => Promise.all(mobileImage.map((mobileImageUrl) => limit(() => base64convertRetry(mobileImageUrl)))))
          .then((mobileImage) => {
            images = images.map((image,index) => Object.assign(image,{
              mobileImage: mobileImage[index],
            }));
          })
          .then(() => {
            resolve(images);
          });
      }
        break;
      default: {
        resolve([]);
      }
    }
  })
    .catch((parseError) => {
      console.log(`Parsing ${query} failed`);

      // Something happened in setting up the request that triggered an e
      console.log(parseError);

      throw parseError;
    });
}

console.log('Sync: Staring sync process.');

// queue all queries for fetching
const limit = pLimit(1);
Object.keys(queries).forEach((query) => {
  promises.push(limit(() => fetchRetry(query, 0)));
});

Promise.all(promises).then((result) => {
  console.log('Sync: Downloads complete');
  const jsonDir = './app/json';
  const squidexDir = './app/json/squidex';

  if (!fs.existsSync(jsonDir)) {
    console.log(`Creating ${jsonDir}`);
    fs.mkdirSync(jsonDir);
  }

  if (!fs.existsSync(squidexDir)) {
    console.log(`Creating ${squidexDir}`);
    fs.mkdirSync(squidexDir);
  }

  Object.keys(queries).forEach((query, index) => {
    fs.writeFile(`${squidexDir}/${query}.json`, JSON.stringify(removeDuplicates(result[index].concat.apply([], result[index]), 'id')), (err) => {
      if (err) {
        throw err;
      }

      return true;
    });
  });

  console.log('Sync: Sync complete');
}).catch((e) => {
  console.log(e);

  setTimeout(() => { throw e; });
});
