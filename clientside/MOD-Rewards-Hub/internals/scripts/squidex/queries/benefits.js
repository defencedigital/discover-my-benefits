module.exports = `
{
 queryBenefitContents(top: 1000) {
   id,
   data {
     name {
      iv
     }
     title {
      iv
     }
     strapline {
      iv
     }
     description {
      iv
     }
     content {
      iv
     }
     links {
       iv {
        id
       }
     }

     primaryCategory {
       iv {
        id
       }
     }
     internalQuestions {
       iv
     }
    additionalQuestions {
       iv {
        id
      }
    }
    calculation {
      iv {
        id
      }
    }
    benefitImageNavy {
      iv {
        id
        thumbnailUrl
      }
     }
     benefitImageArmy {
      iv {
        id
        thumbnailUrl
      }
     }
     benefitImageRaf {
      iv {
        id
        thumbnailUrl
      }
     }
     benefitImageMarines {
      iv {
        id
        thumbnailUrl
      }
     }
     benefitTags {
      iv {
        id
      }
     }
     usefulStatus {
      iv
     }
     disclaimer {
      iv
     }
     howToClaim{
       iv {
         stepTitle
         stepText
       }
     }
   }
 }
}
`;
