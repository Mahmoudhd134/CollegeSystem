using Application.Dtos.SubjectMaterial;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Global;
using Application.MediatR.Queries.Subject;

namespace Application.MediatR.Handlers.Subject;

public class GetSubjectFileTypeTemplateHandler : IRequestHandler<GetSubjectFileTypeTemplateQuery,
    Response<SubjectMaterialStreamInfoDto>>
{
    private readonly IMediator _mediator;

    public GetSubjectFileTypeTemplateHandler(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task<Response<SubjectMaterialStreamInfoDto>> Handle(GetSubjectFileTypeTemplateQuery request,
        CancellationToken cancellationToken)
    {
        var type = request.Type;
        var wwwroot = await _mediator.Send(new GetWwwrootPathQuery(), cancellationToken);
        var path = Path.Combine(wwwroot, "SubjectFileTemplate", type + ".docx");
        var info = new FileInfo(path);
        try
        {
            return new SubjectMaterialStreamInfoDto
            {
                Stream = File.OpenRead(path),
                Size = info.Length
            };
        }
        catch (FileNotFoundException e)
        {
            return Response<SubjectMaterialStreamInfoDto>.Failure(SubjectFileTemplateErrors.FileNotFound);
        }
    }
}