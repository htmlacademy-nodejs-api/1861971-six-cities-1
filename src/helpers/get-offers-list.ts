import {
  Offer,
  CitiesList,
  PhotosHousing,
  TypeHousinList,
  TypeComfortList,
  TypeUserList
} from '../core/types/index.js';
import {
  Avatar,
  NamesCities,
  RADIX,
  CoordinatesList
} from '../core/constants/index.js';

export const getOffersList = (rawData: string): Offer => {
  const {Empty, Default} = Avatar;

  const[
    denomination,
    descriptionOffer,
    datePublication,
    city,
    previewImage,
    photosHousing,
    premium,
    favorites,
    rating,
    typeHousing,
    numberRooms,
    numberGuests,
    rentPrice,
    comforts,
    name,
    email,
    avatarUser,
    password,
    typeUser,
    numberOfComments
  ] = rawData
    .replace('\n', '')
    .split('\t');

  const namesCities: CitiesList = NamesCities[city as CitiesList];
  const photosList = photosHousing.split(',') as PhotosHousing;
  const nameHousing = typeHousing as TypeHousinList;
  const nameComfort = comforts as unknown as TypeComfortList[];
  const categoryUser = typeUser as TypeUserList;

  return ({
    denomination,
    descriptionOffer,
    datePublication,
    city: namesCities,
    previewImage,
    photosHousing: photosList,
    premium: new Boolean(Number.parseInt(premium, RADIX)).valueOf(),
    favorites: new Boolean(Number.parseInt(favorites, RADIX)).valueOf(),
    rating: Number.parseInt(rating, RADIX),
    typeHousing: nameHousing,
    numberRooms: Number.parseInt(numberRooms, RADIX),
    numberGuests: Number.parseInt(numberGuests, RADIX),
    rentPrice: Number.parseInt(rentPrice, RADIX),
    comforts: nameComfort,
    authorOfOffer: {
      name,
      email,
      avatarUser: avatarUser === Empty ? Default : avatarUser,
      password,
      typeUser: categoryUser
    },
    numberOfComments: Number.parseInt(numberOfComments, RADIX),
    coordinates: CoordinatesList[namesCities]
  });
};
