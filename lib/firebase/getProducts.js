import { firestore } from "./firestore";
let products=firestore.collection('products');
const getProducts = async() => {
    const snapshot = await products.get()
    let list = []
    snapshot.forEach(doc => {
        let data={
            _id:doc.id,
          ...doc.data()
        }
        list.push(data);
      });
    return list
}
export default getProducts