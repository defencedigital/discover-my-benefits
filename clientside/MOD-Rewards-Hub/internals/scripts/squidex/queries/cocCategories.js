module.exports = `
{
  queryCocCategoriesContents {
    data {
      category {
        ... on CocCategoriesDataCategoryDto {
          iv {
            id
            data {
              namespace {
                iv
              }
              subheading {
                iv
              }
              title {
                iv
              }
              image {
                iv {
                  id
                  thumbnailUrl
                }
              }
              benefits {
                iv {
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