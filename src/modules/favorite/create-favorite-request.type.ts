import { Request } from 'express';

import {
  RequestBody,
  RequestParams
} from '../../libs/types/index.js';
import CreateUserDto from '../user/dto/create-user.dto.js';

export type CreateFavoriteRequest = Request<RequestParams, RequestBody, CreateUserDto>;
