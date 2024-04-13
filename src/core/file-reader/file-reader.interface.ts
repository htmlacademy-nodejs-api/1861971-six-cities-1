export interface FileReaderInterface {
  readonly filename: string;
  read(): Promise<void>;
}
