import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './index.js';
import {
  getOffersList,
  getErrorMessage,
  showResult,
  showError
} from '../../app/index.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private onLine(line: string) {
    const offer = getOffersList(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(showResult(`${count} rows imported.`));
  }

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());

    try {
      await fileReader.read({
        onLine: this.onLine,
        onComplete: this.onComplete
      });
    } catch(error) {
      console.log(showError(`Can't read the file: ${getErrorMessage(error)}`));
    }
  }
}
