using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserMessageStateTableAndItsAssosiationsAndReplaceItWithLastOnlineDateColumnInUserRoomTableMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserMessageStates");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastOnlineDate",
                table: "UserRooms",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "Messages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_UserRooms_LastOnlineDate",
                table: "UserRooms",
                column: "LastOnlineDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserRooms_LastOnlineDate",
                table: "UserRooms");

            migrationBuilder.DropColumn(
                name: "LastOnlineDate",
                table: "UserRooms");

            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "Messages");

            migrationBuilder.CreateTable(
                name: "UserMessageStates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoomId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DeliveredDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDelivered = table.Column<bool>(type: "bit", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    ReadDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMessageStates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserMessageStates_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserMessageStates_Messages_MessageId",
                        column: x => x.MessageId,
                        principalTable: "Messages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserMessageStates_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserMessageStates_IsDelivered",
                table: "UserMessageStates",
                column: "IsDelivered");

            migrationBuilder.CreateIndex(
                name: "IX_UserMessageStates_IsRead",
                table: "UserMessageStates",
                column: "IsRead");

            migrationBuilder.CreateIndex(
                name: "IX_UserMessageStates_MessageId",
                table: "UserMessageStates",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMessageStates_RoomId",
                table: "UserMessageStates",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMessageStates_UserId",
                table: "UserMessageStates",
                column: "UserId");
        }
    }
}
