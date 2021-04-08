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
    [Route("api/dmb/feedback/final")]
    public class FeedbackPart2Controller : ControllerBase
    {
        private readonly ILogger<FeedbackPart2Controller> _logger;
        private ZoHoService _zoHoService;

        public FeedbackPart2Controller(ILogger<FeedbackPart2Controller> logger, ZoHoService zoHoService)
        {
            _logger = logger;
            _zoHoService = zoHoService;
        }

        /// <summary>
        /// [DMB] Saves the key feedback information provided by the user. This is appended to the previous data the user sent.
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/dmb/feedback/final
        ///     {
        ///         "id": "d1329d11-0e4a-4e0b-8265-24c01fec518c",
        ///         "feedback_type": "incorrect_missing_info", 
        ///         "feedback_field_1": "There was no information about how to claim the benefit"
        ///     }
        /// </remarks>
        /// <param name="feedback"></param>
        /// <returns></returns>
        /// <response code="200">Successful submission</response>
        /// <response code="400">id not valid or has already received complete data record. Other validation issues</response>
        [HttpPost]
        [ProducesResponseType(200, Type = typeof(FeedbackPart2ResponseDTO))]
        [ProducesResponseType(400, Type = typeof(List<APIError>))]
        public ActionResult<FeedbackPart2ResponseDTO> Post(FeedbackPart2RequestDTO feedback)
        {
            Dictionary<string, string> postData = GenerateZoHoPostData(feedback);
            var apiResult = _zoHoService.UpdateFeedback(postData, SubmissionType.DMB);

            if (apiResult.Success)
            {
                var response = new FeedbackPart2ResponseDTO();
                return Ok(response);
            }
            else 
            {
                List<APIError> response = new List<APIError>();
                response.Add(apiResult.Error);
                return BadRequest(response);
            }
        }

        private Dictionary<string, string> GenerateZoHoPostData(FeedbackPart2RequestDTO feedback)
        {
            Dictionary<string, string> postData = new Dictionary<string, string>();

            postData.Add("ZOHO_CRITERIA", "(\"id\"='" + feedback.id.ToString() + "' and \"data_completeness\"='partial')");
            postData.Add("data_completeness", "complete");
            postData.Add("feedback_type", feedback.feedback_type.ToString());
            postData.Add("feedback_field_1", feedback.feedback_field_1);
            postData.Add("date_submitted", DateTime.UtcNow.ToString("yyyy-MM-dd-HH:mm:ss"));

            if (feedback.feedback_field_2 != null)
            {
                postData.Add("feedback_field_2", feedback.feedback_field_2);
            }
            
            return postData;
        }
    }
}
