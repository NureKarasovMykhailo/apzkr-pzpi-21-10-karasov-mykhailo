package com.example.tasksyncmobileapp.model.response

import com.example.tasksyncmobileapp.model.Complexity
import com.example.tasksyncmobileapp.model.Pagination

data class GetComplexitiesResponse(
    val complexities: List<Complexity>,
    val pagination: Pagination
)
