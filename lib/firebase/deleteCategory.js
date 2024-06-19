import { firestore } from "./firestore";
let categories = firestore.collection('categories');
const deleteCategory = async (id) => {
    return await categories.doc(encodeURI(id)).delete()
}
export default deleteCategory