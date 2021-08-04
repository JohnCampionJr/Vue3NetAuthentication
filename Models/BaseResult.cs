using System;
using System.Collections.Generic;

namespace Vue3Net6Validation
{
    public class BaseResult
    {
        public bool IsSuccessful { get; set; } = false;
        public string Message { get; set; } = string.Empty;
        public IDictionary<string, string> Errors { get; set; } = new Dictionary<string, string>();
    }
}
