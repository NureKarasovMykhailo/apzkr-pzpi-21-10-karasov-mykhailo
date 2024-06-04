package com.example.tasksyncmobileapp.controller

import com.example.tasksyncmobileapp.model.dto.AddDeleteEmployeeFromActivityDto
import com.example.tasksyncmobileapp.model.dto.CreateActivityDto
import com.example.tasksyncmobileapp.model.response.GetActivitiesResponse
import com.example.tasksyncmobileapp.model.response.GetActivityResponse
import com.example.tasksyncmobileapp.repository.ActivityRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ActivityController (private val activityRepository: ActivityRepository) {

    suspend fun getCompanyActivities(token: String, page: Int = 1, limit: Int = 8): Result<GetActivitiesResponse> {
        return withContext(Dispatchers.IO) {
            activityRepository.getActivities("Bearer $token", limit, page)
        }
    }

    suspend fun createActivity(token: String, createActivityDto: CreateActivityDto): Result<GetActivityResponse> {
        return withContext(Dispatchers.IO) {
            activityRepository.createActivity("Bearer $token", createActivityDto)
        }
    }

    suspend fun getActivityById(token: String, id: Int): Result<GetActivityResponse> {
        return withContext(Dispatchers.IO) {
            activityRepository.getActivityById("Bearer $token", id)
        }
    }

    suspend fun updateActivity(token: String, id: Int, createActivityDto: CreateActivityDto): Result<GetActivityResponse> {
        return withContext(Dispatchers.IO) {
            activityRepository.updateActivity("Bearer $token", id, createActivityDto)
        }
    }

    suspend fun deleteActivity(token: String, id: Int): Result<Unit> {
        return withContext(Dispatchers.IO) {
            activityRepository.deleteActivity("Bearer $token", id)
        }
    }

    suspend fun deleteEmployeeFromActivity (
        token: String,
        id: Int,
        addDeleteEmployeeFromActivityDto: AddDeleteEmployeeFromActivityDto
    ): Result<GetActivityResponse> {
        return withContext(Dispatchers.IO) {
            activityRepository.deleteEmployeeFromActivity(
                "Bearer $token",
                id,
                addDeleteEmployeeFromActivityDto
            )
        }
    }

}