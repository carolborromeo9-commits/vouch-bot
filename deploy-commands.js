require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Send a vouch')
    .addAttachmentOption((option) =>
      option.setName('proof').setDescription('Proof').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('item').setDescription('Item').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('feedback').setDescription('Feedback').setRequired(true)
    )
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log('Commands registered!');
  } catch (error) {
    console.error(error);
  }
})();
