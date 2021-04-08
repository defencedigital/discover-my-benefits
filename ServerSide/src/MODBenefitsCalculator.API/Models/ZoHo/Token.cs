namespace MODBenefitsCalculator.API.Models.ZoHo
{
    public class Token
    {
        public string access_token { get; set; }
        public string api_domain { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
    }
}
