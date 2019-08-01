import {DishConsist} from './DishConsist';

export class Dish {
  id = 0;
  name = '';
  ismenu = true;
  cost = 0;
  type = '';
  consist: DishConsist[] = [];
  maxCount = 0;
  editable = true;
}

// export class DishForDb {
//   name: string;
//   ismenu: boolean;
//   cost: number;
//   type: string;
//   consist: DishConsist[];
// }

export interface DishApi {
  items: Dish[];
  totalCount: number;
}
