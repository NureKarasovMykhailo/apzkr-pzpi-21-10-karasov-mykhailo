package com.example.tasksyncmobileapp.view.worker

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.GridLayoutManager
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.adapter.WorkerAdapter
import com.example.tasksyncmobileapp.controller.WorkerController
import com.example.tasksyncmobileapp.databinding.ActivityWorkerBinding
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.WorkerRepository
import com.example.tasksyncmobileapp.util.classes.Jwt
import com.example.tasksyncmobileapp.util.classes.PaginationScrollListener
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.util.functions.hasUserRoles
import com.example.tasksyncmobileapp.view.HeaderFragment
import com.example.tasksyncmobileapp.view.company.CompanyActivity
import kotlinx.coroutines.launch

class WorkerActivity : AppCompatActivity() {
    private lateinit var adapter: WorkerAdapter
    private lateinit var binding: ActivityWorkerBinding
    private lateinit var workerController: WorkerController
    private lateinit var tokenManager: TokenManager
    private var currentPage = 1
    private var isLoading = false
    private var isLastPage = false
    private lateinit var companyIntent: Intent
    private lateinit var addWorkersIntent: Intent

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWorkerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        tokenManager = TokenManager(this)
        val retrofitClient = RetrofitClient()
        val workerRepository = WorkerRepository(retrofitClient.apiService)
        workerController = WorkerController(workerRepository)

        adapter = WorkerAdapter { worker ->
            val intent = Intent(this, OneWorkerActivity::class.java).apply {
                putExtra("WORKER_ID", worker.id)
            }
            startActivity(intent)
        }

        val layoutManager = GridLayoutManager(this, 2)
        binding.rcViewWorkers.layoutManager = layoutManager
        binding.rcViewWorkers.adapter = adapter
        setAddButtonVisibility()
        loadWorkers()

        binding.rcViewWorkers.addOnScrollListener(object : PaginationScrollListener(layoutManager) {
            override fun loadMoreItems() {
                currentPage++
                loadWorkers()
            }

            override fun isLastPage(): Boolean {
                return isLastPage
            }

            override fun isLoading(): Boolean {
                return isLoading
            }
        })


        companyIntent = Intent(this, CompanyActivity::class.java)
        addWorkersIntent =  Intent(this, AddWorkersActivity::class.java)

        binding.apply {
            bWorkersBack.setOnClickListener {
                startActivity(companyIntent)
            }

            bWorkersAdd.setOnClickListener {
                startActivity(addWorkersIntent)
            }
        }
    }




    private fun loadWorkers() {
        binding.workerProgressBar.visibility = View.VISIBLE
        isLoading = true
        lifecycleScope.launch {
            val token = tokenManager.getToken()
            if (token != null) {
                val result = workerController.getCompanyWorkers(token, limit = 6, page = currentPage)
                result.onSuccess { response ->
                    if (currentPage == 1) {
                        adapter.submitList(response.users)
                    } else {
                        val currentList = adapter.currentList.toMutableList()
                        currentList.addAll(response.users)
                        adapter.submitList(currentList)
                    }
                    binding.workerProgressBar.visibility = View.GONE
                    isLoading = false
                    isLastPage = response.users.isEmpty()
                }.onFailure {
                    binding.workerProgressBar.visibility = View.GONE
                    isLoading = false
                }
            }
        }
    }

    private fun setAddButtonVisibility() {
        val token = tokenManager.getToken()
        if (token != null) {
            val roles = listOf("SUBSCRIBER", "COMPANY-ADMIN")
            if (hasUserRoles(roles, token)) {
                binding.bWorkersAdd.visibility = View.VISIBLE
            } else {
                binding.bWorkersAdd.visibility = View.GONE
            }
        } else {
            binding.bWorkersAdd.visibility = View.GONE
        }
    }




}