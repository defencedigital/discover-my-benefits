module.exports = `
{
  queryImagesContents(top: 1000) {
    id
   data{
     id{
       iv
     },

     mobileImage{
       iv {
         id
         thumbnailUrl
       }
     },
     desktopImage{
       iv {
         id
         thumbnailUrl
       }
     }
   }
  }
 }
`;
