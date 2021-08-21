using Microsoft.AspNetCore.Authorization;

namespace Features.Base;

[ApiController]
[TranslateResultToActionResult]
public abstract class BaseEndpoint : ControllerBase { }

[Authorize]
public abstract class AuthorizedBaseEndpoint : BaseEndpoint { }
