package com.example.tasksyncmobileapp.util.classes

import android.widget.ImageView
import com.squareup.picasso.Picasso

class FileManager {

    fun loadUserPhoto2ImageView(imageUrl: String, imageView: ImageView) {
        Picasso.get()
            .load(imageUrl)
            .resize(150, 150)
            .into(imageView)

    }

    fun loadImage2ImageView(imageUrl: String, imageView: ImageView, height: Int, width: Int) {
        Picasso.get()
            .load(imageUrl)
            .resize(width, height)
            .into(imageView)

    }

}