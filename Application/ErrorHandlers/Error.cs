namespace Application.ErrorHandlers;

public class Error
{
    public readonly string Code;
    public readonly string Message;

    public Error(string code, string message)
    {
        Code = code;
        Message = message;
    }
}