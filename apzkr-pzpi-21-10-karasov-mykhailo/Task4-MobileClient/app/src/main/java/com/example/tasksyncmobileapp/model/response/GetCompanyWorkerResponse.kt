package com.example.tasksyncmobileapp.model.response

import com.example.tasksyncmobileapp.model.Pagination
import com.example.tasksyncmobileapp.model.Worker

data class GetCompanyWorkerResponse(
    val users: List<Worker>,
    val pagination: Pagination
)
