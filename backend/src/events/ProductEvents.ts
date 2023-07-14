import { ProductModel } from '../models/Product';

export class ProductCreatedEvent {
  constructor(public readonly product: ProductModel) {}
}

export class ProductUpdatedEvent {
  constructor(public readonly product: ProductModel) {}
}

export class ProductDeletedEvent {
  constructor(public readonly productId: string) {}
}
