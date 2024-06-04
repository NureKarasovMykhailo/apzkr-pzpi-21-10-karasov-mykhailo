package com.example.tasksyncmobileapp.controller

import com.example.tasksyncmobileapp.model.response.GetUserResponse
import com.example.tasksyncmobileapp.repository.UserRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserController (private val userRepository: UserRepository) {

    suspend fun getUserById(id: Int, token: String): Result<GetUserResponse> {
        return withContext(Dispatchers.IO) {
            userRepository.getUserById(id, "Bearer $token")
        }
    }

    suspend fun addRole(token: String, id: Int, roleTitle: String): Result<GetUserResponse> {
        return withContext(Dispatchers.IO) {
            userRepository.addUserRole("Bearer $token", id, roleTitle)
        }
    }

    suspend fun deleteRole(token: String, id: Int, roleTitle: String): Result<GetUserResponse> {
        return withContext(Dispatchers.IO) {
            userRepository.deleteUserRole("Bearer $token", id, roleTitle)
        }
    }
}