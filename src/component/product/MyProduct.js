import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import API from "../../API"

function MyProduct() {
    const params = useParams()
    const user_id = params.user_id
    let user = JSON.parse(localStorage.getItem("user")) || {}
    const [myProduct, setMyProduct] = useState([])
    let newProductList = [...myProduct]
    console.log(myProduct)

    useEffect(() => {
        API.get(`products/api/users/${user_id}/products/`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        })
        .then(res => {
            setMyProduct(res.data)
        })
        .catch(err => {
          if(err.response.status == 401) {
            API.post("users/api/token/refresh/", {
              refresh: user.refresh_token
            })
            .then(res => {
              user.access_token = res.data.access
              localStorage.setItem("user", JSON.stringify(user))
              API.get(`products/api/users/${user_id}/products/`, {
                headers: {
                  Authorization: `Bearer ${user.access_token}`
                }
              })
              .then(res => 
                setMyProduct(res.data)
              )
              .catch(err => console.log(err))
            })
          } else console.log(err)
        })
    }, [])

    function handleDelete(e) {
        API.delete(`products/api/products/${e.target.id}/`)
        .then(res => {
            newProductList = newProductList.filter(prd => prd.id != e.target.id)
            setMyProduct(newProductList)
        })
        .catch(err => console.log(err))
    }

    return (
      <section id="myPrd_items">
        <div className="col-sm-9">
          <h2 className="title text-center">My Product</h2>
        <div className="table-responsive myPrd_info">
          <table className="table table-condensed">
            <thead>
              <tr className="myPrd_menu">
                <td className="image">image</td>
                <td className="description">name</td>
                <td className="price">price</td>
                <td className="total">action</td>
              </tr>
            </thead>
            <tbody>
              {myProduct.map(obj => 
                <tr>
                <td className="myPrd_product">
                  <a href><img style={{width: "70px"}} src={`${process.env.REACT_APP_API_URL}media/products/${obj.image[0]}`} alt="" /></a>
                </td>
                <td className="myPrd_description">
                  <h4><a href>{obj.productname}</a></h4>
                </td>
                <td className="myPrd_price">
                  <p>${obj.price}</p>
                </td>
                <td className="myPrd-action">
                  <a href={`/account/edit_product/${obj.id}`} className="btn btn-secondary btn-sm">edit</a>
                  <a onClick={handleDelete} className="btn btn-secondary btn-sm" id={obj.id}>delete</a>
                </td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </section>
    )
}

export default MyProduct