using Application.Abstractions;
using Application.Dtos.SubjectMaterial;

namespace Infrastructure;

public class PhysicalFileAccessor : IFileAccessor
{
    public async Task<string> Add(Stream stream, string extension)
    {
        var newFileName = Guid.NewGuid() + extension;

        await using var rootFileStream =
            new FileStream(Path.Combine("wwwroot", "subjectMaterials", newFileName), FileMode.Create);
        await stream.CopyToAsync(rootFileStream);

        return newFileName;
    }

    public Task<SubjectMaterialStreamInfoDto> GetStream(string name)
    {
        var path = Path.Combine("wwwroot", "subjectMaterials", name);
        var info = new FileInfo(path);
        var stream = File.OpenRead(path);
        return Task.FromResult(new SubjectMaterialStreamInfoDto()
        {
            Stream = stream,
            Size = info.Length
        });
    }

    public async Task<byte[]> GetBytes(string name)
    {
        return await File.ReadAllBytesAsync(Path.Combine("wwwroot", "subjectMaterials", name));
    }

    public Task Delete(string name)
    {
        File.Delete(name);
        return Task.CompletedTask;
    }
}