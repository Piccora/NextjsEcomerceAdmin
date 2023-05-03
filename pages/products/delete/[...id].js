import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DeleteProductPage() {
    const router = useRouter()
    const [productInfo, setProductInfo] = useState()
    const { id } = router.query
    useEffect(() => {
        if (!id) {
            return
        }
        axios.get('/api/products?id=' + id).then(res => {
            setProductInfo(res.data)
            console.log(res.data)
        })
    }, [id])
    function goBack() {
        router.push('/products')
    }
    async function deleteProduct() {
        await axios.delete('/api/products?id=' + id)
        router.push('/products')
    }
    return (
        <Layout>
            <h1 className="text-center">Do you realy want to delete product &nbsp;"{productInfo?.title}"?</h1>
            <div className="flex gap-2 justify-center">
                <button className="btn-red" onClick={deleteProduct}>Yes</button>
                <button className="btn-default" onClick={goBack}>No</button>
            </div>
        </Layout>
    )
}