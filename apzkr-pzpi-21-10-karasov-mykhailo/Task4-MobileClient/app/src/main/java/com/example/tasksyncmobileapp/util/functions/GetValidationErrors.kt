package com.example.tasksyncmobileapp.util.functions

fun getValidationErrors(errorMessage: String): String {
    val regex = Regex("[^,]+-(.*?)(?=(,|$))")
    val matches = regex.findAll(errorMessage)

    return matches.joinToString("\n") { it.groupValues[1].trim() }
}