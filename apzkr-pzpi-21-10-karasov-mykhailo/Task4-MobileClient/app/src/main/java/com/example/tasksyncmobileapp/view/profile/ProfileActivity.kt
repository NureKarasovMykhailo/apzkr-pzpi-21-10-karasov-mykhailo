package com.example.tasksyncmobileapp.view.profile

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.databinding.ActivityProfileBinding
import com.example.tasksyncmobileapp.view.HeaderFragment
import com.example.tasksyncmobileapp.view.company.CompanyActivity

class ProfileActivity: AppCompatActivity(){
    private lateinit var binding: ActivityProfileBinding
    private lateinit var userProfileIntent: Intent

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportFragmentManager.beginTransaction()
            .replace(R.id.header, HeaderFragment())
            .commit()

        val companyIntent = Intent(this, CompanyActivity::class.java)
        val userProfileIntent = Intent(this, UserProfileActivity::class.java)

        binding.bProfileGoToCompany.setOnClickListener {
            startActivity(companyIntent)
        }

        binding.bProfileGoToProfile.setOnClickListener {
            startActivity(userProfileIntent)
        }

    }

}