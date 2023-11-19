namespace Application.ErrorHandlers.Errors;

public static class RoomErrors
{
    public static readonly Error WrongId = new Error("Room.WrongId",
        "The Id Is Wrong");

    public static readonly Error UnAuthorizeAdd = new Error("Room.UnAuthorizeAdd",
        "You can not add a room to a subject that you are not assigned to.");

    public static readonly Error UnAuthorizeAddMessage = new Error("Room.UnAuthorizeAddMessage",
        "You can not add a message to a room that you are not joined in.");

    public static readonly Error UnAuthorizeEdit = new Error("Room.UnAuthorizeEdit",
        "You can not edit a room to a subject that you are not assigned to.");

    public static readonly Error UnAuthorizeDelete = new Error("Room.UnAuthorizeDelete",
        "You can not delete a room to a subject that you are not assigned to.");

    public static readonly Error UserAlreadyJoined = new Error("Room.UserAlreadyJoined",
        "The user is already joined this room.");

    public static readonly Error CanNotGetMoreThat150MessagesAtOnce = new Error("Room.CanNotGetMoreThat150MessagesAtOnce",
        "You can not request more that 150 in a single run.");
}