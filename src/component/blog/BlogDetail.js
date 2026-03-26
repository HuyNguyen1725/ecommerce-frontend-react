import { useState, useEffect } from "react"
import API from "../../API"
import { useParams } from "react-router-dom"
import Comment from "./Comment"
import Rate from "./Rate"

function BlogDetail() {
  const params = useParams()
  const id = params.id
  const [blogDetail, setBlogDetail] = useState({})
  console.log(blogDetail)

  useEffect(() => {
    API.get(`/blogs/api/blogs/${id}/`)
      .then((res) => {
        console.log(res.data)
        setBlogDetail(res.data)
      })
      .catch((err) => console.log(err.response.data))
  }, [])

  return (
    <div className="col-sm-9">
        <div className="blog-post-area">
          <h2 className="title text-center">Latest From our Blog</h2>
          <div className="single-blog-post">
            <h3>{blogDetail.title}</h3>
            <div className="post-meta">
              <ul>
                <li><i className="fa fa-user" /> {blogDetail.author}</li>
                <li><i className="fa fa-clock-o" /> {blogDetail.time}</li>
                <li><i className="fa fa-calendar" /> {blogDetail.date}</li>
              </ul>
              {/* <span>
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<i class="fa fa-star-half-o"></i>
								</span> */}
            </div>
            <a href>
              <img src={`${process.env.REACT_APP_API_URL}${blogDetail.image}`} alt="" />
            </a>
            <p>
              {blogDetail.content}
            </p>
            <div className="pager-area">
              <ul className="pager pull-right">
                <li><a href="#">Pre</a></li>
                <li><a href="#">Next</a></li>
              </ul>
            </div>
          </div>
        </div>{/*/blog-post-area*/}
        <div className="rating-area">
          <ul className="ratings">
            <li className="rate-this">Rate this item:
                  <Rate />
            </li>
          </ul>
          <ul className="tag">
            <li>TAG:</li>
            <li><a className="color" href>Pink <span>/</span></a></li>
            <li><a className="color" href>T-Shirt <span>/</span></a></li>
            <li><a className="color" href>Girls</a></li>
          </ul>
        </div>{/*/rating-area*/}
        <Comment />
      </div>
  )
}

export default BlogDetail