package com.example.tasksyncmobileapp.adapter

import android.os.Build
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.annotation.RequiresApi
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.tasksyncmobileapp.BuildConfig
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.databinding.WorkerItemBinding
import com.example.tasksyncmobileapp.model.Worker
import com.example.tasksyncmobileapp.util.classes.FileManager
import com.example.tasksyncmobileapp.util.functions.getAge

class WorkerAdapter(private val onItemClick: (Worker) -> Unit) : ListAdapter<Worker, WorkerAdapter.Holder>(Comparator()) {

    class Holder(view: View, private val onItemClick: (Worker) -> Unit) : RecyclerView.ViewHolder(view) {
        private val binding = WorkerItemBinding.bind(view)

        @RequiresApi(Build.VERSION_CODES.O)
        fun bind(worker: Worker) = with(binding){
            val fileManager = FileManager()
            fileManager.loadImage2ImageView(
                BuildConfig.BASE_IMAGE_URL + worker.userImage,
                ivWorkerItem,
                200,
                200
            )
            tvWokerItemName.text = "Ім'я: ${worker.firstName}"
            tvWorkerItemEmail.text = "Email: ${worker.email}"
            tvWorkerItemSurname.text = "Прізвище: ${worker.secondName}"
            tvWorkerItemAge.text = "Вік: ${getAge(worker.birthday)}"
            bWorkerItemSeeDetail.setOnClickListener {
                onItemClick(worker)
            }
        }
    }

    class Comparator: DiffUtil.ItemCallback<Worker>() {
        override fun areItemsTheSame(oldItem: Worker, newItem: Worker): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Worker, newItem: Worker): Boolean {
            return oldItem == newItem
        }

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): Holder {
        val view = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.worker_item, parent, false)
        return Holder(view, onItemClick)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onBindViewHolder(holder: Holder, position: Int) {
        holder.bind(getItem(position))
    }


}