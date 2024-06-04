package com.example.tasksyncmobileapp.model.response

import com.example.tasksyncmobileapp.model.Activity
import com.example.tasksyncmobileapp.model.Pagination

data class GetActivitiesResponse (
    val activities: List<Activity>,
    val pagination: Pagination
)