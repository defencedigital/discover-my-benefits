module.exports = `
{
 querySubappContents(top: 1000) {
    id
    data {
      name {
        iv
      }
      title {
        iv
      }
      appname {
        iv
      }
      strapline {
        iv
      }
      xfactor {
        iv {
          id
        }
      }
    }
  }
}
`;
