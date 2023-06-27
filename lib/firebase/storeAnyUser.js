import { firestore } from "./firestore";
let users=firestore.collection('users');
const storeAnyUser = async(data) => {
   return await users.add(data)
}
export default storeAnyUser