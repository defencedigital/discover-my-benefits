module.exports = `
{
  queryCtacomponentsContents(top: 1000) {
    id
    data {
      name {
        iv
      }
      title {
        iv
      }
      text {
        iv
      }
      link {
        iv {
          __typename
          ... on Link {
            id
            data {
              name {
                iv
              }
              url {
                iv
              }
            }
          }
        }
      }
    }
  }
}
`;
