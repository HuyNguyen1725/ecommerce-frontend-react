import { useEffect, useState, useContext } from "react"
import API from "../../API"
import Slider from "rc-slider";
import { UserContext } from "../../UserContext";

function MenuLeft() {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const { priceRange, setPriceRange } = useContext(UserContext)


  useEffect(() => {
    API.get("products/api/categories/")
    .then(res => {
      console.log(res.data)
      setCategories(res.data)
    })
    .catch(err => console.log(err.response.data))
  }, [])

  useEffect(() => {
    API.get("products/api/brands/")
    .then(res => {
      console.log(res.data)
      setBrands(res.data)
    })
    .catch(err => console.log(err.response.errors))
  }, [])


  return (
    <div className="col-sm-3">
      <div className="left-sidebar">
        <h2>Category</h2>
        <div className="panel-group category-products" id="accordian">{/*category-productsr*/}
          {categories.map(category => 
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordian" href={`#${category.name}`}>
                    <span className="badge pull-right"><i className="fa fa-plus" /></span>
                    {category.name}
                  </a>
                </h4>
              </div>
              {category.brands.map(brand => 
                <div id={category.name} className="panel-collapse collapse">
                  <div className="panel-body">
                    <ul>
                      <li><a href="#">{brand.name} </a></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>{/*/category-products*/}
        <div className="brands_products">{/*brands_products*/}
          <h2>Brands</h2>
          <div className="brands-name">
            <ul className="nav nav-pills nav-stacked">
              {brands.map(brand => 
                <li><a href="#"> <span className="pull-right">({brand.products.length})</span>{brand.name}</a></li>
              )}
            </ul>
          </div>
        </div>{/*/brands_products*/}
        <div className="price-range">{/*price-range*/}
                <h2>Price Range</h2>

        <div className="well text-center">
          <div style={{ padding: "20px 10px" }}>
            <Slider
              range
              min={0}
              max={1000000}
              step={5}
              value={priceRange}
              onChange={setPriceRange}
              styles={{
                track: {
                  backgroundColor: "#FE980F",
                  height: 6
                },
                rail: {
                  backgroundColor: "#f2f2f2",
                  height: 6
                },
                handle: {
                  borderColor: "#FE980F",
                  backgroundColor: "#FE980F",
                  width: 16,
                  height: 16,
                  marginTop: -5,
                  opacity: 1,
                  boxShadow: "none"
                }
              }}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <b>
              ${priceRange[0].toLocaleString()} - $
              {priceRange[1].toLocaleString()}
            </b>
          </div>

          <br />
          {/* <b className="pull-left">$ 0</b>
          <b className="pull-right">$ 1,000,000</b> */}
        </div>
        </div>{/*/price-range*/}
        <div className="shipping text-center">{/*shipping*/}
          <img src="images/home/shipping.jpg" alt="" />
        </div>{/*/shipping*/}
      </div>
    </div>
  )
}

export default MenuLeft