package com.example.tasksyncmobileapp.network

import com.example.tasksyncmobileapp.model.Company
import com.example.tasksyncmobileapp.model.GetUser
import com.example.tasksyncmobileapp.model.dto.AddDeleteEmployeeFromActivityDto
import com.example.tasksyncmobileapp.model.dto.AddDeleteRoleDto
import com.example.tasksyncmobileapp.model.dto.AuthDto
import com.example.tasksyncmobileapp.model.dto.CreateActivityDto
import com.example.tasksyncmobileapp.model.dto.RegistrationDto
import com.example.tasksyncmobileapp.model.response.AuthRegistrationResponse
import com.example.tasksyncmobileapp.model.response.CompanyResponse
import com.example.tasksyncmobileapp.model.response.GetActivitiesResponse
import com.example.tasksyncmobileapp.model.response.GetActivityResponse
import com.example.tasksyncmobileapp.model.response.GetCompanyWorkerResponse
import com.example.tasksyncmobileapp.model.response.GetComplexitiesResponse
import com.example.tasksyncmobileapp.model.response.GetEducationsResponse
import com.example.tasksyncmobileapp.model.response.GetUserResponse
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface IApiService {
    @POST("auth/login")
    suspend fun login(@Body authDto: AuthDto): AuthRegistrationResponse

    @POST("auth/registration")
    suspend fun registration(@Body registrationDto: RegistrationDto): AuthRegistrationResponse

    @GET("auth/check-auth")
    suspend fun checkAuth(@Header("Authorization") token: String): AuthRegistrationResponse

    @GET("public-company/")
    suspend fun getCompany(@Header("Authorization") token: String): CompanyResponse

    @GET("public-company/employees")
    suspend fun getWorkers(
        @Header("Authorization") token: String,
        @Query("limit") limit: Int,
        @Query("page") page: Int
    ): GetCompanyWorkerResponse

    @GET("public-company/users/without-company")
    suspend fun getUsersWithoutCompany(
        @Header("Authorization") token: String,
        @Query("limit") limit: Int,
        @Query("page") page: Int
    ): GetCompanyWorkerResponse

    @GET("admin-user/{id}")
    suspend fun getUserById(@Header("Authorization") token: String, @Path("id") id: Int): GetUserResponse

    @POST("public-company/add-employee/{id}")
    suspend fun addUser2Company(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): GetUser

    @PATCH("admin-user/add-role/{id}")
    suspend fun addRole(
        @Header("Authorization") token: String,
        @Body addDeleteRoleDto: AddDeleteRoleDto,
        @Path("id") id: Int
    ): GetUserResponse

    @PATCH("admin-user/delete-role/{id}")
    suspend fun deleteRole(
        @Header("Authorization") token: String,
        @Body addDeleteRoleDto: AddDeleteRoleDto,
        @Path("id") id: Int
    ): GetUserResponse

    @DELETE("public-company/delete-employee/{id}")
    suspend fun deleteUserFromCompany(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    )

    @GET("activity/")
    suspend fun getCompanyActivities(
        @Header("Authorization") token: String,
        @Query("limit") limit: Int,
        @Query("page") page: Int
    ): GetActivitiesResponse

    @GET("complexity/")
    suspend fun getComplexities(
        @Header("Authorization") token: String,
        @Query("limit") limit: Int,
        @Query("page") page: Int
    ): GetComplexitiesResponse

    @GET("education/")
    suspend fun getEducations(
        @Header("Authorization") token: String,
        @Query("limit") limit: Int,
        @Query("page") page: Int
    ): GetEducationsResponse

    @POST("activity/")
    suspend fun createActivity(
        @Header("Authorization") token: String,
        @Body createActivityDto: CreateActivityDto
    ): GetActivityResponse

    @GET("activity/{id}")
    suspend fun getActivityById(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): GetActivityResponse

    @PUT("activity/{id}")
    suspend fun updateActivityById(
        @Header("Authorization") token: String,
        @Path("id") id: Int,
        @Body createActivityDto: CreateActivityDto
    ): GetActivityResponse

    @DELETE("activity/{id}")
    suspend fun deleteActivityById(@Header("Authorization") token: String, @Path("id") id: Int)

    @POST("activity/delete-employee/{id}")
    suspend fun deleteEmployeeFromActivity(
        @Header("Authorization") token: String,
        @Path("id") id: Int,
        @Body addDeleteEmployeeFromActivityDto: AddDeleteEmployeeFromActivityDto
    ): GetActivityResponse

    @GET("timetable/{id}")
    suspend fun getTimetableForOneEmployee(@Header("Authorization") token: String, @Path("id") id: Int): GetActivityResponse

}