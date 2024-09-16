import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useEffect } from "react";
import { userStateContext } from "../contexts/ContextProvider";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function QuestionEditor( {
    index = 0,
    question,
    addQuestion,
    questionChange,
    deleteQuestion
 }) {

    const [model, setModel] = useState({ ...question});
    const { questionTypes } = userStateContext();

    useEffect(() => {
        questionChange(model)
    }, [model]);

    function upperCaseFirst(str){
        return  str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    function shouldHaveOptions(type = null) {
        // console.log('SHOULD HAVE OPTIONS ENTERED')
        type = type || model.type;
        // console.log(type, 'TYPE ENTERED')
        // console.log(model.type, 'model.type ENTERED')
        // console.log(["select", "radio", "checkbox"].includes(type), 'RETURNED')
        return ["select", "radio", "checkbox"].includes(type);
    }

    function onTypeChange(ev) {
        console.log('ONYTYPECHANGE TRIGGERED')
        const newModel = {
            ...model,
            type: ev.target.value
        }
        // console.log(ev.target.value, "TYPE")
        console.log(shouldHaveOptions(ev.target.value), 'SHOULD HAVE OPTIONS')
        if (!shouldHaveOptions(model.type) && shouldHaveOptions(ev.target.value)) {
            if (!model.data.options) {
                
            
            console.log("should have options true")
            newModel.data = {
                options: [
                    {uuid: uuidv4(), text: ''}
                ]
            }
        }
            
    } else if (shouldHaveOptions(model.type) && !shouldHaveOptions(ev.target.value)) {
        newModel.data = {};
    }
    // console.log(newModel, "New Model")
    setModel(newModel);
    // console.log(model, "modEL")
}

// function onTypeChange(ev) {
//     const newModel = {
//       ...model,
//       type: ev.target.value,
//     };
//     if (!shouldHaveOptions(model.type) && shouldHaveOptions(ev.target.value)) {
//       if (!model.data.options) {
//         newModel.data = {
//           options: [{ uuid: uuidv4(), text: "" }],
//         };
//       }
//     }
//     setModel(newModel);
//   }

function addOption() {
    model.data.options.push({
        uuid: uuidv4(),
        text: ''
    })
    setModel({...model})
}

function deleteOption(option) {
    model.data.options = model.data.options.filter((item) => item.uuid !== option.uuid)
    setModel({...model})
}
 return (
    <div>
        <div className= "flex justify-between mb-3">    
            <h4>
                {index + 1}. {model.question}
            </h4>
            <div className="flex items-center"> 
                <button
                type="button"
                className="flex items-center text-sm py-1 px-4 rounded-sm text-whiite bg-gray-600 hover:bg-gray-700"
                onClick={()=> addQuestion(index + 1)}>
                <PlusIcon className="w-4"/>
                add
                </button>
                <button
                type="button"
                className="flex items-center text-sm py-1 px-4 rounded-sm text-red bg-rose-600 hover:border-red-600"
                onClick={() => deleteQuestion(model)}>
                <TrashIcon className="w-4"/>
                Delete
                </button>
            </div>
        </div>
        <div className = "flex gap-3 justify-between mb-3">
            {/* Question Text */}
            <div className="flex-1">
                <label 
                htmlFor="question"
                className = "block text-sm font-medium text-gray-700">
                Question
                </label>
                <input
                type = "text"
                name = "question"
                id = "question"
                className = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={model.question}
                placeholder="Question"
                onChange={(ev) => setModel({...model, question: ev.target.value})}
                />            
            </div>
            {/* Question Text */}

            {/* Question Type */}
            <div className="flex-1">
                <label 
                htmlFor="questionType"
                className = "block text-sm font-medium text-gray-700">
                Question Type
                </label>
                <select
                name = "questionType"
                id = "questionType"
                className = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={model.type}
                onChange= {onTypeChange}
                >
                    {questionTypes.map((type) => (
                        <option  value={type}  key={type}>
                            {upperCaseFirst(type)}
                        </option>
                    ))}
                </select>
            </div>
            {/* Question Type */} 
           {/* <span>{model.data} Model </span> */}
            {/* Description */}
            <div className="flex-1">
                <label 
                htmlFor="description"  
                className = "block text-sm font-medium text-gray-700">
                Description
                </label>
                <textarea
                name = "description"
                id = "description"
                className = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={model.description || ""}
                placeholder="Describe your question"
                onChange={(ev) => setModel({...model, description: ev.target.value})}
                />
            </div>
            {/* Description */}
            <div> {shouldHaveOptions() && <div>
                <h4 className = "text-sm font-semibold mb-1 flex justify-between items-center">Options

                <button
                type="button"
                className="flex items-center text-sm py-1 px-4 rounded-sm text-whiite bg-gray-600 hover:bg-gray-700"
                onClick={() => addOption()}>
                <PlusIcon className="w-4"/>
                Add

                </button>
                
                </h4>
                
                {model.data.options.length === 0 && <div>
                    You dont have options defined
                </div>
                } 
                {model.data.options.length > 0 && <div>
                    {model.data.options.map((op, ind) => (
                        <div>
                            <span> {ind + 1}</span>
                            <input type="text" 
                            value={op.text}
                            onInput = {(ev) => {
                                op.text = ev.target.value; setModel({...model})
                            }} 

                             className="w-full rounded-sm"
                            />
                            <button onClick= {(ev) => deleteOption(op)} type="button" className = "text-sm py-1 px-4 rounded-sm text-red bg-rose-600 hover:border-red-600"> 
                                
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}

                    
                </div>
                }           
            </div>}</div>
        </div>
    </div>   
    )
}