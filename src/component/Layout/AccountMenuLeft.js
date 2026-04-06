function AccountMenuLeft() {
    const user = JSON.parse(localStorage.getItem("user")) || {}
    return (
        <div className="col-sm-3">
              <div className="left-sidebar">
                <h2>Account</h2>
                <div className="panel-group category-products" id="accordian">{/*category-productsr*/}
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title"><a href="/account">account</a></h4>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title"><a href="/account/add_product">Add product</a></h4>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title"><a href={`/account/my_product/${user.user_id}`}>My product</a></h4>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title"><a href="/account/add_blog">Add blog</a></h4>
                    </div>
                  </div>
                </div>{/*/category-products*/}
              </div>
            </div>
    )
}

export default AccountMenuLeft