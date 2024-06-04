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
import com.example.tasksyncmobileapp.databinding.ActivityAddWorkersBinding
import com.example.tasksyncmobileapp.network.RetrofitClient
import com.example.tasksyncmobileapp.repository.WorkerRepository
import com.example.tasksyncmobileapp.util.classes.PaginationScrollListener
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.view.HeaderFragment
import kotlinx.coroutines.launch

class AddWorkersActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAddWorkersBinding
    private lateinit var workersIntent: Intent
    private lateinit var adapter: WorkerAdapter
    private lateinit var workerController: WorkerController
    private lateinit var tokenManager: TokenManager
    private var currentPage = 1
    private var isLastPage = false
    private var isLoading = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddWorkersBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        workersIntent = Intent(this, WorkerActivity::class.java)


        binding.apply {
            bAddWorkersBack.setOnClickListener {
                startActivity(workersIntent)
            }
        }

        val retrofitClient = RetrofitClient()
        val workerRepository = WorkerRepository(retrofitClient.apiService)
        workerController = WorkerController(workerRepository)

        tokenManager = TokenManager(binding.root.context)
        adapter = WorkerAdapter{ worker ->
            val intent = Intent(this, AddWorkerActivity::class.java).apply {
                putExtra("WORKER_ID", worker.id)
            }
            startActivity(intent)
        }


        val layoutManager = GridLayoutManager(this, 2)
        binding.rvAddWorkers.layoutManager = layoutManager
        binding.rvAddWorkers.adapter = adapter

        loadUsers()

        binding.rvAddWorkers.addOnScrollListener(object : PaginationScrollListener(layoutManager) {
            override fun loadMoreItems() {
                currentPage++
                loadUsers()
            }

            override fun isLastPage(): Boolean {
                return isLastPage
            }

            override fun isLoading(): Boolean {
                return isLoading
            }
        })


    }

    private fun loadUsers() {
        binding.addWorkersProgressBar.visibility = View.VISIBLE
        isLoading = true
        lifecycleScope.launch {
            val token = tokenManager.getToken()
            if (token != null) {
                val result = workerController.getUsersWithoutCompany(token, limit = 6, currentPage)
                result.onSuccess { response ->
                    if (currentPage == 1) {
                        adapter.submitList(response.users)
                    } else {
                        val currentList = adapter.currentList.toMutableList()
                        currentList.addAll(response.users)
                    }
                    isLastPage = response.users.isEmpty()
                    isLoading = false
                    binding.addWorkersProgressBar.visibility = View.GONE
                }
            }
        }
    }


}