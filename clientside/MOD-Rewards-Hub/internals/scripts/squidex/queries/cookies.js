module.exports = `
{
  queryCookiesContents(top: 1000) {
       id
       data {
         title {
           iv
         }
         strapline {
           iv
         }
         service {
           iv {
             id
           }
         }
         content {
           iv
         }
       }
     }
   }
`;
