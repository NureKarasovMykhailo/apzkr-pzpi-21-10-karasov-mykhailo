package com.example.tasksyncmobileapp.controller

import com.example.tasksyncmobileapp.model.GetUser
import com.example.tasksyncmobileapp.model.response.GetActivityResponse
import com.example.tasksyncmobileapp.model.response.GetCompanyWorkerResponse
import com.example.tasksyncmobileapp.model.response.GetUserResponse
import com.example.tasksyncmobileapp.repository.WorkerRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class WorkerController(private val workerRepository: WorkerRepository) {

    suspend fun getCompanyWorkers (token: String, limit: Int = 8, page: Int = 1): Result<GetCompanyWorkerResponse> {
        return withContext(Dispatchers.IO) {
            workerRepository.getCompanyWorker("Bearer $token", page, limit)
        }
    }

    suspend fun getUsersWithoutCompany(token: String, limit: Int = 8, page: Int = 1): Result<GetCompanyWorkerResponse> {
        return withContext(Dispatchers.IO) {
            workerRepository.getUsersWithoutCompany("Bearer $token", page, limit)
        }
    }

    suspend fun addUser2Company(token: String, id: Int): Result<GetUser> {
        return withContext(Dispatchers.IO) {
            workerRepository.addUser2Company("Bearer $token", id)
        }
    }

    suspend fun deleteUserFromCompany(token: String, id: Int): Result<Unit> {
        return withContext(Dispatchers.IO) {
            workerRepository.deleteUserFromCompany("Bearer $token", id)
        }
    }

    suspend fun getActivityForOneEmployee(token: String, id: Int): Result<GetActivityResponse> {
        return withContext(Dispatchers.IO) {
            workerRepository.getActivityForEmployee("Bearer $token", id)
        }
    }

}