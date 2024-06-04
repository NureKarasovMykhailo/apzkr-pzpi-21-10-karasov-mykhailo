package com.example.tasksyncmobileapp.view.auth

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.lifecycle.lifecycleScope
import com.example.tasksyncmobileapp.controller.AuthController
import com.example.tasksyncmobileapp.databinding.ActivityRegistrationBinding
import com.example.tasksyncmobileapp.model.dto.RegistrationDto
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.AuthRepository
import com.example.tasksyncmobileapp.util.classes.Date
import com.example.tasksyncmobileapp.util.functions.getErrorMessage
import com.example.tasksyncmobileapp.util.functions.getValidationErrors
import kotlinx.coroutines.launch

class RegistrationActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegistrationBinding
    private lateinit var authController: AuthController
    private lateinit var intent: Intent
    private lateinit var loginIntent: Intent
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegistrationBinding.inflate(layoutInflater)
        setContentView(binding.root)
        loginIntent = Intent(this, LoginActivity::class.java)

        val retrofitClient = RetrofitClient()
        val authRepository = AuthRepository(retrofitClient.apiService)
        authController = AuthController(authRepository)

        binding.apply {
            bRegistration.setOnClickListener {
                registration()
            }

            tvRegistrationGoToLogin.setOnClickListener {
                startActivity(loginIntent)

            }
        }
    }

    private fun registration() {
        binding.apply {
            val date = Date()

            val email = etRegistrationEmail.text.toString()
            val password = etRegistrationPassword.text.toString()
            val passwordConfirm = etRegistrationPasswordConfirm.text.toString()
            val birthday = date.stringToDate(etRegistrationBirthday.text.toString())
            val formattedBirthday = birthday?.let { date.formatDateToString(it) }

            val firstName = etRegistrationFirstName.text.toString()
            val surname = etRegistrationSurname.text.toString()
            val phoneNumber = etRegistrationPhone.text.toString()

           if (formattedBirthday != null) {
               val registrationDto = RegistrationDto(
                   email,
                   password,
                   passwordConfirm,
                   firstName,
                   surname,
                   formattedBirthday,
                   phoneNumber
               )

               lifecycleScope.launch {
                   val result = authController.registration(registrationDto)
                   result.onSuccess {
                       startActivity(intent)
                   }.onFailure { throwable ->
                       tvRegistrationError.visibility = View.VISIBLE
                       val errorMessage = getErrorMessage(throwable)
                       if (errorMessage == null) {
                           tvRegistrationError.text = "Unknown error";
                       } else {
                           tvRegistrationError.text = getValidationErrors(errorMessage)
                       }
                   }

               }
           }
        }
    }


}