package com.example.tasksyncmobileapp.view.activities

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.controller.ActivityController
import com.example.tasksyncmobileapp.controller.ComplexityController
import com.example.tasksyncmobileapp.controller.EducationController
import com.example.tasksyncmobileapp.databinding.ActivityAddBinding
import com.example.tasksyncmobileapp.model.dto.CreateActivityDto
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.ActivityRepository
import com.example.tasksyncmobileapp.repository.ComplexityRepository
import com.example.tasksyncmobileapp.repository.EducationRepository
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.util.functions.getErrorMessage
import com.example.tasksyncmobileapp.util.functions.getValidationErrors
import com.example.tasksyncmobileapp.util.functions.timeToSeconds
import com.example.tasksyncmobileapp.view.HeaderFragment
import kotlinx.coroutines.launch

class AddActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAddBinding
    private lateinit var activitiesIntent: Intent
    private lateinit var complexityController: ComplexityController
    private lateinit var educationController: EducationController
    private lateinit var activityController: ActivityController
    private lateinit var tokenManager: TokenManager
    private var complexityId: Int = -1
    private var educationId: Int = -1
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityAddBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        val retrofitClient = RetrofitClient()
        val educationRepository = EducationRepository(retrofitClient.apiService)
        val complexityRepository = ComplexityRepository(retrofitClient.apiService)
        val activityRepository = ActivityRepository(retrofitClient.apiService)


        activitiesIntent = Intent(this, ActivitiesActivity::class.java)
        complexityController = ComplexityController(complexityRepository)
        educationController = EducationController(educationRepository)
        activityController = ActivityController(activityRepository)

        tokenManager = TokenManager(binding.root.context)

        setEducationSpinnerData(binding.root.context)
        setComplexitySpinnerData(binding.root.context)

        binding.apply {
            bAddActivityBack.setOnClickListener {
                startActivity(activitiesIntent)
            }

            bAddActivityAdd.setOnClickListener {
                addActivity()
            }
        }
    }

    private fun addActivity() {
        val activityTitle = binding.etAddAcitvityTitle.text.toString()
        val description = binding.etAddActivityDescription.text.toString()
        val requiredWorkerCount: Int = binding.etAddActivityRequiredWorkerCount.text.toString().toIntOrNull() ?: 0
        var timeShift = -1
        try {
            timeShift = timeToSeconds(binding.etAddActivityTimeShift.text.toString())
        } catch (e: Exception) {
            binding.tvAddActivityError.visibility = View.VISIBLE
            binding.tvAddActivityError.text = e.message.toString()
        }

        if (timeShift != -1 && complexityId != -1 && educationId != -1) {
            val createActivityDto = CreateActivityDto(
                activityTitle,
                description,
                requiredWorkerCount,
                timeShift,
                complexityId,
                educationId
            )
            val token = tokenManager.getToken()
            if (token != null) {
                lifecycleScope.launch {
                    val result = activityController.createActivity(token, createActivityDto)
                    result.onSuccess {
                        startActivity(activitiesIntent)
                    }.onFailure {throwable ->
                        binding.tvAddActivityError.visibility = View.VISIBLE
                        val errorMessage = getErrorMessage(throwable)
                        if (errorMessage == null) {
                            binding.tvAddActivityError.text = "Unknown error";
                        } else {
                            binding.tvAddActivityError.text = getValidationErrors(errorMessage)
                        }
                    }
                }
            }
        }
    }

    private fun setEducationSpinnerData(context: Context) {
        val token = tokenManager.getToken()
        if (token != null) {
            lifecycleScope.launch {
                val result = educationController.getEducations(token, 999, 1)
                result.onSuccess { response ->
                    val educations = response.educations
                    val adapter = ArrayAdapter(
                        context,
                        android.R.layout.simple_spinner_item,
                        educations.map { it.educationTitle })
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                    binding.sAddActivityEducation.adapter = adapter

                    binding.sAddActivityEducation.onItemSelectedListener =
                        object : AdapterView.OnItemSelectedListener {
                            override fun onItemSelected(
                                parent: AdapterView<*>,
                                view: android.view.View?,
                                position: Int,
                                id: Long
                            ) {
                                val selectedItem = educations[position]
                                educationId = selectedItem.id
                            }

                            override fun onNothingSelected(parent: AdapterView<*>?) {

                            }
                        }
                }
            }
        }
    }

    private fun setComplexitySpinnerData(context: Context) {
        val token = tokenManager.getToken()
        if (token != null) {
            lifecycleScope.launch {
                val result = complexityController.getComplexities(token, 999, 1)
                result.onSuccess { response ->
                    val complexities = response.complexities
                    val adapter = ArrayAdapter(
                        context,
                        android.R.layout.simple_spinner_item,
                        complexities.map { it.complexityTitle })
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                    binding.sAddActivityComplexity.adapter = adapter

                    binding.sAddActivityComplexity.onItemSelectedListener =
                        object : AdapterView.OnItemSelectedListener {
                            override fun onItemSelected(
                                parent: AdapterView<*>,
                                view: android.view.View?,
                                position: Int,
                                id: Long
                            ) {
                                val selectedItem = complexities[position]
                                complexityId = selectedItem.id
                            }

                            override fun onNothingSelected(parent: AdapterView<*>?) {

                            }
                        }
                }
            }
        }
    }
}