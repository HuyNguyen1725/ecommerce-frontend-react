import { useEffect, useState } from "react"
import API from "../../API"
import FormErrors from "../../FormErrors"


function AddProduct() {
    let user = JSON.parse(localStorage.getItem("user")) || {}
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
        if(files.length <= 3) {
            let fileArr = []
        for(let i = 0; i < files.length; i++) {
            fileArr.push(files[i])
        }
        setFiles(fileArr)
        } else {
            alert("Vượt quá số lượng file cho phép!")
        }
    }

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
        if(brand.length === 0) {
            errors.brand = "Vui lòng chọn brand!"
            flag = false
        }

        if(category.length === 0) {
            errors.category = "Vui lòng chọn category!"
            flag = false
        }

        if(status === 1 || status === "") {
            errors.status = "Vui lòng chọn status"
            flag = false
        }

        if(sale === "") {
            errors.sale = "Vui lòng chọn sale!"
            flag = false
        } else if(saleInput === "") {
            errors.saleInput = "Vui lòng nhập giá sale!"
            flag = false
        }

        if(info.name === "") {
            errors.name = "Vui lòng nhập tên sản phẩm!"
            flag = false
        }

        if(info.price === "") {
            errors.email = "Vui lòng nhập giá sản phẩm!"
            flag = false
        }
        if(detail === "") {
            errors.detail = "Vui lòng nhập chi tiết sản phẩm!"
            flag = false
        }
        if(info.company === "") {
            errors.company = "Vui lòng nhập company!"
            flag = false
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
            files.forEach(file => formData.append("image", file))
            API.post("products/api/products/", formData, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            })
            .then(res => {
                console.log(res.data)
                alert("Tạo sản phẩm thành công!")
            })
            .catch(err => {
                if(err.response.status == 401) {
                    API.post("users/api/token/refresh/", {
                        refresh: user.refresh_token
                    })
                    .then(res => {
                        user.access_token = res.data.access
                        localStorage.setItem("user", JSON.stringify(user))
                        API.post("products/api/products/", formData, {
                            headers: {
                                Authorization: `Bearer ${user.access_token}`
                            }
                        })
                        .then(res => {
                            alert("Tạo sản phẩm thành công!")
                        })
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                } else console.log(err)
            })
        }

    }
    useEffect(() => {
        API.get("products/api/categories/")
        .then(res => 
            setCategories(res.data)
        )
        .catch(err => console.log(err.respone.data))
    }, [])

    useEffect(() => {
        API.get("products/api/brands/")
        .then(res => 
            setBrands(res.data)
        )
        .catch(err => console.log(err.respone.data))
    }, [])
    return (
        <div className="col-sm-9">
            <FormErrors errors={errors}/>
            <h2 className="create_prd_title">Create Product!</h2>
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
                        <input style={{ width: "150px" }} onChange={handleSaleInput} value={saleInput} className="sale_input" placeholder="0"/>%
                        </div> :
                        null
                    }
                    <input name="company" onChange={handleInfo} value={info.company} placeholder="Company profile"/>
                    <input onChange={handleFile} type="file" multiple/>
                    <textarea onChange={handleDetail} placeholder="Detail"/>
                    <button className="btn btn-default" type="submit">Create product</button>
                </form>
            </div>
        </div>
    )
}

export default AddProduct