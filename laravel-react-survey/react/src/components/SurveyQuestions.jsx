import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionEditor from "./QuestionEditor";

export default function SurveyQuestions( { questions, onQuestionsChange }) {
    const [myQuestions, setMyQuestions] = useState([...questions]);

    const addQuestion = (index) => {
        index = index !== undefined ? index : myQuestions.length -1;
        myQuestions.splice(index, 0,{
            id: uuidv4(),
            type: "text", 
            question: "",
            description: "",
            data: {}, 

        })
        setMyQuestions([
            ...myQuestions,
          ]);
        onQuestionsChange(myQuestions);
     };


    const questionChange = (question) => {
        if (!question) return;
        const newQuestions = myQuestions.map((q) => {
            if (q.id == question.id) {
                return {...question};
        }
        return q;
            
    });
    setMyQuestions(newQuestions);
    onQuestionsChange(newQuestions);
};

    const deleteQuestion = (question) => {
        const newQuestions = myQuestions.filter((q)=> q.id !== question.id);
        setMyQuestions(newQuestions);
        onQuestionsChange(newQuestions);
    };

    useEffect(()=> {
        setMyQuestions(questions); 
    }, [questions]  );

    // useEffect(()=> {
    //     setModel({...survey}); 
    // }, [survey]  );

    
    return (
        <>
        <div className = "flex jsutify-between ">
            <h3 className = "text-lg font-bold">Questions</h3>
            <button 
             type="button"
             className="flex items-center text-sm py-1 p-4 rounded-sm text-whiite bg-gray-600 hover:bg-gray-700"
             onClick={()=>addQuestion()}>
                <PlusIcon className="w-4 h-4"/>
                Add question
             </button>
        </div>
        {myQuestions.length ? (
            myQuestions.map((q, ind)=> (
                <QuestionEditor
                key = {q.id}
                question = {q}
                index = {ind}
                questionChange = {questionChange}
                addQuestion= {addQuestion}
                deleteQuestion= {deleteQuestion}
                />
            ))
            
        ) : (
            <div className = "text-center text-sm p-4">
            You don't have any questions added.
            </div>

        )}
        </>

    );

}