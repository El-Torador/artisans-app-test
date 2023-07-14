export interface Account {
  _id: string;
  username: string;
  email: string;
  password?: string;
}

export interface ProductType {
  _id?: string;
  name: string;
  type: string;
  price: number;
  rating: number;
  warranty_years: number;
  available: boolean;
}

export enum ProductStatus {
  ERROR,
  INIT,
  CREATED,
  UPDATED,
  DELETED
}