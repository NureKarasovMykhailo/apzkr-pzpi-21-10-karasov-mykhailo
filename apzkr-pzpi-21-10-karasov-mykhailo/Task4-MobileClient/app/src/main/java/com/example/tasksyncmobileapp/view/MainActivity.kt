package com.example.tasksyncmobileapp.view

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.lifecycleScope
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.controller.AuthController
import com.example.tasksyncmobileapp.databinding.ActivityMainBinding
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.AuthRepository
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.view.auth.LoginActivity
import com.example.tasksyncmobileapp.view.profile.ProfileActivity
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var tokenManager: TokenManager
    private lateinit var authController: AuthController


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val retrofitClient = RetrofitClient()
        val authRepository = AuthRepository(retrofitClient.apiService)
        authController = AuthController(authRepository)

        tokenManager = TokenManager(binding.root.context)


        checkAuth()


    }

    private fun checkAuth() {
        val token = tokenManager.getToken()
        if (token != null) {
            lifecycleScope.launch {
                val result = authController.checkAuth(token)
                result.onSuccess { authResponse ->
                    tokenManager.saveToken(authResponse.token)
                    navigateToProfile()
                }.onFailure {
                    tokenManager.clearToken()
                    navigateToLogin()
                }
            }
        } else {
            navigateToLogin()
        }
    }

    private fun navigateToProfile() {
        val profileIntent = Intent(this, ProfileActivity::class.java)
        startActivity(profileIntent)
        finish() // Закрыть MainActivity после перехода на ProfileActivity
    }

    private fun navigateToLogin() {
        val loginIntent = Intent(this, LoginActivity::class.java)
        startActivity(loginIntent)
        finish() // Закрыть MainActivity после перехода на LoginActivity
    }

}