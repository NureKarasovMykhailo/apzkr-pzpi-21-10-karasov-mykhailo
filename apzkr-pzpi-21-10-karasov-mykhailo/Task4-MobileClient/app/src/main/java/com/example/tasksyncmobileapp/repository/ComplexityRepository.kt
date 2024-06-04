package com.example.tasksyncmobileapp.repository

import com.example.tasksyncmobileapp.model.response.GetComplexitiesResponse
import com.example.tasksyncmobileapp.network.IApiService

class ComplexityRepository (private val apiService: IApiService) {

    suspend fun getComplexities(token: String, limit: Int, page: Int): Result<GetComplexitiesResponse> {
        return try {
            val response = apiService.getComplexities(token, limit, page)
            return Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}