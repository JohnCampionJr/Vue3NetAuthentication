namespace Features.Person;

public class PersonResult
{
    public bool IsSuccessful { get; set; } = false;
    public string Message { get; set; } = string.Empty;
    public IDictionary<string, string[]> Errors { get; set; } = new Dictionary<string, string[]>();
}
