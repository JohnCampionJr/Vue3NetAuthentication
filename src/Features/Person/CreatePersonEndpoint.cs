namespace Features.Person;
public class CreatePersonEndpoint : BaseEndpoint
{
    [HttpPost("api/person")]
    public async Task<Result> Handle(
        Person person
    )
    {
        var result = new Result().Success("Looks good to the server (endpoint).");
        return result;
    }

}
