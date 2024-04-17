export type Callback = {
  onLine: (line: string) => void;
  onComplete: (count: number) => void;
};
