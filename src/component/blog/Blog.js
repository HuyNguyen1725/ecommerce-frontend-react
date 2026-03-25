import { useState, useEffect } from "react"
import API from "../../API"

function Blog() {
  const [pageCount, setPageCount] = useState(0)
  const [blogList, setBlogList] = useState([])
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  useEffect(() => {
    API.get(`blogs/api/blogs/?page=${page}`)
      .then((res) => {
        setBlogList(res.data.results)
        setNext(res.data.next)
        setPrevious(res.data.previous)
        setPageCount(res.data)
        console.log(res.data)
      })
      .catch((err) => console.log(err.response.data))
  }, [page])

  return (
    <div className="col-sm-9">
        <div className="blog-post-area">
          <h2 className="title text-center">Latest From our Blog</h2>
          {blogList.map(blg => 
            <div className="single-blog-post">
            <h3>Girls Pink T Shirt arrived in store</h3>
            <div className="post-meta">
              <ul>
                <li><i className="fa fa-user" /> {blg.author}</li>
                <li><i className="fa fa-clock-o" /> {blg.time}</li>
                <li><i className="fa fa-calendar" /> {blg.date}</li>
              </ul>
              <span>
                <i className="fa fa-star" />
                <i className="fa fa-star" />
                <i className="fa fa-star" />
                <i className="fa fa-star" />
                <i className="fa fa-star-half-o" />
              </span>
            </div>
            <a href>
              <img src="images/blog/blog-one.jpg" alt="" />
            </a>
            <p>{blg.title}.</p>
            <a href={`/blog_detail/${blg.id}`} className="btn btn-primary">Read More</a>
          </div>
          )}
          <div className="pagination-area">
            <ul className="pagination">
              <li><button className="btn btn-default previous" disabled={!previous} onClick={() => setPage(page-1)}>Previous</button></li>
              <span>{page}</span>
              <li><button className="btn btn-default next" disabled={!next} onClick={() => setPage(page+1)}>Next</button></li>
            </ul>
          </div>
        </div>
      </div>
  )
}

export default Blog