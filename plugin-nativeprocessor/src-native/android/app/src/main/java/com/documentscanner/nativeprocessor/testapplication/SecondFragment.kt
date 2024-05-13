package com.documentscanner.nativeprocessor.testapplication

import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.akylas.documentscanner.CustomImageAnalysisCallback
import com.documentscanner.nativeprocessor.testapplication.databinding.FragmentSecondBinding


/**
 * A simple [Fragment] subclass as the second destination in the navigation.
 */
class SecondFragment : Fragment() {

    private var _binding: FragmentSecondBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = FragmentSecondBinding.inflate(inflater, container, false)
        return binding.root

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val imageView = binding.imageView
        val bitmap = (imageView.getDrawable() as BitmapDrawable).bitmap
        val activity = this.requireActivity()
        if (bitmap != null) {
            val start = System.currentTimeMillis()
            CustomImageAnalysisCallback.getJSONDocumentCorners(
                bitmap,
                object : CustomImageAnalysisCallback.FunctionCallback {
                    override fun onResult(e: Exception?, result: Any?) {
                        if (e != null) {
                            Log.e(
                                "CustomImageAnalysisCallback",
                                "getJSONDocumentCornersAndImage: " + e
                            )
                        } else {
                            Log.d(
                                "CustomImageAnalysisCallback",
                                "getJSONDocumentCornersAndImage: $result in ${System.currentTimeMillis() - start}ms"
                            )
                            CustomImageAnalysisCallback.cropDocument(
                                bitmap,
                                result as String,
                                object : CustomImageAnalysisCallback.FunctionCallback {
                                    override fun onResult(e: Exception?, result: Any?) {
                                        if ((result as Array<Any>).size > 0) {
                                            Log.d(
                                                "CustomImageAnalysisCallback",
                                                "cropDocument done in ${System.currentTimeMillis() - start}ms"
                                            )

                                            activity.runOnUiThread(Runnable {
                                                binding.imageView.setImageBitmap((result as Array<Any>)[0] as Bitmap)
                                            })
                                        }
                                    }
                                },
                                "whitepaper"
                            )
                        }
                    }
                },
                200.0
            )
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}