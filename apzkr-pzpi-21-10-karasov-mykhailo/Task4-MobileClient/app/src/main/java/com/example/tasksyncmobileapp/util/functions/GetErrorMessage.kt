package com.example.tasksyncmobileapp.util.functions

import com.example.tasksyncmobileapp.util.classes.JsonParser

fun getErrorMessage(throwable: Throwable): String? {
    val jsonParser = JsonParser()
    if (throwable is retrofit2.HttpException) {
        val errorJson = throwable.response()?.errorBody()?.string()
        val errorResponse = errorJson?.let { jsonParser.parseErrorResponse( it) }
        return errorResponse?.message ?: "Unknown error"
    } else {
        return throwable.message
    }
}