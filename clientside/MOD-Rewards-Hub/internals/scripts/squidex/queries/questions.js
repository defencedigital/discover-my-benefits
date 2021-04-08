module.exports = `
{
 queryQuestionContents(top: 1000) {
   id,
   data {
      name {
        iv
      }
      namespace {
        iv
      }
      title {
        iv
      }
      type {
        iv
      }
      hint {
        iv
      }
      options {
        iv {
          id
        }
      }
      dependancies {
        iv {
          id
        }
      }
   }
 }
}
`;
