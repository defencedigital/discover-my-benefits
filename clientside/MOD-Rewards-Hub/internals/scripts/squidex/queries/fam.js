module.exports = `
{
 queryFamContents(top: 1000) {
      id
      data {
        exploreIntro {
          iv
        },
        exploreDescription {
          iv
        },
        exploreCtaIntro {
          iv
        },
        exploreCtaDescription {
          iv,
        }
        allowanceIntro {
          iv,
        }
        allowanceDescription {
          iv,
        }
        allowanceRentingQuestion {
          iv,
        }
        allowanceBaseQuestion {
          iv,
        }
        allowanceBaseQuestionDescription {
          iv,
        }
        allowanceDependantsQuestion {
          iv,
        }
        allowanceDependantsQuestionDescription {
          iv,
        }
        allowanceBenchmarkTitle {
          iv,
        }
        allowanceBenchmarkDescription {
          iv,
        }
        allowanceBreakdownTitle {
          iv,
        }
        allowanceBreakdownRentTitle {
          iv,
        }
        allowanceBreakdownRentDescription {
          iv,
        }
        allowanceBreakdownCoreTitle {
          iv,
        }
        allowanceBreakdownCoreDescription {
          iv,
        }
        allowanceBreakdownRentalTitle {
          iv,
        }
      	allowanceBreakdownRentalDescription {
          iv,
        }
      	allowanceBreakdownTotalTitle {
          iv,
        }
      	allowanceBreakdownTotalDescription {
          iv,
        }
      	allowancePersonalTitle {
          iv,
        }
      	allowancePersonalDescription {
          iv,
        }
        allowanceRentPayTitle {
          iv,
        }
        allowanceRentPayDescription {
          iv,
        }
        depositIntro {
          iv,
        }
        depositDescription {
          iv,
        }
        depositRentalQuestion {
          iv,
        }
        depositRentalDescription {
          iv,
        }
        depositAmountQuestion {
          iv,
        }
        depositAmountQuestionDescription {
          iv,
        }
      	depositBreakdownIntro {
          iv,
        }
     		depositBreakdownDescription {
          iv,
        }
     		cashflowIntro {
          iv,
        }
     		cashflowDescription {
          iv,
        }
     		cashflowRentalQuestion {
          iv,
        }
     		cashflowRentalDescription {
          iv,
        }
        cashflowRentalStartQuestion {
          iv,
        }
        cashflowRentalStartDescription {
          iv,
        }
        cashflowBreakdownTitle {
          iv,
        }
        cashflowBreakdownTitleHint {
          iv,
        }
        cashflowBreakdownDescription {
          iv,
        }
        eligibleIntro {
          iv,
        }
        eligibleDescription {
          iv,
        }
        eligibleTitle {
          iv,
        }
        eligibleStatements {
          iv {
            id
          }
        }
        links {
          iv {
            id
          }
        }
        calculateSupportLinks {
          iv {
            id
          }
        }
        depositAndRentalLinks {
          iv {
            id
          }
        }
      }
    }
  }
`;
