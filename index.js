const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  GuildMember,
} = require("discord.js");
const { token } = require("./config.json");
const emailer = require("./mail-sender.js");
const {
  sendVerifyMessage,
  checkCode,
} = require("./botActions/helperFunctions.js");
const database = require("./database/Database");

// Create a new client instance
const unlvBot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
});

//Grab all slash commands for the bot
unlvBot.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
const mailSender = new emailer();

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  unlvBot.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
unlvBot.once(Events.ClientReady, () => {
  console.log("Ready!");
});

unlvBot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = unlvBot.commands.get(interaction.commandName);

  if (!command) return;

  try {
    if (interaction.commandName === "request_code") {
      const validEmail = await sendVerifyMessage(interaction, mailSender);
      await command.execute(interaction, validEmail);
    } else if (interaction.commandName === "verify") {
      const validCode = await checkCode(interaction);
      await command.execute(interaction, validCode);
    } else await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    unlvBot.once(event.name, (...args) => event.execute(...args));
  } else {
    unlvBot.on(event.name, (...args) => event.execute(...args));
  }
}

// Log in to Discord with your client's token
unlvBot.login(token);
