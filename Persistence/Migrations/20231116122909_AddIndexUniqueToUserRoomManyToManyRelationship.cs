using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIndexUniqueToUserRoomManyToManyRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserRooms_RoomId",
                table: "UserRooms");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "Messages",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2023, 11, 14, 21, 19, 21, 167, DateTimeKind.Local).AddTicks(4379));

            migrationBuilder.CreateIndex(
                name: "IX_UserRooms_RoomId_UserId",
                table: "UserRooms",
                columns: new[] { "RoomId", "UserId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserRooms_RoomId_UserId",
                table: "UserRooms");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "Messages",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2023, 11, 14, 21, 19, 21, 167, DateTimeKind.Local).AddTicks(4379),
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateIndex(
                name: "IX_UserRooms_RoomId",
                table: "UserRooms",
                column: "RoomId");
        }
    }
}
