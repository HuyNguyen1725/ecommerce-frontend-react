import { useState, useEffect, useContext } from "react"
import API from "../API"
import { UserContext } from "../UserContext"
import { useDispatch } from "react-redux"
import { totalCheckoutCount } from "../counterSlice"

function Home() {
  let user = JSON.parse(localStorage.getItem("user")) || {}
  let userCartLc = JSON.parse(localStorage.getItem("user_cart")) || {}
  let wishListLc = JSON.parse(localStorage.getItem("wishlist")) || []

  const dispatch = useDispatch()

  const { setGetCart, setGetWishList, priceRange } = useContext(UserContext)
  const [getProducts, setGetProducts] = useState([])
  const [categoryProduct, setCategoryProduct] = useState([])
  const [recommendProduct, setRecommendProduct] = useState([])
  
  useEffect(() => {
    API.get("products/api/home/")
      .then((res) => {
        setGetProducts(res.data)
      })
      .catch(err => console.log(err.response.data))
  }, [])

  useEffect(() => {
    API.get("/products/api/categories/products/")
    .then(res => {
      setCategoryProduct(res.data)
    })
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if(priceRange[0] >= 0 && priceRange[1] != 1000) {
      API.get(`products/api/products/?min_price=${priceRange[0]}&max_price=${priceRange[1]}`)
      .then(res => {
        console.log(res.data, " getProduct")
        setGetProducts(res.data)
      })
      .catch(err => console.log(err))
    }
  }, [priceRange])

  useEffect(() => {
    API.get("products/api/recommend/products/")
    .then(res => setRecommendProduct(res.data))
    .catch(err => console.log(err))
  }, [])

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
    <div className="col-sm-9 padding-right">
        <div className="features_items">{/*features_items*/}
          <h2 className="title text-center">Features Items</h2>
          {getProducts.map(prd => 
            <div className="col-sm-4">
            <div className="product-image-wrapper">
              <div className="single-products">
                <div className="productinfo text-center">
                  <img src={`http://127.0.0.1:8000/media/products/${prd.image[0]}`} alt="" />
                  <h2>${prd.price}</h2>
                  <p>{prd.productname}</p>
                  <a onClick={handleAddToCart} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" />Add to cart</a>
                </div>
                <div className="product-overlay">
                  <div className="overlay-content">
                    <a href={`/product_detail/${prd.id}`} className="btn btn-default prd_detail">Detail</a>
                    <h2>${prd.price}</h2>
                    <p>{prd.productname}</p>
                    <a onClick={handleAddToCart} id={prd.id} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" />Add to cart</a>
                  </div>
                </div>
              </div>
              <div className="choose">
                <ul className="nav nav-pills nav-justified">
                  <li><a onClick={handleWishList} id={prd.id}><i className="fa fa-plus-square" />Add to wishlist</a></li>
                  <li><a><i className="fa fa-plus-square" />Add to compare</a></li>
                </ul>
              </div>
            </div>
          </div>
          )}
        </div>{/*features_items*/}

        <div className="category-tab">{/*category-tab*/}
          <div className="col-sm-12">
            <ul className="nav nav-tabs">
              {categoryProduct.map((cgr, idx) => 
                <li key={idx} className={idx == 0 ? "active" : ""}><a href={`#${cgr.id}-tab`} data-toggle="tab">{cgr.name}</a></li>
              )}
            </ul>
          </div>
          <div className="tab-content">
            {categoryProduct.map((cgrprd, index) =>
                <div key={index} className={`tab-pane fade ${index == 0 ? "active in" : ""}`} id={`${cgrprd.id}-tab`}>
                  {cgrprd.products.map(prds =>
                    <div className="col-sm-3">
                      <div className="product-image-wrapper">
                        <div className="single-products">
                          <div className="productinfo text-center">
                          <img src={`http://127.0.0.1:8000/media/products/${prds.image[0]}`} alt="" />
                          <h2>${prds.price}</h2>
                          <p>{prds.productname}</p>
                          <a href="#" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" />Add to cart</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>{/*/category-tab*/}
        <div className="recommended_items">{/*recommended_items*/}
          <h2 className="title text-center">recommended items</h2>
          <div id="recommended-item-carousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              <div className="item active">	
                {recommendProduct.map((prd, idx) => {
                  if(idx <= 2) {
                    return <div className="col-sm-4">
                    <div className="product-image-wrapper">
                      <div className="single-products">
                        <div className="productinfo text-center">
                          <img src={`http://127.0.0.1:8000/media/products/${prd.image[0]}`} alt="" />
                          <h2>${prd.price}</h2>
                          <p>{prd.productname}</p>
                          <a onClick={handleAddToCart} id={prd.id} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" />Add to cart</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  }
                })}
              </div>
              <div className="item">	
                {recommendProduct.map((prd, idx) => {
                  if(idx > 2) {
                    return <div className="col-sm-4">
                  <div className="product-image-wrapper">
                    <div className="single-products">
                      <div className="productinfo text-center">
                        <img src={`http://127.0.0.1:8000/media/products/${prd.image[0]}`} alt="" />
                        <h2>${prd.price}</h2>
                        <p>{prd.name}</p>
                        <a onClick={handleAddToCart} id={prd.id} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" />Add to cart</a>
                      </div>
                    </div>
                  </div>
                </div>
                  }
                })}
              </div>
            </div>
            <a className="left recommended-item-control" href="#recommended-item-carousel" data-slide="prev">
              <i className="fa fa-angle-left" />
            </a>
            <a className="right recommended-item-control" href="#recommended-item-carousel" data-slide="next">
              <i className="fa fa-angle-right" />
            </a>			
          </div>
        </div>{/*/recommended_items*/}
      </div>
  )
}

export default Home