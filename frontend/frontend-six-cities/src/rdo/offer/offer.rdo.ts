import {
  CityName,
  Location,
  Type,
  User
} from '../../types/types';

export class OfferRdo {
  public id!: string;
  public rentPrice!: number;
  public rating!: number;
  public denomination!: string;
  public premium!: boolean;
  public favorites!: boolean;
  public city!: CityName;
  public coordinates!: Location;
  public previewImage!: string;
  public typeHousing!: Type;
  public numberRooms!: number;
  public descriptionOffer!: string;
  public comforts!: string[];
  public authorOfOffer!: User;
  public photosHousing!: string[];
  public numberGuests!: number;
  public datePublication!: string;
  public numberOfComments!: number;

}
