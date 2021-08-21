using Microsoft.AspNetCore.Mvc.Filters;

namespace Features.Base;
public class TranslateResultToActionResultAttribute : ActionFilterAttribute
{
    public override void OnActionExecuted(ActionExecutedContext context)
    {
        if ((context.Result as ObjectResult)?.Value is not Result result) return;

        if (context.Controller is not ControllerBase controller) return;

        context.Result = controller.ToActionResult(result);
    }
}
