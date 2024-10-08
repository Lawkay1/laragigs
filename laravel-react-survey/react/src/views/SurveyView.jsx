import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import TButton from "../components/core/TButton";
import { PhotoIcon, TrashIcon,  LinkIcon } from "@heroicons/react/24/outline";
import axiosClient from "../axios.js";
import { useNavigate, useParams } from "react-router-dom";
import SurveyQuestions from "../components/SurveyQuestions.jsx";
import { userStateContext } from "../contexts/ContextProvider";
export default function SurveyView(){
    const { showToast } = userStateContext()
    const navigate = useNavigate()
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [survey, setSurvey] = useState({
        title: "",
        slug: "",
        image_url: null,
        status: false, 
        expire_date: "",
        description: "",
        questions: [],
        image: null,

    });

    const [error, setError] = useState('')
    const onImageChoose =(ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setSurvey({...survey, image: file, image_url: reader.result}) // image_url: reader.result
            ev.target.value = ""
        }
        
        reader.readAsDataURL(file);
    }


    const onSubmit = (ev) => {
        ev.preventDefault();
        
        const payload = { ...survey};
        if (payload.image) {
            payload.image = payload.image_url;
        }
        delete payload.image_url;
        let res = null;

        if (id) {
            res = axiosClient.put(`/survey/${id}`, payload)
        } else { 
            res = axiosClient.post('/survey', payload)
        }
        res
        .then((res) =>{
            console.log(res);
            navigate('/surveys')
            if(id){
            showToast('The survey was updated');
            }else {
                showToast('The survey was created');
            }
        })
        .catch((err) => {
            console.log(err && err.response)
            if (err && err.response) {
                console.log('i am here')
                setError( err.response.data.message);
            }
        });

    };

    function onQuestionsChange(questions) {
         setSurvey({
            ...survey,
            questions
        })
    }

    const onDelete = ()=> {

    }

    useEffect(() => {
        if (id) {
            setLoading(true)
            axiosClient.get(`/survey/${id}`).then(({ data }) => {
                setSurvey(data.data)
                setLoading(false)
            })
        }
    }, [])
    return (
        <PageComponent title={!id ? "Create new Survey" : "Update Survey" }
        
        buttons={
            <div className = "flex gap 5">
            <TButton color="green" href={`/survey/public/${survey.slug}`}>
                <LinkIcon className="w-5 h-5"/>
                Public Link
            </TButton>

            <TButton color="red" onClick={onDelete}>
                <TrashIcon className="w-5 h-5"/>
                Delete
            </TButton>
            
            </div>
            }>
            
           {loading && <div>Loading...</div>}
           {!loading && <form action="#" method="POST" onSubmit={onSubmit}>
               <div className="shadow sm:overflow-hidden sm:rounded-md">
                
                <div className = "space-y-6 bg-white px-4 py-6 sm:p-6">
                {error && <div className="bg-red-500 text-white py-2 px-3 rounded-lg">
                    Here
                    { error }
                    </div>
                }
                {/* Image */}
                <div>
                    <label className = "block text-sm font-medium text-gray-700">
                        Photo
                    </label>
                    <div className = "mt-1 flex items-center">
                        {survey.image_url && (
                            <img
                                src = {survey.image_url}
                                alt = "s"
                                className = "h-32 w-32 object-cover"
                            />
                            
                        )}
                        {!survey.image_url && (
                            <span className = "flex items-right justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                <PhotoIcon className="h-10 w-10"/>
                            </span>
                        )}

                        <button
                            type = "button"
                            className="relative ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                            <input
                                type="file"
                                className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={onImageChoose}
                            />
                            Change
                    
                            </button>
                        </div>
                            </div>

                            {/* Title */}
                            <div className = "col-span-6 sm:col-span-1">
                                <label 
                                htmlFor="title"
                                className = "block text-sm font-medium text-gray-700">
                                
                                    SurveyTitle
                                    </label>
                                    <input
                                    type = "text"
                                    name = "title"
                                    id = "title"
                                    className = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={survey.title}
                                    placeholder="Title"
                                    onChange={(ev) => setSurvey({...survey, title: ev.target.value})}
                                    />
                                {/* Title */}
                            </div>
                                {/* Description */}
                                <div className = "col-span-6 sm:col-span-3">
                                    <label 
                                    htmlFor="description"
                                    className = "block text-sm font-medium text-gray-700">
                                    
                                        Description
                                        </label>
                                        <textarea
                                        
                                        name = "description"
                                        id = "description"
                                        className = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={survey.description}
                                        placeholder="Describe your survey"
                                        onChange={(ev) => setSurvey({...survey, description: ev.target.value})}
                                        />
                                    {/* Description */}
                                </div>
                                    {/* Expire Date */}
                                    <div className = "col-span-6 sm:col-span-3">
                                        <label 
                                        htmlFor="expire_date"
                                        className = "block text-sm font-medium text-gray-700">
                                        
                                            Expire date
                                            </label>
                                            <input
                                            type = "date"
                                            name = "expire_date"
                                            id = "expire_date"
                                            className = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={survey.expire_date}
                                            onChange={(ev) => setSurvey({...survey, expire_date: ev.target.value})}
                                            />
                                        {/* Expire Date */}
                                    </div>
                                        {/* Active          */}
                                        <div className = "flex items-start"> 
                                            <div className = "flex h-5 items-center">
                                                <input
                                                id = "status"
                                                name = "status"
                                                type = "checkbox"
                                                className = "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={survey.status}
                                                onChange={(ev) => setSurvey({...survey, status: ev.target.checked})}
                                                />
                                            </div>
                                            <div className = "ml-3 text-sm">
                                                <label
                                                htmlFor = "comments"
                                                className = "block text-sm font-medium text-gray-700"
                                                >
                                                    Active
                                                    </label>
                                                    <p className = "text-gray-500">
                                                        Whether to show this survey in makesurvey p
                                                        </p>
                                                    </div>
                                                  </div>
                                                    
                                                    {/* Active          */}

                                                    <SurveyQuestions questions={survey.questions} onQuestionsChange={onQuestionsChange}/>

                    
                                                </div>
                                                <div className = "bg-gray-50 px-4 py-3 text-right sm:px-6">
                                                    <TButton color="green">
                                                        Save
                                                    </TButton>
                                                </div>
                 </div>
                
                
              
   
           
            </form>
            }
        </PageComponent>
    )
}