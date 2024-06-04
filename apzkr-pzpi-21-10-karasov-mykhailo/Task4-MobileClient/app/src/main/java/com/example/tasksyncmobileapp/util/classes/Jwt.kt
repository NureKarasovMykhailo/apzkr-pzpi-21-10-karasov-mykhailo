package com.example.tasksyncmobileapp.util.classes
import com.auth0.jwt.JWT
import com.auth0.jwt.interfaces.DecodedJWT
import com.example.tasksyncmobileapp.model.Role
import com.example.tasksyncmobileapp.model.User
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken


class Jwt {
    fun decodeJWT(token: String): User {
        val jwt: DecodedJWT = JWT.decode(token)

        val id = jwt.claims["id"]?.asInt() ?: throw RuntimeException("Missing 'id' claim in JWT")
        val email = jwt.claims["email"]?.asString() ?: throw RuntimeException("Missing 'email' claim in JWT")
        val firstName = jwt.claims["firstName"]?.asString() ?: throw RuntimeException("Missing 'firstName' claim in JWT")
        val secondName = jwt.claims["secondName"]?.asString() ?: throw RuntimeException("Missing 'secondName' claim in JWT")
        val userImage = jwt.claims["userImage"]?.asString() ?: throw RuntimeException("Missing 'userImage' claim in JWT")
        val birthday = jwt.claims["birthday"]?.asString() ?: throw RuntimeException("Missing 'birthday' claim in JWT")
        val phoneNumber = jwt.claims["phoneNumber"]?.asString() ?: ""
        val companyId = jwt.claims["companyId"]?.asInt() ?: -1

        val rolesJson = jwt.claims["roles"].toString()
        println(rolesJson)
        val gson = Gson()

        val type = object : TypeToken<List<Role>>() {}.type

        val roles: List<Role> = gson.fromJson(rolesJson, type)


        return User(id, email, firstName, secondName, userImage, birthday, phoneNumber, companyId, roles)
    }

}

