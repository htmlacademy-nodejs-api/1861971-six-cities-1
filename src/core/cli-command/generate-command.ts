import axios from 'axios';

import OfferGenerator from '../offer-generator/offer-generator.js';
import TSVFileWriter from '../file-writer/tsv-file-writer.js';
import { CliCommandInterface } from './index.js';
import {MockData} from '../types/index.js';
import {
  showError,
  showResult,
  getErrorMessage
} from '../../app/index.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;

    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = (await axios.get(url)).data;
    } catch(error) {
      console.log(showError(`Can't fetch data from ${url}.`));
      return;
    }

    const offerGeneratorString = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      try{
        await tsvFileWriter.write(offerGeneratorString.generate());
      }catch(error){
        console.log(showError(`Can't write to file: ${getErrorMessage(error)}`));
        return;
      }
    }

    console.log(showResult(`File ${filepath} was created!`));
  }
}
