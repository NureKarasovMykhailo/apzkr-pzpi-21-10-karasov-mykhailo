package com.example.tasksyncmobileapp.util.classes

import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class Date {

    fun formatDateToString(date: Date): String {
        return SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH).format(date)
    }

    fun stringToDate(dateString: String): Date? {
        return try {
            SimpleDateFormat("dd.MM.yyyy", Locale.getDefault()).parse(dateString)
        } catch (e: ParseException) {
            e.printStackTrace()
            null
        }
    }



}

