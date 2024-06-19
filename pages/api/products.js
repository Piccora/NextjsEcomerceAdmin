import getProduct from "@/lib/firebase/getProduct"
import getProducts from "@/lib/firebase/getProducts"
import updateProduct from "@/lib/firebase/updateProduct"
import uploadProduct from "@/lib/firebase/uploadProduct"
import deleteProduct from "@/lib/firebase/deleteProduct"
import { Storage } from '@google-cloud/storage'
import { stripe } from "@/lib/stripe/stripe"
import { isAdminRequest } from "./auth/[...nextauth]"

const storage = new Storage({
    projectId: process.env.FIREBASE_PROJECT_ID,
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
    },
  });
const bucketName=process.env.FIREBASE_STORAGE_BUCKET
const publicUrl=`https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/`
const bucket = storage.bucket(bucketName);
const deleteByURL = (imagesList) => {
    for (const imageURL of imagesList) {
        const fileName = imageURL.slice(publicUrl.length);
        bucket.file(fileName).delete();
    }
}
export default async function handle(req, res) {
    await isAdminRequest(req, res)
    const { method } = req //==method=req.method
    if (res.statusCode === 200) {
        if (method === 'GET') {
            if (req.query?.id) {
                return getProduct(req.query?.id)
                    .then((data) => {
                        return res.status(200).send(data);
                    })
                    .catch((error) => {
                        console.log('error', error);
                        return res.status(500).send(error);
                    })
            }
            return getProducts()
                .then((data) => {

                    return res.status(200).send(data);
                })
                .catch((error) => {
                    console.log('error', error);
                    return res.status(500).send(error);
                })
        }
        else if (method === 'POST') {
            const data = {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                images: req.body.images,
                properties: req.body.properties,
                category: req.body.category,
                stock: req.body.stock,
            }
            deleteByURL(req.body.deletedImages)
            try {
                const product = await stripe.products.create({
                    name: data.title,
                    description: data.description,
                    images: data.images,
                    default_price_data: {
                        currency: "VND",
                        unit_amount: data.price,
                    }
                 });
                data["stripeId"] = product.default_price;
                data["productId"] = product.id;
            } catch (error) {
                console.log('error', error);
                return res.status(500).send(error);
            }
            return uploadProduct(data).then(() => {
                return res.status(200).send();
            })
                .catch((error) => {
                    console.log('error', error);
                    return res.status(500).send(error);
                })
        }
        else if (method === 'PUT') {
            const data = {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                images: req.body.images,
                category: req.body.category,
                properties: req.body.properties,
                stock:req.body.stock,
                id: req.body._id,
                productId: req.body.productId,
                stripeId: req.body.stripeId
            }
            deleteByURL(req.body.deletedImages)
            let price = 0;
            try {
                price = await stripe.prices.create({
                    currency: 'vnd',
                    unit_amount: data.price,
                    product: data.productId
                });
            } catch (error) {
                console.log('error', error);
                return res.status(500).send(error);
            }

            try {
                const product = await stripe.products.update(data.productId, {
                    name: data.title,
                    description: data.description,
                    images: data.images,
                    default_price: price.id
                 });
            } catch (error) {
                console.log('error', error);
                return res.status(500).send(error);
            }

            try {
                const oldPrice = await stripe.prices.update(data.stripeId, {
                    active: false
                });
            } catch (error) {
                console.log('error', error);
                return res.status(500).send(error);
            }

            data["stripeId"] = price.id
            
            return updateProduct(data).then(() => {
                return res.status(200).send();
            })
                .catch((error) => {
                    console.log('error', error);
                    return res.status(500).send(error);
                })
        }
        else if (method === 'DELETE') {
            if (req.query?.id) {
                const data = await getProduct(req.query?.id)
                const deleted = await stripe.products.update(data.productId, {
                    active: false
                });;

                try {
                    const oldPrice = await stripe.prices.update(data.stripeId, {
                        active: false
                    });
                } catch (error) {
                    console.log('error', error);
                    return res.status(500).send(error);
                }
    

                deleteByURL(data.images)
                return deleteProduct(req.query?.id)
                    .then((data) => {
                        return res.status(200).send(data);
                    })
                    .catch((error) => {
                        console.log('error', error);
                        return res.status(500).send(error);
                    })
            }else{
                let data = await getProducts()
                let proList=data.map((product) =>{ return product.images})
                const imageList=proList.flat(1)
                const [files] = await bucket.getFiles({prefix:'ProductImages/'});
                const url = 'https://storage.googleapis.com/'
                let delList=[]
                files.forEach(file => {
                    let publicUrl = url.concat(bucketName,'/',file.name)
                    if(publicUrl!=`https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/ProductImages/` && !imageList.includes(publicUrl) ){
                        delList.push(publicUrl)
                    }
                  })
                deleteByURL(delList)
                return res.status(200).send('ok')
            }
        }
        else {
            return res.status(405).send('Method Not Allowed')
        }
    }
}