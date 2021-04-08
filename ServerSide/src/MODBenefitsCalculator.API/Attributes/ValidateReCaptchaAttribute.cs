using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Http;
using System.Text;

namespace MODBenefitsCalculator.API.Attributes
{
    public class ValidateReCaptchaAttribute : ValidationAttribute
    {
        private string _verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
        private string _secret = string.Empty;
        private ILogger<ValidateReCaptchaAttribute> _logger;

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var config = (IConfiguration)validationContext.GetService(typeof(IConfiguration));
            _logger = (ILogger<ValidateReCaptchaAttribute>)validationContext.GetService(typeof(ILogger<ValidateReCaptchaAttribute>));
            _secret = config.GetValue<string>("Google:reCaptchaSecret");

            string reCaptchaToken = (string)value;
            if (ReCaptchaVerify(reCaptchaToken))
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult("Google reCaptcha response not valid");
            }    
        }

        public bool ReCaptchaVerify(string responseToken)
        {
            HttpClient httpClient = new HttpClient();
            string postData = "secret=" + _secret + "&response=" + responseToken;
            StringContent stringContent = new StringContent(postData, Encoding.UTF8, "application/x-www-form-urlencoded");
            var res = httpClient.PostAsync(_verifyUrl, stringContent).Result;
            if (res.StatusCode != HttpStatusCode.OK)
                return false;

            string JSONres = res.Content.ReadAsStringAsync().Result;
            dynamic JSONdata = JObject.Parse(JSONres);
            if (JSONdata.success != "true")
            {
                _logger.LogWarning("Google reCaptcha response not valid");
                return false;
            }

            //change the threshold here if needed
            if (JSONdata.score < 0.5)
            {
                _logger.LogWarning("Google reCaptcha response score not high enough - " + ((double)JSONdata.score).ToString());
                return false;
            }

            return true;
        }

        internal class ResponseToken
        {
            public bool Success { get; set; }
            public float Score { get; set; }
            public string Action { get; set; }
            public DateTime Challenge_TS { get; set; }
            public string HostName { get; set; }
            public List<object> ErrorCodes { get; set; }
        }
    }
}
