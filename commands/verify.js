const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription(
      "Verify your UNLV email address with the verification code that you recieved"
    )
    .addStringOption((option) =>
      option
        .setName("auth")
        .setDescription("Input verification code")
        .setRequired(true)
    ),

  async execute(interaction, valid) {
    var botResponse = "";
    if (valid)
      botResponse =
        "Verification code was accepted, your user role should now be updated.";
    else botResponse = "Invalid verification code, please try again";

    await interaction.reply({
      content: botResponse,
      ephemeral: true,
    });
  },
};
