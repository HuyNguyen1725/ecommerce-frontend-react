import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Rating } from "react-simple-star-rating"
import API from "../../API"

function Rate() {
  const params = useParams()
  const blog_id = params.id
  const user = JSON.parse(localStorage.getItem("user")) || {}
  const [rating, setRating] = useState(0)
  const [average, setAverage] = useState(0)

  useEffect(() => {
    API.get(`blogs/api/rates/${blog_id}/`)
    .then(res => {
      console.log(res.data.average)
      setAverage(res.data.average)
    })
    .catch(err => console.log(err.response.errors))
  }, [])

  function handleRating(rate) {
        setRating(rate)
        const userRate = {
          user_id: user.user_id,
          blog_id: blog_id,
          rate: rate
        }
        console.log(userRate)
        API.post(`blogs/api/rates/${blog_id}/`, userRate, {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        })
        .then(res => {
          console.log(res.data.average)
          setAverage(res.data.average)
        })
        .catch(err => {
          if (err.response.status == 401) {
            API.post("api/token/refresh", {
              refresh: user.refresh_token
            })
            .then(res => {
              user.access_token = res.data.access
              localStorage.setItem("user", JSON.stringify(user))
              API.post(`blogs/api/rates/${blog_id}/`, userRate, {
                headers: {
                  Authorization: `Bearer ${user.access_token}`
                }
              })
              .then(res => setAverage(res.data.average))
              .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
          } else console.log(err)
        })
      }

  return (
      <div >
          <Rating 
          onClick={handleRating}
          ratingValue={rating}
          size={35}
          transition
          fillColor="gold"
          emptyColor="gray"
          />
          <span>{average}</span>
        <ul className="tag">
          <li>TAG:</li>
          <li><a className="color">Pink <span>/</span></a></li>
          <li><a className="color">T-Shirt <span>/</span></a></li>
          <li><a className="color">Girls</a></li>
        </ul>
      </div>
  )
}

export default Rate