const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("request_code")
    .setDescription("Send a verification code to your UNLV email address.")
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("Input UNLV email address")
        .setRequired(true)
    ),

  async execute(interaction, valid) {
    var botResponse = "";
    var email = interaction.options.getString("email");
    if (valid == 1)
      botResponse = "Verification code has been sent to: " + email + ".";
    else if (valid == 0)
      botResponse = "Email address not found in the system, please double check your email address.";
    else botResponse = "You are already verified!";

    await interaction.reply({
      content: botResponse,
      ephemeral: true,
    });
  },
};
