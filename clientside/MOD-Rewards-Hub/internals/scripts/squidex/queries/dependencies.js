module.exports = `
{
 queryDependencyContents(top: 1000) {
      id
      data {
        name {
          iv
        }
        question {
          iv {
            id
          }
        }
        value {
          iv {
            id
          }
        }
      }
    }
  }
`;
