namespace Application.ErrorHandlers.Errors;

public static class RoomErrors
{
    public static readonly Error WrongId = new Error("Room.WrongId",
        "The Id Is Wrong");

    public static readonly Error UnAuthorizeAdd = new Error("Room.UnAuthorizeAdd",
        "You can not add a room to a subject that you are not assigned to.");

    public static readonly Error UnAuthorizeEdit = new Error("Room.UnAuthorizeEdit",
        "You can not edit a room to a subject that you are not assigned to.");
    
    public static readonly Error UnAuthorizeDelete = new Error("Room.UnAuthorizeDelete",
        "You can not delete a room to a subject that you are not assigned to.");
}