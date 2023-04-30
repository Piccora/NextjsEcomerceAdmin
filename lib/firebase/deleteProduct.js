import { firestore } from "./firestore";
let products=firestore.collection('products');
const deleteProduct = async(id) => {
    return await products.doc(id).delete();
}
export default deleteProduct