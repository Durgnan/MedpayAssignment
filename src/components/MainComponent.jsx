import React, {useState,useEffect} from "react";
import axios from "axios";
import { API_KEY } from "../constants/values";


const MainComponent = (props) => 
{
    const [data,setData] = useState([])
    const [nextPageUrl, setNextPageUrl] = useState("")
    const [page,setPage] = useState({})

    useEffect(() => {
        const getData = () => {
            axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?size=10&api_key=${API_KEY}`).then((res) => {
                const { links, near_earth_objects, page } = res.data    
                setData(near_earth_objects)
                setNextPageUrl(links.next)
                setPage({...page})
            })
        }

        getData()
    }, [])

    const lookUpAsteroid = (url) => 
    {
        axios.get(url).then((res) => {
            console.log(res.data)
        })
    }

    return (
        <div>
            <div className="row border border-dark bg-dark" id="heading">
                <div className="col border border-dark text-white">Name</div>
                <div className="col border border-dark text-white">Minimum Diameter</div>
                <div className="col border border-dark text-white">Maximum Diameter</div>
                <div className="col border border-dark text-white">Hazardous</div>
                <div className="col border border-dark text-white">Sentry</div>
                <div className="col border border-dark text-white">Absolute Magnitude</div>
                <div className="col border border-dark text-white">Close Approaches</div>
            </div>
            {
                data
                .map((item) => {
                    const {id, name, estimated_diameter, is_potentially_hazardous_asteroid, is_sentry_object, absolute_magnitude_h} = item
                    return(
                        <div className="row border border-dark" key={id} onClick={(e) => {lookUpAsteroid(item.links.self)}}>
                            {
                                [name, `${+estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} KM`, `${+estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} KM`, is_potentially_hazardous_asteroid ? "Yes" : "No", is_sentry_object ? "Yes" : "No", +absolute_magnitude_h.toFixed(2), item.close_approach_data.length]
                                .map((element, index) => {
                                   return( <div className="col border border-dark" key={index}>{element}</div>)
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default MainComponent;