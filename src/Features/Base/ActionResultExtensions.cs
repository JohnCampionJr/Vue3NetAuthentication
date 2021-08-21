namespace Features.Base;

/// <summary>
/// Extensions to support converting Result to an ActionResult
/// </summary>
public static class ActionResultExtensions
{
    /// <summary>
    /// Convert an Ardalis.Result to a Microsoft.AspNetCore.Mvc.ActionResult
    /// </summary>
    /// <typeparam name="T">The value being returned</typeparam>
    /// <param name="controller">The controller this is called from</param>
    /// <param name="result">The Result to convert to an ActionResult</param>
    /// <returns></returns>
    public static ActionResult<T> ToActionResult<T>(this T result, ControllerBase controller) where T : Result
    {
        return controller.ToActionResult(result);
    }

    /// <summary>
    /// Convert an Ardalis.Result to a Microsoft.AspNetCore.Mvc.ActionResult
    /// </summary>
    /// <typeparam name="T">The value being returned</typeparam>
    /// <param name="controller">The controller this is called from</param>
    /// <param name="result">The Result to convert to an ActionResult</param>
    /// <returns></returns>
    public static ActionResult<T> ToActionResult<T>(this ControllerBase controller,
        T result) where T : Result
    {
        return controller.ToActionResult(result);
    }

    internal static ActionResult ToActionResult(this ControllerBase controller, Result result) 
    {
        switch (result.Status)
        {
            case ResultStatus.Ok: return controller.Ok(result);
            case ResultStatus.NotFound: return controller.NotFound();
            case ResultStatus.Unauthorized: return controller.Unauthorized();
            case ResultStatus.Forbidden: return controller.Forbid();
            case ResultStatus.Invalid: return controller.BadRequest(result); 
            case ResultStatus.Error: return controller.UnprocessableEntity(result);
            default:
                throw new NotSupportedException($"Result {result.Status} conversion is not supported.");
        }
    }

}
