import { useState } from "react";
import FormErrors from "../../FormErrors"
import API from "../../API";

function AddBlog() {
    let user = JSON.parse(localStorage.getItem("user")) || {}
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [file, setFile] = useState(null)
    const [errors, setErrors] = useState({})

    function handleTitle(e) {
        setTitle(e.target.value)
    }

    function handleContent(e) {
        setContent(e.target.value)
    }

    function handleFile(e) {
        setFile(e.target.files[0])
    }

    function handleSubmit(e) {
        e.preventDefault()
        let errors = {}
        let flag = true
        if(title === "") {
            errors.title = "Vui lòng nhập tiêu đề!"
            flag = false
        }
        if(content === "") {
            errors.content = "Vui lòng nhập nội dung!"
            flag = false
        }
        if(!file) {
            errors.file = "Vui lòng chọn hình ảnh!"
            flag = false
        }
        if(!flag) {
            setErrors(errors)
        } else {
            setErrors({})
            const formData = new FormData()
            formData.append("title", title)
            formData.append("content", content)
            formData.append("image", file)
            formData.append("author", user.user_id)
            API.post("blogs/api/blogs/", formData, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                if(err.response.status == 401) {
                    API.post("users/api/token/refresh/", {
                        refresh: user.refresh_token
                    })
                    .then(res => {
                        user.access_token = res.data.access
                        localStorage.setItem("user", JSON.stringify(user))
                        API.post("blogs/api/blogs/", formData, {
                            headers: {
                                Authorization: `Bearer ${user.access_token}`
                            }
                        })
                        .then(res => {
                            console.log(res.data)
                        })
                        .catch(err => console.log(err))
                    })
                } else console.log(err)
            })
        }
    }
    return (
        <div className="col-sm-9">
            <h2 className="title text-center">Create blog</h2>
            <FormErrors errors={errors}/>
            <form onSubmit={handleSubmit} className="add-blog-form" method="POST" encType="multipart/form-data">
                <input onChange={handleTitle} value={title} placeholder="title"/>
                <input onChange={handleFile} type="file"/>
                <textarea onChange={handleContent} value={content} placeholder="Content" />
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default AddBlog