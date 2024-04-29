export const getMongoURI = (
  username: string,
  password: string,
  host: string,
  port: string
): string => `mongodb://${username}:${password}@${host}:${port}/`;
