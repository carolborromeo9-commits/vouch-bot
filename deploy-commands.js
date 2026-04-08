require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Send a vouch')
    .addStringOption(option =>
      option.setName('a_item').setDescription('Item').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('b_feedback').setDescription('Feedback').setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName('c_proof').setDescription('Proof').setRequired(true)
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
