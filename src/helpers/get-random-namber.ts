export const getRandomNamber = (minNamber: number, maxNamber: number): number => {
  minNamber = Math.ceil(minNamber);
  maxNamber = Math.floor(maxNamber);

  return Math.floor(Math.random() * (maxNamber - minNamber + 1)) + minNamber;
};
