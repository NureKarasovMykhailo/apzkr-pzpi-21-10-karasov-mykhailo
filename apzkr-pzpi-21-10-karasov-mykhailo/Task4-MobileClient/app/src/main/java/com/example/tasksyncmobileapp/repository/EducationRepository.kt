package com.example.tasksyncmobileapp.repository

import com.example.tasksyncmobileapp.model.response.GetEducationsResponse
import com.example.tasksyncmobileapp.network.IApiService

class EducationRepository (val apiService: IApiService) {

    suspend fun getEducations(token: String, limit: Int, page: Int): Result<GetEducationsResponse> {
        return try {
            val response = apiService.getEducations(token, limit, page)
            return Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

}