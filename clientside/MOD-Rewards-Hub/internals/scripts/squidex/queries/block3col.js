module.exports = `
{
  queryBlock3ColContents(top: 1000) {
    id
    data {
      name {
        iv
      }
      title {
        iv
      }
      subheading{
        iv
      }
      oneThirdArea{
        iv {
          __typename
            ... on Category {
              id
            }
           ... on Benefit {
              id
            }
            ... on TextComponent {
              id
              data{
                columnSpan{
                  iv
                }
              }
            }
        }
      }
      twoThirdsColumnTitle{
        iv
      }
      twoThirdsArea{
        iv {
          __typename
            ... on Category {
              id
            }
           ... on Benefit {
              id
            }
            ... on TextComponent {
              id
              data{
                columnSpan{
                  iv
                }
              }
            }
            ... on Ctacomponents {
              id
              data{
                columnSpan{
                  iv
                }
              }
            }
            ... on Cardwithimage {
              id
              data {
                name {
                  iv
                }
                image {
                  iv {
                    id
                    thumbnailUrl
                  }
                }
                benefit{
                  iv{
                    id
                  }
                }
              }
            }
        }
      }
      layoutOrder{
        iv
      }
      folderDisplay{
        iv
      }
    }
  }
}

`;
