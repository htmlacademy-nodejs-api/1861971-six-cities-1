import {Callback} from '../types/index.js';

export interface FileReaderInterface {
  readonly filename: string;
  read(arg0: Callback): Promise<void>;
}
