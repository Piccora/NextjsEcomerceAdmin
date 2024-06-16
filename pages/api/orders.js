import getOrders from "@/lib/firebase/getOrders";
// import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    // await isAdminRequest(req, res)
    const { method } = req //==method=req.method
    if (res.statusCode === 200) {
        if (method === 'GET') {
            return getOrders()
                .then((data) => {
                    return res.status(200).send(data);
                })
                .catch((error) => {
                    console.log('error', error);
                    return res.status(500).send(error);
                })
        }
    }
}