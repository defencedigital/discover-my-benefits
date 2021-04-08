module.exports = `
{
 queryServiceContents(top: 1000) {
   id,
   data {
     name {
      iv
     }
     headerImage {
      iv {
        id
        thumbnailUrl
      }
     }
     logo {
      iv {
        id
        thumbnailUrl
      }
     }
     facebookImage {
      iv {
        id
        thumbnailUrl
      }
     }
     categories {
       iv {
        id
      }
     }
     themeColor {
      iv
     }
     beta {
      iv
     }
     betaLink {
      iv
     }
     feedbackLink {
       iv
     }
   }
 }
}
`;
