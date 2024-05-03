import { OfferGeneratorInterface } from './index.js';
import {MockData} from '../types/index.js';
import {
  getRandomNamber,
  getRandomItems
} from '../../helpers/index.js';
import {Value} from '../constants/index.js';

const {
  Zero,
  One,
  Five,
  Six,
  Eight,
  Ten,
  OneHundred,
  OneHundredThousand
} = Value;

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const firstRandomNumber = getRandomNamber(Zero, this.mockData.denomination.length - 1);
    const secondRandomNumber = getRandomNamber(Zero, this.mockData.city.length - 1);
    const randomNumberForDatePublication = getRandomNamber(Zero, Six);
    const randomNumberForName = getRandomNamber(Zero, this.mockData.name.length - 1);
    const randomNumberForTypeUser = getRandomNamber(Zero, One);

    const denomination = this.mockData.denomination[firstRandomNumber];
    const descriptionOffer = this.mockData.descriptionOffer[firstRandomNumber];
    const datePublication = new Date(2024, 4, randomNumberForDatePublication).toISOString();
    const city = this.mockData.city[secondRandomNumber];
    const previewImage = this.mockData.previewImage[firstRandomNumber];
    const photosHousing = this.mockData.photosHousing;
    const premium = getRandomNamber(Zero, One);
    const favorites = getRandomNamber(Zero, One);
    const rating = getRandomNamber(One, Five);
    const typeHousing = this.mockData.typeHousing[secondRandomNumber] ?? this.mockData.typeHousing[1];
    const numberRooms = getRandomNamber(One, Eight);
    const numberGuests = getRandomNamber(One, Ten);
    const rentPrice = getRandomNamber(OneHundred, OneHundredThousand);
    const comforts = getRandomItems<string>(this.mockData.comforts);
    const name = this.mockData.name[randomNumberForName];
    const email = this.mockData.email[randomNumberForName];
    const avatarUser = this.mockData.avatarUser[randomNumberForName] ?? ' ';
    const password = this.mockData.password[randomNumberForName];
    const typeUser = this.mockData.typeUser[randomNumberForTypeUser];
    const numberOfComments = getRandomNamber(Zero, OneHundredThousand);

    return [
      denomination, descriptionOffer, datePublication, city,
      previewImage, photosHousing, premium, favorites, rating,
      typeHousing, numberRooms, numberGuests,
      rentPrice, comforts, name, email, avatarUser,
      password, typeUser, numberOfComments
    ].join('\t');
  }
}
