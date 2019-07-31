export class WaiterOrders {
  id?: number;
  timeOfTake?: Date;
  timeOfGiven?: Date;
  isReady?: boolean;
  isTake?: boolean;
  waiter?: number;

  constructor() {
  }
}
