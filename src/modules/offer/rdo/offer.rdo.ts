import { Expose } from 'class-transformer';

import {
  PhotosHousing,
  User,
  CoordinatesOffer,
  TypeComfortList,
  TypeHousinList,
  CitiesList
} from '../../../core/types/index.js';

export default class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public denomination!: string ;

  @Expose()
  public descriptionOffer!: string;

  @Expose()
  public datePublication!: string;

  @Expose()
  public city!: CitiesList;

  @Expose()
  public previewImage!: string;

  @Expose()
  public photosHousing!: PhotosHousing;

  @Expose()
  public premium!: boolean;

  @Expose()
  public favorites!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public typeHousing!: TypeHousinList;

  @Expose()
  public numberRooms!: number;

  @Expose()
  public numberGuests!: number;

  @Expose()
  public rentPrice!: number;

  @Expose()
  public comforts!: TypeComfortList;

  @Expose()
  public authorOfOffer!: User;

  @Expose()
  public numberOfComments!: number;

  @Expose()
  public coordinates!: CoordinatesOffer;
}
