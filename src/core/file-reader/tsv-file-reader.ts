import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { FileReaderInterface } from './index.js';
import {showError} from '../../app/index.js';
import {
  Offer,
  CitiesList,
  TypeHousinList,
  TypeComfortList
} from '../types/index.js';
import {
  TypeUserList,
  PhotosHousing
} from '../types/index.js';
import {
  CoordinatesList,
  NamesCities,
  RADIX,
  Avatar
} from '../constants/index.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public async read(): Promise<void> {
    try {
      const filePath = resolve(this.filename);
      this.rawData = await readFile(filePath, { encoding: 'utf8' });
    }catch(error){
      console.log(showError(error));
    }
  }

  public getOffersList(): Offer[] {
    const {Empty, Default} = Avatar;

    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
        denomination,
        descriptionOffer,
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
      ]) => {
        const namesCities: CitiesList = NamesCities[city as CitiesList];
        const photosList = photosHousing.split(',') as PhotosHousing;
        const nameHousing = typeHousing as TypeHousinList;
        const nameComfort = comforts as TypeComfortList;
        const categoryUser = typeUser as TypeUserList;

        return ({
          denomination,
          descriptionOffer,
          datePublication: new Date().toISOString(),
          city: namesCities,
          previewImage,
          photosHousing: photosList,
          premium: JSON.parse(premium),
          favorites: JSON.parse(favorites),
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
      });
  }
}
