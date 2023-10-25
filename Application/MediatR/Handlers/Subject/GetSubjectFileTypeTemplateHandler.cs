using Application.Dtos.SubjectMaterial;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Global;
using Application.MediatR.Queries.Subject;

namespace Application.MediatR.Handlers.Subject;

public class GetSubjectFileTypeTemplateHandler : IRequestHandler<GetSubjectFileTypeTemplateQuery,
    Response<GetSubjectMaterialPathAndTypeDto>>
{
    private readonly IMediator _mediator;

    public GetSubjectFileTypeTemplateHandler(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task<Response<GetSubjectMaterialPathAndTypeDto>> Handle(GetSubjectFileTypeTemplateQuery request,
        CancellationToken cancellationToken)
    {
        var type = request.Type;
        var wwwroot = await _mediator.Send(new GetWwwrootPathQuery(), cancellationToken);
        var path = Path.Combine(wwwroot, "SubjectFileTemplate", type + ".docx");
        try
        {
            return new GetSubjectMaterialPathAndTypeDto
            {
                Bytes = await File.ReadAllBytesAsync(path, cancellationToken)
            };
        }
        catch (FileNotFoundException e)
        {
            return Response<GetSubjectMaterialPathAndTypeDto>.Failure(SubjectFileTemplateErrors.FileNotFound);
        }
    }
}