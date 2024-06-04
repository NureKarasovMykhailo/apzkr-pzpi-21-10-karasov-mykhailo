package com.example.tasksyncmobileapp.util.classes

import com.example.tasksyncmobileapp.model.response.ErrorResponse
import com.google.gson.Gson

class JsonParser {

    fun parseErrorResponse(json: String): ErrorResponse? {
        return try {
            Gson().fromJson(json, ErrorResponse::class.java)
        } catch (e: Exception) {
            null
        }
    }

}