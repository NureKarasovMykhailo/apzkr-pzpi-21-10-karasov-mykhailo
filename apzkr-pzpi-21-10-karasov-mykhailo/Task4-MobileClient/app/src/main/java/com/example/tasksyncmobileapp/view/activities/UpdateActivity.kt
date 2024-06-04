package com.example.tasksyncmobileapp.view.activities

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.lifecycle.lifecycleScope
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.controller.ActivityController
import com.example.tasksyncmobileapp.controller.ComplexityController
import com.example.tasksyncmobileapp.controller.EducationController
import com.example.tasksyncmobileapp.databinding.ActivityUpdateBinding
import com.example.tasksyncmobileapp.model.dto.CreateActivityDto
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.ActivityRepository
import com.example.tasksyncmobileapp.repository.ComplexityRepository
import com.example.tasksyncmobileapp.repository.EducationRepository
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.util.functions.getErrorMessage
import com.example.tasksyncmobileapp.util.functions.getTimeWithDoubleDot
import com.example.tasksyncmobileapp.util.functions.getValidationErrors
import com.example.tasksyncmobileapp.util.functions.timeToSeconds
import com.example.tasksyncmobileapp.view.HeaderFragment
import kotlinx.coroutines.launch

class UpdateActivity : AppCompatActivity() {
    private lateinit var binding: ActivityUpdateBinding
    private lateinit var tokenManager: TokenManager
    private lateinit var activityController: ActivityController
    private lateinit var complexityController: ComplexityController
    private lateinit var educationController: EducationController
    private lateinit var oneActivityIntent: Intent
    private var educationId = -1
    private var complexityId = -1
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityUpdateBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        tokenManager = TokenManager(binding.root.context)

        setProgressBarVisible()

        val activityId = intent.getIntExtra("ACTIVITY_ID", -1)
        val retrofitClient = RetrofitClient()
        val activityRepository = ActivityRepository(retrofitClient.apiService)
        val complexityRepository = ComplexityRepository(retrofitClient.apiService)
        val educationRepository = EducationRepository(retrofitClient.apiService)

        complexityController = ComplexityController(complexityRepository)
        educationController = EducationController(educationRepository)
        activityController = ActivityController(activityRepository)
        oneActivityIntent = Intent(this, OneActivity::class.java).apply {
            putExtra("ACTIVITY_ID", activityId)
        }


        setData(activityId)

        binding.apply {
            bUpdateActivityBack.setOnClickListener {
                val oneActivityIntent = Intent(binding.root.context, OneActivity::class.java).apply {
                    putExtra("ACTIVITY_ID", activityId)
                }
                startActivity(oneActivityIntent)
            }

            bUpdateActivityAdd.setOnClickListener {
                updateActivity(activityId)
            }
        }
    }

    private fun setProgressBarVisible() {
        binding.apply {
            updateActivityProgressBar.visibility = View.VISIBLE

            etUpdateAcitvityTitle.visibility = View.GONE
            etUpdateActivityDescription.visibility = View.GONE
            etUpdateActivityTimeShift.visibility = View.GONE
            etUpdateActivityRequiredWorkerCount.visibility = View.GONE
            sUpdateActivityComplexity.visibility = View.GONE
            sUpdateActivityEducation.visibility = View.GONE
            textView10.visibility = View.GONE
            textView13.visibility = View.GONE
            textView14.visibility = View.GONE
        }
    }

    private fun setProgressBarInvisible() {
        binding.apply {
            updateActivityProgressBar.visibility = View.GONE

            etUpdateAcitvityTitle.visibility = View.VISIBLE
            etUpdateActivityDescription.visibility = View.VISIBLE
            etUpdateActivityTimeShift.visibility = View.VISIBLE
            etUpdateActivityRequiredWorkerCount.visibility = View.VISIBLE
            sUpdateActivityComplexity.visibility = View.VISIBLE
            sUpdateActivityEducation.visibility = View.VISIBLE
            textView10.visibility = View.VISIBLE
            textView13.visibility = View.VISIBLE
            textView14.visibility = View.VISIBLE
        }
    }

    private fun setData(activityId: Int) {
        val token = tokenManager.getToken()
        if (token != null) {
            lifecycleScope.launch {
                val result = activityController.getActivityById(token, activityId)
                result.onSuccess { response ->
                    binding.apply {
                        val activity = response.activity
                        etUpdateAcitvityTitle.setText(activity.activityTitle)
                        etUpdateActivityDescription.setText(activity.description)
                        etUpdateActivityRequiredWorkerCount.setText(activity.requiredWorkerCount.toString())
                        etUpdateActivityTimeShift.setText(getTimeWithDoubleDot(activity.timeShift))
                        educationId = activity.educationId
                        complexityId = activity.complexityId
                        setEducationSpinnerData(binding.root.context, educationId)
                        setComplexitySpinnerData(binding.root.context, complexityId)
                        setProgressBarInvisible()
                    }
                }
            }
        }
    }

    private fun updateActivity(activityId: Int) {
        val activityTitle = binding.etUpdateAcitvityTitle.text.toString()
        val description = binding.etUpdateActivityDescription.text.toString()
        val requiredWorkerCount: Int = binding.etUpdateActivityRequiredWorkerCount.text.toString().toIntOrNull() ?: 0
        var timeShift = -1
        try {
            timeShift = timeToSeconds(binding.etUpdateActivityTimeShift.text.toString())
        } catch (e: Exception) {
            binding.tvUpdateActivityError.visibility = View.VISIBLE
            binding.tvUpdateActivityError.text = e.message.toString()
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
                    val result = activityController.updateActivity(token, activityId, createActivityDto)
                    result.onSuccess {
                        startActivity(oneActivityIntent)
                    }.onFailure {throwable ->
                        binding.tvUpdateActivityError.visibility = View.VISIBLE
                        val errorMessage = getErrorMessage(throwable)
                        if (errorMessage == null) {
                            binding.tvUpdateActivityError.text = "Unknown error";
                        } else {
                            binding.tvUpdateActivityError.text = getValidationErrors(errorMessage)
                        }
                    }
                }
            }
        }
    }

    private fun setEducationSpinnerData(context: Context, selectedEducationId: Int) {
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
                    binding.sUpdateActivityEducation.adapter = adapter

                    val selectedIndex = educations.indexOfFirst { it.id == selectedEducationId }
                    if (selectedIndex != -1) {
                        binding.sUpdateActivityEducation.setSelection(selectedIndex)
                    }

                    binding.sUpdateActivityEducation.onItemSelectedListener =
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

    private fun setComplexitySpinnerData(context: Context, selectedComplexityId: Int) {
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
                    binding.sUpdateActivityComplexity.adapter = adapter

                    val selectedIndex = complexities.indexOfFirst { it.id == selectedComplexityId }
                    if (selectedIndex != -1) {
                        binding.sUpdateActivityComplexity.setSelection(selectedIndex)
                    }

                    binding.sUpdateActivityComplexity.onItemSelectedListener =
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