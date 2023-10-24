using Application.MediatR.Queries.Global;

namespace Application.MediatR.Handlers.Global;

public class GetWwwrootPathHandler : IRequestHandler<GetWwwrootPathQuery, string>
{
    public Task<string> Handle(GetWwwrootPathQuery request, CancellationToken cancellationToken)
    {
        var dir = string.Join("\\",
                      Environment.CurrentDirectory.Split("\\").SkipLast(1)) + "\\" +
                  typeof(DependencyInjection).Assembly.FullName?.Split(",").First() + "\\wwwroot";

        var s = Environment.CurrentDirectory;

        return Task.FromResult(s + "\\wwwroot");
    }
}