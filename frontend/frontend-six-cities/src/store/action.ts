import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  UserAuth,
  //User,
  Offer,
  Comment,
  CommentAuth,
  FavoriteAuth,
  UserRegister,
  NewOffer
} from '../types/types';
import {
  ApiRoute,
  AppRoute,
  HttpCode,
  NameToken
} from '../const';
import { Token } from '../utils';
import {
  LoggedUserRdo,
  UserRdo
} from '../rdo/user';
import {
  OfferRdo
} from '../rdo/offer';
import { CommentRdo } from '../rdo/comment';
import {
  adaptDataUserToServer,
  adaptDataOfferToServer
} from '../utils/adaptersToServer';
import {
  adaptDataUserToClient,
  adaptDataUserStatusToClient,
  adaptDataOfferToClien,
  adaptDataCommentToClient
} from '../utils/adaptersToClient';
//import {userStatus} from '../store/user-process/user-process';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
  FETCH_GET_NEW_PAIRS_TOKEN: 'user/fetch-get-new-tokens'
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const offersList: Offer[] = [];

    const { data } = await api.get<OfferRdo[]>(`${ApiRoute.Offers}${ApiRoute.List}`);

    data.forEach((value: OfferRdo) => {
      const adaptedDataOfferToClien = adaptDataOfferToClien(value);
      offersList.push(adaptedDataOfferToClien);
    });

    return offersList;
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const favoriteOffersList: Offer[] = [];

    const { data } = await api.get<OfferRdo[]>(`${ApiRoute.Favorite}${ApiRoute.List}`);

    data.forEach((value: OfferRdo) => {
      const adaptedDataOfferToClien = adaptDataOfferToClien(value);
      favoriteOffersList.push(adaptedDataOfferToClien);
    });

    return favoriteOffersList;
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<OfferRdo>(
        `${ApiRoute.Offers}${ApiRoute.ShowOffer}/${id}`
      );

      const adaptedDataOfferToClien = adaptDataOfferToClien(data);

      return adaptedDataOfferToClien;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const adaptedDataOfferToServer = adaptDataOfferToServer(newOffer);

    const { data } = await api.post<OfferRdo>(
      `${ApiRoute.Offers}${ApiRoute.Create}`,
      adaptedDataOfferToServer
    );

    const adaptedDataOfferToClien = adaptDataOfferToClien(data);
    history.push(`${AppRoute.Property}/${adaptedDataOfferToClien.id}`);

    return adaptedDataOfferToClien;
  });

export const editOffer = createAsyncThunk<Offer, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;

    const adaptedDataOfferToServer = adaptDataOfferToServer(offer);

    const { data } = await api.patch<OfferRdo>(
      `${ApiRoute.Offers}${ApiRoute.Redaction}/${offer.id}`,
      adaptedDataOfferToServer);

    const adaptedDataOfferToClien = adaptDataOfferToClien(data);
    history.push(`${AppRoute.Property}/${data.id}`);

    return adaptedDataOfferToClien;
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}${ApiRoute.Delete}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    const premiumoffersList: Offer[] = [];

    const { data } = await api.get<OfferRdo[]>(
      `${ApiRoute.Offers}${ApiRoute.Premium}?nameCity=${cityName}`
    );

    data.forEach((value: OfferRdo) => {
      const adaptedDataOfferToClien = adaptDataOfferToClien(value);
      premiumoffersList.push(adaptedDataOfferToClien);
    });

    return premiumoffersList;
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const commentsList: Comment[] = [];

    const { data } = await api.get<CommentRdo[]>(`${ApiRoute.Comments}${ApiRoute.List}/${id}`);

    data.forEach((value: CommentRdo) => {
      const adaptedDataCommentToClient = adaptDataCommentToClient(value);
      commentsList.push(adaptedDataCommentToClient);
    });

    return commentsList;
  });
/*
export const fetchGetNewPairsToken = createAsyncThunk<
void,
undefined,
{ extra: Extra }>(
  Action.FETCH_GET_NEW_PAIRS_TOKEN,
  async (_, {dispatch, extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<LoggedUserRdo>(`${ApiRoute.RefreshToken}${ApiRoute.Login}`);

      const adaptedDataUserToClient = adaptDataUserToClient(data);

      Token.save(adaptedDataUserToClient.token, NameToken.Token);
      Token.save(adaptedDataUserToClient.refreshToken, NameToken.RefreshToken);

      dispatch(fetchUserStatus());
    } catch (error) {
      return Promise.reject(error);
    }
  });
*/
export const fetchUserStatus = createAsyncThunk<
{email: string, avatarUrl: string},
undefined,
{ extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, {extra }) => {
    const { api } = extra;

    try{
      const {data} = await api.get<UserRdo>(`${ApiRoute.Users}${ApiRoute.Login}`);

      const {email, avatarUrl} = adaptDataUserStatusToClient(data);
      return {email, avatarUrl};
    }catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NoAuth) {
        Token.drop(NameToken.Token);
        Token.drop(NameToken.RefreshToken);
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<
{email: string, avatarUrl: string},
UserAuth,
{ extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;

    const { data } = await api.post<LoggedUserRdo>(
      `${ApiRoute.Users}${ApiRoute.Login}`,
      { email, password }
    );

    const adaptedDataUserToClient = adaptDataUserToClient(data);
    const {
      token,
      refreshToken,
      avatarUrl
    } = adaptedDataUserToClient;

    Token.save(token, NameToken.Token);
    Token.save(refreshToken, NameToken.RefreshToken);
    history.push(AppRoute.Root);

    return {
      email: adaptedDataUserToClient.email,
      avatarUrl
    };
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async (_, { extra }) => {
    const { api } = extra;
    await api.delete(`${ApiRoute.Users}${ApiRoute.Logout}`);

    Token.drop(NameToken.Token);
    Token.drop(NameToken.RefreshToken);
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, type }, { extra }) => {
    const { api, history } = extra;
    const adaptedDataUserToServer = adaptDataUserToServer({ email, password, name, type });

    const { data } = await api.post<{ id: string }>(
      `${ApiRoute.Users}${ApiRoute.Register}`,
      adaptedDataUserToServer
    );

    if (avatar !== undefined) {
      const payload = new FormData();
      payload.append('avatar', avatar);

      await api.post(
        `${ApiRoute.Users}/${data.id}${ApiRoute.Avatar}`,
        payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    }

    history.push(AppRoute.Login);
  });


export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({ id, comment, rating }, { extra }) => {
    const { api } = extra;

    const { data } = await api.post<CommentRdo>(
      `${ApiRoute.Comments}${ApiRoute.Create}/${id}`,
      { comment, rating }
    );

    const adaptedDataCommentToClient = adaptDataCommentToClient(data);

    return adaptedDataCommentToClient;
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.post<OfferRdo>(
      `${ApiRoute.Favorite}${ApiRoute.Create}/${id}`
    );

    const adaptedDataOfferToClien = adaptDataOfferToClien(data);

    return adaptedDataOfferToClien;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.delete<OfferRdo>(
      `${ApiRoute.Favorite}${ApiRoute.Delete}/${id}`
    );

    const adaptedDataOfferToClien = adaptDataOfferToClien(data);

    return adaptedDataOfferToClien;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});
