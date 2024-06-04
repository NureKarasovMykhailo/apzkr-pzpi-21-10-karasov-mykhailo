package com.example.tasksyncmobileapp.view.worker

import android.content.Intent
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.annotation.RequiresApi
import androidx.lifecycle.lifecycleScope
import com.example.tasksyncmobileapp.BuildConfig
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.controller.UserController
import com.example.tasksyncmobileapp.controller.WorkerController
import com.example.tasksyncmobileapp.databinding.ActivityAddWorkerBinding
import com.example.tasksyncmobileapp.model.Education
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.UserRepository
import com.example.tasksyncmobileapp.repository.WorkerRepository
import com.example.tasksyncmobileapp.util.classes.FileManager
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.util.functions.getAge
import com.example.tasksyncmobileapp.util.functions.getEducations
import com.example.tasksyncmobileapp.view.HeaderFragment
import kotlinx.coroutines.launch

class AddWorkerActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAddWorkerBinding
    private lateinit var userController: UserController
    private lateinit var workerController: WorkerController
    private lateinit var tokenManager: TokenManager
    private lateinit var addWorkersIntent: Intent
    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddWorkerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        val workerId = intent.getIntExtra("WORKER_ID", -1)

        val retrofitClient = RetrofitClient()
        val userRepository = UserRepository(retrofitClient.apiService)
        userController = UserController(userRepository)

        val workerRepository = WorkerRepository(retrofitClient.apiService)
        workerController = WorkerController(workerRepository)

        tokenManager = TokenManager(binding.root.context)

        setData(workerId)


        addWorkersIntent = Intent(this, AddWorkersActivity::class.java)

        binding.apply {
            bAddWorkerBack.setOnClickListener {
                startActivity(addWorkersIntent)
            }

            bAddWorkerAdd.setOnClickListener {
                addWorker2Company(workerId)
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun setData(id: Int) {
        binding.addWorkerProgressBar.visibility = View.VISIBLE

        binding.apply {
            tvAddWorkerEmail.visibility = View.INVISIBLE
            tvAddWorkerAge.visibility = View.INVISIBLE
            tvAddWorkerBithday.visibility = View.INVISIBLE
            tvAddWorkerFirstName.visibility = View.INVISIBLE
            tvAddWorkerSurname.visibility = View.INVISIBLE
            tvAddWorkerPhone.visibility = View.INVISIBLE
            tvAddWorkerEducations.visibility = View.INVISIBLE

        }

        val token = tokenManager.getToken()
        if (token != null) {
            lifecycleScope.launch {
                val response = userController.getUserById(id, token)
                response.onSuccess { response ->
                    val user = response.user
                    val educations = response.educations
                    val fileManager = FileManager()
                    fileManager.loadImage2ImageView(
                        BuildConfig.BASE_IMAGE_URL + user.userImage,
                        binding.ivAddWorkerImage,
                        400,
                        400
                    )
                    binding.apply {
                        tvAddWorkerEmail.text = "Email адреса: ${user.email}"
                        tvAddWorkerAge.text = "Вік: ${getAge(user.birthday)}"
                        tvAddWorkerBithday.text = "День народження: ${user.birthday}"
                        tvAddWorkerFirstName.text = "Ім\'я: ${user.firstName}"
                        tvAddWorkerSurname.text = "Прізивще: ${user.secondName}"
                        tvAddWorkerEducations.text = "Освіти:\n ${getEducations(educations)}"


                        addWorkerProgressBar.visibility = View.GONE

                        tvAddWorkerEmail.visibility = View.VISIBLE
                        tvAddWorkerAge.visibility = View.VISIBLE
                        tvAddWorkerBithday.visibility = View.VISIBLE
                        tvAddWorkerFirstName.visibility = View.VISIBLE
                        tvAddWorkerSurname.visibility = View.VISIBLE
                        tvAddWorkerEducations.visibility = View.VISIBLE
                        if (user.phoneNumber.isNotEmpty()) {
                            tvAddWorkerPhone.text = "Номер телефону: ${user.phoneNumber}"
                        } else {
                            tvAddWorkerPhone.visibility = View.GONE
                        }
                        tvAddWorkerEducations.visibility = View.VISIBLE
                    }
                }
            }
        }
    }

    private fun addWorker2Company(id: Int) {
        val token = tokenManager.getToken()
        if (token != null) {
            lifecycleScope.launch {
                val response = workerController.addUser2Company(token, id)
                response.onSuccess {
                    startActivity(addWorkersIntent)
                }
            }
        }
    }
}