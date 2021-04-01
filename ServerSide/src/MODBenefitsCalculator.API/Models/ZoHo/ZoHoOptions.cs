namespace MODBenefitsCalculator.API.Models.ZoHo
{
    public class ZoHoOptions
    {
        public string AccountEmailAddress { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string WorkspaceName { get; set; }
        public string DataAPIUrl { get; set; }
        public string RefreshToken { get; set; }            
    }
}
