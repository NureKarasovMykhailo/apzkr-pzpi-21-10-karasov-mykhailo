package com.example.tasksyncmobileapp.util.functions

import com.example.tasksyncmobileapp.model.Role

fun getRolesString(roles: List<Role>): String {
    val res = StringBuilder()

    for (role in roles) {
        when (role.roleTitle) {
            "USER" -> res.append("Звичайний робітник\n")
            "SUBSCRIBER" -> res.append("Підписник\n")
            "COMPANY-ADMIN" -> res.append("Адміністратор компанії\n")
            else -> res.append("${role.roleTitle}\n")
        }
    }
    if (res.toString().isEmpty()) {
        return "Ролі відстутні"
    }
    return res.toString()

}