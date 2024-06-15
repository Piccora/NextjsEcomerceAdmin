import { firestore } from "./firestore";
let products=firestore.collection('products');
const updateProduct = async(data) => {
   let id=data.id;
   let newData={
    title:data.title,
    description:data.description,
    price:data.price,
    images:data.images,
    properties: data.properties,
    category:data.category,
    stock:data.stock,
    stripeId: data.stripeId,
    productId: data.productId
   }
   return await products.doc(id).set(newData)
}
export default updateProduct