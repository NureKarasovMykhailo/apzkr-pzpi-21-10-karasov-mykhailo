package com.example.tasksyncmobileapp.view.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView.LayoutManager
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.adapter.ActivityAdapter
import com.example.tasksyncmobileapp.controller.ActivityController
import com.example.tasksyncmobileapp.databinding.ActivityActivitiesBinding
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.ActivityRepository
import com.example.tasksyncmobileapp.util.classes.PaginationScrollListener
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.util.functions.hasUserRoles
import com.example.tasksyncmobileapp.view.HeaderFragment
import com.example.tasksyncmobileapp.view.company.CompanyActivity
import kotlinx.coroutines.launch

class ActivitiesActivity : AppCompatActivity() {

    private lateinit var binding: ActivityActivitiesBinding
    private lateinit var companyIntent: Intent
    private lateinit var adapter: ActivityAdapter
    private lateinit var activityController: ActivityController
    private var currentPage = 1
    private var isLoading = false
    private var isLastPage = false
    private lateinit var tokenManager: TokenManager
    private lateinit var addActivityIntent: Intent

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityActivitiesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        val retrofitClient = RetrofitClient()
        val activityRepository = ActivityRepository(retrofitClient.apiService)
        var layoutManager = GridLayoutManager(this, 1)

        companyIntent = Intent(this, CompanyActivity::class.java)
        tokenManager = TokenManager(binding.root.context)
        activityController = ActivityController(activityRepository)
        addActivityIntent = Intent(this, AddActivity::class.java)

        adapter = ActivityAdapter { activity ->
            val intent = Intent(this, OneActivity::class.java).apply {
                putExtra("ACTIVITY_ID", activity.id)
            }
            startActivity(intent)
        }

        setButtonVisibility()

        binding.apply {
            rvActivities.layoutManager = layoutManager
            rvActivities.adapter = adapter
            loadActivities()


            bActivitiesBack.setOnClickListener {
                startActivity(companyIntent)
            }

            bActivitiesAdd.setOnClickListener {
                startActivity(addActivityIntent)
            }

            rvActivities.addOnScrollListener(object : PaginationScrollListener(layoutManager) {
                override fun loadMoreItems() {
                    currentPage++
                    loadActivities()
                }

                override fun isLastPage(): Boolean {
                    return isLastPage
                }

                override fun isLoading(): Boolean {
                    return isLoading
                }
            })
        }

    }

    private fun loadActivities() {
        binding.activitiesProgressBar.visibility = View.VISIBLE
        isLoading = true
        lifecycleScope.launch {
            val token = tokenManager.getToken()
            if (token != null) {
                val result = activityController.getCompanyActivities(token, limit = 6, page = currentPage)
                result.onSuccess { response ->
                    if (currentPage == 1) {
                        adapter.submitList(response.activities)
                    } else {
                        val currentList = adapter.currentList.toMutableList()
                        currentList.addAll(response.activities)
                        adapter.submitList(currentList)
                    }
                    binding.activitiesProgressBar.visibility = View.GONE
                    isLastPage = response.activities.isEmpty()
                    isLoading = false
                }.onFailure {
                    isLoading = false
                    binding.activitiesProgressBar.visibility = View.GONE

                }
            }
        }
    }

    private fun setButtonVisibility() {
        val token = tokenManager.getToken()
        if (token != null) {

            if (hasUserRoles(listOf("COMPANY-ADMIN", "SUBSCRIBER"), token)) {
                binding.bActivitiesAdd.visibility = View.VISIBLE
            } else {
                binding.bActivitiesAdd.visibility = View.GONE
            }

        } else {
            binding.bActivitiesAdd.visibility = View.GONE
        }
    }
}