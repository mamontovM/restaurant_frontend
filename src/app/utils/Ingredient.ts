import {IngredientPart} from './IngredientPart';


export class Ingredient {
  id = 0;
  name?: string;
  measure?: string;
  volumePerUnit = 0;
  summaryAmount?: number;
  summaryVolume?: number;
  parts: IngredientPart[] = [];
}

export interface IngredientApi {
  items: Ingredient[];
  totalCount: number;
}
