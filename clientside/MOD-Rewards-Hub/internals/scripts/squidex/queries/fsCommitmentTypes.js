module.exports = `
{
  queryFsCommitmentTypeContents(top: 1000) {
    id
    data {
      xFactor {
        iv
      }
      xFactorOF5AndAboveCalculation {
        iv {
          id
        }
      }
      xFactorOF5AndAboveLeaveFigure {
        iv
      }
      xFactorOF5AndAboveXFactorMessage {
        iv
      }
      percentage {
        iv
      }
      commitmentTypes {
        iv {
          id
        }
      }
      option {
        iv {
          id
        }
      }
      benefit {
        iv {
          id
        }
      }
      dailyRate {
        iv
      }
      maxDays {
        iv
      }
      salaryTooltip {
        iv
      }
      leaveMessage {
        iv
      }
      expressLeaveAsHalfDay {
        iv
      }
    }
  }
}
`;
