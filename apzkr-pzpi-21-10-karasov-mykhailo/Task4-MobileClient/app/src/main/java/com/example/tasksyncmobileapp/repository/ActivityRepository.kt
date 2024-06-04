package com.example.tasksyncmobileapp.repository

import com.example.tasksyncmobileapp.model.dto.AddDeleteEmployeeFromActivityDto
import com.example.tasksyncmobileapp.model.dto.CreateActivityDto
import com.example.tasksyncmobileapp.model.response.GetActivitiesResponse
import com.example.tasksyncmobileapp.model.response.GetActivityResponse
import com.example.tasksyncmobileapp.network.IApiService

class ActivityRepository (private val apiService: IApiService) {

    suspend fun getActivities(token: String, limit: Int, page: Int): Result<GetActivitiesResponse> {
        return try {
            val response = apiService.getCompanyActivities(token, limit, page)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createActivity(token: String, createActivityDto: CreateActivityDto): Result<GetActivityResponse> {
        return try {
            val response = apiService.createActivity(token, createActivityDto)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getActivityById(token: String, id: Int): Result<GetActivityResponse> {
        return try {
            val response = apiService.getActivityById(token, id)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateActivity(token: String, id: Int, createActivityDto: CreateActivityDto): Result<GetActivityResponse> {
        return try {
            val response = apiService.updateActivityById(token, id, createActivityDto)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteActivity(token: String, id: Int): Result<Unit> {
        return try {
            val response = apiService.deleteActivityById(token, id)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteEmployeeFromActivity(
        token: String,
        id: Int,
        addDeleteEmployeeFromActivityDto: AddDeleteEmployeeFromActivityDto): Result<GetActivityResponse> {
        return try {
            val response = apiService.deleteEmployeeFromActivity(token, id, addDeleteEmployeeFromActivityDto)
            return Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

}