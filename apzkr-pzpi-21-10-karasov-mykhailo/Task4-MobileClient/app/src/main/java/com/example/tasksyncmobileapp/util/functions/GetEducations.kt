package com.example.tasksyncmobileapp.util.functions

import com.example.tasksyncmobileapp.model.Education

 fun getEducations(educations: List<Education>): String {
    var res = StringBuilder()
    for (education in educations) {
        res.append("${education.educationTitle}\n")
    }
    if (res.toString().isEmpty()) {
        return "Освіти відстутні"
    }
    return res.toString()
}