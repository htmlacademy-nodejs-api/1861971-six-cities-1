import {
  defaultClasses,
  getModelForClass,
  prop,
  modelOptions
} from '@typegoose/typegoose';

import {
  CitiesList,
  PhotosHousing,
  TypeHousinList,
  TypeComfortList,
  User,
  CoordinatesOffer
} from '../../core/types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    minlength: 10,
    maxlength: 100
  })
  public denomination!: string;

  @prop({
    required: true,
    minlength: 20,
    maxlength:1024
  })
  public descriptionOffer!: string;

  @prop({
    required: true
  })
  public datePublication!: string;

  @prop({
    required: true
  })
  public city!: CitiesList;

  @prop({
    required: true
  })
  public previewImage!: string;

  @prop({
    required: true
  })
  public photosHousing!: PhotosHousing;

  @prop({
    required: true
  })
  public premium!: boolean;

  @prop({
    required: true
  })
  public favorites!: boolean;

  @prop({
    required: true,
    default: 1,
    min: 1,
    max: 5
  })
  public rating!: number;

  @prop({
    required: true
  })
  public typeHousing!: TypeHousinList;

  @prop({
    required: true,
    min: 1,
    max: 8
  })
  public numberRooms!: number;

  @prop({
    required: true,
    min: 1,
    max: 10
  })
  public numberGuests!: number;

  @prop({
    required: true,
    min: 100,
    max: 100000
  })
  public rentPrice!: number;

  @prop({
    required: true
  })
  public comforts!: TypeComfortList;

  @prop({
    required: true,
  })
  public authorOfOffer!: User;

  @prop({
    default: 0
  })
  public numberOfComments!: number;

  @prop({
    required: true
  })
  public coordinates!: CoordinatesOffer;
}

export const OfferModel = getModelForClass(OfferEntity);
