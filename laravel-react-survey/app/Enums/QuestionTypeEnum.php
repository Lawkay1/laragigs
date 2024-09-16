<?php

namespace App\Enums;

enum QuestionTypeEnum: string
{
    case Text = 'text';
    case Select = 'select';
    case Checkbox = 'checkbox';
    case Radio = 'radio';
    case Textarea = 'textarea';

}