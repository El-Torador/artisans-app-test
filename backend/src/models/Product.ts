import { Schema, model, Document } from "mongoose"


export interface ProductModel extends Document {
  name: string;
  type: string;
  price: number;
  rating: number;
  warranty_years: number;
  available: boolean;
}

const productSchema = new Schema<ProductModel>({
  name: { type: String, required: true },
  type: { type: String, required: true},
  price: { type: Number, required: true},
  rating: { type: Number, required: true},
  warranty_years: { type: Number, required: true},
  available: { type: Boolean, required: true}
})

const Product = model<ProductModel>('Product', productSchema)


export default Product;