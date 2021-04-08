using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MODBenefitsCalculator.API.Models.Shared;
using MODBenefitsCalculator.API.Models.ZoHo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using static MODBenefitsCalculator.API.Enums;
using static MODBenefitsCalculator.API.Enums.SubmissionType;

namespace MODBenefitsCalculator.API.Services
{
    public class ZoHoService
    {
        private string _accessToken = string.Empty;
        private string _refreshToken = string.Empty;
        private string _clientId = string.Empty;
        private string _clientSecret = string.Empty;
        private string _dataApiUrl = string.Empty;
        private string _accountEmailAddress = string.Empty;
        private string _MODWorkspaceName = string.Empty;
        private static readonly HttpClient client = new HttpClient();
        private IMemoryCache _cache;
        private readonly ILogger<ZoHoService> _logger;
        private readonly IConfiguration _config;

        public ZoHoService(ZoHoOptions options, IConfiguration config, IMemoryCache cache, ILogger<ZoHoService> logger)
        {
            _refreshToken = options.RefreshToken;
            _clientId = options.ClientId;
            _clientSecret = options.ClientSecret;
            _dataApiUrl = options.DataAPIUrl;
            _accountEmailAddress = options.AccountEmailAddress;
            _MODWorkspaceName = options.WorkspaceName;
            _cache = cache;
            _accessToken = _cache.Get<string>("ZoHo_AccessToken");
            _logger = logger;
            _config = config;
        }

        public APIResult SubmitFeedback(Dictionary<string, string> postData, SubmissionType submissionType)
        {
            APIResult result = new APIResult();

            if (IsTokenExpired())
            {
                var refreshResult = RefreshAccessToken();
                if (!refreshResult.Success)
                {
                    return refreshResult;
                }
            }

            var data = string.Join("&", postData.Select(kvp => string.Format("{0}={1}", kvp.Key, HttpUtility.UrlEncode(kvp.Value))));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
            StringContent stringContent = new StringContent(data, Encoding.UTF8, "application/x-www-form-urlencoded");

            string tableName = GetZoHoTableName(submissionType);

            var response = client.PostAsync(string.Format(_dataApiUrl, HttpUtility.UrlEncode(_accountEmailAddress), HttpUtility.UrlEncode(_MODWorkspaceName), HttpUtility.UrlEncode(tableName), "ADDROW"), stringContent).Result;

            if (response.IsSuccessStatusCode)
            {
                result.Success = true;
            }
            else
            {
                var responseContent = response.Content;
                string responseString = responseContent.ReadAsStringAsync().Result;

                result.Success = false;
                result.Error = new APIError() {
                    ErrorCode = "FEED1STORE01",
                    ErrorType = Enums.ErrorType.data_storage,
                    ErrorDetail = "Failed to send record to storage.",
                    DisplayMessage = "Unable to store the feedback."
                };
                _logger.LogError("FEED1STORE01 - Failed to send record to storage: " + responseString);
            }

            return result;
        }

        public APIResult UpdateFeedback(Dictionary<string, string> postData, SubmissionType submissionType)
        {
            APIResult result = new APIResult();

            if (IsTokenExpired())
            {
                var refreshResult = RefreshAccessToken();
                if (!refreshResult.Success)
                {
                    return refreshResult;
                }
            }

            var data = string.Join("&", postData.Select(kvp => string.Format("{0}={1}", kvp.Key, HttpUtility.UrlEncode(kvp.Value))));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
            StringContent stringContent = new StringContent(data, Encoding.UTF8, "application/x-www-form-urlencoded");
            
            string tableName = GetZoHoTableName(submissionType);

            var response = client.PostAsync(string.Format(_dataApiUrl, HttpUtility.UrlEncode(_accountEmailAddress), HttpUtility.UrlEncode(_MODWorkspaceName), HttpUtility.UrlEncode(tableName), "UPDATE"), stringContent).Result;

            if (response.IsSuccessStatusCode)
            {
                result.Success = true;

                var responseContent = response.Content;
                string responseString = responseContent.ReadAsStringAsync().Result;
                var responseJson = JsonConvert.DeserializeObject<UpdateRowResponse>(responseString);

                //check if a record was updated
                int rowsUpdated = 0;
                int.TryParse(responseJson.response.result.updatedRows, out rowsUpdated);

                if (rowsUpdated == 0)
                {
                    result.Success = false;
                    result.Error = new APIError() {
                        ErrorCode = "FEED2STORE02",
                        ErrorType = Enums.ErrorType.data_storage,
                        ErrorDetail = "Full data already submitted.",
                        DisplayMessage = "Unable to update data record, already submitted."
                    };

                    _logger.LogWarning("FEED2STORE02 - Full data already submitted.");
                }
            }
            else
            {
                var responseContent = response.Content;
                string responseString = responseContent.ReadAsStringAsync().Result;

                result.Success = false;
                result.Error = new APIError() {
                    ErrorCode = "FEED2STORE01",
                    ErrorType = Enums.ErrorType.data_storage,
                    ErrorDetail = "Failed to send record update to storage.",
                    DisplayMessage = "Unable to update data record."
                };

                _logger.LogError("FEED2STORE01 - Failed to send record update to storage: " + responseContent);
            }

            return result;
        }

        private string GetZoHoTableName(SubmissionType submissionType)
        {
            switch (submissionType)
            {
                case DMB:
                    return _config.GetValue<string>("ZoHo:DMBFeedbackTableName");
                case Civilians:
                    return _config.GetValue<string>("ZoHo:CiviliansFeedbackTableName");
                default:
                    return _config.GetValue<string>("ZoHo:DMBFeedbackTableName");
            }
        }

        private bool IsTokenExpired()
        {
            var accessToken = _cache.Get<string>("ZoHo_AccessToken");
            return accessToken == null;
        }

        public APIResult RefreshAccessToken()
        {
            APIResult result = new APIResult();

            string postData = "refresh_token=" + _refreshToken + "&client_id=" + _clientId + "&client_secret=" + _clientSecret + "&grant_type=refresh_token";
            StringContent stringContent = new StringContent(postData, Encoding.UTF8, "application/x-www-form-urlencoded");
            var response = client.PostAsync("https://accounts.zoho.eu/oauth/v2/token", stringContent).Result;

            if (response.IsSuccessStatusCode)
            {
                result.Success = true;
                var responseContent = response.Content;
                string responseString = responseContent.ReadAsStringAsync().Result;
                var responseJson = JsonConvert.DeserializeObject<Token>(responseString);
                _accessToken = responseJson.access_token;
                _cache.Set<string>("ZoHo_AccessToken", _accessToken, DateTimeOffset.Now.AddSeconds(responseJson.expires_in - 60));
            }
            else
            {
                result.Success = false;
                result.Error = new APIError()
                {
                    ErrorCode = "FEEDTOKEN01",
                    ErrorType = Enums.ErrorType.data_storage,
                    ErrorDetail = "Failed to refresh API token.",
                    DisplayMessage = "There was an issue storing data via the API."
                };
                _logger.LogError("FEEDTOKEN01 - Failed to refresh API token.");
            }

            return result;
        }
    }
}
