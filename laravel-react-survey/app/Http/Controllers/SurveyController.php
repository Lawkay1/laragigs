<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Survey;
use App\Http\Requests\SurveyStoreRequest;
use App\Http\Requests\SurveyUpdateRequest;
use App\Http\Requests\StoreSurveyAnswerRequest;
use App\Http\Resources\SurveyResource;
use App\Http\Resources\SurveyCollection;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use App\Models\SurveyQuestion;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Support\Facades\Storage;
use App\Enums\QuestionTypeEnum;
use Illuminate\Validation\Rule;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return SurveyResource::collection(Survey::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->paginate(2)
    );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SurveyStoreRequest $request)
    {
        //
        $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        $survey = Survey::create($data);

        foreach ($data['questions'] as $question) {
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);           

        }
        return new SurveyResource($survey);
    }

    /**
     * Display th/home/lawkay/laragigs/laravel-react-survey/app/Http/Resourcese specified resource.
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized');
        }

        return new SurveyResource($survey);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SurveyUpdateRequest $request, Survey $survey)
    {
        $data = $request->validated();
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }
        // If there is an old image, delete it
        if ($survey->image){
            $absolutePath = public_path('images/' . $survey->image);
            File::delete($absolutePath);
        }

        // Update survey in the database
        $survey->update($data);

        // Get ids as plain array of existing questions
        $existingIds = $survey->questions()->pluck('id')->toArray();
        // Get ids as plain array of new questions 
        $newIds = Arr::pluck($data['questions'], 'id');
        // Find questions to delete 
        $toDelete = array_diff($existingIds, $newIds);
        // Find questions to add
        $toAdd = array_diff($newIds, $existingIds);

        // Delete questions 
        SurveyQuestion::destroy($toDelete);

        // Create new questions
        foreach ($data['questions'] as $question) {
            if (in_array($question['id'], $toAdd)) {
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }

        //Update existing questions 
        $questionMap = collect($data['questions'])->keyBy('id');
        foreach ($survey->questions as $question) {
            if (isset($questionMap[$question->id])) {
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }

        return new SurveyResource($survey);


 }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized');
        }
        $survey->delete();
        // If there is an old mage, delete it
        if ($survey->image) {
            $absolutePath = public_path('images/' . $survey->image);
        }
        return response('', 204);

    }

    private function saveImage($image)
    {
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // Take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // Get file extension
            $type = strtolower($type[1]); // jpg, png, gif

            // Check if file is an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }


    // private function saveImage($image)
    // {
    //     // Check if image is valid base64 string
    //     if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
    //         // Take out the base64 encoded text without mime
    //         $image = substr($image, strpos($image, ',') + 1);

    //         // Get file extension
    //         $type = strtolower($type[1]);

    //         // Check if file is an image
    //         if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
    //             throw new \Exception('invalid image type');
    //         }
    //         $image = str_replace(' ', '+', $image);
    //         $image = base64_decode($image);

    //         if ($image === false) {
    //             throw new \Exception('base64_decode failed');
    //         }
    //     } else {
    //         throw new \Exception('did not find valid base64 string');
    //     }

    //     $dir = 'images/';
    //     $file = Str::random() . '.' . $type;
    //     $absolutePath = public_path($dir);
    //     $relativePath = $dir . $file;
    //     if (!File::exists($absolutePath)) {
    //         File:makeDirectory($absolutePath, 0755, true);
    //     }

    //     file_put_contents($relativePath, $image);

    //     return $relativePath;

    // }

    private function createQuestion($data)
    {   
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = \Validator::make($data, [
            'question' => 'required|string|',
            'description' => 'nullable|string',
            'type' => ['required', Rule::in([
                // 'text', 'checkbox'
                QuestionTypeEnum::Text->value,
                QuestionTypeEnum::Select->value,
                QuestionTypeEnum::Checkbox->value,
                QuestionTypeEnum::Radio->value,
                QuestionTypeEnum::Textarea->value
        ])],
            'data' => 'present',
            'survey_id' => 'exists:App\Models\Survey,id',
            
        ]);
       return SurveyQuestion::create($validator->validated());
    }
    private function updateQuestion(SurveyQuestion $question, $data)
    {
        if (is_array($data['data'])) {  
            $data['data'] = json_encode($data['data']);
    }
    $validator = Validator::make($data, [
        'id' => 'exists:App\Models\SurveyQuestion,id',
        'question' => 'required|string|',
        'description' => 'nullable|string',
        'type' => ['required', new Enum(QuestionTypeEnum::class)],
        'data' => 'present',       
        
    ]);

    return $question->update($validator->validated());
    }


    public function getBySlug(Survey $survey)
    {
        if (!$survey->status) {
            return response("", 404);
        }

        $currentDate = new \DateTime();
        $expireDate = new \DateTime($survey->expire_date);
        if ($expireDate < $currentDate) {
            return response("", 404);
        }

        return new SurveyResource($survey);

    }

    public function StoreAnswer(StoreSurveyAnswerRequest $request, Survey $survey)
    {
        $validated = $request->validated();
        $surveyAnswer = SurveyAnswer::create([
            'survey_id' => $survey->id,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s'),
        ]);

        foreach ($validated['answers'] as $questionId=> $answer) {
            $question = SurveyQuestion::where(['id'=>$questionId, 'survey_id'=>$survey->id])->get();
            if (!$question) {
                return response("Invalid question ID: \"$questionId\"", 400);
        }
        $data = [
            'survey_question_id' => $questionId,
            'survey_answer_id' => $surveyAnswer->id,
            'answer' => is_array($answer) ? json_encode($answer) : $answer
        ];

        $questionAnswer = SurveyQuestionAnswer::create($data);
    }

        return response("", 201);
}
}



