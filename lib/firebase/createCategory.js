import { firestore } from "./firestore";
let categories=firestore.collection('categories');
const createCategory = async(data) => {
   return await categories.doc(encodeURI(data.name)).set(data)
}
export default createCategory