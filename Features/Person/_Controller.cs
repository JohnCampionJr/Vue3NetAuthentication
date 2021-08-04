using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Features.Base;
using MediatR;

namespace Features.Person
{
    [Route("api/[controller]/")]
    public class PersonController : MediatrControllerBase
    {
        public PersonController(ISender sender) : base(sender) { }

        [HttpPost]
        public async Task<IActionResult> Index(CreatePerson.Command model) => await Send(model);
    }
}
