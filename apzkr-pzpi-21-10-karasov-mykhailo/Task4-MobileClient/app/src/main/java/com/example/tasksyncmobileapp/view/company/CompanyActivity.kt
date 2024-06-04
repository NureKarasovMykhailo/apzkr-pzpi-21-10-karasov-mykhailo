package com.example.tasksyncmobileapp.view.company

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.lifecycle.lifecycleScope
import com.example.tasksyncmobileapp.BuildConfig
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.controller.CompanyController
import com.example.tasksyncmobileapp.databinding.ActivityCompanyBinding
import com.example.tasksyncmobileapp.model.Company
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.CompanyRepository
import com.example.tasksyncmobileapp.util.classes.FileManager
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.view.HeaderFragment
import com.example.tasksyncmobileapp.view.activities.ActivitiesActivity
import com.example.tasksyncmobileapp.view.profile.ProfileActivity
import com.example.tasksyncmobileapp.view.worker.WorkerActivity
import kotlinx.coroutines.launch

class CompanyActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCompanyBinding
    private lateinit var companyController: CompanyController
    private lateinit var company: Company
    private lateinit var tokenManager: TokenManager
    private lateinit var workersIntent: Intent
    private lateinit var activitiesIntent: Intent
    private lateinit var profileIntent: Intent
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCompanyBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.companyHeader, HeaderFragment())
            .commit()

        tokenManager = TokenManager(binding.root.context)
        var retrofitClient = RetrofitClient()
        var companyRepository = CompanyRepository(retrofitClient.apiService)
        companyController = CompanyController(companyRepository)

        workersIntent = Intent(this, WorkerActivity::class.java)
        activitiesIntent = Intent(this, ActivitiesActivity::class.java)
        profileIntent = Intent(this, ProfileActivity::class.java)

        getCompany()

        binding.bCompanyWorkers.setOnClickListener {
            startActivity(workersIntent)
        }

        binding.bCompanyGoToActivity.setOnClickListener {
            startActivity(activitiesIntent)
        }

        binding.bCompanyBack.setOnClickListener {
            startActivity(profileIntent)
        }
    }

    private fun getCompany(){
        binding.companyProgressBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            val result = companyController.getCompany(tokenManager.getToken()!!)
            val fileManager = FileManager()
            result.onSuccess { company ->
                binding.apply {
                    println(company)
                    tvCompanyName.text = company.company.companyName
                    tvCompanyDescription.text = company.company.description
                    fileManager.loadImage2ImageView(
                        BuildConfig.BASE_IMAGE_URL + company.company.companyImage,
                        ivCompanyImage,
                        300,
                        300
                    )
                }
            }.onFailure {

            }
        }
        binding.companyProgressBar.visibility = View.GONE

    }
}