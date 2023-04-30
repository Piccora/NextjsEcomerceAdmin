import { firestore } from "./firestore";
let categories=firestore.collection('categories');
const createCategory = async(data) => {
   return await categories.doc(data.name).set(data)
}
export default createCategory