import { firestore } from "./firestore";
let products=firestore.collection('products');
const getProduct = async(id) => {
    const snapshot = await products.doc(id).get();
    let data={
        _id:snapshot.id,
      ...snapshot.data()
    }
    return data
}
export default getProduct