import {
  LoggedUserRdo,
  UserRdo
} from '../rdo/user';
import { OfferRdo } from '../rdo/offer';
import { CommentRdo } from '../rdo/comment';
import {
  User,
  Offer,
  Comment
} from '../types/types';
import { UserType } from '../const';

export const adaptDataUserToClient =
  (user: LoggedUserRdo): User & { token: string, refreshToken: string} => ({
    name: user.name,
    avatarUrl: user.avatarUser,
    type: user.typeUser as UserType,
    email: user.email,
    token: user.token,
    refreshToken: user.refreshToken
  });

export const adaptDataUserStatusToClient =
  (user: UserRdo): User => ({
    name: user.name,
    avatarUrl: user.avatarUser,
    type: user.typeUser as UserType,
    email: user.email
  });

export const adaptDataOfferToClien =
  (offer: OfferRdo): Offer => ({
    id: offer.id,
    price: offer.rentPrice,
    rating: offer.rating,
    title: offer.denomination,
    isPremium: offer.premium,
    isFavorite: offer.favorites,
    city: {
      name: offer.city,
      location: offer.coordinates,
    },
    location: offer.coordinates,
    previewImage: offer.previewImage,
    type: offer.typeHousing,
    bedrooms: offer.numberRooms,
    description: offer.descriptionOffer,
    goods: offer.comforts,
    host: offer.authorOfOffer,
    images: offer.photosHousing,
    maxAdults: offer.numberGuests
  });

export const adaptDataCommentToClient =
  (comment: CommentRdo): Comment => ({
    id: comment.id,
    comment: comment.text,
    date: comment.createdAt,
    rating: comment.rating,
    user: {
      name: comment.authorOfOffer.name,
      avatarUrl: comment.authorOfOffer.avatarUser,
      type: comment.authorOfOffer.typeUser as UserType,
      email: comment.authorOfOffer.email
    }
  });
