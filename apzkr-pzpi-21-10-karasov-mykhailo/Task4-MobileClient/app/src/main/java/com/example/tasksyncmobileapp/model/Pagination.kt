package com.example.tasksyncmobileapp.model

data class Pagination(
    val totalItems: Int,
    val totalPages: Int,
    val currentPage: String,
    val itemsPerPage: String
)
