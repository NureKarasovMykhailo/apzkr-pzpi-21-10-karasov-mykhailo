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
import com.example.tasksyncmobileapp.databinding.ActivityOneWorkerBinding
import com.example.tasksyncmobileapp.model.Role
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.UserRepository
import com.example.tasksyncmobileapp.repository.WorkerRepository
import com.example.tasksyncmobileapp.util.classes.FileManager
import com.example.tasksyncmobileapp.util.classes.Jwt
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.util.functions.getAge
import com.example.tasksyncmobileapp.util.functions.getEducations
import com.example.tasksyncmobileapp.util.functions.getErrorMessage
import com.example.tasksyncmobileapp.util.functions.getRolesString
import com.example.tasksyncmobileapp.util.functions.hasOtherUserRole
import com.example.tasksyncmobileapp.util.functions.hasUserRoles
import com.example.tasksyncmobileapp.view.HeaderFragment
import com.example.tasksyncmobileapp.view.activities.OneActivity
import kotlinx.coroutines.launch

class OneWorkerActivity : AppCompatActivity() {

    private lateinit var binding: ActivityOneWorkerBinding
    private lateinit var intentWorkers: Intent
    private lateinit var userController: UserController
    private lateinit var workerController: WorkerController
    private lateinit var tokenManager: TokenManager
    private lateinit var workerActivityIntent: Intent
    private lateinit var oneActivityIntent: Intent

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOneWorkerBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.bOneWorkerAddOrDeleteRole.visibility = View.INVISIBLE
        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        intentWorkers = Intent(this, WorkerActivity::class.java)
        tokenManager = TokenManager(binding.root.context)

        val workerId = intent.getIntExtra("WORKER_ID", -1)

        val retrofitClient = RetrofitClient()
        val userRepository = UserRepository(retrofitClient.apiService)
        userController = UserController(userRepository)

        val workerRepository = WorkerRepository(retrofitClient.apiService)
        val workerController = WorkerController(workerRepository)

        workerActivityIntent = Intent(this, WorkerActivity::class.java)


        binding.apply {
            bOneWorkerBack.setOnClickListener {
                startActivity(intentWorkers)
            }

            bOneWorkerDelete.setOnClickListener {
                val token = tokenManager.getToken()
                if (token != null) {
                    lifecycleScope.launch {
                        workerController.deleteUserFromCompany(token, workerId)
                        startActivity(workerActivityIntent)
                    }
                }
            }

            bOneWorkerSet2Activity.setOnClickListener {
                val token = tokenManager.getToken()
                if (token != null) {
                    lifecycleScope.launch {
                        val result = workerController.getActivityForOneEmployee(token, workerId)
                        result.onSuccess { response ->
                            oneActivityIntent = Intent(binding.root.context, OneActivity::class.java).apply {
                                putExtra("ACTIVITY_ID", response.activity.id)
                            }
                            startActivity(oneActivityIntent)
                        }.onFailure {throwable ->
                            tvOneWorkerError.visibility = View.VISIBLE
                            tvOneWorkerError.text = getErrorMessage(throwable)
                        }
                    }
                }
            }
        }

        setData(workerId)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun setData(id: Int) {

        binding.oneWorkerProgressBar.visibility = View.VISIBLE

        binding.apply {
            tvOneWorkerEmail.visibility = View.INVISIBLE
            tvOneWorkerAge.visibility = View.INVISIBLE
            tvOneWorkerBithday.visibility = View.INVISIBLE
            tvOneWorkerFirstName.visibility = View.INVISIBLE
            tvOneWorkerSurname.visibility = View.INVISIBLE
            tvOneWorkerPhone.visibility = View.INVISIBLE
            tvOneWorkerEducations.visibility = View.INVISIBLE
            tvOneWorkerRoles.visibility = View.INVISIBLE
            bOneWorkerSet2Activity.visibility = View.GONE


        }

        val token = tokenManager.getToken()
        if (token != null) {
            lifecycleScope.launch {
                val result = userController.getUserById(id, token)
                result.onSuccess {response ->
                    val user = response.user
                    val roles = response.role
                    val educations = response.educations
                    val fileManager = FileManager()
                    fileManager.loadImage2ImageView(
                        BuildConfig.BASE_IMAGE_URL + user.userImage,
                        binding.ivOneWorkerImage,
                        400,
                        400
                    )
                    binding.apply {
                        tvOneWorkerEmail.text = "Email адреса: ${user.email}"
                        tvOneWorkerAge.text = "Вік: ${getAge(user.birthday)}"
                        tvOneWorkerBithday.text = "День народження: ${user.birthday}"
                        tvOneWorkerFirstName.text = "Ім\'я: ${user.firstName}"
                        tvOneWorkerSurname.text = "Прізивще: ${user.secondName}"
                        tvOneWorkerEducations.text = "Освіти:\n ${getEducations(educations)}"
                        tvOneWorkerRoles.text = "Ролі:\n ${getRolesString(roles)}"


                        oneWorkerProgressBar.visibility = View.GONE

                        tvOneWorkerEmail.visibility = View.VISIBLE
                        tvOneWorkerAge.visibility = View.VISIBLE
                        tvOneWorkerBithday.visibility = View.VISIBLE
                        tvOneWorkerFirstName.visibility = View.VISIBLE
                        tvOneWorkerSurname.visibility = View.VISIBLE
                        tvOneWorkerEducations.visibility = View.VISIBLE
                        if (user.phoneNumber.isNotEmpty()) {
                            tvOneWorkerPhone.text = "Номер телефону: ${user.phoneNumber}"
                        } else {
                            tvOneWorkerPhone.visibility = View.GONE
                        }
                        tvOneWorkerEducations.visibility = View.VISIBLE
                        tvOneWorkerRoles.visibility = View.VISIBLE

                        setRoleButton(roles, id)
                    }
                }
            }
        }

    }


    @RequiresApi(Build.VERSION_CODES.O)
    private fun setRoleButton(roles: List<Role>, workerId: Int) {
        val token = tokenManager.getToken()
        if (token != null) {
            val jwt = Jwt()
            val user = jwt.decodeJWT(token)

            if (hasUserRoles(listOf("COMPANY_ADMIN", "SUBSCRIBER"), token)) {
                binding.bOneWorkerAddOrDeleteRole.visibility = View.VISIBLE
                binding.bOneWorkerSet2Activity.visibility = View.VISIBLE
                if (hasOtherUserRole(roles, listOf("COMPANY-ADMIN"))) {
                    binding.bOneWorkerAddOrDeleteRole.text = "Видалити роль адміна компанії"
                    binding.bOneWorkerAddOrDeleteRole.setOnClickListener {
                        lifecycleScope.launch {
                            userController.deleteRole(token, workerId, "COMPANY-ADMIN")
                            setData(workerId)
                        }
                    }
                } else {
                    binding.bOneWorkerAddOrDeleteRole.text = "Додати роль адміна компанії"
                    binding.bOneWorkerAddOrDeleteRole.setOnClickListener {
                        lifecycleScope.launch {
                            userController.addRole(token, workerId, "COMPANY-ADMIN")
                            setData(workerId)
                        }
                    }
                }
            } else {
                binding.bOneWorkerAddOrDeleteRole.visibility = View.GONE
                binding.bOneWorkerSet2Activity.visibility = View.GONE
            }
        }
    }
}