const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const database = require("../database/Database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a student from a class.")
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("Input the student's UNLV email address")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("class")
        .setDescription(
          "Input the class name to remove, EX: 2228-CS-218-SEC1003-90697"
        )
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    // Check If User Has Instructor Role
    if (
      interaction.member.roles.cache.some((role) => role.name === "Instructor")
    ) {
      // Fetch User from DB
      var student = await database.getUser(
        "student_email",
        interaction.options.getString("email")
      );
      // Check if Student is in DB
      if (!student || student.discord_id == null)
        botResponse =
          "Student was not found in the DB, please check the email entered.";
      else {
        var classID = interaction.options.getString("class");

        var member = await interaction.guild.members.fetch(student.discord_id);

        var botResponse =
          student.name + " has been removed from class: " + classID;

        var myRole = interaction.guild.roles.cache.find(
          (role) => role.name === classID
        );
        // Check if Discord Role Exists
        if (!myRole)
          botResponse = "Class ID was not found in the Discord Roles!";
        else {
          //Delete Student From Enrollemnt DB and update Discord Role
          await database.delFromEnroll(student.student_email, classID);
          member.roles.remove(myRole);
        }
      }
    } else botResponse = "You do not have permissions to use this command!";
    await interaction.reply({
      content: botResponse,
      ephemeral: true,
    });
  },
};
