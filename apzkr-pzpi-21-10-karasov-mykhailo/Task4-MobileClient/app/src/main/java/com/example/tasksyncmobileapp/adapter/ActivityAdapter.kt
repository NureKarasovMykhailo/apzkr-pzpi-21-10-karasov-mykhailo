package com.example.tasksyncmobileapp.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.databinding.ActivityItemBinding
import com.example.tasksyncmobileapp.model.Activity
import com.example.tasksyncmobileapp.util.functions.getTimeInHoursAndMinutes

class ActivityAdapter(private val onItemClick: (Activity) -> Unit) : ListAdapter<Activity, ActivityAdapter.Holder>(Comparator()) {

    class Holder(view: View, private val onItemClick: (Activity) -> Unit) : RecyclerView.ViewHolder(view) {
        private val binding = ActivityItemBinding.bind(view)

        fun bind(activity: Activity) = with(binding){

            tvActivityItemTitle.text = "Назва активності: ${activity.activityTitle}"
            tvActivityItemDescription.text = "Опис: ${activity.description}"
            tvActivityItemRequiredWorkerCount.text = "Необхідна кількість робітників: ${activity.requiredWorkerCount}"
            tvActivityItemTimeShift.text = "Час робочої зміни: ${getTimeInHoursAndMinutes(activity.timeShift)}"

            bActivityItemSeeDetail.setOnClickListener {
                onItemClick(activity)
            }
        }
    }

    class Comparator: DiffUtil.ItemCallback<Activity>() {
        override fun areItemsTheSame(oldItem: Activity, newItem: Activity): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Activity, newItem: Activity): Boolean {
            return oldItem == newItem
        }

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): Holder {
        val view = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.activity_item, parent, false)
        return Holder(view, onItemClick)
    }

    override fun onBindViewHolder(holder: Holder, position: Int) {
        holder.bind(getItem(position))
    }


}