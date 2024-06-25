import {
  NamesCities,
  TypeHousing,
  ComfortsList
} from '../constants/index.js';
import {
  CoordinatesOffer,
  User,
  PhotosHousing
} from './index.js';

export type CitiesList = typeof NamesCities[keyof typeof NamesCities];
export type TypeHousinList = typeof TypeHousing[keyof typeof TypeHousing];
export type TypeComfortList = typeof ComfortsList[keyof typeof ComfortsList];

export type Offer = {
  denomination: string;
  descriptionOffer: string;
  datePublication: string;
  city: CitiesList;
  previewImage: string;
  photosHousing: PhotosHousing,
  premium: boolean;
  favorites: boolean;
  rating: number;
  typeHousing: TypeHousinList;
  numberRooms: number;
  numberGuests: number;
  rentPrice: number;
  comforts: TypeComfortList[];
  authorOfOffer: User;
  numberOfComments?: number;
  coordinates: CoordinatesOffer;
};
