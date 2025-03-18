import { modelsVocabulary } from 'src/shared';
import { Goods } from './goods.schema';

const { GOODS_MODEL } = modelsVocabulary;

export const goodsProviders = [
  {
    provide: GOODS_MODEL,
    useFactory: () => Goods,
    inject: ['DATABASE_CONNECTION'],
  },
];
