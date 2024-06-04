package com.example.tasksyncmobileapp.util.functions

import android.os.Build
import androidx.annotation.RequiresApi
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@RequiresApi(Build.VERSION_CODES.O)
fun getAge(birthday: String): Int {
    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    val birthDate = LocalDate.parse(birthday, formatter)
    val currentDate = LocalDate.now()
    return ChronoUnit.YEARS.between(birthDate, currentDate).toInt()
}