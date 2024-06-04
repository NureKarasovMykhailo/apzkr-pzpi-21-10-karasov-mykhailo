package com.example.tasksyncmobileapp.view

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import com.example.tasksyncmobileapp.BuildConfig
import com.example.tasksyncmobileapp.R
import com.example.tasksyncmobileapp.model.User
import com.example.tasksyncmobileapp.util.classes.FileManager
import com.example.tasksyncmobileapp.util.classes.Jwt
import com.example.tasksyncmobileapp.util.classes.TokenManager
import com.example.tasksyncmobileapp.view.auth.LoginActivity

class HeaderFragment : Fragment() {
    private lateinit var tokenManager: TokenManager
    private lateinit var loginIntent: Intent
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_header, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val context = requireContext()
        loginIntent = Intent(requireActivity(), LoginActivity::class.java)
        tokenManager = TokenManager(context)
        val token = tokenManager.getToken()
        val button = view.findViewById<Button>(R.id.bHeaderExit)
        button.setOnClickListener {
            logOut()
        }

        if (token != null) {
            val user: User
            try {
                val jwt = Jwt()
                user = jwt.decodeJWT(token)

                val imageView: ImageView = view.findViewById(R.id.ivHeaderUserAvatar)
                val fileManager = FileManager()
                fileManager.loadUserPhoto2ImageView(BuildConfig.BASE_IMAGE_URL + user.userImage, imageView)

            } catch (e: Exception) {
                Log.e("Token error", e.toString())
            }


        }
    }

    private fun logOut(){
        tokenManager.clearToken()
        startActivity(loginIntent)
    }



}