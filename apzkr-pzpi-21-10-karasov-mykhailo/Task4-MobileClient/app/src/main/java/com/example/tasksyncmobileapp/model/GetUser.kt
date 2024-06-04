package com.example.tasksyncmobileapp.model

data class GetUser (
    val id: Int,
    val email: String,
    val firstName: String,
    val secondName: String,
    val userImage: String,
    val birthday: String,
    val phoneNumber: String,
    val companyId: Int,
    val password: String
)