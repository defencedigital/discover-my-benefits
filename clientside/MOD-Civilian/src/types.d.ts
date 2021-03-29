interface IGlobalPageProps {
  metaTitle: string;
  metaDescription: string;
  introTitle: string;
  description: string;
  slug: string;
  name: string;
  headerImage?: [
    {
      url: string;
    },
  ];
}
interface ILandingPageProps {
  squidex: {
    queryLandingpageContents: [
      {
        flatData: {
          metaTitle: string;
          metaDescription: string;
          title: string;
          subtitle: string;
          introTitle: string;
          description: string;
          slug: string;
          name?: string;
          benefit?: IBenefitProps[];
          featuredBenefitTag: string;
          featuredBenefitCaption: string;
          categories: ICategoryLandingpageProps[];
        };
      },
    ];
  };
}

interface IUncategorisedBenefits {
  uncategorisedBenefits: [
    {
      id: string;
      flatData: {
        slug: string;
        name: string;
        parentCategory: [
          {
            flatData: {
              slug: string;
              name: string;
            };
            id: string;
          },
        ];
      };
    },
  ];
}

interface ISubcategorisedBenefits {
  benefits: [
    {
      id: string;
      flatData: {
        name: string;
        shortIntro: string;
        slug: string;
        parentCategory: [
          {
            flatData: {
              slug: string;
              name: string;
            };
            id: string;
          },
        ];
      };
    },
  ];
}

interface IPopularBenefits {
  flatData: {
    name: string;
    slug: string;
    shortIntro: string;
    parentCategory: [
      {
        flatData: {
          name: string;
          slug: string;
        };
        id: string;
      },
    ];
  };
  id: string;
}

interface IFeaturedBenefitProps {
  featuredBenefitCaption?: string;
  benefit?: IBenefitProps[];
  featuredBenefitTag?: string;
}
interface IBenefitProps {
  id: string;
  flatData: {
    headerImage: [
      {
        url: string;
      },
    ];
    name: string;
    slug: string;
    parentCategory: [
      {
        flatData: {
          slug: string;
        };
      },
    ];
  };
}
interface ICategoryLandingpageProps {
  id: string;
  flatData: {
    shortIntro?: string;
    slug: string;
    name: string;
    headerImage: [
      {
        url: string;
      },
    ];
    uncategorisedBenefits: IUncategorisedBenefits[];
    subcategorisedBenefits: ISubcategorisedBenefits[];
    popularBenefits: IPopularBenefits[];
  };
}

interface IBreadcrumbItemProps {
  text: string;
  slug: string;
  active: boolean;
  icon?: string;
}

interface IBenefits {
  id: string;
  flatData: {
    name: string;
    shortIntro: string;
    slug: string;
    parentCategory: [
      {
        flatData: {
          slug: string;
          name: string;
        };
        id: string;
      },
    ];
  };
}
