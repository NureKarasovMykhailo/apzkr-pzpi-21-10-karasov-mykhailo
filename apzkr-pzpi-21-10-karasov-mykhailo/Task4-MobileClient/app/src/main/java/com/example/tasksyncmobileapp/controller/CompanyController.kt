package com.example.tasksyncmobileapp.controller

import com.example.tasksyncmobileapp.model.Company
import com.example.tasksyncmobileapp.model.dto.RegistrationDto
import com.example.tasksyncmobileapp.model.response.AuthRegistrationResponse
import com.example.tasksyncmobileapp.model.response.CompanyResponse
import com.example.tasksyncmobileapp.repository.CompanyRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CompanyController(private val companyRepository: CompanyRepository) {

        suspend fun getCompany(token: String): Result<CompanyResponse> {
            return withContext(Dispatchers.IO) {
                companyRepository.getCompany("Bearer $token")
            }
        }

}