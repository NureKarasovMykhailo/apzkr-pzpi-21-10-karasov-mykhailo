package com.example.tasksyncmobileapp.util.functions

import com.example.tasksyncmobileapp.model.Role

fun hasOtherUserRole(userRoles: List<Role>, requiredRoles: List<String>): Boolean {
    for (role in userRoles) {
        if (role.roleTitle in requiredRoles) {
            return true
        }
    }
    return false
}