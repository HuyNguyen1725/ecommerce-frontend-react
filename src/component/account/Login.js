import { useState } from "react"
import API from "../../API"
import FormErrors from "../../FormErrors"
import Register from "./Register"

function Login() {
    const [input, setInput] = useState({
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState({})

    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    function handleInput(e) {
        const name = e.target.name
        const value = e.target.value
        setInput(state => ({
            ...state,
            [name]: value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        let errors = {}
        let flag = true
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
        if(!flag) {
            setErrors(errors)
        } else {
            setErrors({})
            API.post("users/api/auth/login/", input)
            .then(res => {
                  let user = {
                    "access_token": res.data.access_token,
                    "refresh_token": res.data.refresh_token,
                    "user_id": res.data.user_id,
                    "username": res.data.username,
                    "avatar": res.data.avatar,
                    "user_email": res.data.user_email
                   }
                  localStorage.setItem("user", JSON.stringify(user))
                  window.location.href = "/blog"
            })
            .catch(err => alert(err.response.data.Error))
        }
    } 
    
    return (
        
      <section id="form">{/*form*/}
      <FormErrors errors={errors}/>
        <div className="container">
          <div className="row">
            <div className="col-sm-4 col-sm-offset-1">
              <div className="login-form">{/*login form*/}
                <h2>Login to your account</h2>
                <form onSubmit={handleSubmit} method="POST">
                  <input type="text" onChange={handleInput} value={input.email} name="email" placeholder="Email" />
                  <input type="password" onChange={handleInput} value={input.password} name="password" placeholder="Password" />
                  <span>
                    <input type="checkbox" className="checkbox" /> 
                    Keep me signed in
                  </span>
                  <button type="submit" className="btn btn-default">Login</button>
                </form>
              </div>{/*/login form*/}
            </div>
            <div className="col-sm-1">
              <h2 className="or">OR</h2>
            </div>
            <div className="col-sm-4">
              <Register />
            </div>
          </div>
        </div>
      </section>
    )
}

export default Login