import { UserType } from '../const';
import {CreateUserDto} from '../dto/user/index';
import { CreateOfferDto } from '../dto/offer';
import {
  NewOffer
} from '../types/types';

export type User = {
  name: string;
  type: UserType;
  email: string;
  password: string;
};

export const adaptDataUserToServer =
  (user: User): CreateUserDto => ({
    name: user.name,
    email: user.email,
    password: user.password,
    typeUser: user.type
  });

export const adaptDataOfferToServer =
  (offer: NewOffer): CreateOfferDto => ({
    rentPrice: offer.price,
    denomination: offer.title,
    premium: offer.isPremium,
    favorites: false,
    city: offer.city.name,
    coordinates: offer.location,
    previewImage: offer.previewImage,
    typeHousing: offer.type,
    numberRooms: offer.bedrooms,
    descriptionOffer: offer.description,
    comforts: offer.goods,
    photosHousing: offer.images,
    numberGuests: offer.maxAdults,
  });
