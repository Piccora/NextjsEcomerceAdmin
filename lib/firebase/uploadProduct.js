import { firestore } from "./firestore";
let products=firestore.collection('products');
const uploadProduct = async(data) => {
   return await products.add(data)
}
export default uploadProduct