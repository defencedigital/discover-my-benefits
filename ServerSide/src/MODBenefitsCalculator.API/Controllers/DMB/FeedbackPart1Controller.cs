using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MODBenefitsCalculator.API.Models.DMB.Feedback;
using MODBenefitsCalculator.API.Models.Shared;
using MODBenefitsCalculator.API.Services;
using System;
using System.Collections.Generic;
using static MODBenefitsCalculator.API.Enums;

namespace MODBenefitsCalculator.API.Controllers.DMB
{
    [Produces("application/json")]
    [ApiController]
    [Route("api/dmb/feedback/initial")]
    public class FeedbackPart1Controller : ControllerBase
    {
        private readonly ILogger<FeedbackPart1Controller> _logger;
        private ZoHoService _zoHoService;

        public FeedbackPart1Controller(ILogger<FeedbackPart1Controller> logger, ZoHoService zoHoService)
        {
            _logger = logger;
            _zoHoService = zoHoService;
        }

        /// <summary>
        /// [DMB] Saves the initial feedback response with additional meta data from the user's session and browser state
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/dmb/feedback/initial
        ///     {
        ///         "main_answer":"useful_yes", 
        ///         "page_url":"https://discovermybenefits.mod.gov.uk/royal-navy/royal-navy-service-benefits/service-benefits-sport", 
        ///         "benefit_name": "Sport",
        ///         "benefit_category": "Royal Navy Service Benefits",
        ///         "service": "Royal Navy",
        ///         "service_commitment": "prr20",
        ///         "rank": "{\"value\":\"Able Rate\",\"meta\":{\"ID\":30,\"Name\":\"Able Rate\",\"RankTypeID\":2,\"ServiceID\":1,\"Order\":1,\"PayRangeID\":21,\"CorePayTableID\":\"\",\"AllowsUniquePayTable\":-1}}",
        ///         "current_eligibility":"eligible",
        ///         "eligibility_responses": "{\"servingtype\":\"prr20\"}",
        ///         "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
        ///         "console_errors": "Manifest: Line: 1, column: 1, Syntax error.",
        ///         "window_width":1536,
        ///         "window_height":824,
        ///         "screen_width":1536,
        ///         "screen_height":864,
        ///         "referrer_url": "https://discovermybenefits.mod.gov.uk/royal-navy/royal-navy-service-benefits",
        ///         "google_captcha": "03AGdBq24roOUogTKAMYWstc5yylMAsizSmMyMNJkK2zTY-3jjhEKGBlx3Ur8SOqC_W7EFh9HqwQPXD3oozpmq1EcyLRqRQ9V1Dz3vVWq6W0qsZgXhuH4mj-RRp1wxZc2L_CEcYmCbB8oCUKMjtD4AsaOOTNs33a8wDiZ4LL_nJPRaf4gca-hnvwi_zy7tnYcXkvEsYpIWtzne47p9mvxekCia7hc-gD5DhOgbcr-oPA1Grv7xlzaQKzTBdvozgsSce7kxWYOe3uUDSXnPgj49rE8aiTiehRPw-nYTLtHquspy2hEzE6HhF2NDV9Cb1EhPUf7k97Wv9NnwQgvZOzG3vZ1ilINyOXSKQJ7-KNzZ1Roas3UEZq67rIGLDtxd_eugSfES-3Hrw2HlhfUsa1I-yfDCUhaswr4IvxmMbZrxTunVao7Wt8KFp24"
        ///     }
        /// </remarks>
        /// <param name="feedback"></param>
        /// <returns>An id that is needed for subsequent feedback submission</returns>
        /// <response code="200">Successful submission</response>
        /// <response code="400">Validation issue</response>
        [HttpPost]
        [ProducesResponseType(200, Type = typeof(FeedbackPart1ResponseDTO))]
        [ProducesResponseType(400, Type = typeof(List<APIError>))]
        public ActionResult<FeedbackPart1ResponseDTO> Post(FeedbackPart1RequestDTO feedback)
        {
            Guid id = Guid.NewGuid();
            Dictionary<string, string> postData = GenerateZoHoPostData(id, feedback);
            var apiResult = _zoHoService.SubmitFeedback(postData, SubmissionType.DMB);

            if (apiResult.Success)
            {
                var response = new FeedbackPart1ResponseDTO();
                response.id = id;
                return Ok(response);
            }
            else
            {
                List<APIError> response = new List<APIError>();
                response.Add(apiResult.Error);
                return BadRequest(response);
            }
        }

        private Dictionary<string, string> GenerateZoHoPostData(Guid id, FeedbackPart1RequestDTO feedback)
        {
            Dictionary<string, string> postData = new Dictionary<string, string>();

            postData.Add("id", id.ToString());
            postData.Add("main_answer", feedback.main_answer.ToString());
            postData.Add("page_url", feedback.page_url);
            postData.Add("current_eligibility", feedback.current_eligibility.ToString());
            postData.Add("date_submitted", DateTime.UtcNow.ToString("yyyy-MM-dd-HH:mm:ss"));

            if (feedback.benefit_name != null)
            {
                postData.Add("benefit_name", feedback.benefit_name);
            }
            if (feedback.benefit_category != null)
            {
                postData.Add("benefit_category", feedback.benefit_category);
            }
            if (feedback.console_errors != null)
            {
                postData.Add("console_errors", feedback.console_errors);
            }
            if (feedback.eligibility_responses != null)
            {
                postData.Add("eligibility_responses", feedback.eligibility_responses);
            }
            if (feedback.rank != null)
            {
                postData.Add("rank", feedback.rank);
            }
            if (feedback.referrer_url != null)
            {
                postData.Add("referrer_url", feedback.referrer_url);
            }
            if (feedback.screen_height != null)
            {
                postData.Add("screen_height", feedback.screen_height.ToString());
            }
            if (feedback.screen_width != null)
            {
                postData.Add("screen_width", feedback.screen_width.ToString());
            }
            if (feedback.window_height != null)
            {
                postData.Add("window_height", feedback.window_height.ToString());
            }
            if (feedback.window_width != null)
            {
                postData.Add("window_width", feedback.window_width.ToString());
            }
            if (feedback.service != null)
            {
                postData.Add("service", feedback.service);
            }
            if (feedback.service_commitment != null)
            {
                postData.Add("service_commitment", feedback.service_commitment);
            }
            if (feedback.user_agent != null)
            {
                postData.Add("user_agent", feedback.user_agent);
            }
            if (feedback.main_answer == Enums.FeedbackAnswer.useful_yes)
            {
                postData.Add("data_completeness", "complete");
            }
            else
            {
                postData.Add("data_completeness", "partial");
            }

            return postData;
        }
    }
}
