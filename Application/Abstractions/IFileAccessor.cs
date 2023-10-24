namespace Application.Abstractions;

public interface IFileAccessor
{
    /*
     * Return the new file path
     */
    Task<string> Add(Stream stream,string extension);

    Task<byte[]> Get(string name);

    Task Delete(string name);
}