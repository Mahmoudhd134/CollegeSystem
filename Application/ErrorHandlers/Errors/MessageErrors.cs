namespace Application.ErrorHandlers.Errors;

public static class MessageErrors
{
    public static readonly Error WrongId = new("Message.WrongId",
        "There is no message with that id, The Id is wrong");

    public static readonly Error UnAuthorizeDelete = new("Message.UnAuthorizeDelete",
        "You can not delete a message that you did not send");

    public static readonly Error UnAuthorizeGet = new("Message.UnAuthorizeGet",
        "You can not get a message you did not send or receive");
}