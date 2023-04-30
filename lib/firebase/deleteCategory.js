import { firestore } from "./firestore";
let categories = firestore.collection('categories');
const deleteCategory = async (id) => {
    return await categories.doc(id).delete()
}
export default deleteCategory