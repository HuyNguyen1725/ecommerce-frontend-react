import { useState, useContext, useEffect } from "react"
import { UserContext } from "../../UserContext"
import { totalCheckoutCount } from "../../counterSlice"
import { useDispatch } from "react-redux"
import API from "../../API"

function Wishlist() {
  let wishListLc = JSON.parse(localStorage.getItem("wishlist")) || []
  let userCartLc = JSON.parse(localStorage.getItem("user_cart")) || {}
  const { setGetCart, setGetWishList } = useContext(UserContext)

  const dispatch = useDispatch()

  const [wishlist, setWishlist] = useState([])
  let newWishList = [...wishlist]

  useEffect(() => {
    const wishListLc = JSON.parse(localStorage.getItem("wishlist")) || []
    API.post("products/api/wishlists/products/", wishListLc)
    .then(res => { 
      console.log(res.data)
      setWishlist(res.data)
    })
  }, [])

  function handleAddToCart(e) {
    const prd_id = e.target.id
    let total = 0
    if(userCartLc[prd_id]) {
      userCartLc[prd_id]++
    } else {
      userCartLc[prd_id] = 1
    }
    localStorage.setItem("user_cart", JSON.stringify(userCartLc))
    Object.keys(userCartLc).map(prd => 
      total += userCartLc[prd]
    )
    setGetCart(total)
    dispatch(totalCheckoutCount())
  }

  function handleDeleteWishList(e) {
    const prd_id = e.target.id
    newWishList = newWishList.filter(prd => prd.id != prd_id)
    setWishlist(newWishList)
    wishListLc = wishListLc.filter(prdId => prdId != prd_id)
    localStorage.setItem("wishlist", JSON.stringify(wishListLc))
    setGetWishList(wishListLc.length)
  }

  return (
    <div>
        <section id="wishlist_items">
          <div className="container">
            <div className="breadcrumbs">
              <ol className="breadcrumb">
                <li><a href="/home">Home</a></li>
                <li className="active">Wish List</li>
              </ol>
            </div>
            <div className="table-responsive wishlist_info">
              <table className="table table-condensed">
                <thead>
                  <tr className="wishlist_menu">
                    <td className="image">Item</td>
                    <td className="description" />
                    <td className="price">Price</td>
                    <td className="quantity"></td>
                    <td className="total"></td>
                    <td />
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map(prd => 
                    <tr key={prd.id}>
                    <td className="wishlist_product">
                      <a href><img src={`http://127.0.0.1:8000/media/products/${prd.image[0]}`} alt="" /></a>
                    </td>
                    <td className="wishlist_description">
                      <h4><a href>{prd.productname}</a></h4>
                      <p>Web ID: {prd.id}</p>
                    </td>
                    <td className="wishlist_price">
                      <p>${prd.price}</p>
                    </td>
                    <td className="wishlist_addToCart">
                      <a onClick={handleAddToCart} id={prd.id} className="btn btn-primary wishlist-add-to-cart"><i className="fa fa-shopping-cart" />Add to cart</a>
                    </td>
                    <td className="wishlist_delete">
                      <a onClick={handleDeleteWishList} id={prd.id} className="wishlist_quantity_delete"><i id={prd.id} className="fa fa-times" /></a>
                    </td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section> {/*/#cart_items*/}
      </div>
  )
}

export default Wishlist