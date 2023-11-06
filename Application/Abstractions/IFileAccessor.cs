using Application.Dtos.SubjectMaterial;

namespace Application.Abstractions;

public interface IFileAccessor
{
    /*
     * Return the new file path
     */
    Task<string> Add(Stream stream,string extension);

    Task<byte[]> GetBytes(string name);
    Task<SubjectMaterialStreamInfoDto> GetStream(string name);

    Task Delete(string name);
}