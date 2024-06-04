package com.example.tasksyncmobileapp.model.dto

import android.text.Editable
import java.util.Date

data class RegistrationDto(
    val email: String,
    val password: String,
    val passwordConfirm: String,
    val firstName: String,
    val secondName: String,
    val birthday: String,
    val phoneNumber: String
)
