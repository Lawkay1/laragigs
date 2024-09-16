import PageComponent from "../components/PageComponent"
import { userStateContext } from "../contexts/ContextProvider"
import SurveyListItem from "../components/SurveyListItem"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import TButton from "../components/core/TButton"
import { useEffect, useState } from "react"
import axiosClient from "../axios"
import PaginationLinks from "../components/PaginationLinks"
import router from "../router"
export default function Surveys(){
    // const { surveys } = userStateContext()
    const { showToast } = userStateContext()
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({});
    const onDeleteClick = (id) => {
        if (window.confirm('Are you sure?')) {
        axiosClient.delete(`/survey/${id}`).then(() => {
            getSurveys()
            showToast('The message was deleted')
        })
    }
    };

    const onPageClick = (link) => {
        getSurveys(link.url)
    }

    const getSurveys = (url) => {
        setLoading(true);
        url = url || '/survey'
        axiosClient.get(url).then(({data}) => {
            setSurveys(data.data);
            setMeta(data.meta)
            setLoading(false)
        })
    }

    useEffect(()=>{
       
        getSurveys() 
        
    }, [])

    return (
       
          <PageComponent title="Surveys"
          buttons={
            <TButton color="green" to="/surveys/create">
                <PlusCircleIcon className="w-5 h-5"/>
                Create new
            </TButton>
            }
           >
            {loading && <div className= "flex items-center justify-center">
                Loading...
            </div>}
            {!loading &&<div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {surveys.map((survey)=>(

                    <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onDeleteClick} />
                ))}
                </div>
                    <PaginationLinks meta={meta} onPageClick={onPageClick}/>
            </div>}
        </PageComponent>
    )
}