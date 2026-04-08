require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'vouch') return;

  try {
    const buyer = interaction.user;

    const item = interaction.options.getString('a_item', true);
    const feedback = interaction.options.getString('b_feedback', true);
    const proof = interaction.options.getAttachment('c_proof', true);

    const buyerMention = `<@${buyer.id}>`;
    const sellerMention = `<@${process.env.SELLER_ID}>`;
    const avatar = buyer.displayAvatarURL({ size: 1024 });

    const embed1 = new EmbedBuilder()
      .setAuthor({
        name: buyer.username,
        iconURL: avatar
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

    await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'cia',
        embeds: [embed1.toJSON(), embed2.toJSON()]
      })
    });

    await interaction.reply({
      content: `_ _
_ _ _ _   **warranty activated !**_ _

-# _ _               thank ü saur much for your
-# _ _               purchase feel free to create a
-# _ _               report tix anytime for app
-# _ _               updates or lil concerns <a:korila:1482440638694686811>
_ _`,
      ephemeral: true
    });

  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.BOT_TOKEN);
