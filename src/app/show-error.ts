import chalk from 'chalk';

export const showError = (typeError: unknown): string => chalk.red(typeError);
