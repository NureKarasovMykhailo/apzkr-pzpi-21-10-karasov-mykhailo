package com.example.tasksyncmobileapp.model.response

import com.example.tasksyncmobileapp.model.Education
import com.example.tasksyncmobileapp.model.Pagination

data class GetEducationsResponse(
    val educations: List<Education>,
    val pagination: Pagination
)
