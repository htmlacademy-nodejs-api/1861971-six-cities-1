import { readFile } from 'node:fs/promises';
import {resolve} from 'node:path';

import { CliCommandInterface } from './index.js';
import {
  showError,
  showResult
} from '../../app/index.js';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  private async readVersion(): Promise<string | unknown> {
    try{
      const filePath = resolve('./package.json');
      const contentPageJSON = await readFile(filePath, {encoding:'utf-8'});
      const content = JSON.parse(contentPageJSON);
      return showResult(content.version);
    }catch(error){
      return showError(error);
    }
  }

  public async execute(): Promise<void> {
    const version = await this.readVersion();
    console.log(version);
  }
}
