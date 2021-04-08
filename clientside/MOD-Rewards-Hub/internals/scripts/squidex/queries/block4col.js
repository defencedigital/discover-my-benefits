module.exports = `
{
  queryBlock4ColContents(top: 1000) {
    id
    data {
      name {
        iv
      }
      title {
        iv
      }
      subheading {
        iv
      }
      items {
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
    }
  }
}

`;
