<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SurveyUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

         // Log the survey and user to see what's happening
    \Log::info('Survey:', ['survey' => $this->route('survey')]);
    \Log::info('User:', ['user' => $this->user()]);
       
        $survey = $this->route('survey');
        if ($this->user()->id !== $survey->user_id) {
           return false; 
        }
        return true;
    }

//     public function authorize(): bool
//     {
//     // Fetch the survey instance from the route parameter
//     $surveyId = $this->route('survey');
//     $survey = Survey::find($surveyId);

//     // Check if the survey exists and if the authenticated user is the owner
//     if ($survey && $this->user()->id === $survey->user_id) {
//         return true;
//     }

//     return false;
// }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:1000',
            'image' => 'string',
            'user_id' => 'exists:users,id',
            'status' => 'required|boolean',
            'expire_date' => 'nullable|date|after:today',
            'description' => 'nullable|string',
            'questions' => 'array',

            //
        ];
    }
}
