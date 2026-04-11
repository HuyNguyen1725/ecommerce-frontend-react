import { useState, useEffect, useContext } from "react"
import API from "../../API"
import { UserContext } from "../../UserContext"
import { totalCheckoutCount } from "../../counterSlice"
import { useDispatch } from "react-redux"

function Cart() {
    let userCartLc = JSON.parse(localStorage.getItem("user_cart")) || {}
    
    const {setGetCart} = useContext(UserContext)
    const [userCart, setUserCart] = useState([])
    let newUserCart = [...userCart]
    const dispatch = useDispatch()

    useEffect(() => {
      API.post("products/api/carts/products/", userCartLc)
      .then(res => {
        let totalQty = 0
        setUserCart(res.data)
        res.data.map(prd => totalQty += prd.qty)
        setGetCart(totalQty)
      })
    }, [setGetCart])


    function cartSubTotal() {
      let result = 0
      userCart.map(prd => result += (prd.qty * prd.price))
      return result
    }
    console.log(userCartLc)

    function handleQtyUp(e) {
      let totalQty = 0
      const prd_id = e.target.id
      if(userCartLc[prd_id]) {
        userCartLc[prd_id] += 1
      } else userCartLc[prd_id] = 1
      localStorage.setItem("user_cart", JSON.stringify(userCartLc))
      newUserCart.map(prd => {
        if(prd.id == prd_id) {
          prd.qty += 1
        }
      })
      setUserCart(newUserCart)
      newUserCart.map(prd => totalQty += prd.qty)
      setGetCart(totalQty)
      dispatch(totalCheckoutCount(totalQty))
    }

  
    function handleQtyDown(e) {
      let totalQty = 0
      const prd_id = e.target.id
      if(userCartLc[prd_id]) {
        userCartLc[prd_id] -= 1
        if(userCartLc[prd_id] < 1) {
          delete userCartLc[prd_id]
        }
        localStorage.setItem("user_cart", JSON.stringify(userCartLc))
      }
      
      newUserCart.map(prd => {
        if(prd.id == prd_id) {
          prd.qty -= 1
          if(prd.qty < 1) {
            newUserCart = newUserCart.filter(prd => prd.id != prd_id)
          }
        }
      })
      setUserCart(newUserCart)
      newUserCart.map(prd => totalQty += prd.qty)
      setGetCart(totalQty)
      dispatch(totalCheckoutCount(totalQty))
    }

    function handleDeleteProduct(e) {
      let totalQty = 0
      const prd_id = e.target.id
      delete userCartLc[prd_id]
      localStorage.setItem("user_cart", JSON.stringify(userCartLc))
      newUserCart = newUserCart.filter(prd => prd.id != prd_id)
      setUserCart(newUserCart)
      newUserCart.map(prd => totalQty += prd.qty)
      setGetCart(totalQty)
    }

    return (
      <div>
        <section id="cart_items">
          <div className="container">
            <div className="breadcrumbs">
              <ol className="breadcrumb">
                <li><a href="/home">Home</a></li>
                <li className="active">Shopping Cart</li>
              </ol>
            </div>
            <div className="table-responsive cart_info">
              <table className="table table-condensed">
                <thead>
                  <tr className="cart_menu">
                    <td className="image">Item</td>
                    <td className="description" />
                    <td className="price">Price</td>
                    <td className="quantity">Quantity</td>
                    <td className="total">Total</td>
                    <td />
                  </tr>
                </thead>
                <tbody>
                  {userCart.map(prd => 
                    <tr>
                    <td className="cart_product">
                      <a href><img src={`${process.env.REACT_APP_API_URL}media/products/${prd.image[0]}`} alt="" /></a>
                    </td>
                    <td className="cart_description">
                      <h4><a href>{prd.productname}</a></h4>
                      <p>Web ID: {prd.id}</p>
                    </td>
                    <td className="cart_price">
                      <p>${prd.price}</p>
                    </td>
                    <td className="cart_quantity">
                      <div className="cart_quantity_button">
                        <a onClick={handleQtyUp} id={prd.id} className="cart_quantity_up"> + </a>
                        <input className="cart_quantity_input" type="text" name="quantity" value={prd.qty} autoComplete="off" size={2} />
                        <a onClick={handleQtyDown} id={prd.id} className="cart_quantity_down"> - </a>
                      </div>
                    </td>
                    <td className="cart_total">
                      <p className="cart_total_price">${prd.qty * prd.price}</p>
                    </td>
                    <td className="cart_delete">
                      <a onClick={handleDeleteProduct} id={prd.id} className="cart_quantity_delete"><i id={prd.id} className="fa fa-times" /></a>
                    </td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section> {/*/#cart_items*/}
        <section id="do_action">
          <div className="container">
            <div className="heading">
              <h3>What would you like to do next?</h3>
              <p>Choose if you have a discount code or reward points you want to use or would like to estimate your delivery cost.</p>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="chose_area">
                  <ul className="user_option">
                    <li>
                      <input type="checkbox" />
                      <label>Use Coupon Code</label>
                    </li>
                    <li>
                      <input type="checkbox" />
                      <label>Use Gift Voucher</label>
                    </li>
                    <li>
                      <input type="checkbox" />
                      <label>Estimate Shipping &amp; Taxes</label>
                    </li>
                  </ul>
                  <ul className="user_info">
                    <li className="single_field">
                      <label>Country:</label>
                      <select>
                        <option>United States</option>
                        <option>Bangladesh</option>
                        <option>UK</option>
                        <option>India</option>
                        <option>Pakistan</option>
                        <option>Ucrane</option>
                        <option>Canada</option>
                        <option>Dubai</option>
                      </select>
                    </li>
                    <li className="single_field">
                      <label>Region / State:</label>
                      <select>
                        <option>Select</option>
                        <option>Dhaka</option>
                        <option>London</option>
                        <option>Dillih</option>
                        <option>Lahore</option>
                        <option>Alaska</option>
                        <option>Canada</option>
                        <option>Dubai</option>
                      </select>
                    </li>
                    <li className="single_field zip-field">
                      <label>Zip Code:</label>
                      <input type="text" />
                    </li>
                  </ul>
                  <a className="btn btn-default update" href>Get Quotes</a>
                  <a className="btn btn-default check_out" href>Continue</a>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="total_area">
                  <ul>
                    <li>Cart Sub Total <span>${cartSubTotal()}</span></li>
                    <li>Eco Tax <span>$2</span></li>
                    <li>Shipping Cost <span>Free</span></li>
                    <li>Total <span>${cartSubTotal() + 2}</span></li>
                  </ul>
                  <a href="/checkout" className="btn btn-default check_out">Check Out</a>
                </div>
              </div>
            </div>
          </div>
        </section>{/*/#do_action*/}
      </div>
    )
}

export default Cart