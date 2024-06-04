package com.example.tasksyncmobileapp.view.profile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.lifecycle.lifecycleScope
import com.example.tasksyncmobileapp.BuildConfig
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.controller.UserController
import com.example.tasksyncmobileapp.databinding.ActivityUserProfileBinding
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.UserRepository
import com.example.tasksyncmobileapp.util.classes.FileManager
import com.example.tasksyncmobileapp.util.classes.Jwt
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.util.functions.getEducations
import com.example.tasksyncmobileapp.view.HeaderFragment
import kotlinx.coroutines.launch
import retrofit2.Retrofit

class UserProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityUserProfileBinding
    private lateinit var profileActivityIntent: Intent
    private lateinit var userController: UserController
    private lateinit var tokenManager: TokenManager
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityUserProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        val retrofitClient = RetrofitClient()
        val userRepository = UserRepository(retrofitClient.apiService)
        userController = UserController(userRepository)

        setProgressBarVisible()
        profileActivityIntent = Intent(this, ProfileActivity::class.java)

        tokenManager = TokenManager(this)

        loadUserData()


        binding.apply {
            bUserProfileGoBack.setOnClickListener {
                startActivity(profileActivityIntent)
            }
        }
    }


    private fun setProgressBarVisible() {
        binding.apply {
            progressBar.visibility = View.VISIBLE

            tvUserProfileBirthday.visibility = View.INVISIBLE
            tvUserProfileEducations.visibility = View.INVISIBLE
            tvUserProfileEmail.visibility = View.INVISIBLE
            tvUserProfileName.visibility = View.INVISIBLE
            tvUserProfileSurname.visibility = View.INVISIBLE
            tvUserProfilePhoneNumber.visibility = View.INVISIBLE

            bUserProfileGoBack.visibility = View.INVISIBLE
            bUserProfileGoToScannerHistory.visibility = View.INVISIBLE
        }
    }

    private fun setProgressBarInvisible() {
        binding.apply {
            progressBar.visibility = View.GONE

            tvUserProfileBirthday.visibility = View.VISIBLE
            tvUserProfileEducations.visibility = View.VISIBLE
            tvUserProfileEmail.visibility = View.VISIBLE
            tvUserProfileName.visibility = View.VISIBLE
            tvUserProfileSurname.visibility = View.VISIBLE
            tvUserProfilePhoneNumber.visibility = View.VISIBLE

            bUserProfileGoBack.visibility = View.VISIBLE
            bUserProfileGoToScannerHistory.visibility = View.VISIBLE
        }
    }

    private fun loadUserData() {
        val token = tokenManager.getToken()
        if (token != null) {
            lifecycleScope.launch {
                val jwt = Jwt()
                val userId = jwt.decodeJWT(token).id
                val result = userController.getUserById(userId, token)
                result.onSuccess { response ->
                    val user = response.user
                    val educations = response.educations

                    binding.apply {
                        val fileManager = FileManager()
                        fileManager.loadImage2ImageView(
                            BuildConfig.BASE_IMAGE_URL + user.userImage,
                            ivUserProfileUserImage,
                            400,
                            400
                        )
                        tvUserProfileEmail.text = "Email: ${user.email}"
                        tvUserProfileName.text = "Ім\'я: ${user.firstName}"
                        tvUserProfileSurname.text = "Прізвище: ${user.secondName}"
                        tvUserProfileBirthday.text = "Дата народження: ${user.birthday}"
                        tvUserProfileEducations.text = "Освіти:\n ${getEducations(educations)}"
                        tvUserProfilePhoneNumber.text = "Номер телефону: ${user.phoneNumber}"
                    }

                    setProgressBarInvisible()
                }
            }
        }
    }
}