package com.example.tasksyncmobileapp.repository

import com.example.tasksyncmobileapp.model.Company
import com.example.tasksyncmobileapp.model.response.CompanyResponse
import com.example.tasksyncmobileapp.network.IApiService

class CompanyRepository(private val apiService: IApiService) {

    suspend fun getCompany(token: String): Result<CompanyResponse> {
        return try {
            val response = apiService.getCompany(token)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

}