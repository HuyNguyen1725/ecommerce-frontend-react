import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import FormErrors from "../../FormErrors"
import API from "../../API"

function EditProduct() {
    const params = useParams()
    const product_id = params.id
    let user = JSON.parse(localStorage.getItem("user")) || {}
    const [productEdit, setProductEdit] = useState({})
    const [imageDelete, setImageDelete] = useState([])
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState("")
    const [brand, setBrand] = useState("")
    const [brands, setBrands] = useState([])
    const [files, setFiles] = useState([])
    const [sale, setSale] = useState("")
    const [saleInput, setSaleInput] = useState("")
    const [status, setStatus] = useState(1)
    const [detail, setDetail] = useState("")
    const [info, setInfo] = useState({
        name: "",
        price: "",
        company: ""
    })
    const [errors, setErrors] = useState("")
    const allowedExtension = ["jpg", "jpeg", "png", "gif"]
    const maxSize = 1 * 1024 * 1024

    useEffect(() => {
        API.get("products/api/categories/")
        .then(res => 
            setCategories(res.data)
        )
        .catch(err => console.log(err.respone.data))
    }, [])

    useEffect(() => {
        API.get(`products/api/products/${product_id}/`)
        .then(res => {
            setProductEdit(res.data)
        })
        .catch(err => console.log(err))
    }, [])

    
    useEffect(() => {
        API.get("products/api/brands/")
        .then(res => 
            setBrands(res.data)
        )
        .catch(err => console.log(err.respone.data))
    }, [])

    function categoryOption() {
        return categories.map(obj => 
            <option value={obj.id} key={obj.id}>{obj.name}</option>
        )
    }


    function brandOption() {
        return brands.map(obj => 
            <option value={obj.id} key={obj.id}>{obj.name}</option>
        )
    }

    function handleCategory(e) {
        setCategory(e.target.value)
    }

    function handleBrand(e) {
        setBrand(e.target.value)

    }

    function handleFile(e) {
        const files = e.target.files
        let fileArr = []
        if(files.length <= 3) {
            for(let i = 0; i < files.length; i++) {
            fileArr.push(files[i])
            }
        setFiles(fileArr)
        } else alert("Vượt quá số lượng file cho phép!")
    }
    console.log(files)

    function handleSale(e) {
        setSale(e.target.value)
    }

    function handleStatus(e) {
        setStatus(e.target.value)
    }

    function handleInfo(e) {
        const name = e.target.name
        const value = e.target.value
        setInfo(state => ({
            ...state,
            [name]: value
        }))
    }

    function handleSaleInput(e) {
        setSaleInput(e.target.value)
    }

    function handleDetail(e) {
        setDetail(e.target.value)
    }

    function handleCheckbox(e) {
        const checked = e.target.checked
        const img = e.target.id
        if(checked) {
            setImageDelete(state => ([
                ...state,
                img
            ]))
        } else {
            setImageDelete(imageDelete.filter(imge => imge !== img))
        }
    }

    function checkboxDelete() {
        if(Object.keys(productEdit).length > 0) {
            return productEdit["image"].map(img => 
            <div className="me-2">
                <img className="mb-2" style={{width: "50px"}} src={`${process.env.REACT_APP_API_URL}media/products/${img}`}/>
                <input onChange={handleCheckbox} className="form-check-input" id={img} type="checkbox"/>
            </div>
        )
        }
    }


    function handleSubmit(e) {
        e.preventDefault()
        let errors = {}
        let flag = true
        if(files.length === 0) {
            errors.files = "Vui lòng chọn hình ảnh sản phẩm!"
            flag = false
        } else {
            files.map(file => {
                if(file.size > maxSize) {
                    errors.fileSize = "Dung lượng file quá lớn!"
                    flag = false
                }
                if(!allowedExtension.includes(file.name.split(".").pop().toLowerCase())) {
                    errors.fileType = "Sai định dạng file!"
                    flag = false
                }
            })
        }
        if(!flag) {
            setErrors(errors)
        } else {
            setErrors({})
            let formData = new FormData()
            formData.append("author", Number(user.user_id))
            formData.append("productname", info.name)
            formData.append("brand", brand)
            formData.append("price", info.price)
            formData.append("category", category)
            formData.append("status", status)
            formData.append("sale", saleInput)
            formData.append("detail", detail)
            formData.append("company", info.company)
            formData.append("imageDelete", imageDelete)
            files.forEach(file => formData.append("image", file))
            API.patch(`products/api/products/${product_id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            })
            .then(res => {
                console.log(res.data)
                alert("Cập nhật sản phẩm thành công!")
            })
            .catch(err => {
                if (err.respone.status == 401) {
                    API.post("users/api/token/refresh", {
                        refresh: user.refresh_token
                    })
                    .then(res => {
                        user.access_token = res.data.access
                        localStorage.setItem("user", JSON.stringify(user))
                        API.patch(`products/api/products/${product_id}/`, formData, {
                            headers: {
                                Authorization: `Bearer ${user.access_token}`
                            }
                        })
                        .then(res => 
                            alert("Cập nhật sản phẩm thành công!")
                        )
                        .catch(err => console.log(err))
                    })
                } else console.log(err)
            })
        }

    }

    return (
        <div className="col-sm-9">
            <FormErrors errors={errors}/>
            <h2 className="title text-center">Edit Product</h2>
            <div className="add-product-form">
                <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
                    <input value={info.name} onChange={handleInfo} name="name" placeholder="Name"/>
                    <input value={info.price} onChange={handleInfo} name="price" placeholder="Price"/>
                    <select onChange={handleCategory} value={category}>
                        <option value={[]}>Please choose category</option>
                        {categoryOption()}
                    </select>
                    <select onChange={handleBrand} value={brand}>
                        <option value={[]}>Please choose brand</option>
                        {brandOption()}
                    </select>
                    <select onChange={handleStatus} value={status}>
                        <option value={""}>Please choose status</option>
                        <option value={0}>New</option>
                        <option value={1}>Sale</option>
                    </select>
                    <select value={sale} onChange={handleSale}>
                        <option value={""}>Sale</option>
                        <option value={"yes"}>Yes</option>
                        <option value={"no"}>No</option>
                    </select>
                    {   sale === "yes" ?
                        <div style={{display: "flex", alignItems: "center"}}>
                        <input style={{width: "150px"}} onChange={handleSaleInput} value={saleInput} className="sale_input" placeholder="0"/>%
                        </div> :
                        null
                    }
                    <input name="company" onChange={handleInfo} value={info.company} placeholder="Company profile"/>
                    <input onChange={handleFile} type="file" multiple/>
                    <div style={{display: "flex"}}>
                        {checkboxDelete()}
                    </div>
                    <textarea onChange={handleDetail} placeholder="Detail"/>
                    <button type="submit">Update product</button>
                </form>
            </div>
        </div>
    )
}

export default EditProduct