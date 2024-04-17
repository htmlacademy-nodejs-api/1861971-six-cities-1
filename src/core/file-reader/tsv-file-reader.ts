import { open } from 'node:fs/promises';

import { FileReaderInterface } from './index.js';
import {Callback} from '../types/index.js';

const CHUNK_SIZE = 100;

export default class TSVFileReader implements FileReaderInterface {
  constructor(public filename: string) {}

  public async read({onLine, onComplete}: Callback): Promise<void> {

    const fd = await open(this.filename);

    const stream = fd.createReadStream({
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    stream.on('readable', () => {
      const chunk = stream.read(CHUNK_SIZE);

      if(chunk !== null) {
        remainingData += chunk.toString();
      }

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        onLine(completeRow);
      }
    });

    stream.on('end', () => onComplete(importedRowCount));
  }
}
