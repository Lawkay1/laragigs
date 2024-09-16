import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axiosClient from "../axios"
import PublicQuestionView from "../components/PublicQuestionView"
export default function SurveyPublicView(){
    const answers = {}
    const [survey, setSurvey] = useState({
        questions: []
    })
    const [surveyFinished, setSurveyFinished] = useState(false)
    const { slug } = useParams()
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        setLoading(true)
        axiosClient.get(`survey/get-by-slug/${slug}`)
        .then(({data}) => {
            setLoading(false)
            setSurvey(data.data);
        }).catch(() => {
            setLoading(false)
        });
    }, []);

    function onSubmit(ev) {
        ev.preventDefault();
        console.log(answers)
        axiosClient.post(`/survey/${survey.id}/answer`, {
            answers
        })
        .then((response)=>{
            debugger;
            setSurveyFinished(true)
        });
    }

    function answerChanged(question, value) {
        answers[question.id] = value
        console.log(question, value)
    }
    return (
        <div>
            {/* <pre> {JSON.stringify(survey, undefined, 2)}</pre> */}
            {loading && <div className= "flex items-center justify-center">Loading...</div>}
            {!loading &&(
                <form onSubmit= {(ev) => onSubmit(ev)} className= "container mx-auto">
                <div className="grid grid-cols-6">
                
                <div>
                    <img src= { survey.image_url} alt=""/>
                </div>
                <div className="col-span-5">
                    <h1 className="text-3xl font-bold">
                        {survey.title}
                    </h1>
                        <p className = "text-gray-500 text-sm">
                            {survey.expire_date}
                        </p>
                        <p className = "text-gray-500 text-sm">
                            {survey.description}
                        </p>
                </div>
                </div>
                {
                    surveyFinished && (
                        <div className="py-8 px-6 bg-emerald text-white w-[600px] mx-auto">
                            Thank you for participating in the survey
                        </div>
                    )
                }     

                {
                    !surveyFinished && (
                            <>
                            
                                {survey.questions.map((question, index) => (
                                    <PublicQuestionView 
                                    key={question.id}
                                    question={question}
                                    index={index}
                                    answerChanged={val => answerChanged(question, val)}
                                    />

                                    
                                    ))}
                                    <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded font-medium"
                                    >
                                        Submit
                                    </button>
                            </>

                    )}           
               
               
        </form>)}
        
        </div>
    
    
    )
    
}