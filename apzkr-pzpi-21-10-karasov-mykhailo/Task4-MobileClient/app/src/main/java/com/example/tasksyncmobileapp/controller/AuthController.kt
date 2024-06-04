package com.example.tasksyncmobileapp.controller

import com.example.tasksyncmobileapp.model.dto.AuthDto
import com.example.tasksyncmobileapp.model.dto.RegistrationDto
import com.example.tasksyncmobileapp.model.response.AuthRegistrationResponse
import com.example.tasksyncmobileapp.repository.AuthRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AuthController(private val authRepository: AuthRepository) {

    suspend fun registration(registrationDto: RegistrationDto): Result<AuthRegistrationResponse> {
        return withContext(Dispatchers.IO) {
            authRepository.registration(registrationDto)
        }
    }

    suspend fun auth(authDto: AuthDto): Result<AuthRegistrationResponse> {
        return withContext(Dispatchers.IO) {
            authRepository.authorization(authDto)
        }
    }

    suspend fun checkAuth(token: String): Result<AuthRegistrationResponse> {
        return withContext(Dispatchers.IO) {
            authRepository.checkAuth(token)
        }
    }


}