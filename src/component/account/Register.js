import { useState } from "react"
import API from "../../API"
import FormErrors from "../../FormErrors"

function Register() {

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        avatar: "",
        sex: "",
    })

    const [getFile, setGetFile] = useState("")
    const [getSex, setGetSex] = useState("")
    const [errors, setErrors] = useState({})

    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const allowed_extension = ["jpeg", "png", "jpg", "gif"]
    const maxSize = 1 * 1024 * 1024

    function handleInput(e) {
        const name = e.target.name
        const value = e.target.value
        setInput(state => ({
            ...state,
            [name]: value
        }))
    }

    function handleFileInput(e) {
        setGetFile(e.target.files[0])
    }

    function handleSexInput(e) {
        setGetSex(e.target.value)
    }

    

    function handleSignUpSubmit(e) {
        e.preventDefault()
        let errors = {}
        let flag = true

        if(input.username === "") {
            errors.username = "Vui lòng nhập tên"
            flag = false
        }
        if(input.email === "") {
            errors.email = "Vui lòng nhập email"
            flag = false
        } else if(!emailCheck.test(input.email)) {
            errors.email = "Sai định dạng email"
            flag = false
        }
        if(input.password === "") {
            errors.password = "Vui lòng nhập mật khẩu"
            flag = false
        } 
        if(getSex === "") {
            errors.sex = "Vui lòng chọn giới tính"
            flag = false
        }
        if(getFile === "") {
            errors.file = "Vui lòng chọn ảnh đại diện"
            flag = false
        } else {
            if(!allowed_extension.includes(getFile.name.split(".").pop().toLowerCase())) {
                errors.fileType = "Sai định dạng ảnh"
                flag = false
            } if(getFile.size > maxSize) {
                errors.fileSize = "File ảnh quá lớn"
                flag = false
            }
        }
        if (!flag) {
            setErrors(errors)
        } else {
            const formData = new FormData()
            formData.append("email", input.email)
            formData.append("username", input.username)
            formData.append("password", input.password)
            formData.append("avatar", getFile)
            formData.append("sex", getSex)
            setErrors({})
            API.post("users/api/auth/register/", formData)
            .then(res => {
                console.log(res.data)
                alert("Đăng kí thành công")
            })
            .catch(err => console.log(err.response.data))
        }
    }
    return (
        <div>
        <FormErrors errors={errors}/>
        <div className="signup-form">{/*sign up form*/}
                <h2>New User Signup!</h2>
                <form onSubmit={handleSignUpSubmit} method="POST" encType="multipart/form-data">
                  <input name="username" type="text" placeholder="Name" value={input.username} onChange={handleInput}/>
                  <input name="email" type="text" placeholder="Email Address" value={input.email} onChange={handleInput}/>
                  <input name="password" type="password" placeholder="Password" value={input.password} onChange={handleInput}/>
                  <input name="avatar" onChange={handleFileInput} type="file"/>
                  <select onChange={handleSexInput} value={getSex}>
                    <option value={""}>Select</option>
                    <option value={1}>Male</option>
                    <option value={2}>Female</option>
                  </select>
                  <button type="submit" className="btn btn-default">Signup</button>
                </form>
              </div>{/*/sign up form*/}
        </div>
    )
}

export default Register