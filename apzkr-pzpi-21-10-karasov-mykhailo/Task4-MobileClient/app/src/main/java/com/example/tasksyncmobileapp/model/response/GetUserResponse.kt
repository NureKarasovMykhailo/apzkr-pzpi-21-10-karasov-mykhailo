package com.example.tasksyncmobileapp.model.response

import com.example.tasksyncmobileapp.model.Education
import com.example.tasksyncmobileapp.model.GetUser
import com.example.tasksyncmobileapp.model.Role

data class GetUserResponse (
    val user: GetUser,
    val role: List<Role>,
    val educations: List<Education>
)