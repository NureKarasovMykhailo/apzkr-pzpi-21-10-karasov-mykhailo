package com.example.tasksyncmobileapp.util.functions

import com.example.tasksyncmobileapp.util.classes.Jwt

fun hasUserRoles(roles: List<String>, token: String): Boolean {
    val jwt = Jwt()
    val user = jwt.decodeJWT(token)
    if (user != null) {
        for (role in user.roles) {
            if (roles.contains(role.roleTitle)) {
                return true
            }
        }
    }

    return false
}
