module.exports = `
{
 queryCategoryContents(top: 1000) {
   id,
   data {
     name {
      iv
     }
     strapline {
      iv
     }
     description {
      iv
     }
     cardImageNavy {
      iv {
        id
        thumbnailUrl
      }
     }
     cardImageArmy {
      iv {
        id
        thumbnailUrl
      }
     }
     cardImageRaf {
      iv {
        id
        thumbnailUrl
      }
     }
     cardImageMarines {
      iv {
        id
        thumbnailUrl
      }
     }
     catImageNavy {
      iv {
        id
        thumbnailUrl
      }
     }
     catImageArmy {
      iv {
        id
        thumbnailUrl
      }
     }
     catImageRaf {
      iv {
        id
        thumbnailUrl
      }
     }
     catImageMarines {
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
     categories {
  		iv {
        id
      }
     }
     subApps {
  		iv {
        id
      }
     }
     subAppsBottom {
  		iv {
        id
      }
     }
     tags {
      iv {
        id
      }
    }
    customLayout {
      iv
    }
    pageLayout {
      iv {
        __typename
        ... on Block4Col {
          id
          data {
            name {
              iv
            }
            items {
              iv{
                __typename
                   ... on Benefit {
                    id
                  }
                  ... on TextComponent {
                    id
                    data{
                      columnSpan{
                        iv
                      }
                    }
                  }
                  ... on Ctacomponents {
                    id
                    data{
                      columnSpan{
                        iv
                      }
                    }
                  }
                  ... on Cardwithimage {
                    id
                    data {
                      benefit{
                        iv{
                          id
                        }
                      }
                    }
                  }
              }
            }
          }
        }
        ... on Block3Col {
          id
          data {
            name {
              iv
            }
             oneThirdArea{
              iv {
                __typename
                 ... on Benefit {
                    id
                  }
              }
            }
            twoThirdsArea{
              iv {
                __typename
                 ... on Benefit {
                    id
                  }
                  ... on Cardwithimage {
                    id
                    data {
                      benefit{
                        iv{
                          id
                        }
                      }
                    }
                  }
              }
            }
            layoutOrder{
              iv
            }
            folderDisplay{
              iv
            }
          }
        }
      }
    }
  }
 }
}
`;
