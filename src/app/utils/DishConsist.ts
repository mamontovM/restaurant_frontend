import {Ingredient} from './Ingredient';

export interface DishConsist {
  id: EmbeddedId;
  value: number;
  ingredient: Ingredient;
}

export interface EmbeddedId {
  dishId: number;
  ingredientId: number;
}
