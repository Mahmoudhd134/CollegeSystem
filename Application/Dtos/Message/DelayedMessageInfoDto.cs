namespace Application.Dtos.Message;

public class DelayedSubjectMessageInfoDto
{
    public int SubjectCode { get; set; }

    public string SubjectName { get; set; }

    public IList<DelayedRoomMessageInfoDto> DelayedRooms { get; set; }
}

public class DelayedRoomMessageInfoDto
{
    public Guid RoomId { get; set; }
    public string RoomName { get; set; }
    public int MessagesCount { get; set; }
}