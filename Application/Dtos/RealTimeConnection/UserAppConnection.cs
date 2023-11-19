using Application.Dtos.Room;

namespace Application.Dtos.RealTimeConnection;

public class UserAppConnection
{
    public string UserId { get; set; }
    public IList<UserRoomForAppConnection> UserRooms { get; set; }
}