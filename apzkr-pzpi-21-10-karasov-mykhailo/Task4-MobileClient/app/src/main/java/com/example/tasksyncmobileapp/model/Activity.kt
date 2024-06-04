package com.example.tasksyncmobileapp.model

data class Activity(
    val id: Int,
    val activityTitle: String,
    val description: String,
    val requiredWorkerCount: Int,
    val timeShift: Int,
    val complexityId: Int,
    val educationId: Int,
    val companyId: Int,
    val complexity: Complexity,
    val education: Education,
    val company: Company,
    val users: List<User>
)
