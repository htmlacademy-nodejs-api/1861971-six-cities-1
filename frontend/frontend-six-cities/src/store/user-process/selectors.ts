import { AuthorizationStatus, StoreSlice } from '../../const';
import type { State, UserProcess } from '../../types/state';

export const getAuthorizationStatus = ({ [StoreSlice.UserProcess]: USER_PROCESS }: State): AuthorizationStatus => USER_PROCESS.authorizationStatus;
export const getIsAuthorized = ({ [StoreSlice.UserProcess]: USER_PROCESS }: State): boolean => USER_PROCESS.authorizationStatus === AuthorizationStatus.Auth;
export const getUser = ({ [StoreSlice.UserProcess]: USER_PROCESS }: State): UserProcess => USER_PROCESS;
