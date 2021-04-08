using System;
using System.ComponentModel.DataAnnotations;
using static MODBenefitsCalculator.API.Enums;

namespace MODBenefitsCalculator.API.Models.Civilians.Feedback
{
    public class FeedbackPart2RequestDTO
    {
        //making the Guid nullable and required allows for automatic validation of the presence of this property through the API. If not nullable it will convert non-existance to a zero GUID
        [Required]
        public Guid? id { get; set; }
        [Required]
        [EnumDataType(typeof(FeedbackType))]
        public FeedbackType? feedback_type { get; set; }
        [Required]
        [MaxLength(5000)]
        public string feedback_field_1 { get; set; }
        [MaxLength(5000)]
        public string feedback_field_2 { get; set; }
    }
}
