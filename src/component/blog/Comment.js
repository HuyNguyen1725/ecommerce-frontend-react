import { useState, useEffect } from "react"
import API from "../../API"
import { useParams } from "react-router-dom"

function Comment() {
  const params = useParams()
  const blog_id = params.id
  const user = JSON.parse(localStorage.getItem("user")) || {}

  const [comments, setComments] = useState([])
  const [replyComments, setReplyComments] = useState([])

  const [getComment, setComment] = useState({
    user_id: user.user_id,
    user_name: user.username,
    user_image: user.avatar,
    blog_id: blog_id,
    comment_id: 0,
    set: 0,
    content: "",
  })

  function handleComment(e) {
    setComment((state) => ({
      ...state,
      content: e.target.value,
    }))
  }

  function BtnComment() {
    setComment((state) => ({
      ...state,
      set: 0,
    }))
  }

  function BtnReplyComment(e) {
    setComment((state) => ({
      ...state,
      set: 1,
      comment_id: e.target.id,
    }))
  }

  useEffect(() => {
    API.get(`blogs/api/comments/${blog_id}/`)
      .then((res) => {
        setComments(res.data.comments)
        setReplyComments(res.data.replyComments)
      })
      .catch((err) => console.log(err.response.data))
  }, [])

  function PostComment() {
    if (getComment.content === "") {
      alert("Vui lòng không để trống")
    } else {
      API.post(`blogs/api/comments/${blog_id}/`, getComment, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
        .then((res) => {
          setComments(res.data.comments)
          setReplyComments(res.data.replyComments)
        })
        .catch(err => {
          if(err.response.status == 401) {
            API.post("users/api/token/refresh/", {
              refresh: user.refresh_token
            })
            .then(res => {
              user.access_token = res.data.access
              localStorage.setItem("user", JSON.stringify(user))
              API.post(`blogs/api/comments/${blog_id}/`, getComment, {
                headers: {
                  Authorization: `Bearer ${user.access_token}`,
                },
              })
              .then(res => {
                setComments(res.data.comments)
                setReplyComments(res.data.replyComments)
              })
            })
            .catch(err => console.log(err))
          } else console.log(err)
        })
    }
  }

  return (
    <div>
        <div className="response-area">
          <a onClick={BtnComment} href="#cmt_text" className="btn btn-default cmt">Comment</a>
          <h2>{comments.length + replyComments.length} RESPONSES</h2>
          <ul className="media-list">
            {comments.map(cmt => 
              <li className="media">
              <a className="pull-left">
                <img className="media-object" src={`${process.env.REACT_APP_API_URL}${cmt.user_image}`} alt="" />
              </a>
              <div className="media-body">
                <ul className="sinlge-post-meta">
                  <li><i className="fa fa-user" />{cmt.user_name}</li>
                  <li><i className="fa fa-clock-o" /> {cmt.time}</li>
                  <li><i className="fa fa-calendar" /> {cmt.date}</li>
                </ul>
                <p>{cmt.content}</p>
                <a onClick={BtnReplyComment} href="#cmt_text" id={cmt.id} className="btn btn-primary"><i className="fa fa-reply" />Replay</a>
              </div>
              {replyComments.map(replCmt => {
                if(replCmt.comment_id == cmt.id) {
                  return <li className="media second-media">
                  <a className="pull-left">
                  <img className="media-object" src={`${process.env.REACT_APP_API_URL}${replCmt.user_image}`} alt="" />
                  </a>
                  <div className="media-body">
                  <ul className="sinlge-post-meta">
                    <li><i className="fa fa-user" />{replCmt.user_name}</li>
                    <li><i className="fa fa-clock-o" /> {replCmt.time}</li>
                    <li><i className="fa fa-calendar" /> {replCmt.date}</li>
                  </ul>
                  <p>{replCmt.content}</p>
                </div>
              </li>
                }
              })}
            </li>
            )}
          </ul>					
        </div>{/*/Response-area*/}
        <div className="replay-box">
          <div className="row">
            <div className="col-sm-12">
              <h2>Leave a replay</h2>
              <div className="text-area">
                <div className="blank-arrow">
                  <label>Your Name</label>
                </div>
                <span>*</span>
                <textarea onChange={handleComment} name="message" id="cmt_text" rows={11} value={getComment.content} />
                <a onClick={PostComment} className="btn btn-primary">post comment</a>
              </div>
            </div>
          </div>
        </div>{/*/Repaly Box*/}
      </div>
  )
}

export default Comment