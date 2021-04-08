namespace MODBenefitsCalculator.API.Models.ZoHo
{
    public class UpdateRowResponse
    {
        public UpdateRowResponseInner response { get; set; }
    }

    public class UpdateRowResponseInner
    {
        public string uri { get; set; }
        public string action { get; set; }
        public string criteria { get; set; }
        public UpdateRowResponseResult result { get; set; }
    }

    public class UpdateRowResponseResult
    {
        public string[] updatedColumns { get; set; }
        public string updatedRows { get; set; }
    }
}
