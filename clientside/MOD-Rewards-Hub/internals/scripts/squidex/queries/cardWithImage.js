module.exports = `
{
  queryCardwithimageContents(top: 1000) {
    id
    data {
      name {
        iv
      }
      benefit {
        iv {
          id
        }
      }
      image {
        iv {
          id
          thumbnailUrl
        }
      }
    }
  }
}
`;
