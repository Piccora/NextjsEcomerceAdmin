import axios from "axios";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({ _id, title: existingTitle, description: existingDescription, price: existingPrice, images: existingImages, category: existingCategory, properties: existingProperties }) {
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [price, setPrice] = useState(existingPrice || '')
    const [images, setImages] = useState(existingImages || [])
    const [deletedImages, setDeletedImages] = useState([])
    const [category, setCategory] = useState(existingCategory || '')
    const [productProperties, setProductProperties] = useState(existingProperties || {})
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [categories, setCategories] = useState([])
    const router = useRouter()
    const inputRef = useRef(null);
    useEffect(() => {
        axios.get('/api/categories').then(res => {
            setCategories(res.data)
        })
    }, [])
    if (goToProducts) {
        router.push('/products')
    }
    const handleClick = () => {
        inputRef.current.click();
    };
    const setProduct = async (ev) => {//create product and update it if exists
        ev.preventDefault()
        const data = { title, description, price, images, category, properties: productProperties,deletedImages }
        if (_id) {
            //update
            await axios.put(`/api/products`, { ...data, _id })
        } else {
            //create
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }
    const uploadImages = async (ev) => {
        const files = ev.target.files;
        if (files.length > 0) {
            setIsUploading(true)
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append(`file${i}`, files[i]);
            }
            const res = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setImages(oldImages => {
                return [...oldImages, ...res.data]
            })
            setIsUploading(false)
        }
    };
    const tempRemoveImage = (link) => {
        var indexToRemove = images.indexOf(link)
        setImages(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove
            })
        })
        setDeletedImages(prev => {
            return [...prev, link]
        })
    }
    const updateImagesOrder = (images) => {
        setImages(images)
    }
    const setProductProp = (propName, value) => {
        setProductProperties(prev => {
            const newProductProps = { ...prev }
            newProductProps[propName] = value
            return newProductProps
        })
    }

    const propertiesToFill = []
    if (categories.length > 0 && category) {
        let selCatInfo = categories.find(({ _id }) => _id === category)
        propertiesToFill.push(...selCatInfo.properties)
        while (selCatInfo.parentCategory != '') {
            const parentCatInfo = categories.find(({ _id }) => _id === selCatInfo.parentCategory)
            if (typeof (parentCatInfo) == "undefined") {
                break
            }
            propertiesToFill.push(...parentCatInfo.properties)
            selCatInfo = parentCatInfo
        }
    }
    return (
        <form onSubmit={setProduct}>
            <label>Product name</label>
            <input type="text" placeholder="product name" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(category => {
                    return (
                        <option key={category._id} value={category.name}>{category.name}</option>
                    )
                })
                }
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map((p, index) => (
                <div className="flex gap-1" key={index}>
                    <label>{p.name[0].toUpperCase() + p.name.slice(1)}</label>
                    <div>
                        <select value={productProperties[p.name]} onChange={(ev) => setProductProp(p.name, ev.target.value)}>
                            <option value={''}>No field selected</option>
                            {p.values.map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-1">
                    {!!images?.length > 0 && images.map(link => {
                        return (
                            <div key={link} className=" h-24">
                                <button type="button" onClick={() => tempRemoveImage(link)} className="absolute text-red-500 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-[3px]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <img src={link} alt="" className="rounded-lg" />
                            </div>
                        )
                    })}
                </ReactSortable>
                {isUploading && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Spinner />
                    </div>
                )}
                <button type="button" onClick={handleClick} className="w-24 h-24 text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input ref={inputRef} onChange={uploadImages} type="file" className="hidden" multiple />
                </button>
            </div>
            <label>Description</label>
            <textarea placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <label>Price</label>
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button type="submit" className="btn-primary">Save Product</button>
            <button type="button" onClick={()=>setGoToProducts(true)} className="btn-default ml-5">Back</button>
        </form>
    )
}