import Layout from "@/components/Layout";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

function Categories({ swal }) {
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState([])
    const fetchCategories = () => {
        axios.get('/api/categories').then(res => {
            setCategories(res.data)
        })
    }
    useEffect(() => {
        fetchCategories()
        console.log(categories)
    }, [])
    const editCategory = (category) => {
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parentCategory)
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(', ')
            }))
        )
    }
    const deleteCategory = (category) => {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, delete',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category
                await axios.delete('/api/categories?id=' + _id)
                fetchCategories()
            }
        }).catch(error => {
            console.log(error)
        });
    }
    const saveCategory = async (ev) => {
        ev.preventDefault()
        const data = {
            name, parentCategory,
            properties: properties.map(p => {
                return { name: p.name, values: p.values.split(',') }
            })
        }
        if (editedCategory) {
            let _id = editedCategory._id
            await axios.put('/api/categories', { ...data, _id })
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data)
        }
        setName('')
        setParentCategory('')
        setProperties([])
        fetchCategories()
    }
    const addProperty = () => {
        setProperties(prev => {
            return [...prev, { name: '', value: '' }]
        })
    }
    const handlePropertyNameChange = (index, property, newName) => {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].name = newName
            return properties
        })
    }
    const handlePropertyValuesChange = (index, property, newValues) => {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].values = newValues
            return properties
        })
    }
    const removeProperty = (indexToRemove) => {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove
            })
        })
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input value={name} onChange={ev => setName(ev.target.value)} type="text" placeholder={"category name"} className="mb-0" />
                    <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory} className="mb-0" >
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button onClick={addProperty} type="button" className="btn-default text-sm mb-2">Add new property</button>
                    {properties.length > 0 && properties.map((property, index) => {
                        return (
                            <div key={property._id} className="flex gap-1 mb-2">
                                <input value={property.name} onChange={(ev) => handlePropertyNameChange(index, property, ev.target.value)} type="text" placeholder={"property name"} className="mb-0" />
                                <input value={property.values} onChange={(ev) => handlePropertyValuesChange(index, property, ev.target.value)} type="text" placeholder={"property value"} className="mb-0" />
                                <button onClick={() => removeProperty(index)} type="button" className="btn-red">Remove</button>
                            </div>
                        )
                    })}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button onClick={() => {
                            setEditedCategory(null)
                            setName('')
                            setParentCategory('')
                            setProperties([])
                        }
                        }
                            type="button" className="btn-default py-1">Cancel</button>
                    )}
                    <button type="submit" className="btn-primary py-1">Save</button>
                </div>
            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category.parentCategory}</td>
                                <td>
                                    <button onClick={() => editCategory(category)} className="btn-default mr-1">Edit</button>
                                    <button onClick={() => deleteCategory(category)} className="btn-red">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {categories.length == 0 &&
                <div className="flex mt-6 w-full justify-center">
                    <Spinner />
                </div>
            }
        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
))