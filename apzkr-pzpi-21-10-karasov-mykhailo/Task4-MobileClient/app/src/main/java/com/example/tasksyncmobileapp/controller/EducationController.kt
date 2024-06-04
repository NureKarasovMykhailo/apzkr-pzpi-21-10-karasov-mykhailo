package com.example.tasksyncmobileapp.controller

import com.example.tasksyncmobileapp.model.response.GetComplexitiesResponse
import com.example.tasksyncmobileapp.model.response.GetEducationsResponse
import com.example.tasksyncmobileapp.repository.EducationRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class EducationController (private val educationRepository: EducationRepository) {

    suspend fun getEducations (token: String, limit: Int = 10, page: Int = 1): Result<GetEducationsResponse> {
        return withContext(Dispatchers.IO) {
            educationRepository.getEducations("Bearer $token", limit, page)
        }
    }


}