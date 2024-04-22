import convict from 'convict';
import validator from 'convict-format-with-validator';

import {RestSchema} from '../types/index.js';

convict.addFormats(validator);

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  DB_ADDRESS: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_ADDRESS',
    default: '127.0.0.1'
  },
  SOLT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SOLT',
    default: null
  }
});
