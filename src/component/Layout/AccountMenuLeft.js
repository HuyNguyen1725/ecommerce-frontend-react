function AccountMenuLeft() {
    const userLocal = localStorage.getItem("user")
    const user = JSON.parse(userLocal)
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
                </div>{/*/category-products*/}
              </div>
            </div>
    )
}

export default AccountMenuLeft