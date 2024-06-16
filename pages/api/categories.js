import createCategory from "@/lib/firebase/createCategory"
import getCategories from "@/lib/firebase/getCategories";
import updateCategory from "@/lib/firebase/updateCategory";
import deleteCategory from "@/lib/firebase/deleteCategory";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    await isAdminRequest(req, res)
    const { method } = req
    if (res.statusCode === 200) {
        if (method === 'GET') {
            return getCategories()
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
                name: req.body.name,
                parentCategory: req.body.parentCategory,
                properties: req.body.properties,
            }
            return createCategory(data).then(() => {
                return res.status(200).send();
            })
                .catch((error) => {
                    console.log('error', error);
                    return res.status(500).send(error);
                })
        }
        else if (method === 'PUT') {
            const data = {
                name: req.body.name,
                parentCategory: req.body.parentCategory,
                properties: req.body.properties,
                _id: req.body._id
            }
            return updateCategory(data).then(() => {
                return res.status(200).send();
            })
                .catch((error) => {
                    console.log('error', error);
                    return res.status(500).send(error);
                })
        }
        else if (method === 'DELETE') {
            if (req.query?.id) {
                return deleteCategory(req.query?.id)
                    .then((data) => {
                        return res.status(200).send(data);
                    })
                    .catch((error) => {
                        console.log('error', error);
                        return res.status(500).send(error);
                    })
            }
        }
        else {
            return res.status(405).send('Method Not Allowed')
        }
    }
}