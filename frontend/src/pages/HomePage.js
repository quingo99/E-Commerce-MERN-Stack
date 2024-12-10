import { useEffect } from "react"
import HomePageComponent from "./components/HomePageComponent"
import {useSelector} from "react-redux"
import { useState } from "react"

const HomePage = () => {
    const [localCategories, setLocalCategories] = useState(null); // Local state to track categories
    const { categories } = useSelector((state) => state.categoryList);

    useEffect(() => {
        if (categories) {
            setLocalCategories(categories); // Update local state when categories are available
            console.log("Categories loaded:", categories);
        }
    }, [categories]);

    return (
        <>
        {localCategories  ? <HomePageComponent categories={localCategories}/> : <h2>Loading...</h2>}
          
        </>
    )
}

export default HomePage