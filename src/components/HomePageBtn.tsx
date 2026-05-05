import { useNavigate } from "react-router-dom"
function HomePageBtn() {
    const navigate = useNavigate()

    const handleButton = () => {
        navigate("/")
    }
  return (
    <button onClick={handleButton}>בחר מוצרים</button>
  )
}

export default HomePageBtn