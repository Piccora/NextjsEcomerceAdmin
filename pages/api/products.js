import getProduct from "@/lib/firebase/getProduct"
import getProducts from "@/lib/firebase/getProducts"
import updateProduct from "@/lib/firebase/updateProduct"
import uploadProduct from "@/lib/firebase/uploadProduct"
import deleteProduct from "@/lib/firebase/deleteProduct"
import { isAdminRequest } from "./auth/[...nextauth]"

export default async function handle(req, res) {
    await isAdminRequest(req,res)
    const { method } = req //==method=req.method
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
            category: req.body.category
        }
        return uploadProduct(data).then(() => {
            console.log('res', res.json);
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
            id: req.body._id
        }
        console.log(data)
        return updateProduct(data).then(() => {
            console.log('res', res.json);
            return res.status(200).send();
        })
            .catch((error) => {
                console.log('error', error);
                return res.status(500).send(error);
            })
    }
    else if (method === 'DELETE') {
        if (req.query?.id) {
            return deleteProduct(req.query?.id)
                .then((data) => {
                    
                    return res.status(200).send(data);
                })
                .catch((error) => {
                    console.log('error', error);
                    return res.status(500).send(error);
                })
        }
    }
    else{
        return res.status(405).send('Method Not Allowed')
    }
}