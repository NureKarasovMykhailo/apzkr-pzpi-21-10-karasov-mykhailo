package com.example.tasksyncmobileapp.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.tasksyncmobileapp.BuildConfig
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.databinding.UserItemBinding
import com.example.tasksyncmobileapp.model.User
import com.example.tasksyncmobileapp.util.classes.FileManager

class UserAdapter(private val onItemClick: (User) -> Unit) : ListAdapter<User, UserAdapter.Holder>(Comparator()) {

    class Holder(view: View, private val onItemClick: (User) -> Unit) : RecyclerView.ViewHolder(view) {
        private val binding = UserItemBinding.bind(view)

        fun bind(user: User) = with(binding) {
            val fileManager = FileManager()
            fileManager.loadImage2ImageView(
                BuildConfig.BASE_IMAGE_URL + user.userImage,
                ivUserItemUserImage,
                150,
                150
            )
            tvUserItemEmail.text = "Email: ${user.email}"
            tvUserItemName.text = "Ім'я: ${user.firstName}\nПрізвище: ${user.secondName}"

            bUserItemDeleteWorkerFromActivity.setOnClickListener {
                onItemClick(user)
            }
        }
    }

    class Comparator: DiffUtil.ItemCallback<User>() {
        override fun areItemsTheSame(oldItem: User, newItem: User): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: User, newItem: User): Boolean {
            return oldItem == newItem
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): Holder {
        val view = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.user_item, parent, false)
        return Holder(view, onItemClick)
    }

    override fun onBindViewHolder(holder: Holder, position: Int) {
        holder.bind(getItem(position))
    }
}
