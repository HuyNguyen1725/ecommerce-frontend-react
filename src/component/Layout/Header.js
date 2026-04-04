import logo from "../../images/home/logo.png"
import { useEffect, useState, useContext } from "react"
import { UserContext } from "../../UserContext"
import { useSelector } from "react-redux"
import API from "../../API"
import { useNavigate } from "react-router-dom"



function Header() {
  const userLocal = localStorage.getItem("user")
  const user = JSON.parse(userLocal) || {}

  const userCartLocal = localStorage.getItem("user_cart")
  const userCartLc = JSON.parse(userCartLocal) || {}

  const wishListLocal = localStorage.getItem("wishlist")
  const wishListLc = JSON.parse(wishListLocal) || []

  const { getCart, setGetCart, getWishList, setGetWishList, setGetProducts } = useContext(UserContext)
  const [searchInput, setSearchInput] = useState("")

  const navigate = useNavigate()

  let checkOutCount = useSelector((state) => state.counter.value)

  useEffect(() => {
    setGetWishList(wishListLc.length)
  }, [setGetWishList, wishListLc.length])

  useEffect(() => {
    let totalQty = 0
    Object.values(userCartLc).forEach((qty) => {
      totalQty += qty
    })
    setGetCart(totalQty)
  }, [setGetCart, userCartLc])

  function handleLogout() {
    localStorage.clear()
    window.location.href = "/login"
  }

  function handleSearchInput(e) {
    setSearchInput(e.target.value)
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    API.get(`products/api/products/?productname=${searchInput}`)
    .then(res => {
      setGetProducts(res.data.results)
      navigate("/productfilter")
    })
    .catch(err => console.log(err))
  }
 
  return (
    <div>
    <header id="header">{/*header*/}
        <div className="header_top">{/*header_top*/}
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <div className="contactinfo">
                  <ul className="nav nav-pills">
                    <li><a href><i className="fa fa-phone" /> +2 95 01 88 821</a></li>
                    <li><a href><i className="fa fa-envelope" /> info@domain.com</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="social-icons pull-right">
                  <ul className="nav navbar-nav">
                    <li><a href><i className="fa fa-facebook" /></a></li>
                    <li><a href><i className="fa fa-twitter" /></a></li>
                    <li><a href><i className="fa fa-linkedin" /></a></li>
                    <li><a href><i className="fa fa-dribbble" /></a></li>
                    <li><a href><i className="fa fa-google-plus" /></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>{/*/header_top*/}
        <div className="header-middle">{/*header-middle*/}
          <div className="container">
            <div className="row">
              <div className="col-md-4 clearfix">
                <div className="logo pull-left">
                  <a href="/"><img src={logo} alt="" /></a>
                </div>
                <div className="btn-group pull-right clearfix">
                  <div className="btn-group">
                    <button type="button" className="btn btn-default dropdown-toggle usa" data-toggle="dropdown">
                      USA
                      <span className="caret" />
                    </button>
                    <ul className="dropdown-menu">
                      <li><a href>Canada</a></li>
                      <li><a href>UK</a></li>
                    </ul>
                  </div>
                  <div className="btn-group">
                    <button type="button" className="btn btn-default dropdown-toggle usa" data-toggle="dropdown">
                      DOLLAR
                      <span className="caret" />
                    </button>
                    <ul className="dropdown-menu">
                      <li><a href>Canadian Dollar</a></li>
                      <li><a href>Pound</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-8 clearfix">
                <div className="shop-menu clearfix pull-right">
                  <ul className="nav navbar-nav">
                    {Object.keys(user).length > 0 ? 
                    <li><a href="/account"><i className="fa fa-user" /> Account</a></li> :
                    null}
                    <li>
                      <a href="/wishlist">
                      <div className="wishlist-icon">
                        <i className="fa fa-star" /> Wishlist
                        {getWishList > 0 ? 
                        <span className="wishlist-count">{getWishList}</span> :
                        null}
                      </div>
                      </a>
                      </li>
                    <li>
                      <a href="/checkout">
                          <div className="checkout-icon">
                            <i className="fa fa-crosshairs" /> Checkout
                            {checkOutCount > 0 ? 
                            <span className="checkout-count">{checkOutCount}</span> :
                            null}
                          </div>
                      </a>
                    </li>
                    <li>
                      <a href="/cart" className="cart-link">
                        <div className="cart-icon">
                          <i className="fa fa-shopping-cart" /> Cart
                          {getCart > 0 ?
                          <span className="cart-count">{getCart}</span> :
                          null}
                        </div>
                      </a>
                    </li>
                    {Object.keys(user).length === 0 ? 
                      <li><a href="/login"><i className="fa fa-lock" /> Login</a></li> :
                      <li><button className="header-logout" onClick={handleLogout}><i className="fa fa-lock" /> Logout</button></li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>{/*/header-middle*/}
        <div className="header-bottom">{/*header-bottom*/}
          <div className="container">
            <div className="row">
              <div className="col-sm-9">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                </div>
                <div className="mainmenu pull-left">
                  <ul className="nav navbar-nav collapse navbar-collapse">
                    <li><a href="/">Home</a></li>
                    <li className="dropdown"><button href="#">Shop<i className="fa fa-angle-down" /></button>
                      <ul role="menu" className="sub-menu">
                        <li><a href="/productfilter">Products</a></li>
                        <li><a href="/checkout">Checkout</a></li> 
                        <li><a href="/cart">Cart</a></li> 
                      </ul>
                    </li> 
                    <li className="dropdown"><button>Blog<i className="fa fa-angle-down" /></button>
                      <ul role="menu" className="sub-menu">
                        <li><a href="/blog">Blog List</a></li>
                        {/* <li><button >Blog Single</button></li> */}
                      </ul>
                    </li> 
                    <li><button >404</button></li>
                    <li><button >Contact</button></li>
                  </ul>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="search_box pull-right">
                  <form onSubmit={handleSearchSubmit}>
                    <input onChange={handleSearchInput} value={searchInput} type="text" placeholder="Search" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>{/*/header-bottom*/}
      </header>{/*/header*/}
      </div>
  )
}

export default Header