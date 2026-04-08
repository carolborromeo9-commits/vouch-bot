require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('vouch')
      .setDescription('Send a vouch')
      .addAttachmentOption(option =>
        option.setName('proof').setDescription('Proof').setRequired(true)
      )
      .addStringOption(option =>
        option.setName('item').setDescription('Item').setRequired(true)
      )
      .addStringOption(option =>
        option.setName('feedback').setDescription('Feedback').setRequired(true)
      )
      .toJSON()
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    await registerCommands();
    console.log('Slash command registered.');
  } catch (err) {
    console.error('Command registration failed:', err);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'vouch') return;

  try {
    const buyer = interaction.user;

    const proof = interaction.options.getAttachment('proof', true);
    const item = interaction.options.getString('item', true);
    const feedback = interaction.options.getString('feedback', true);

    const buyerMention = `<@${buyer.id}>`;
    const sellerMention = `<@${process.env.SELLER_ID}>`;
    const avatar = buyer
