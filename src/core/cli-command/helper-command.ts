import chalk from 'chalk';
import { CliCommandInterface } from './index.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(chalk.yellow(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            ${chalk.green('npm run ts ./src/main.cli.ts --<command> [--arguments]')}
        Команды:
            ${chalk.green('--help')}:                      Выводит информацию о списке поддерживаемых команд.
            ${chalk.green('--version')}:                   Выводит информацию о версии приложения.
            ${chalk.green('--import <filepath>')}:         Импортирует в базу данных информацию из tsv-файла. Путь к файлу передаётся в параметре filepath.
        `));
  }
}
