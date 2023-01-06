const { SlashCommandBuilder } = require("discord.js");
const database = require("../database/Database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add_classes")
    .setDescription("The bot will assign roles for the classes you are in."),

  async execute(interaction) {
    var botResponse = "";

    if (
      interaction.member.roles.cache.some((role) => role.name === "Verified")
    ) {
        // Fetch User
      let user = await database.getUser("discord_id", interaction.member.id);
       // Join all User Classes
      let classes = await database.getStudentClasses(user.student_email);
      botResponse = "The appropriate class roles have been assigned.";
      for (var i = 0, l = classes.length; i < l; i++) {
        // Find Class Role
        let classRole = interaction.guild.roles.cache.find(
          (role) => role.name === classes[i].class_id
        );
        // Assign Role
        await interaction.member.roles.add(classRole);
      }
    } else botResponse = "You have not verified your email address! ";

    await interaction.reply({
      content: botResponse,
      ephemeral: true,
    });
  },
};
