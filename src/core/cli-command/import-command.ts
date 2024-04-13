import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './index.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());

    await fileReader.read();
    console.log(fileReader.getOffersList());
  }
}
