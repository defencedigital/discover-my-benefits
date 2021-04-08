module.exports = `
{
  queryUpdatesContents(top: 1000) {
    id
    data {
      published {
        iv
      }      
      title {
        iv
      }
      description {
        iv
      }
      links {
        iv {
          id
        }
      }
      benefitLinks {
        iv {
          id
        }
      }
      categoryLinks {
        iv {
          id
        }
      }
      service {
        iv {
          id
        }
      }
    }
  }
}
`;
