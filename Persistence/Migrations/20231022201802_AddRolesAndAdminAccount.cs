using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRolesAndAdminAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //Add Admin, Doctor Roles and an admin account
            /*
            *{
            *    "firstName": "Mahmoud",
            *    "lastName": "Nasser",
            *    "username": "Mahmoudhd134",
            *    "phonenumber": "01284473202",
            *    "password": "Mahmoud2320030@",
            *    "email": "nassermahmoud571@gmail.com"
            *}
            */
            migrationBuilder.Sql(@"
INSERT [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'15f61df4-15b5-41a9-b8b6-0f7228b458aa', N'Admin', N'ADMIN', NULL)
GO
INSERT [dbo].[AspNetUsers] ([Id], [FirstName], [LastName], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount], [NationalNumber], [Type], [ProfilePhoto]) VALUES (N'52594980-4d11-4924-8672-1a307728e2e3', N'Mahmoud', N'Nasser', N'Mahmoudhd134', N'MAHMOUDHD134', N'nassermahmoud571@gmail.com', N'NASSERMAHMOUD571@GMAIL.COM', 0, N'AQAAAAIAAYagAAAAECjb6EM8ZuwC/YVE2nGz9fgeEhFjoVrCB4GcrW2fiXW82RRYk9BY6MG6gRrOSz7R1w==', N'KOUN3IFF256IUGVLXWII5L7SKX6G7VSB', N'b8247390-a0de-4c1d-bdce-1fa3178f7703', N'01284473202', 0, 0, NULL, 1, 0, '01234567890123', N'User', 'default.png')
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'52594980-4d11-4924-8672-1a307728e2e3', N'15f61df4-15b5-41a9-b8b6-0f7228b458aa')
GO
INSERT [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'6ade61a6-919b-4b2b-bb0d-385df0af719a', N'Doctor', N'DOCTOR', NULL)
GO");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
