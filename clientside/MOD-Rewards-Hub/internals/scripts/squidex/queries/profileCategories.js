module.exports = `
{
 queryProfileCategoryContents(top: 1000) {
   id,
   data {
     name {
      iv
     }
     title {
      iv
     }    
     questions {
       iv {
        id
       }
     }
   }
 }
}
`;
