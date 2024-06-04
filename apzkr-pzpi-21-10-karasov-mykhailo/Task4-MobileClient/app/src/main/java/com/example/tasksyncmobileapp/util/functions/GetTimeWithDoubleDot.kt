package com.example.tasksyncmobileapp.util.functions

fun getTimeWithDoubleDot(timeInSeconds: Int): String {
    val hours = timeInSeconds / 3600
    val minutes = (timeInSeconds % 3600) / 60
    return "$hours:$minutes"
}