using MODBenefitsCalculator.API.Models.Shared;

namespace MODBenefitsCalculator.API.Models.Shared
{
    public class APIResult
    {
        public bool Success { get; set; }
        public APIError Error { get; set; }
    }
}
