import PageComponent from "../components/PageComponent"
import { userStateContext } from "../contexts/ContextProvider"
import SurveyListItem from "../components/SurveyListItem"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import TButton from "../components/core/TButton"
export default function Surveys(){
    const { surveys } = userStateContext()
    const onDeleteClick = () => {
        console.log('On delete click')
    }

    return (
       
          <PageComponent title="Surveys"
          buttons={(
            <TButton color="green" to="/surveys/create">
                <PlusCircleIcon className="w-5 h-5"/>
                Create new
            </TButton>
          )}>
            {surveys.map((survey)=>(

                <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onDeleteClick} />
             ))}
            
        </PageComponent>
    )
}