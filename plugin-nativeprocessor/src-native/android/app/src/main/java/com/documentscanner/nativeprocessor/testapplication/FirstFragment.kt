package com.documentscanner.nativeprocessor.testapplication

import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Color
import android.media.Image
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.navigation.fragment.findNavController
import com.akylas.documentscanner.CustomImageAnalysisCallback
import com.google.android.material.snackbar.Snackbar
import com.documentscanner.nativeprocessor.testapplication.databinding.FragmentFirstBinding
import com.nativescript.cameraview.CameraEventListener
import com.nativescript.cameraview.ImageAnalysis
import com.nativescript.cameraview.ImageAsyncProcessor
import java.io.File
import java.lang.Exception

/**
 * A simple [Fragment] subclass as the default destination in the navigation.
 */
class FirstFragment : Fragment() {

    private var photoTime: Long = 0
    private var _binding: FragmentFirstBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    private val requestPermissionLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { isGranted: Boolean ->
            if (isGranted) {
                binding.cameraView.startPreview()
                Log.i("Permission: ", "Granted")
            } else {
                Log.i("Permission: ", "Denied")
            }
        }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = FragmentFirstBinding.inflate(inflater, container, false)
        return binding.root

    }

    fun requestCameraPermission() {
        when {
            ContextCompat.checkSelfPermission(
                this.requireActivity(),
                android.Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED -> {
//                layout.showSnackbar(
//                    view,
//                    "granted",
//                    Snackbar.LENGTH_INDEFINITE,
//                    null
//                ) {}
            }

            ActivityCompat.shouldShowRequestPermissionRationale(
                this.requireActivity(),
                android.Manifest.permission.CAMERA
            ) -> {
                view?.let {
                    Snackbar.make(it, "permission required", Snackbar.LENGTH_INDEFINITE)
                        .setAction("ok") {
                            requestPermissionLauncher.launch(
                                android.Manifest.permission.CAMERA
                            )
                        }
                        .show()
                }
            }

            else -> {
                requestPermissionLauncher.launch(
                    android.Manifest.permission.CAMERA
                )
            }
        }

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.cameraView.savePhotoToDisk = false
        binding.cameraView.analyserCallback = (CustomImageAnalysisCallback(this.requireActivity(), binding.cropView))
        (binding.cameraView.analyserCallback as (CustomImageAnalysisCallback)).previewResizeThreshold =
            200.0;
        binding.cameraView.listener = object : CameraEventListener {
            override fun onReady() {
                Log.d("CameraView","onReady")
            }

            override fun onCameraOpen() {
                Log.d("CameraView","onCameraOpen")
            }

            override fun onCameraClose() {
                Log.d("CameraView","onCameraClose")
            }

            override fun onCameraPhoto(file: File?) {
                Log.d("CameraView","onCameraPhoto: " + ((System.nanoTime()-photoTime)/1000000) + "ms" )
            }

            override fun onCameraPhotoImage(
                image: Bitmap?,
                info: androidx.camera.core.ImageInfo,
            ) {
                Log.d("CameraView","onCameraPhotoImage: " + ((System.nanoTime()-photoTime)/1000000) + "ms" )
            }

            override fun onCameraVideo(file: File?) {
                Log.d("CameraView","onCameraVideo")
            }

            override fun onCameraAnalysis(analysis: ImageAnalysis) {
                Log.d("CameraView","onCameraAnalysis")
            }

            override fun onCameraError(message: String, ex: Exception) {
                Log.d("CameraView","onCameraError")
            }

            override fun onCameraVideoStart() {
                Log.d("CameraView","onCameraVideoStart")
            }

        }
        requestCameraPermission()
//        binding.cameraView.startPreview()
//        binding.buttonFirst.setOnClickListener {
//            findNavController().navigate(R.id.action_FirstFragment_to_SecondFragment)
//        }

        binding.fab.setOnClickListener { view ->
            photoTime = System.nanoTime()
            binding.cameraView.takePhoto("{\"savePhotoToDisk\":false}")
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}