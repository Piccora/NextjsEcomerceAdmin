import { firestore } from "./firestore";
let categories=firestore.collection('categories');
const getCategories = async() => {
    const snapshot = await categories.get()
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
export default getCategories