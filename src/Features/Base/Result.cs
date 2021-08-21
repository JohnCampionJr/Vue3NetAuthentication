namespace Features.Base;

[TsInterface]
public class BaseResult : Result { }

public class Result
{
    public ResultStatus Status { get; set; } = ResultStatus.Ok;
    public bool IsSuccess => Status == ResultStatus.Ok;
    public string SuccessMessage { get; set; } = string.Empty;
    public List<string> Errors { get; private set; } = new List<string>();
    public IDictionary<string, string> ValidationErrors { get; set; } = new Dictionary<string, string>();
    
    private string errorMessage = "";
    public string ErrorMessage
    {
        get
        {
            if (!string.IsNullOrEmpty(errorMessage)) return errorMessage;

            if (Errors.Count == 0) return string.Empty;
            if (Errors.Count == 1) return Errors[0];
            return string.Join("<br/>", Errors.ToArray());
        }
        set
        {
            errorMessage = value;
        }
    } 

}
