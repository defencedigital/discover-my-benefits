using Microsoft.AspNetCore.Mvc;
using MODBenefitsCalculator.API.Models;
using MODBenefitsCalculator.API.Models.Shared;
using System.Collections.Generic;

namespace MODBenefitsCalculator.API.Controllers
{
    [Produces("application/json")]
    [ApiController]
    [Route("api/status")]
    public class StatusController : ControllerBase
    {
        /// <summary>
        /// Checks the status of the API
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(Status))]
        [ProducesResponseType(500, Type = typeof(List<APIError>))]
        public ActionResult<Status> Get()
        {
            var response = new Status();
            return Ok(response);
        }
    }
}
