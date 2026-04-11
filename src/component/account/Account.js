import { useState } from "react"
import API from "../../API"
import FormErrors from "../../FormErrors"


function Account() {
    const user = JSON.parse(localStorage.getItem("user")) || {}
    const [errors, setErrors] = useState({})

    const allowedExtension = ["jpg", "jpeg", "png", "gif"]
    const maxSize = 1 * 1024 * 1024

    const [info, setInfo] = useState({
        user_name: user.username,
        user_email: user.user_email,
        user_password: ""
    })

    const [avatar, setAvatar] = useState("")

    function handleInput(e) {
        const name = e.target.name
        const value = e.target.value
        setInfo(state => ({
            ...state,
            [name]: value
        }))
    }

    function handleConfirmPassword(e) {
        setInfo(state => ({
            ...state,
            user_confirm_password: e.target.value
        }))
    }

    function handleFile(e) {
        setAvatar(e.target.files[0])
    }

    function handleSubmit(e) {
        e.preventDefault()
        let errors = {}
        let flag = true
        
        if(info.user_password !== "") {
            if(info.user_confirm_password !== info.user_password) {
                errors.password = "Mật khẩu không khớp!"
                flag = false
            }
        }
        if(avatar !== "") {
            if(!allowedExtension.includes(avatar.name.split(".").pop().toLowerCase())) {
            errors.fileType = "Sai định dạng hình ảnh!"
            flag = false
            }
            if(avatar.size > maxSize) {
                errors.fileSize = "Dung lượng file quá lớn!"
                flag = false
            }
        }
        
        if(!flag) {
            setErrors(errors)
        } else {
            setErrors({})
            const formData = new FormData()
            formData.append("username", info.user_name)
            formData.append("password", info.user_password)
            formData.append("avatar", avatar)
            console.log(formData)
            API.patch(`users/api/users/${user.user_id}/`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`
                    }
                }
            )
            .then(res => {
            setInfo(res.data)
            console.log(res.data)
            })
            .catch(err => {
                if(err.response.status == 401) {
                    API.post("/users/api/token/refresh/", {
                        refresh: user.refresh_token
                    })
                    .then(res => {
                        user.access_token = res.data.access
                        localStorage.setItem("user", JSON.stringify(user))
                        API.patch(`users/api/users/${user.user_id}`, formData, {
                            headers: {
                                Authorization: `Bearer ${user.access_token}`
                            }
                        })
                        .then(res => {
                            user.user_name = res.data.username
                            user.avatar = res.data.avatar
                        })
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                } else console.log(err)
            })
        }
    }

    return (
            <div className="col-sm-9">
              <div className="blog-post-area">
                <FormErrors errors={errors}/>
                <h2 className="title text-center">Update user</h2>
                <div className="signup-form">{/*sign up form*/}
                  <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
                    <input type="text" name="user_name" value={info.user_name} onChange={handleInput} placeholder="Name" />
                    <input type="email" name="user_email" value={info.user_email} readOnly placeholder="Email Address" />
                    <input type="text" name="user_password" value={info.user_password} onChange={handleInput} placeholder="Password" />
                    <input type="text" value={info.user_confirm_password} onChange={handleConfirmPassword} placeholder="Confirm Password" />
                    <input type="file" onChange={handleFile}/>
                    <button type="submit" className="btn btn-default">Update</button>
                  </form>
                </div>
              </div>
            </div>
    )
}

export default Account