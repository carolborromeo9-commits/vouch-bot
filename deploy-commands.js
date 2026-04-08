require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Send a vouch')
    .addAttachmentOption(option =>
      option.setName('a_proof').setDescription('Proof').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('b_item').setDescription('Item').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('c_feedback').setDescription('Feedback').setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );
})();
