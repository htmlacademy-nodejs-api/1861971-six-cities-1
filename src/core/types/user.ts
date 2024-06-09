import {TypeUser} from '../constants/index.js';

export type TypeUserList = typeof TypeUser[keyof typeof TypeUser];

export type User = {
  name: string;
  email: string;
  avatarUser?: string;
  password?: string;
  typeUser: TypeUserList;
};
