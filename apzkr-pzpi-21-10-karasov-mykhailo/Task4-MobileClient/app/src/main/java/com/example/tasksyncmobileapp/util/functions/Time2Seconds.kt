package com.example.tasksyncmobileapp.util.functions

import java.lang.IllegalArgumentException

fun timeToSeconds(time: String): Int {
    val regex = """^(\d{1,2}):(\d{1,2})$""".toRegex()
    val matchResult = regex.matchEntire(time)

    if (matchResult != null) {
        val (hours, minutes) = matchResult.destructured
        val hoursInt = hours.toInt()
        val minutesInt = minutes.toInt()

        if (hoursInt in 0..23 && minutesInt in 0..59) {
            return hoursInt * 3600 + minutesInt * 60
        } else {
            throw IllegalArgumentException("Невірний формат часу: година повина бути між 0-23 а хвилини мають бути між 0-59.")
        }
    } else {
        throw IllegalArgumentException("Невірний формат часу: має бути 'HH:mm'.")
    }
}
