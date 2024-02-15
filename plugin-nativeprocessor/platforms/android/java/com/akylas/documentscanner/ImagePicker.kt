package com.akylas.documentscanner

import org.json.JSONObject
//import androidx.activity.result.contract.ActivityResultContracts.PickMultipleVisualMedia
//import androidx.activity.result.PickVisualMediaRequest
//import androidx.activity.result.contract.ActivityResultContracts.PickVisualMedia
//import androidx.appcompat.app.AppCompatActivity
//import android.util.Log
//
//class ImagePicker {
//    interface OnResult {
//        fun onResult(e: Exception?, result: Any?)
//    }
//    companion object {
//        private const val TAG = "ImagePicker"
//
//        fun pickImagesVideos(activity: AppCompatActivity, onResult:OnResult, opts: String) {
//            // val options = JSONObject(opts)
//            val pickMultipleMedia = activity.registerForActivityResult(PickMultipleVisualMedia(5)) { uris ->
//                // Callback is invoked after the user selects media items or closes the
//                // photo picker.
//                onResult.onResult(null, uris)
//            }
//            pickMultipleMedia.launch(PickVisualMediaRequest(PickVisualMedia.ImageOnly))
//
//
//        }
//    }
//}
