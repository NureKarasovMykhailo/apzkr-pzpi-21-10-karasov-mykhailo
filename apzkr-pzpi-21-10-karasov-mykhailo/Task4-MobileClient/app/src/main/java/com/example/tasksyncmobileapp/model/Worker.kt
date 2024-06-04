package com.example.tasksyncmobileapp.model

data class Worker (
    val id: Int,
    val email: String,
    val firstName: String,
    val secondName: String,
    val userImage: String,
    val birthday: String,
    val phoneNumber: String,
    val companyId: Int,
    val roles: List<Role>,
    val educations: List<Education>
)