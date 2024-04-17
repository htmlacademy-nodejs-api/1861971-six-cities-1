import { OfferGeneratorInterface } from './index.js';
import {MockData} from '../types/index.js';
import {
  getRandomNamber,
  getRandomItems
} from '../../helpers/index.js';
import {Value} from '../constants/index.js';

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const firstRandomNumber = getRandomNamber(Value[0], this.mockData.denomination.length - 1);
    const secondRandomNumber = getRandomNamber(Value[0], this.mockData.city.length - 1);
    const randomNumberForDatePublication = getRandomNamber(Value[0], Value[6]);
    const randomNumberForName = getRandomNamber(Value[0], this.mockData.name.length - 1);
    const randomNumberForTypeUser = getRandomNamber(Value[0], Value[1]);

    const denomination = this.mockData.denomination[firstRandomNumber];
    const descriptionOffer = this.mockData.descriptionOffer[firstRandomNumber];
    const datePublication = new Date(2024, 4, randomNumberForDatePublication).toISOString();
    const city = this.mockData.city[secondRandomNumber];
    const previewImage = this.mockData.previewImage[firstRandomNumber];
    const photosHousing = this.mockData.photosHousing;
    const premium = getRandomNamber(Value[0], Value[1]);
    const favorites = getRandomNamber(Value[0], Value[1]);
    const rating = getRandomNamber(Value[0], Value[5]);
    const typeHousing = this.mockData.typeHousing[secondRandomNumber] ?? this.mockData.typeHousing[1];
    const numberRooms = getRandomNamber(Value[1], Value[8]);
    const numberGuests = getRandomNamber(Value[1], Value[10]);
    const rentPrice = getRandomNamber(Value[100], Value[100000]);
    const comforts = getRandomItems<string>(this.mockData.comforts);
    const name = this.mockData.name[randomNumberForName];
    const email = this.mockData.email[randomNumberForName];
    const avatarUser = this.mockData.avatarUser[randomNumberForName] ?? ' ';
    const password = this.mockData.password[randomNumberForName];
    const typeUser = this.mockData.typeUser[randomNumberForTypeUser];
    const numberOfComments = getRandomNamber(Value[0], Value[100000]);

    return [
      denomination, descriptionOffer, datePublication, city,
      previewImage, photosHousing, premium, favorites, rating,
      typeHousing, numberRooms, numberGuests,
      rentPrice, comforts, name, email, avatarUser,
      password, typeUser, numberOfComments
    ].join('\t');
  }
}
