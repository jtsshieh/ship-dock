import { DiscordStrategy } from './discord/discord.strategy';
import { GoogleStrategy } from './google/google.strategy';
import { LocalStrategy } from './local/local.strategy';

export const AVAILABLE_STRATEGIES = [
	DiscordStrategy,
	GoogleStrategy,
	LocalStrategy,
] as const;
