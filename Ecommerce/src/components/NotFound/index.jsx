import { Link } from "react-router-dom"
import "./index.css"

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/not-found-blog-img.png"
      alt="not-found"
      className="not-found-img"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-description">
      We couldn’t find the page you are looking for.
    </p>
    <Link to="/" className="home-link">
      Go Back Home
    </Link>
  </div>
)

export default NotFound
