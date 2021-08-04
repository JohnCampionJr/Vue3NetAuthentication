using System.Threading;
using System.Threading.Tasks;
using Features.Base;
using FluentValidation;
using MediatR;
using Vue3Net6Authentication.Extensions;

namespace Features.Person
{
    public class CreatePerson
    {
        public class Command : Person, IRequest<Result>
        {

        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                Include(new PersonValidator());
            }
        }

        public class Result : BaseResult { }

        public class CommandHandler : IRequestHandler<Command, Result>
        {
            public Task<Result> Handle(Command request, CancellationToken cancellationToken)
            {
                var result = new Result().Succeeded("Looks good to the server (mediatr).");
                return Task.FromResult(result);
            }
        }

    }
}
