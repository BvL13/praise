import { SettingModel } from '../schemas/settings/03_settings.schema';

const settings = [
  {
    key: 'PRAISE_ACCOUNT_ALREADY_ACTIVATED_ERROR',
    value:
      '**❌ Account Already Activated**\nYour account is already activated in the praise system.',
    type: 'Textarea',
    label: 'Praise Account Already Activated',
    description: 'Discord /activate command response',
  },
];

const up = async (): Promise<void> => {
  const settingUpdates = settings.map((s) => ({
    updateOne: {
      filter: { key: s.key },

      // Insert setting if not found, otherwise continue
      update: { $setOnInsert: { ...s } },
      upsert: true,
    },
  })) as any;

  await SettingModel.bulkWrite(settingUpdates);
};

const down = async (): Promise<void> => {
  const allKeys = settings.map((s) => s.key);
  await SettingModel.deleteMany({ key: { $in: allKeys } });
};

export { up, down };
