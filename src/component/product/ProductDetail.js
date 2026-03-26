import { useState, useEffect, useContext } from "react"
import API from "../../API"
import { useParams } from "react-router-dom"
import Carousel from "react-multi-carousel"
import { useDispatch } from "react-redux"
import { totalCheckoutCount } from "../../counterSlice"
import { UserContext } from "../../UserContext"
import "react-multi-carousel/lib/styles.css"

function ProductDetail() {
    let user_cart = JSON.parse(localStorage.getItem("user_cart")) || {}

    const dispatch = useDispatch()
    const { setGetCart } = useContext(UserContext)

    const [getProduct, setGetProduct] = useState({})
    const [cartQtyInput, setCartQtyInput] = useState(1)
    const params = useParams()
    const product_id = params.id

    const responsive = {
        desktop: {
            breakpoint: {max: 3000, min: 1024},
            items: 3,
            slidesToSlide: 1
        },
        tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 1,
        },
        mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1,
        },
    }

    function handleCartQtyInput(e) {
        setCartQtyInput(e.target.value)
    }
    

    function handleAddToCart() {
        let totalCart = 0
        if(user_cart[product_id]) {
          user_cart[product_id] += Number(cartQtyInput)
        } else user_cart[product_id] = 1
        localStorage.setItem("user_cart", JSON.stringify(user_cart))
        Object.values(user_cart).map(qty => totalCart += qty)
        dispatch(totalCheckoutCount())
        setGetCart(totalCart)
    }

    useEffect(() => {
        API.get(`products/api/products/${product_id}/`)
        .then(res => {
            setGetProduct(res.data)
            console.log(res.data)
        })
        .catch(err => console.log(err.response.data))
    }, [product_id])

    return (
        
        <div className="col-sm-9 padding-right">
            
        <div className="product-details">
          <div className="col-sm-5">
            <div className="view-product">
              <img src={`${process.env.REACT_APP_API_URL}media/products/${Object.keys(getProduct).length > 0 ? getProduct.image[0] : null}`} alt="product" />
              <a href={`${process.env.REACT_APP_API_URL}media/products/${Object.keys(getProduct).length > 0 ? getProduct.image[0] : null}`} rel="prettyPhoto"><h3>ZOOM</h3></a>
            </div>
                <Carousel
                responsive={responsive}
                arrows={true}
                infinite={true}
                autoPlay={false}
                showDots={false}
                containerClass="carousel-container"
                itemClass="carousel-item-padding-40-px"
                >
                <div className="item active">
                  <img style={{width: "100px"}} src={`${process.env.REACT_APP_API_URL}media/products/${Object.keys(getProduct).length > 0 ? getProduct.image[1] : null}`} alt="product" />
                </div>
                <div className="item">
                  <img  style={{width: "100px"}} src={`${process.env.REACT_APP_API_URL}media/products/${Object.keys(getProduct).length > 0 ? getProduct.image[2] : null}`} alt="product"/>
                </div>
                <div className="item">
                  <img style={{width: "100px"}} src={`${process.env.REACT_APP_API_URL}media/products/${Object.keys(getProduct).length > 0 ? getProduct.image[0] : null}`} alt="product" />
                </div>
                </Carousel>
          </div>
          <div className="col-sm-7">
            <div className="product-information">
              <img src="images/product-details/new.jpg" className="newarrival" alt="product" />
              <h2>{getProduct.productname}</h2>
              <p>Web ID: {getProduct.id}</p>
              <img src="images/product-details/rating.png" alt="product" />
              <span>
                <span>US ${getProduct.price}</span>
                <label>Quantity:</label>
                <input onChange={handleCartQtyInput} type="text" value={cartQtyInput} />
                <button onClick={handleAddToCart} type="button" className="btn btn-default prd-detail-cart">
                  <i className="fa fa-shopping-cart" />
                  Add to cart
                </button>
              </span>
              <p><b>Availability:</b> In Stock</p>
              <p><b>Condition:</b> New</p>
              <p><b>Brand:</b> E-SHOPPER</p>
              <img src="images/product-details/share.png" className="share img-responsive" alt="product" />
            </div>
          </div>
        </div>

      </div>
    )
}

export default ProductDetail