package com.example.tasksyncmobileapp.view.auth

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.lifecycle.lifecycleScope
import com.example.tasksyncmobileapp.controller.AuthController
import com.example.tasksyncmobileapp.databinding.ActivityLoginBinding
import com.example.tasksyncmobileapp.model.dto.AuthDto
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.AuthRepository
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.util.functions.getErrorMessage
import com.example.tasksyncmobileapp.view.profile.ProfileActivity
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var authController: AuthController
    private lateinit var profileIntent: Intent
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        profileIntent = Intent(this, ProfileActivity::class.java)
        val registrationIntent = Intent(this, RegistrationActivity::class.java)
        val retrofit = RetrofitClient()
        val authRepository = AuthRepository(retrofit.apiService)
        authController = AuthController(authRepository)

        binding.apply {
            bAuthorize.setOnClickListener {
                login()
            }
            tvAuthGoToRegistration.setOnClickListener {
                startActivity(registrationIntent)
            }
        }

    }

    private fun login () {
        binding.apply {
            val email = editTextTextEmailAddress.text.toString()
            val password = editTextTextPassword.text.toString()

            val authDto = AuthDto(email, password)

            lifecycleScope.launch {
                val result = authController.auth(authDto)
                result.onSuccess {authResponse ->
                    val tokenManager = TokenManager(root.context)
                    tokenManager.saveToken(authResponse.token)
                    startActivity(profileIntent)
                }.onFailure { throwable ->
                    tvAuthrError.visibility = View.VISIBLE
                    tvAuthrError.text = getErrorMessage(throwable)
                }
            }
        }
    }
}