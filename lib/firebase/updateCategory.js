import { firestore } from "./firestore";
let categories = firestore.collection('categories');
const updateCategory = async (data) => {
    let id = data._id;
    let newData = {
        name:data.name,
        parentCategory:data.parentCategory,
        properties:data.properties,
    }
    return await categories.doc(id).set(newData)
}
export default updateCategory