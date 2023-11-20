using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_UserMessageStates_IsDelivered",
                table: "UserMessageStates",
                column: "IsDelivered");

            migrationBuilder.CreateIndex(
                name: "IX_UserMessageStates_IsRead",
                table: "UserMessageStates",
                column: "IsRead");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_Date",
                table: "Messages",
                column: "Date");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserMessageStates_IsDelivered",
                table: "UserMessageStates");

            migrationBuilder.DropIndex(
                name: "IX_UserMessageStates_IsRead",
                table: "UserMessageStates");

            migrationBuilder.DropIndex(
                name: "IX_Messages_Date",
                table: "Messages");
        }
    }
}
