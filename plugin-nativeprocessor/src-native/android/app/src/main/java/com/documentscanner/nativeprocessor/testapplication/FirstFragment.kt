package com.documentscanner.nativeprocessor.testapplication

import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Point
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.ImageProxy
import androidx.camera.view.PreviewView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.palette.graphics.Palette
import com.akylas.documentscanner.AutoScanHandler
import com.akylas.documentscanner.CustomImageAnalysisCallback
import com.documentscanner.nativeprocessor.testapplication.databinding.FragmentFirstBinding
import com.google.android.material.snackbar.Snackbar
import com.nativescript.cameraview.CameraEventListener
import com.nativescript.cameraview.ImageAnalysis
import com.nativescript.cameraview.ImageAsyncProcessor
import java.io.File
import kotlin.jvm.functions.FunctionN


/**
 * A simple [Fragment] subclass as the default destination in the navigation.
 */
class FirstFragment : Fragment() {

    private var photoTime: Long = 0
    private var _binding: FragmentFirstBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    private val requestPermissionLauncher = registerForActivityResult(
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
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View? {

        _binding = FragmentFirstBinding.inflate(inflater, container, false)
        return binding.root

    }

    fun requestCameraPermission() {
        when {
            ContextCompat.checkSelfPermission(
                this.requireActivity(), android.Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED -> {
//                layout.showSnackbar(
//                    view,
//                    "granted",
//                    Snackbar.LENGTH_INDEFINITE,
//                    null
//                ) {}
            }

            ActivityCompat.shouldShowRequestPermissionRationale(
                this.requireActivity(), android.Manifest.permission.CAMERA
            ) -> {
                view?.let {
                    Snackbar.make(it, "permission required", Snackbar.LENGTH_INDEFINITE)
                        .setAction("ok") {
                            requestPermissionLauncher.launch(
                                android.Manifest.permission.CAMERA
                            )
                        }.show()
                }
            }

            else -> {
                requestPermissionLauncher.launch(
                    android.Manifest.permission.CAMERA
                )
            }
        }

    }
    fun requestStoragePermission() {
        when {
            ContextCompat.checkSelfPermission(
                this.requireActivity(), android.Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) == PackageManager.PERMISSION_GRANTED -> {
//                layout.showSnackbar(
//                    view,
//                    "granted",
//                    Snackbar.LENGTH_INDEFINITE,
//                    null
//                ) {}
            }

            ActivityCompat.shouldShowRequestPermissionRationale(
                this.requireActivity(), android.Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) -> {
                view?.let {
                    Snackbar.make(it, "permission required", Snackbar.LENGTH_INDEFINITE)
                        .setAction("ok") {
                            requestPermissionLauncher.launch(
                                android.Manifest.permission.WRITE_EXTERNAL_STORAGE
                            )
                        }.show()
                }
            }

            else -> {
                requestPermissionLauncher.launch(
                    android.Manifest.permission.WRITE_EXTERNAL_STORAGE
                )
            }
        }

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.cameraView.aspectRatio = "16:9"
        binding.cameraView.enablePinchZoom = true
        binding.cameraView.zoom = 1.0F
        binding.cameraView.scaleType = PreviewView.ScaleType.FIT_CENTER
        binding.cropView.scaleType = binding.cameraView.scaleType
        binding.cameraView.savePhotoToDisk = false
        val activity = this.requireActivity()
        var lastQRCode: String? = null
        binding.cameraView.analyserCallback = (CustomImageAnalysisCallback(this.requireActivity(),
            binding.cropView,
            object : CustomImageAnalysisCallback.OnQRCode {
                override fun onQRCode(text: String, format: String) {
                    if (lastQRCode != text) {
                        lastQRCode = text
                        CustomImageAnalysisCallback.generateQRCode(text,
                            format,
                            400,
                            400,
                            object : CustomImageAnalysisCallback.FunctionCallback {
                                override fun onResult(e: Exception?, result: Any?) {
                                    activity.runOnUiThread(Runnable {
                                        if (result != null) {

                                            binding.imageView.setImageBitmap(result as Bitmap)
                                        }
                                    })
                                }
                            })
                    }
                }
            }
//            object : CustomImageAnalysisCallback.OnTestBitmap {
//                override fun onTestBitmap(bitmap: Bitmap) {
//                    activity.runOnUiThread(Runnable {
//                        binding.imageView.setImageBitmap(bitmap)
//                    } //public void run() {
//                    )
//                }
//            }
        ))
//        (binding.cameraView.analyserCallback as (CustomImageAnalysisCallback)).autoScanHandler = AutoScanHandler(this.requireActivity(), binding.cropView, onAutoScan = object: AutoScanHandler.OnAutoScan {
//            override fun onAutoScan(corners: String) {
//                Log.d("CameraView", "onAutoScan $corners")
//            }
//        })
        (binding.cameraView.analyserCallback as (CustomImageAnalysisCallback)).previewResizeThreshold =
            200.0;
        (binding.cameraView.analyserCallback as (CustomImageAnalysisCallback)).detectQRCode = false
        binding.cameraView.listener = object : CameraEventListener {
            override fun onReady() {
                Log.d("CameraView", "onReady")
            }

            override fun onCameraOpen() {
                var test = binding.cameraView.getAllAvailablePictureSizes();
                Log.d("CameraView", "onCameraOpen " + test.get(0).toString())
                Log.d("CameraView", "onCameraOpen zoom" + binding.cameraView.minZoom + " " + binding.cameraView.zoom + " " + binding.cameraView.maxZoom)
            }

            override fun onCameraClose() {
                Log.d("CameraView", "onCameraClose")
            }

            override fun onZoom(zoom: Float) {
                Log.d("CameraView", "onZoom " + zoom)
            }

            override fun onCameraPhoto(file: File?) {
                Log.d(
                    "CameraView",
                    "onCameraPhoto: " + ((System.nanoTime() - photoTime) / 1000000) + "ms"
                )
            }

            override fun onCameraPhotoImage(
                image: Bitmap?,
                info: androidx.camera.core.ImageInfo,
            ) {
                Log.d(
                    "CameraView",
                    "onCameraPhotoImage: " + image?.width + " " + image?.height + " " + image?.byteCount + " " + ((System.nanoTime() - photoTime) / 1000000) + "ms"
                )
                if (image != null) {
                    CustomImageAnalysisCallback.getJSONDocumentCorners(
                        image,
                        object : CustomImageAnalysisCallback.FunctionCallback {
                            override fun onResult(e: Exception?, result: Any?) {
                                if (e != null) {
                                    Log.e(
                                        "CameraView",
                                        "getJSONDocumentCornersAndImage: " + e
                                    )
                                } else {
                                    Log.d(
                                        "CameraView",
                                        "getJSONDocumentCornersAndImage: " + result
                                    )
                                    CustomImageAnalysisCallback.cropDocument(
                                        image,
                                        result as String,
                                        object : CustomImageAnalysisCallback.FunctionCallback {
                                            override fun onResult(e: Exception?, result: Any?) {
                                                if (result != null && (result as Array<*>).isNotEmpty()) {

                                                    activity.runOnUiThread(Runnable {
                                                        binding.imageView.setImageBitmap((result as Array<Any>)[0] as Bitmap)
                                                    })
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        },
                        200.0
                    )
                }
            }

            override fun onCameraPhotoImageProxy(
                image: ImageProxy,
                processor: ImageAsyncProcessor
            ) {
                Log.d(
                    "CameraView",
                    "onCameraPhotoImageProxy: " + ((System.nanoTime() - photoTime) / 1000000) + "ms"
                )
                processor.finished()
//                CustomImageAnalysisCallback.getJSONDocumentCornersAndImage(image, processor, object: CustomImageAnalysisCallback.FunctionCallback{
//                    override fun onResult(e: Exception?, result: Any?) {
//                        if (e!=null) {
//                            Log.e(
//                                "CameraView",
//                                "getJSONDocumentCornersAndImage: " + e
//                            )
//                        } else {
//                            Log.d(
//                                "CameraView",
//                                "getJSONDocumentCornersAndImage: " + result
//                            )
//                            activity.runOnUiThread(Runnable {
//                                binding.imageView.setImageBitmap((result as HashMap<String,Any>).get("image") as Bitmap)
//                            })
//                        }
//                    }}, 200.0)
            }

            override fun onCameraVideo(file: File?) {
                Log.d("CameraView", "onCameraVideo")
            }

            override fun onCameraAnalysis(analysis: ImageAnalysis) {
                Log.d("CameraView", "onCameraAnalysis")
            }

            override fun onCameraError(message: String, ex: Exception) {
                Log.d("CameraView", "onCameraError")
            }

            override fun onCameraVideoStart() {
                Log.d("CameraView", "onCameraVideoStart")
            }

        }
        requestCameraPermission()
        requestStoragePermission()
//        binding.cameraView.startPreview()
//        binding.buttonFirst.setOnClickListener {
//            findNavController().navigate(R.id.action_FirstFragment_to_SecondFragment)
//        }

        val launcher = registerForActivityResult(
            ActivityResultContracts.OpenDocument()
        ) { uri ->
            uri?.let { fileUri ->
                var bitmap: Bitmap? =
                    MediaStore.Images.Media.getBitmap(
                        requireActivity().getContentResolver(),
                        fileUri
                    )
                if (bitmap != null) {
                    CustomImageAnalysisCallback.getJSONDocumentCorners(
                        bitmap,
                        object : CustomImageAnalysisCallback.FunctionCallback {
                            override fun onResult(e: Exception?, result: Any?) {
                                if (result is String && result.isNotEmpty()) {


                                    CustomImageAnalysisCallback.cropDocument(
                                        bitmap,
                                        result,
                                        object : CustomImageAnalysisCallback.FunctionCallback {
                                            override fun onResult(e: Exception?, result: Any?) {
                                                if (result is Array<*> && result.isNotEmpty()) {
                                                    activity.runOnUiThread(Runnable {
                                                        binding.imageView.setImageBitmap(
                                                            result.get(
                                                                0
                                                            ) as Bitmap?
                                                        )
                                                    })
                                                    (result.get(0) as Bitmap?)?.let {
                                                        var builder = Palette.Builder(it)
                                                        builder.generate {
                                                            if (it != null) {
                                                                Log.d(
                                                                    "JS",
                                                                    "android Palette " + it.swatches.map { it.toString() })
                                                            }
                                                        }
                                                        CustomImageAnalysisCallback.getColorPalette(
                                                            it,
                                                            object :
                                                                CustomImageAnalysisCallback.FunctionCallback {
                                                                override fun onResult(
                                                                    e: Exception?,
                                                                    result: Any?
                                                                ) {
                                                                    Log.d(
                                                                        "JS",
                                                                        "getColorPalette " + result
                                                                    )
                                                                }
                                                            },
                                                            200.0,
                                                            20
                                                        )
                                                    }
                                                }
                                            }
                                        },
                                        ""
                                    )
                                }
                            }
                        },
                        300.0
                    )
                }
            }
        }

        binding.fab.setOnClickListener { view ->
            photoTime = System.nanoTime()
//            binding.cameraView.takePhoto("{\"savePhotoToDisk\":false,\"saveToGallery\":false, \"returnImageProxy\":false, \"pictureSize\":\"3096x4128\", \"captureMode\":0}")
            binding.cameraView.takePhoto("{}")

//            launcher.launch(arrayOf("image/*"))
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}