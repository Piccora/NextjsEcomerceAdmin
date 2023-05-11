import { firestore } from "./firestore";
import { Timestamp } from "firebase/firestore";

let orders=firestore.collection('orders');
const getOrders = async() => {
    const snapshot = await orders.get()
    let list = []
    snapshot.forEach(doc => {
        let data={
            _id:doc.id,
          ...doc.data()
        }
        data.createdAt=data.createdAt.toDate()
        list.push(data);
      });
    return list
}
export default getOrders