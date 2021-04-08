using static MODBenefitsCalculator.API.Enums;

namespace MODBenefitsCalculator.API.Models.Shared
{
    /// <summary>
    /// Represents an error that occured in the API
    /// </summary>
    public class APIError
    {
        public string ErrorCode { get; set; }
        public ErrorType ErrorType { get; set; }
        public string ErrorDetail { get; set; }
        public string DisplayMessage { get; set; }
    }
}
