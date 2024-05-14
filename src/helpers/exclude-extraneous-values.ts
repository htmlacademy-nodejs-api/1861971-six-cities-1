import { ClassConstructor, plainToInstance } from 'class-transformer';

export function excludeExtraneousValues<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}
