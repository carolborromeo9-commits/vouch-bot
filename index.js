require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder,
} = require('discord.js');

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

async function registerCommands() {
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
    const avatar = buyer.displayAvatarURL({ size: 1024 });

    const embed1 = new EmbedBuilder()
      .setAuthor({
        name: buyer.username,
        iconURL: avatar,
      })
      .setDescription(
        `<:korizumi:1491450691208609936> ${buyerMention} has vouched ${sellerMention}`
      );

    const embed2 = new EmbedBuilder()
      .setDescription(
        `<:pearl:1485552109410713611> **item:** ${item}\n\n` +
          `<:pearl:1485552109410713611> **feedback:** ${feedback}`
      )
      .setImage(proof.url);

    const webhookResponse = await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'cıα',
        embeds: [embed1.toJSON(), embed2.toJSON()],
      }),
    });

    if (!webhookResponse.ok) {
      const text = await webhookResponse.text();
      console.error('Webhook error:', text);
      throw new Error('Webhook failed');
    }

    await interaction.reply({
      content: `_ _
            _ _ _ _   **warranty activated !**_ _

-# _ _               thank  ü  saur  much  for your
-# _ _               purchase feel free to create a
-# _ _               report    tix    anytime  for app
-# _ _                 updates  or  lil concerns <a:korila:1482440638694686811> 
_ _`,
      ephemeral: true,
    });
  } catch (err) {
    console.error(err);
    if (!interaction.replied) {
      await interaction.reply({
        content: 'nag error 😭',
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.BOT_TOKEN);
