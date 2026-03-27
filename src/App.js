import Blog from "./component/blog/Blog"
import BlogDetail from "./component/blog/BlogDetail"
import Login from "./component/account/Login"
import Account from "./component/account/Account";
import { useLocation } from "react-router-dom";
import Footer from "./component/Layout/Footer";
import Header from "./component/Layout/Header";
import MenuLeft from "./component/Layout/MenuLeft";
import AccountMenuLeft from "./component/Layout/AccountMenuLeft";
import AddProduct from "./component/product/AddProduct";
import MyProduct from "./component/product/MyProduct";
import EditProduct from "./component/product/EditProduct";
import ProductFilter from "./component/product/ProductFilter";
import AddBlog from "./component/blog/AddBlog";
import Home from "./component/Home";
import Cart from "./component/account/Cart"
import Checkout from "./component/account/Checkout";
import Slider from "./component/Layout/Slider";
import ProductDetail from "./component/product/ProductDetail"
import { UserContext } from "./UserContext";
import { useState } from "react";
import Wishlist from "./component/product/WishList";

import {
    Routes,
    Route,
} from "react-router-dom"


function App() {
    let params1 = useLocation()
    const [getCart, setGetCart] = useState(0)
    const [getWishList, setGetWishList] = useState(0)
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [getProducts, setGetProducts] = useState([])


    return (
        <>
            <UserContext.Provider value={{
                getCart, setGetCart, getWishList, 
                setGetWishList, priceRange, setPriceRange,
                getProducts, setGetProducts
            }}>
            <Header />
                <div className="container">
                    <div className="row">
                        {params1['pathname'] === "/" ? <Slider /> : null}
                        {!params1['pathname'].includes("login") && 
                        !params1['pathname'].includes("cart") &&!params1['pathname'].includes("checkout") && 
                        (params1['pathname'].includes("account") ? <AccountMenuLeft /> : <MenuLeft />)}
                    <Routes>
                        <Route path="/blog" element={<Blog />}/>
                        <Route path="/blog_detail/:id" element={<BlogDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/account/add_product" element={<AddProduct />} />
                        <Route path="/account/my_product/:user_id" element={<MyProduct />} />
                        <Route path="/account/edit_product/:id" element={<EditProduct />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/product_detail/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/productfilter" element={<ProductFilter />} />
                        <Route path="/account/add_blog" element={<AddBlog />} />
                    </Routes>
                    </div>
                </div>
            </UserContext.Provider>
            <Footer />
        </>
   )
}

export default App