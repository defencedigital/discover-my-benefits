using MODBenefitsCalculator.API.Attributes;
using System;
using System.ComponentModel.DataAnnotations;
using static MODBenefitsCalculator.API.Enums;

namespace MODBenefitsCalculator.API.Models.DMB.Feedback
{
    public class FeedbackPart1RequestDTO
    {
        [Required]
        [EnumDataType(typeof(FeedbackAnswer))]
        public FeedbackAnswer? main_answer { get; set; }
        [Required]
        [Url]
        [MaxLength(1000)]
        public string page_url { get; set; }
        [MaxLength(100)]
        public string benefit_name { get; set; }
        [MaxLength(100)]
        public string benefit_category { get; set; }
        [MaxLength(100)]
        public string service { get; set; }
        [MaxLength(100)]
        public string service_commitment { get; set; }
        [MaxLength(1000)]
        public string rank { get; set; }
        [Required]
        [EnumDataType(typeof(CurrentEligibility))]
        public CurrentEligibility? current_eligibility { get; set; }
        [MaxLength(5000)]
        public string eligibility_responses { get; set; }
        [MaxLength(500)]
        public string user_agent { get; set; }
        [MaxLength(2000)]
        public string console_errors { get; set; }
        [Range(0, 100000)]
        public int? window_width { get; set; }
        [Range(0, 100000)]
        public int? window_height { get; set; }
        [Range(0, 100000)]
        public int? screen_width { get; set; }
        [Range(0, 100000)]
        public int? screen_height { get; set; }
        [MaxLength(1000)]
        [Url]
        public string referrer_url { get; set; }
        [Required]
        [MaxLength(1000)]
        [ValidateReCaptcha]
        public string google_captcha { get; set; }
    }
}
