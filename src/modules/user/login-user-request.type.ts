import { Request } from 'express';

import {
  RequestBody,
  RequestParams
} from '../../libs/types/index.js';
import LoginUserDto from './dto/login-user.dto.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
