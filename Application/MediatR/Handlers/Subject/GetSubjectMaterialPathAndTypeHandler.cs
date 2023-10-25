using Application.Abstractions;
using Application.Dtos.SubjectMaterial;
using Application.ErrorHandlers.Errors;
using Application.MediatR.Queries.Subject;

namespace Application.MediatR.Handlers.Subject;

public class GetSubjectMaterialPathAndTypeHandler : IRequestHandler<GetSubjectMaterialPathAndContentQuery,
    Response<GetSubjectMaterialPathAndTypeDto>>
{
    private readonly IMediator _mediator;
    private readonly IFileAccessor _fileAccessor;

    public GetSubjectMaterialPathAndTypeHandler(IMediator mediator, IFileAccessor fileAccessor)
    {
        _mediator = mediator;
        _fileAccessor = fileAccessor;
    }

    public async Task<Response<GetSubjectMaterialPathAndTypeDto>> Handle(GetSubjectMaterialPathAndContentQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            return new GetSubjectMaterialPathAndTypeDto
            {
                Bytes = await _fileAccessor.Get(request.Name)
            };
        }
        catch (FileNotFoundException e)
        {
            return Response<GetSubjectMaterialPathAndTypeDto>.Failure(SubjectMaterialErrors.FileNotFound);
        }
        catch (Exception e)
        {
            return Response<GetSubjectMaterialPathAndTypeDto>.Failure(DomainErrors.UnKnown);
        }
    }
}