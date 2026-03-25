import { useState, useEffect, useContext } from "react"
import { UserContext } from "../../UserContext"
import { useDispatch } from "react-redux"
import { totalCheckoutCount } from "../../counterSlice"
import API from "../../API"

function ProductFilter() {
    let userCartLc = JSON.parse(localStorage.getItem("user_cart")) || {}
    let wishListLc = JSON.parse(localStorage.getItem("wishlist")) || []
    const { setGetCart, setGetWishList } = useContext(UserContext)

    const dispatch = useDispatch()

    const { getProducts, setGetProducts } = useContext(UserContext)
    const [getName, setGetName] = useState("")
    const [getPrice, setGetPrice] = useState("")
    const [getCategory, setGetCategory] = useState([])
    const [getBrand, setGetBrand] = useState([])
    const [categoryChoice, setCategoryChoice] = useState("")
    const [brandChoice, setBrandChoice] = useState("")

    useEffect(() => {
          if(getProducts.length === 0) {
            API.get("products/api/products/")
            .then(res => {
            console.log(res.data)
            setGetProducts(res.data)
            })
          .catch(err => console.log(err))
          }
    }, [getProducts, setGetProducts])

    useEffect(() => {
        API.get("products/api/categories/")
        .then(res => 
            setGetCategory(res.data)
        )
        .catch(err => console.log(err))
    }, [])

    console.log(getPrice)

    useEffect(() => {
        API.get("products/api/brands/")
        .then(res => 
            setGetBrand(res.data)
        )
        .catch(err => console.log(err))
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        API.get(`products/api/products/?productname=${getName}&price=${getPrice}&category=${categoryChoice}&brand=${brandChoice}`)
        .then(res => {
            console.log(res.data)
            setGetProducts(res.data)
        })
        .catch(err => console.log(err))
    }

    function cateGoryOption() {
        return getCategory.map(cgr => 
            <option value={cgr.id} key={cgr.id}>{cgr.name}</option>
        )
    }
    function handleCateGory(e) {
        setCategoryChoice(e.target.value)
    }

    function brandOption() {
        return getBrand.map(br =>
            <option value={br.id} key={br.id}>{br.name}</option>
        )
    }
    function handleBrand(e) {
        setBrandChoice(e.target.value)
    }

    function handleNameInput(e) {
        setGetName(e.target.value)
    }

    function handlePriceInput(e) {
        setGetPrice(e.target.value)
    }

    function handleAddToCart(e) {
        let total = 0
        const productId = e.target.id
    
        if (userCartLc[productId]) {
          userCartLc[productId] += 1
        } else {
          userCartLc[productId] = 1
        }
    
        localStorage.setItem("user_cart", JSON.stringify(userCartLc))
        Object.values(userCartLc).forEach((qty) => (total += qty))
        setGetCart(total)
        dispatch(totalCheckoutCount())
      }
    
      function handleWishList(e) {
        const prd_id = e.target.id
        if(!wishListLc.includes(prd_id)) {
          wishListLc.push(prd_id)
        }
        localStorage.setItem("wishlist", JSON.stringify(wishListLc))
        setGetWishList(wishListLc.length)
      }

    return (
        <div className="col-sm-9">
          <h2 className="title text-center search-items">Search Items</h2>
        <form onSubmit={handleSubmit} className="product-filter-form">
            <input onChange={handleNameInput} value={getName} placeholder="name"/>
            <input onChange={handlePriceInput} value={getPrice} placeholder="price"/>
            <select onChange={handleCateGory} value={categoryChoice}>
                <option>Category</option>
                {cateGoryOption()}
            </select>
            <select onChange={handleBrand} value={brandChoice}>
                <option>Brand</option>
                {brandOption()}
            </select>
            <button type="submit" className="btn btn-default search-btn">Search</button>
        </form>
        <div className="features_items">
          {getProducts.map(prd => 
            <div className="col-sm-4">
            <div className="product-image-wrapper">
              <div className="single-products">
                <div className="productinfo text-center">
                  <img src={`http://127.0.0.1:8000/media/products/${prd.image[0]}`} alt="" />
                  <h2>${prd.price}</h2>
                  <p>{prd.productname}</p>
                  <button onClick={handleAddToCart} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" />Add to cart</button>
                </div>
                <div className="product-overlay">
                  <div className="overlay-content">
                    <button href={`/product_detail/${prd.id}`} className="btn btn-default prd_detail">Detail</button>
                    <h2>${prd.price}</h2>
                    <p>{prd.productname}</p>
                    <button onClick={handleAddToCart} id={prd.id} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" />Add to cart</button>
                  </div>
                </div>
              </div>
              <div className="choose">
                <ul className="nav nav-pills nav-justified">
                  <li><button onClick={handleWishList} id={prd.id}><i className="fa fa-plus-square" />Add to wishlist</button></li>
                  <li><button><i className="fa fa-plus-square" />Add to compare</button></li>
                </ul>
              </div>
            </div>
          </div>
          )}
        </div>
        </div>
    )
}

export default ProductFilter