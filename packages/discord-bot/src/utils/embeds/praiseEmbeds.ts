import { User, EmbedBuilder, Role } from 'discord.js';
import { renderMessage } from '../renderMessage';

export const praiseRoleError = async (
  roles: Role[],
  user: User,
  host: string
): Promise<EmbedBuilder> => {
  const msg = await renderMessage(
    'PRAISE_WITHOUT_PRAISE_GIVER_ROLE_ERROR',
    host,
    { user, roles }
  );

  return new EmbedBuilder().setColor('#ff0000').setDescription(msg);
};

export const communityNotCreatedError = (webUrl: string): EmbedBuilder => {
  return new EmbedBuilder().setDescription(
    `⚠️ Before you can begin praising, you need to create a Praise Community. Follow below link to create your community in less than 5 mins.\n\n${webUrl}`
  );
};

export const praiseWelcomeEmbed = (
  name: string,
  webUrl: string,
  nonce: string,
  isActive: boolean,
  hostId: string,
  guildId: string
): EmbedBuilder => {
  return new EmbedBuilder().setDescription(
    `✅ Praise community created\n✅ Praise bot added to Discord\n${
      isActive ? '✅' : '🔴'
    } Praise bot linked to community\n\nOne final step before you can start praising! Follow below link and sign a message with your wallet to secure the connection between the bot and the newly setup community.\n[Link Praise Bot to "${name}"](${webUrl}/discord-bot/link?nonce=${nonce}&communityId=${hostId}&guildId=${guildId})`
  );
};

export const praiseSuccessDM = async (
  praiseUrl: string,
  host: string,
  isActivated = true
): Promise<EmbedBuilder> => {
  const msg = await renderMessage('PRAISE_SUCCESS_DM', host, { praiseUrl });
  const embed = new EmbedBuilder().setColor('#696969').setDescription(msg);

  if (!isActivated) {
    const notActivatedMsg = await renderMessage(
      'PRAISE_ACCOUNT_NOT_ACTIVATED_ERROR_DM',
      host
    );

    embed.addFields([
      {
        name: '\u200b',
        value: notActivatedMsg,
      },
    ]);
  }

  return embed;
};
