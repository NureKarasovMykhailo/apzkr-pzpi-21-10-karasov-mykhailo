package com.example.tasksyncmobileapp.model.dto

data class CreateActivityDto(
    val activityTitle: String,
    val description: String,
    val requiredWorkerCount: Int,
    val timeShift: Int,
    val complexityId: Int,
    val educationId: Int
)
