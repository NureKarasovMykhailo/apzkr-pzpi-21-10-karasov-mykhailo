package com.example.tasksyncmobileapp.repository

import com.example.tasksyncmobileapp.model.dto.AuthDto
import com.example.tasksyncmobileapp.model.dto.RegistrationDto
import com.example.tasksyncmobileapp.model.response.AuthRegistrationResponse
import com.example.tasksyncmobileapp.network.IApiService
import com.example.tasksyncmobileapp.network.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AuthRepository(private val apiService: IApiService) {

    suspend fun registration(registrationDto: RegistrationDto): Result<AuthRegistrationResponse> {
        return try {
            val response = apiService.registration(registrationDto)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun authorization(authDto: AuthDto): Result<AuthRegistrationResponse> {
        return try {
            val response = apiService.login(authDto)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun checkAuth(token: String): Result<AuthRegistrationResponse> {
        return try {
            val response = apiService.checkAuth("Bearer $token")
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }


}