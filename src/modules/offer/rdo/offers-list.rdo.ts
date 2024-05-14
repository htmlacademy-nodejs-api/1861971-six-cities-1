import { Expose } from 'class-transformer';

import {
  TypeHousinList,
  CitiesList
} from '../../../core/types/index.js';

export default class OffersListRdo {
  @Expose()
  public denomination!: string ;

  @Expose()
  public datePublication!: string;

  @Expose()
  public city!: CitiesList;

  @Expose()
  public previewImage!: string;

  @Expose()
  public premium!: boolean;

  @Expose()
  public favorites!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public typeHousing!: TypeHousinList;

  @Expose()
  public rentPrice!: number;

  @Expose()
  public numberOfComments!: number;
}
