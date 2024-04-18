import { WriteStream } from 'node:fs';
import { createWriteStream } from 'node:fs';

import { FileWriterInterface } from './index.js';

const CHUNK_SIZE = 100;

export default class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'r+',
      encoding: 'utf8',
      highWaterMark: CHUNK_SIZE,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      await new Promise((resolve, reject) => {
        this.stream.once('drain', resolve);
        this.stream.once('error', reject);
      });
    }
  }
}
