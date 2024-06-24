import {resolve} from 'node:path';

export const getPath = (segment: string): string => resolve(segment);
