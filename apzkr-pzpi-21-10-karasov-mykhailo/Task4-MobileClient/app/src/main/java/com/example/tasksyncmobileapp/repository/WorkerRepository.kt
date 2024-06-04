package com.example.tasksyncmobileapp.repository

import com.example.tasksyncmobileapp.model.GetUser
import com.example.tasksyncmobileapp.model.response.GetActivityResponse
import com.example.tasksyncmobileapp.model.response.GetCompanyWorkerResponse
import com.example.tasksyncmobileapp.model.response.GetUserResponse
import com.example.tasksyncmobileapp.network.IApiService

class WorkerRepository(private val apiService: IApiService) {

    suspend fun getCompanyWorker(token: String, page: Int = 1, limit: Int = 8): Result<GetCompanyWorkerResponse> {
        return try {
            val response = apiService.getWorkers(token, limit, page)
            Result.success(response)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getUsersWithoutCompany(token: String, page: Int = 1, limit: Int = 8): Result<GetCompanyWorkerResponse> {
        return try {
            val response = apiService.getUsersWithoutCompany(token, limit, page)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun addUser2Company(token: String, id: Int): Result<GetUser> {
        return try {
            val response = apiService.addUser2Company(token, id)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteUserFromCompany(token: String, id: Int, ): Result<Unit> {
        return try {
            val response = apiService.deleteUserFromCompany(token, id)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getActivityForEmployee(token: String, id: Int): Result<GetActivityResponse> {
        return try {
            val response = apiService.getTimetableForOneEmployee(token, id)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

}