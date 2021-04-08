module.exports = `
{
 queryFsCalculationContents(top: 1000) {
    id
    data {
      percentageOne {
        iv
      },
      commitmentTypeOne {
        iv {
          id
        }
      }
      commitmentTypeTwo {
        iv {
          id
        }
      }      
    }
  }
}
`;
