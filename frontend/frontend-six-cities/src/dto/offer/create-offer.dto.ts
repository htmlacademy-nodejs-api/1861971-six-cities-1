import {
  Location,
  Type,
} from '../../types/types';

export class CreateOfferDto {
  public rentPrice!: number;
  public denomination!: string;
  public premium!: boolean;
  public favorites!: boolean;
  public city!: string;
  public coordinates!: Location;
  public previewImage!: string;
  public typeHousing!: Type;
  public numberRooms!: number;
  public descriptionOffer!: string;
  public comforts!: string[];
  public photosHousing!: string[];
  public numberGuests!: number;
}
