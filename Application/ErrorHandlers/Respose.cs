using Application.ErrorHandlers.Errors;

namespace Application.ErrorHandlers;

public class Response<TResult>
{
    public Response(bool isSuccess, TResult result, Error error)
    {
        if (isSuccess && error != DomainErrors.None)
            throw new InvalidOperationException();

        if (!isSuccess && error == DomainErrors.None)
            throw new InvalidOperationException();


        IsSuccess = isSuccess;
        Data = result;
        Error = error;
    }

    public bool IsSuccess { get; set; }
    public TResult Data { get; set; }
    public Error Error { get; set; }

    public static Response<TResult> Success(TResult result)
    {
        return new(true, result, DomainErrors.None);
    }

    public static Response<TResult> Failure(Error error)
    {
        return new(false, default, error);
    }


    public static implicit operator Response<TResult>(TResult value)
    {
        return new(true, value, DomainErrors.None);
    }
}