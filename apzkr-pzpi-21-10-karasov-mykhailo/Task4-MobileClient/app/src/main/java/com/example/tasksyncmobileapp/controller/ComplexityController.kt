package com.example.tasksyncmobileapp.controller

import com.example.tasksyncmobileapp.model.response.GetComplexitiesResponse
import com.example.tasksyncmobileapp.repository.ComplexityRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ComplexityController (private var complexityRepository: ComplexityRepository) {

    suspend fun getComplexities (token: String, limit: Int = 10, page: Int = 1): Result<GetComplexitiesResponse> {
        return withContext(Dispatchers.IO) {
            complexityRepository.getComplexities("Bearer $token", limit, page)
        }
    }

}