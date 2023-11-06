using Application.Abstractions;
using Application.Dtos.SubjectMaterial;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Subject;

namespace Application.MediatR.Handlers.Subject;

public class GetSubjectMaterialInfoHandler : IRequestHandler<GetSubjectMaterialInfoQuery,
    Response<SubjectMaterialStreamInfoDto>>
{
    private readonly IMediator _mediator;
    private readonly IFileAccessor _fileAccessor;

    public GetSubjectMaterialInfoHandler(IMediator mediator, IFileAccessor fileAccessor)
    {
        _mediator = mediator;
        _fileAccessor = fileAccessor;
    }

    public async Task<Response<SubjectMaterialStreamInfoDto>> Handle(GetSubjectMaterialInfoQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            return await _fileAccessor.GetStream(request.Name);
        }
        catch (FileNotFoundException e)
        {
            return Response<SubjectMaterialStreamInfoDto>.Failure(SubjectMaterialErrors.FileNotFound);
        }
        catch (Exception e)
        {
            return Response<SubjectMaterialStreamInfoDto>.Failure(DomainErrors.UnKnown);
        }
    }
}