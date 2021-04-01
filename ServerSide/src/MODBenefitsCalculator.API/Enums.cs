using System.Text.Json.Serialization;

namespace MODBenefitsCalculator.API
{
    public class Enums
    {
        /// <summary>
        /// The main answer from the user about whether the page was useful
        /// </summary>
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum FeedbackAnswer
        {
            useful_yes,
            useful_no,            
            something_wrong
        }

        /// <summary>
        /// Type of feedback provided by the user
        /// </summary>
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum FeedbackType
        {
            suggestion,
            bug,
            incorrect_missing_info
        }

        /// <summary>
        /// Eligibility status of the benefit for the current page
        /// </summary>
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum CurrentEligibility
        {
            eligible,
            not_eligible,
            missing_information,
            not_applicable
        }

        /// <summary>
        /// Type of error
        /// </summary>
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum ErrorType
        {
            unknown,
            data_storage,
            input_validation
        }

        public enum SubmissionType
        {
            DMB,
            Civilians
        }
    }
}
