import { useState, useEffect, useContext } from "react";
import API from "../../API"
import { UserContext } from "../../UserContext";
import Register from "./Register";
import { useDispatch } from "react-redux";
import { totalCheckoutCount } from "../../counterSlice";

function Checkout() {
    const user = JSON.parse(localStorage.getItem("user")) || {}
    const userCartLc = JSON.parse(localStorage.getItem("user_cart")) || {}

    const [userCart, setUserCart] = useState([])
    const { setGetCart } = useContext(UserContext)
    let newUserCart = [...userCart]

    const dispatch = useDispatch()
    
    useEffect(() => {
      API.post("products/api/carts/products/", userCartLc)
      .then(res => {
        setUserCart(res.data)
      })
      .catch(err => console.log(err.response.err))
    }, [])
    
    function cartSubTotal() {
        let result = 0
        userCart.map(prd => result += (prd.qty * prd.price))
        return result
    }

    function handleQtyUp(e) {
          let totalQty = 0
          const prd_id = e.target.id
          newUserCart.map(prd => {
            if(prd.id == prd_id) {
              prd.qty += 1
              userCartLc[prd_id] += 1
              localStorage.setItem("user_cart", JSON.stringify(userCartLc))
            }
          })
          setUserCart(newUserCart)
          newUserCart.map(prd => totalQty += prd.qty)
          setGetCart(totalQty)
          dispatch(totalCheckoutCount())
        }
      
    
        function handleQtyDown(e) {
          let totalQty = 0
          const prd_id = e.target.id
          newUserCart.map(prd => {
            if(prd.id == prd_id) {
              prd.qty -= 1
              if(prd.qty < 1) {
                prd.qty = 0
                delete userCartLc[prd_id]
                localStorage.setItem("user_cart", JSON.stringify(userCartLc))
                newUserCart = newUserCart.filter(prd => prd.id != prd_id)
              }
            }
          })
          setUserCart(newUserCart)
          newUserCart.map(prd => totalQty += prd.qty)
          setGetCart(totalQty)
          dispatch(totalCheckoutCount())
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
          dispatch(totalCheckoutCount())
        }

    return (
      <div>
      <section id="cart_items">
        <div className="container">
          <div className="breadcrumbs">
            <ol className="breadcrumb">
              <li><a href="/home">Home</a></li>
              <li className="active">Check out</li>
            </ol>
          </div>{/*/breadcrums*/}
          <div className="step-one">
            <h2 className="heading">Step1</h2>
          </div>
          <div className="checkout-options">
            <h3>New User</h3>
            <p>Checkout options</p>
            <ul className="nav">

              <li>
                <label><input type="checkbox" /> Register Account</label>
              </li>

              <li>
                <label><input type="checkbox" /> Guest Checkout</label>
              </li>
              <li>
                <a href><i className="fa fa-times" />Cancel</a>
              </li>
            </ul>
          </div>{/*/checkout-options*/}
          <div className="register-req">
            <p>Please use Register And Checkout to easily get access to your order history, or use Checkout as Guest</p>
          </div>{/*/register-req*/}
          <div className="shopper-informations">
            <div className="row">
              
                
                  {Object.keys(user).length === 0 ? 
                  <div className="col-sm-3">
                    <div className="shopper-info">
                      <Register /> 
                    </div> 
                  </div> :
                  null}
                
              
              <div className="col-sm-5 clearfix">
                <div className="bill-to">
                  <p>Bill To</p>
                  <div className="form-one">
                    <form>
                      <input type="text" placeholder="Company Name" />
                      <input type="text" placeholder="Email*" />
                      <input type="text" placeholder="Title" />
                      <input type="text" placeholder="First Name *" />
                      <input type="text" placeholder="Middle Name" />
                      <input type="text" placeholder="Last Name *" />
                      <input type="text" placeholder="Address 1 *" />
                      <input type="text" placeholder="Address 2" />
                    </form>
                  </div>
                  <div className="form-two">
                    <form>
                      <input type="text" placeholder="Zip / Postal Code *" />
                      <select>
                        <option>-- Country --</option>
                        <option>United States</option>
                        <option>Bangladesh</option>
                        <option>UK</option>
                        <option>India</option>
                        <option>Pakistan</option>
                        <option>Ucrane</option>
                        <option>Canada</option>
                        <option>Dubai</option>
                      </select>
                      <select>
                        <option>-- State / Province / Region --</option>
                        <option>United States</option>
                        <option>Bangladesh</option>
                        <option>UK</option>
                        <option>India</option>
                        <option>Pakistan</option>
                        <option>Ucrane</option>
                        <option>Canada</option>
                        <option>Dubai</option>
                      </select>
                      <input type="password" placeholder="Confirm password" />
                      <input type="text" placeholder="Phone *" />
                      <input type="text" placeholder="Mobile Phone" />
                      <input type="text" placeholder="Fax" />
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="order-message">
                  <p>Shipping Order</p>
                  <textarea name="message" placeholder="Notes about your order, Special Notes for Delivery" rows={16} defaultValue={""} />
                  <label><input type="checkbox" /> Shipping to bill address</label>
                </div>	
              </div>					
            </div>
          </div>
          <div className="review-payment">
            <h2>Review &amp; Payment</h2>
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
                    <p className="cart_total_price">${prd.price * prd.qty}</p>
                  </td>
                  <td className="cart_delete">
                    <a onClick={handleDeleteProduct} id={prd.id} className="cart_quantity_delete"><i className="fa fa-times" /></a>
                  </td>
                </tr>
                )}
                <tr>
                  <td colSpan={4}>&nbsp;</td>
                  <td colSpan={2}>
                    <table className="table table-condensed total-result">
                      <tbody><tr>
                          <td>Cart Sub Total</td>
                          <td>${cartSubTotal()}</td>
                        </tr>
                        <tr>
                          <td>Exo Tax</td>
                          <td>$2</td>
                        </tr>
                        <tr className="shipping-cost">
                          <td>Shipping Cost</td>
                          <td>Free</td>										
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td><span>${cartSubTotal() + 2}</span></td>
                        </tr>
                      </tbody></table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="payment-options">
            <span>
              <label><input type="checkbox" /> Direct Bank Transfer</label>
            </span>
            <span>
              <label><input type="checkbox" /> Check Payment</label>
            </span>
            <span>
              <label><input type="checkbox" /> Paypal</label>
            </span>
            {Object.keys(userCartLc).length > 0 ?
              <span>
                <button className="btn btn-default">Order</button>
              </span> :
              null
            }
          </div>
        </div>
      </section> {/*/#cart_items*/}
      </div>
    )
}

export default Checkout