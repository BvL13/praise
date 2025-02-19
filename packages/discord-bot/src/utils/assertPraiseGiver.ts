import { CacheType, CommandInteraction, GuildMember, Role } from 'discord.js';
import { praiseRoleError } from './embeds/praiseEmbeds';
import { renderMessage } from './renderMessage';
import { getSetting } from './settingsUtil';
/**
 * Check if user has discord role PRAISE_GIVER_ROLE_ID if required,
 *  if not: reply with an error message
 *
 */
export const assertPraiseGiver = async (
  praiseGiver: GuildMember,
  interaction: CommandInteraction<CacheType>,
  sendReply: boolean,
  host: string
): Promise<boolean> => {
  const { guild } = interaction;

  if (!guild) {
    if (sendReply) {
      await interaction.editReply({
        content: await renderMessage('DM_ERROR'),
      });
    }
    return false;
  }

  const [praiseGiverRoleIDRequired, praiseGiverRoleIDList] = await Promise.all([
    getSetting('PRAISE_GIVER_ROLE_ID_REQUIRED', host) as Promise<boolean>,
    getSetting('PRAISE_GIVER_ROLE_ID', host) as Promise<string[]>,
  ]);

  if (!praiseGiverRoleIDRequired) {
    return true;
  }

  // Assert that a Praise Giver Role ID has been specified
  if (
    !praiseGiverRoleIDList ||
    (praiseGiverRoleIDList.length === 1 &&
      (!praiseGiverRoleIDList[0] || praiseGiverRoleIDList[0] === '0'))
  ) {
    if (sendReply) {
      await interaction.editReply({
        content: '**❌ No Praise Giver Discord Role ID specified.**',
      });
    }
    return false;
  }

  // Assert that the all praise giver roles exist
  const roles: Role[] = [];
  let invalidRole = '';
  for (const roleID of praiseGiverRoleIDList) {
    const guildRole = guild.roles.cache.find((r) => r.id === roleID);
    if (!guildRole) {
      invalidRole = roleID;
      break;
    } else {
      roles.push(guildRole);
    }
  }

  if (invalidRole) {
    if (sendReply) {
      await interaction.editReply({
        content: `**❌ Unknown Praise Giver Discord Role ID: "${invalidRole}".**`,
      });
    }
    return false;
  }

  let isPraiseGiver = false;
  for (const roleID of praiseGiverRoleIDList) {
    if (praiseGiver.roles.cache.find((r) => r.id === roleID)) {
      isPraiseGiver = true;
      break;
    }
  }

  if (!isPraiseGiver) {
    if (sendReply) {
      await interaction.editReply({
        embeds: [await praiseRoleError(roles, praiseGiver.user, host)],
      });
    }
    return false;
  }

  return true;
};
