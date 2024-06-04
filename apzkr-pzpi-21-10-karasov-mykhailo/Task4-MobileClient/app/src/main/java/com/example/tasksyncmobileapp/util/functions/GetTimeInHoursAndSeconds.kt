package com.example.tasksyncmobileapp.util.functions

fun getTimeInHoursAndMinutes(timeInSeconds: Int): String {
    val hours = timeInSeconds / 3600
    val minutes = (timeInSeconds % 3600) / 60

    return "$hours год. $minutes хв."
}
