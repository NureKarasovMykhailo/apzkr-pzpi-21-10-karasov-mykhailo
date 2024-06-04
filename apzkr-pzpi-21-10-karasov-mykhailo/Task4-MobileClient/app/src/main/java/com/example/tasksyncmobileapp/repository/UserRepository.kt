package com.example.tasksyncmobileapp.repository

import com.example.tasksyncmobileapp.model.dto.AddDeleteRoleDto
import com.example.tasksyncmobileapp.model.response.GetUserResponse
import com.example.tasksyncmobileapp.network.IApiService

class UserRepository (private val apiService: IApiService) {

    suspend fun getUserById(id: Int, token: String): Result<GetUserResponse> {
        return try {
            val response = apiService.getUserById(token, id)
            Result.success(response)

        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun addUserRole(token: String, id: Int, roleTitle: String): Result<GetUserResponse> {
        return try {
            val addDeleteRoleDto = AddDeleteRoleDto(roleTitle)
            val response = apiService.addRole(token, addDeleteRoleDto, id)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteUserRole(token: String, id: Int, roleTitle: String): Result<GetUserResponse> {
        return try {
            val addDeleteRoleDto = AddDeleteRoleDto(roleTitle)
            val response = apiService.deleteRole(token, addDeleteRoleDto, id)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }



}