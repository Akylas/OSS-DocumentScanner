package com.akylas.cameraview

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.content.res.Configuration
import android.graphics.*
import android.hardware.camera2.*
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.AttributeSet
import android.util.Log
import android.view.ScaleGestureDetector
import android.view.Surface
import android.view.WindowManager
import androidx.annotation.RequiresApi
import androidx.camera.camera2.interop.Camera2CameraInfo
import androidx.camera.camera2.interop.Camera2Interop
import androidx.camera.core.*
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.*
import androidx.camera.video.VideoCapture
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.exifinterface.media.ExifInterface
import androidx.lifecycle.LifecycleOwner
import com.google.common.util.concurrent.ListenableFuture
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.IOException
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

typealias CameraAnalyzerListener = (image: ImageProxy) -> Unit

@RequiresApi(Build.VERSION_CODES.LOLLIPOP)
public class CameraView @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : CameraBase(context, attrs, defStyleAttr) {

    companion object {
        private const val RATIO_4_3_VALUE = 4.0 / 3.0
        private const val RATIO_16_9_VALUE = 16.0 / 9.0

    }
    private var cameraProviderFuture: ListenableFuture<ProcessCameraProvider>
    private var cameraProvider: ProcessCameraProvider? = null
    private var imageCapture: ImageCapture? = null
    private var imageAnalysis: ImageAnalysis? = null
    private var videoCapture: VideoCapture<Recorder>? = null
    private var imageAnalysisExecutor = Executors.newSingleThreadExecutor()
    private var imageCaptureExecutor = Executors.newSingleThreadExecutor()
    private var videoCaptureExecutor = Executors.newSingleThreadExecutor()
    private var camera: androidx.camera.core.Camera? = null
    private var preview: Preview? = null
    private var isStarted = false
    private var isRecording = false
    private var file: File? = null
    private var isForceStopping = false
    private var mLock = Any()
    private var cameraManager: CameraManager? = null
    private var scaleGestureDetector: ScaleGestureDetector? = null
    private var recording: Recording? = null

    private val windowManager by lazy {
        context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    }

    var analyserCallback: ImageAnalysisCallback? = null
        @SuppressLint("UnsafeOptInUsageError")
        set(value) {
            field = value
            if (!isRecording && hasPermission()) {
                setUpAnalysis()
                if (value == null) {
                    if (cameraProvider?.isBound(imageAnalysis!!) == true) {
                        cameraProvider?.unbind(imageAnalysis!!)
                    }
                } else {
                    if (cameraProvider?.isBound(imageAnalysis!!) == false) {
                        camera = cameraProvider?.bindToLifecycle(
                            context as LifecycleOwner,
                            selectorFromPosition(),
                            imageAnalysis
                        )
                    }
                }
            }
        }

    override var retrieveLatestImage: Boolean = false
        set(value) {
            field = value
            if (!value && latestImage != null) {
                latestImage = null
            }
        }

    override var pause: Boolean = false
        set(value) {
            field = value
            if (value) {
                stopPreview()
            } else {
                startPreview()
            }
        }

    private fun handleZoom() {
        camera?.cameraControl?.setLinearZoom(
            zoom
        )
    }


    override val previewSurface: Any
        get() {
            return previewView
        }
    override var zoom: Float = 0.0F
        set(value) {
            field = when {
                value > 1 -> {
                    1f
                }
                value < 0 -> {
                    0f
                }
                else -> {
                    value
                }
            }
            handleZoom()
        }
    override var whiteBalance: WhiteBalance = WhiteBalance.Auto
        set(value) {
            if (!isRecording) {
                field = value
                Log.d("JS", "whiteBalance changed");
                safeUnbindAll()
                refreshCamera()
            }
        }
    override var displayRatio = "4:3"
        set(value) {
            if (value == field) return
            field = when (value) {
                "16:9" -> {
                    value
                }
                "4:3" -> value
                else -> return
            }
            if (!isRecording && cameraProviderFuture != null) {
                safeUnbindAll()
                refreshCamera()
            }
        }
    override var pictureSize: String = "0x0"
        get() {
            if (field == "0x0") {
                val size = cachedPictureRatioSizeMap[displayRatio]?.get(0)
                if (size != null) {
                    return when (resources.configuration.orientation) {
                        Configuration.ORIENTATION_LANDSCAPE -> "${size.width}x${size.height}"
                        Configuration.ORIENTATION_PORTRAIT -> "${size.height}x${size.width}"
                        else -> field
                    }
                }
            }
            return field
        }
        set(value) {
            val size = stringSizeToSize(value)
            if (cachedPictureRatioSizeMap[displayRatio]?.contains(size) == true) {
                field = value
            }
        }

    private var previewView: PreviewView = PreviewView(context, attrs, defStyleAttr)


    private fun handlePinchZoom() {
        if (!enablePinchZoom) {
            return
        }
        val listener: ScaleGestureDetector.SimpleOnScaleGestureListener =
            object : ScaleGestureDetector.SimpleOnScaleGestureListener() {
                override fun onScale(detector: ScaleGestureDetector): Boolean {
                    camera?.cameraInfo?.zoomState?.value?.let { zoomState ->
                        camera?.cameraControl?.setZoomRatio(
                            detector.scaleFactor * zoomState.zoomRatio
                        )
                    }
                    return true
                }
            }
        scaleGestureDetector = ScaleGestureDetector(context, listener)
        previewView.setOnTouchListener { view, event ->
            scaleGestureDetector?.onTouchEvent(event)
            view.performClick()
            true
        }
    }

    override var enablePinchZoom: Boolean = true
        set(value) {
            field = value
            if (value) {
                handlePinchZoom()
            } else {
                scaleGestureDetector = null
            }
        }

    init {
        handlePinchZoom()

        val point = Point()
        windowManager.defaultDisplay.getSize(point)
        displayRatio = aspectRatio(point.x, point.y)
        previewView.afterMeasured {
            currentOrientation = previewView.display.rotation
            if (autoFocus) {
                val factory: MeteringPointFactory = SurfaceOrientedMeteringPointFactory(
                    previewView.width.toFloat(), previewView.height.toFloat()
                )
                val centerWidth = previewView.width.toFloat() / 2
                val centerHeight = previewView.height.toFloat() / 2
                val autoFocusPoint = factory.createPoint(centerWidth, centerHeight)
                try {
                    camera?.cameraControl?.startFocusAndMetering(
                        FocusMeteringAction.Builder(
                            autoFocusPoint,
                            FocusMeteringAction.FLAG_AF
                        ).apply {
                            setAutoCancelDuration(2, TimeUnit.SECONDS)
                        }.build()
                    )
                } catch (e: CameraInfoUnavailableException) {
                }
            }
        }
        addView(previewView)
        initOptions()

        // TODO: Bind this to the view's onCreate method
        cameraProviderFuture = ProcessCameraProvider.getInstance(context)
        cameraProviderFuture.addListener({
            try {
                cameraProvider?.unbindAll()
                cameraProvider = cameraProviderFuture.get()
                safeUnbindAll()
                refreshCamera() // or just initPreview() ?
            } catch (e: Exception) {
                e.printStackTrace()
                listener?.onCameraError("Failed to get camera", e)
                isStarted = false
            }
        }, ContextCompat.getMainExecutor(context))
    }

    @Synchronized
    @Throws(Throwable::class)
    override fun finalize() {
        super.finalize()
        // Shut down our background executors
        imageAnalysisExecutor.shutdown()
        imageCaptureExecutor.shutdown()
        videoCaptureExecutor.shutdown()
    }

    override var allowExifRotation: Boolean = true
    override var autoSquareCrop: Boolean = false
    override var autoFocus: Boolean = false
    override var saveToGallery: Boolean = false
    override var maxAudioBitRate: Int = -1
    override var maxVideoBitrate: Int = -1
    override var maxVideoFrameRate: Int = -1
    override var disableHEVC: Boolean = false



    override val numberOfCameras: Int
        get() {
            if (cameraManager == null) {
                cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager?
            }
            var count = 0
            try {
                count = cameraManager?.cameraIdList?.size ?: 0
            } catch (e: CameraAccessException) {
            }
            return count
        }

    private fun getFlashMode(): Int {
        return when (flashMode) {
            CameraFlashMode.AUTO -> ImageCapture.FLASH_MODE_AUTO
            CameraFlashMode.ON -> ImageCapture.FLASH_MODE_ON
            else -> ImageCapture.FLASH_MODE_OFF
        }
    }

    override var position: CameraPosition = CameraPosition.BACK

    private fun selectorFromPosition(): CameraSelector {
        return CameraSelector.Builder()
            .apply {
                if (position == CameraPosition.FRONT) {
                    requireLensFacing(CameraSelector.LENS_FACING_FRONT)
                } else {
                    requireLensFacing(CameraSelector.LENS_FACING_BACK)
                }
            }
            .build()
    }



    /** Rotation specified by client (external code)
     * TODO: link this to the code, overriding or affecting targetRotation logic */
    override var rotation: CameraOrientation = CameraOrientation.UNKNOWN

    @SuppressLint("RestrictedApi", "UnsafeExperimentalUsageError")
    override fun orientationUpdated() {
        val rotation = when (currentOrientation) {
            270 -> Surface.ROTATION_270
            180 -> Surface.ROTATION_180
            90 -> Surface.ROTATION_90
            else -> Surface.ROTATION_0
        }
        imageCapture?.targetRotation = rotation
        videoCapture?.setTargetRotation(rotation)
        imageAnalysis?.targetRotation = rotation
    }

    private fun getDeviceRotation(): Int {
        return currentOrientation
    }

    private fun safeUnbindAll() {
        try {
            cameraProvider?.unbindAll()
        } catch (e: Exception) {
        } finally {
            if (isStarted) {
                listener?.onCameraClose()
            }
            isStarted = false
        }
    }

    override var quality: Quality = Quality.MAX_480P
        set(value) {
            if (!isRecording && field != value) {
                field = value
                videoCapture?.let {
                    cameraProvider?.let {
                        var wasBound = false
                        if (it.isBound(videoCapture!!)) {
                            wasBound = true
                            it.unbind(imageCapture!!)
                        }

                        videoCapture = null
                        initVideoCapture()

                        if (wasBound) {
                            if (!it.isBound(videoCapture!!)) {
                                it.bindToLifecycle(
                                    context as LifecycleOwner,
                                    selectorFromPosition(),
                                    videoCapture!!
                                )
                            }
                        }
                    }
                }
            }
        }
    override var db: Double
        get() {
            return 0.0
        }
        set(value) {}
    override var amplitude: Double
        get() {
            return 0.0
        }
        set(value) {}
    override var amplitudeEMA: Double
        get() {
            return 0.0
        }
        set(value) {}
    override var isAudioLevelsEnabled: Boolean
        get() {
            return false
        }
        set(value) {}

    /**
     *  [androidx.camera.core.ImageAnalysis.Builder] requires enum value of
     *  [androidx.camera.core.AspectRatio]. Currently it has values of 4:3 & 16:9.
     *
     *  Detecting the most suitable ratio for dimensions provided in @params by counting absolute
     *  of preview ratio to one of the provided values.
     *
     *  @param width - preview width
     *  @param height - preview height
     *  @return suitable aspect ratio
     */
    private fun aspectRatio(width: Int, height: Int): String {
        val previewRatio = max(width, height).toDouble() / min(width, height)
        if (abs(previewRatio - RATIO_4_3_VALUE) <= abs(previewRatio - RATIO_16_9_VALUE)) {
            return "4:3"
        }
        return "16:9"
    }

    @SuppressLint("UnsafeOptInUsageError")
    private fun setUpAnalysis() {
        if (imageAnalysis != null || analyserCallback == null) {
            return;
        }
        val builder = ImageAnalysis.Builder()
            .apply {
                setTargetRotation(getDeviceRotation())
                setBackpressureStrategy(STRATEGY_KEEP_ONLY_LATEST)
                setTargetAspectRatio(
                    when (displayRatio) {
                        "16:9" -> AspectRatio.RATIO_16_9
                        else -> AspectRatio.RATIO_4_3
                    }
                )
            }
        imageAnalysis = builder.build()
        imageAnalysis?.setAnalyzer(imageAnalysisExecutor, CameraAnalyzer setAnalyzer@{

            if (it.image != null && currentFrame != processEveryNthFrame) {
                it.close()
                incrementCurrentFrame()
                return@setAnalyzer
            }

            if (retrieveLatestImage) {
                latestImage = BitmapUtils.getBitmap(it)
            }

            if (it.image != null) {
                if (analyserCallback != null) {
                    val latch = CountDownLatch(1);
                    val processor = ImageAsyncProcessor(latch)
                    analyserCallback!!.process(it.image!!, it.imageInfo, processor)
                    latch.await();
                }
                it.close()
                resetCurrentFrame()
            }
        })
    }

    private var cachedPictureRatioSizeMap: MutableMap<String, MutableList<Size>> = HashMap()
    private var cachedPreviewRatioSizeMap: MutableMap<String, MutableList<Size>> = HashMap()

    @SuppressLint("UnsafeOptInUsageError")
    private fun updateImageCapture() {
        var wasBounded = false
        if (imageCapture != null) {
            wasBounded = cameraProvider?.isBound(imageCapture!!) ?: false
            if (wasBounded) {
                cameraProvider?.unbind(imageCapture)
                imageCapture = null
            }
        }

        val builder = ImageCapture.Builder().apply {
            setTargetRotation(getDeviceRotation())
            if (pictureSize == "0x0") {
                setTargetAspectRatio(
                    when (displayRatio) {
                        "16:9" -> AspectRatio.RATIO_16_9
                        else -> AspectRatio.RATIO_4_3
                    }
                )
            } else {
                try {
                    setTargetResolution(
                        android.util.Size.parseSize(pictureSize)
                    )
                } catch (e: Exception) {
                    setTargetAspectRatio(
                        when (displayRatio) {
                            "16:9" -> AspectRatio.RATIO_16_9
                            else -> AspectRatio.RATIO_4_3
                        }
                    )
                }
            }
            setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
            setFlashMode(getFlashMode())
        }

        val extender = Camera2Interop.Extender(builder)

        when (whiteBalance) {
            WhiteBalance.Auto -> {
                extender.setCaptureRequestOption(
                    CaptureRequest.CONTROL_AWB_MODE, CameraMetadata.CONTROL_AWB_MODE_AUTO
                )
            }
            WhiteBalance.Sunny -> {
                extender.setCaptureRequestOption(
                    CaptureRequest.CONTROL_AWB_MODE, CameraMetadata.CONTROL_AWB_MODE_DAYLIGHT
                )
            }
            WhiteBalance.Cloudy -> {
                extender.setCaptureRequestOption(
                    CaptureRequest.CONTROL_AWB_MODE, CameraMetadata.CONTROL_AWB_MODE_CLOUDY_DAYLIGHT
                )
            }
            WhiteBalance.Shadow -> {
                extender.setCaptureRequestOption(
                    CaptureRequest.CONTROL_AWB_MODE, CameraMetadata.CONTROL_AWB_MODE_SHADE
                )
            }
            WhiteBalance.Twilight -> {
                extender.setCaptureRequestOption(
                    CaptureRequest.CONTROL_AWB_MODE, CameraMetadata.CONTROL_AWB_MODE_TWILIGHT
                )
            }
            WhiteBalance.Fluorescent -> {
                extender.setCaptureRequestOption(
                    CaptureRequest.CONTROL_AWB_MODE, CameraMetadata.CONTROL_AWB_MODE_FLUORESCENT
                )
            }
            WhiteBalance.Incandescent -> {
                extender.setCaptureRequestOption(
                    CaptureRequest.CONTROL_AWB_MODE, CameraMetadata.CONTROL_AWB_MODE_INCANDESCENT
                )
            }
            WhiteBalance.WarmFluorescent -> {
                extender.setCaptureRequestOption(
                    CaptureRequest.CONTROL_AWB_MODE,
                    CameraMetadata.CONTROL_AWB_MODE_WARM_FLUORESCENT
                )
            }
        }

        imageCapture = builder.build()

        if (wasBounded) {
            if (!cameraProvider!!.isBound(imageCapture!!)) {
                cameraProvider?.bindToLifecycle(
                    context as LifecycleOwner,
                    selectorFromPosition(),
                    imageCapture!!
                )
            }
        }
    }

    private fun initPreview() {
        preview = Preview.Builder()
            .apply {

                setTargetRotation(getDeviceRotation())
                setTargetAspectRatio(
                    when (displayRatio) {
                        "16:9" -> AspectRatio.RATIO_16_9
                        else -> AspectRatio.RATIO_4_3
                    }
                )
            }
            .build()
            .also {
                it.setSurfaceProvider(this.previewView.surfaceProvider)
            }
        // Must unbind the use-cases before rebinding them
        cameraProvider?.unbindAll()
        try {
            camera = if (imageAnalysis != null) {

                cameraProvider?.bindToLifecycle(
                    context as LifecycleOwner,
                    selectorFromPosition(),
                    preview,
                    imageAnalysis
                )
            } else {
                cameraProvider?.bindToLifecycle(
                    context as LifecycleOwner,
                    selectorFromPosition(),
                    preview
                )
            }
        } catch (exc: Exception) {
            Log.e("JS", "Use case binding failed", exc)
        }

        listener?.onReady()
    }

    internal fun getRecorderQuality(quality: Quality): androidx.camera.video.Quality {
        return when (quality) {
            Quality.MAX_480P -> androidx.camera.video.Quality.SD
            Quality.MAX_720P -> androidx.camera.video.Quality.HD
            Quality.MAX_1080P -> androidx.camera.video.Quality.FHD
            Quality.MAX_2160P -> androidx.camera.video.Quality.UHD
            Quality.HIGHEST -> androidx.camera.video.Quality.HIGHEST
            Quality.LOWEST -> androidx.camera.video.Quality.LOWEST
            Quality.QVGA -> androidx.camera.video.Quality.LOWEST
        }
    }

    @SuppressLint("RestrictedApi")
    private fun initVideoCapture() {
        if (pause) {
            return
        }
        if (hasCameraPermission() && hasAudioPermission()) {
            val profile = getCamcorderProfile(quality)

            val recorder = Recorder.Builder()
                .setQualitySelector(
                    QualitySelector.from(
                        getRecorderQuality(quality),
                        FallbackStrategy.lowerQualityOrHigherThan(androidx.camera.video.Quality.SD)
                    )
                ).setExecutor(videoCaptureExecutor)
                .build()


            videoCapture = VideoCapture.withOutput(recorder).apply {
                targetRotation = getDeviceRotation()
            }
        }
    }


    @SuppressLint("RestrictedApi", "UnsafeOptInUsageError")
    private fun refreshCamera() {
        if (pause || !hasCameraPermission() || cameraProvider == null) {
            return
        }
        if (!hasCameraPermission()) return
        cachedPictureRatioSizeMap.clear()
        cachedPreviewRatioSizeMap.clear()

        videoCapture = null
        imageCapture = null
        imageAnalysis?.clearAnalyzer()
        imageAnalysis = null
        preview?.setSurfaceProvider(null)
        preview = null
        safeUnbindAll()

        setUpAnalysis()

        initPreview()

        initVideoCapture()

        handleZoom()

        camera?.cameraInfo?.let {
            val streamMap = Camera2CameraInfo.from(it)
                .getCameraCharacteristic(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP)

            if (streamMap != null) {
                val sizes =
                    streamMap.getOutputSizes(ImageFormat.JPEG) +
                            streamMap.getOutputSizes(SurfaceTexture::class.java)
                for (size in sizes) {
                    val aspect = size.width.toFloat() / size.height.toFloat()
                    var key: String? = null
                    val value = Size(size.width, size.height)
                    when (aspect) {
                        1.0F -> key = "1:1"
                        in 1.2F..1.2222222F -> key = "6:5"
                        in 1.3F..1.3333334F -> key = "4:3"
                        in 1.77F..1.7777778F -> key = "16:9"
                        1.5F -> key = "3:2"
                    }

                    if (key != null) {
                        val list = cachedPictureRatioSizeMap[key]
                        list?.let {
                            list.add(value)
                        } ?: run {
                            cachedPictureRatioSizeMap[key] = mutableListOf(value)
                        }
                    }
                }
            }
        }
        updateImageCapture()

        if (flashMode == CameraFlashMode.TORCH && camera?.cameraInfo?.hasFlashUnit() == true) {
            camera?.cameraControl?.enableTorch(true)
        }

        isStarted = true
        resetCurrentFrame()
        listener?.onCameraOpen()
    }


    override fun startPreview() {
        if (!isStarted) {
            refreshCamera()
        }
    }

    override fun stopPreview() {
        if (isStarted) {
            safeUnbindAll()
        }
    }

    override var flashMode: CameraFlashMode = CameraFlashMode.OFF
        set(value) {
            field = value
            camera?.let {
                when (value) {
                    CameraFlashMode.OFF -> {
                        it.cameraControl.enableTorch(false)
                        imageCapture?.flashMode = ImageCapture.FLASH_MODE_OFF
                    }
                    CameraFlashMode.ON, CameraFlashMode.RED_EYE -> imageCapture?.flashMode =
                        ImageCapture.FLASH_MODE_ON
                    CameraFlashMode.AUTO -> imageCapture?.flashMode = ImageCapture.FLASH_MODE_AUTO
                    CameraFlashMode.TORCH -> it.cameraControl.enableTorch(true)
                }
            }
        }

    @SuppressLint("RestrictedApi", "MissingPermission")
    override fun startRecording() {
        if (!hasAudioPermission() || !hasCameraPermission()) {
            return
        }
        deInitListener()
        val df = SimpleDateFormat("yyyyMMddHHmmss", Locale.US)
        val today = Calendar.getInstance().time
        val fileName = "VID_" + df.format(today) + ".mp4"
        file = if (saveToGallery && hasStoragePermission()) {
            val externalDir = context.getExternalFilesDir(Environment.DIRECTORY_DCIM)
            if (externalDir == null) {
                listener?.onCameraError(
                    "Cannot save video to gallery",
                    Exception("Failed to create uri")
                )
                return
            } else {
                if (!externalDir.exists()) {
                    externalDir.mkdirs()
                }
                File(externalDir, fileName)
            }

        } else {
            File(context.getExternalFilesDir(null), fileName)
        }

        try {
            if (videoCapture == null) {
                initVideoCapture()
            }
            cameraProvider?.let {
                if (it.isBound(imageCapture!!)) {
                    it.unbind(imageCapture!!)
                }

                if (!it.isBound(videoCapture!!)) {
                    it.bindToLifecycle(
                        context as LifecycleOwner,
                        selectorFromPosition(),
                        videoCapture!!
                    )
                }
            }

            val opts = FileOutputOptions.Builder(file!!).build()

            val pending = videoCapture?.output?.prepareRecording(
                context, opts
            )

            if (enableAudio) {
                pending?.withAudioEnabled()
            }

            recording = pending?.start(
                ContextCompat.getMainExecutor(context)
            ) { event ->
                when (event) {
                    is VideoRecordEvent.Start -> {
                        isRecording = true
                        if (flashMode == CameraFlashMode.ON) {
                            camera?.cameraControl?.enableTorch(true)
                        }
                        startDurationTimer()
                        listener?.onCameraVideoStart()
                    }
                    is VideoRecordEvent.Finalize -> {
                        isRecording = false
                        stopDurationTimer()

                        if (event.hasError()) {
                            file = null
                            val e = if (event.cause != null) {
                                Exception(event.cause)
                            } else {
                                Exception()
                            }
                            listener?.onCameraError("${event.error}", e)
                            if (isForceStopping) {
                                ContextCompat.getMainExecutor(context).execute {
                                    safeUnbindAll()
                                }

                                synchronized(mLock) {
                                    isForceStopping = false
                                }
                            }
                        } else {
                            if (isForceStopping) {
                                if (file != null) {
                                    file!!.delete()
                                }
                                ContextCompat.getMainExecutor(context).execute {
                                    safeUnbindAll()
                                }
                                synchronized(mLock) {
                                    isForceStopping = false
                                }
                            } else {
                                if (saveToGallery && hasStoragePermission()) {
                                    val values = ContentValues().apply {
                                        put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                                        put(
                                            MediaStore.Video.Media.DATE_ADDED,
                                            System.currentTimeMillis()
                                        )
                                        // hardcoded video/avc
                                        put(MediaStore.MediaColumns.MIME_TYPE, "video/avc")
                                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) { //this one
                                            put(
                                                MediaStore.MediaColumns.RELATIVE_PATH,
                                                Environment.DIRECTORY_DCIM
                                            )
                                            put(MediaStore.MediaColumns.IS_PENDING, 1)
                                            put(
                                                MediaStore.Video.Media.DATE_TAKEN,
                                                System.currentTimeMillis()
                                            )
                                        }

                                    }

                                    val uri = context.contentResolver.insert(
                                        MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                                        values
                                    )
                                    if (uri == null) {
                                        listener?.onCameraError(
                                            "Failed to add video to gallery",
                                            Exception("Failed to create uri")
                                        )
                                    } else {
                                        val fos = context.contentResolver.openOutputStream(uri)
                                        val fis = FileInputStream(file!!)
                                        fos.use {
                                            if (it != null) {
                                                fis.copyTo(it)
                                                it.flush()
                                                it.close()
                                                fis.close()
                                            }
                                        }
                                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) { //this one
                                            values.clear();
                                            values.put(MediaStore.Video.Media.IS_PENDING, 0);
                                            context.contentResolver.update(uri, values, null, null);
                                        }
                                        listener?.onCameraVideo(file)
                                    }

                                } else {
                                    listener?.onCameraVideo(file)
                                }
                            }
                        }
                    }
                }
            }

        } catch (e: Exception) {
            isRecording = false
            stopDurationTimer()
            if (file != null) {
                file!!.delete()
            }
            cameraProvider?.let {
                if (it.isBound(videoCapture!!)) {
                    it.unbind(videoCapture!!)
                }
                if (it.isBound(imageCapture!!)) {
                    it.unbind(imageCapture!!)
                }
            }
            isForceStopping = false
            listener?.onCameraError("Failed to record video.", e)
        }
    }

    @SuppressLint("RestrictedApi")
    override fun stopRecording() {
        if (flashMode == CameraFlashMode.ON) {
            camera?.cameraControl?.enableTorch(false)
        }
        recording?.stop()
    }

    override fun takePhoto() {
        val df = SimpleDateFormat("yyyyMMddHHmmss", Locale.US)
        val today = Calendar.getInstance().time
        val fileName = "PIC_" + df.format(today) + ".jpg"
        file = if (saveToGallery && hasStoragePermission()) {
            val externalDir = context.getExternalFilesDir(Environment.DIRECTORY_DCIM)
            if (externalDir == null) {
                listener?.onCameraError(
                    "Cannot save photo to gallery storage",
                    Exception("Failed to get external directory")
                )
                return
            } else {
                if (!externalDir.exists()) {
                    externalDir.mkdirs()
                }
                File(externalDir, fileName)
            }

        } else {
            File(context.getExternalFilesDir(null), fileName)
        }

        cameraProvider?.let { provider ->
            videoCapture?.let { if (provider.isBound(it)) provider.unbind(it) }

            if (imageCapture == null) updateImageCapture()
            imageCapture?.let { capture ->
                if (!provider.isBound(capture)) {
                    provider.bindToLifecycle(
                        context as LifecycleOwner,
                        selectorFromPosition(),
                        capture
                    )
                }
            } ?: run {
                listener?.onCameraError("Cannot take photo", Exception("imageCapture not set"))
                return
            }
        } ?: run {
            listener?.onCameraError("Cannot take photo", Exception("cameraProvider not set"))
            return
        }

        val useImageProxy = autoSquareCrop || !allowExifRotation
        if (useImageProxy) {
            imageCapture?.takePicture(
                imageCaptureExecutor,
                object : ImageCapture.OnImageCapturedCallback() {
                    override fun onCaptureSuccess(image: ImageProxy) {
                        processImageProxy(image, fileName)
                    }

                    override fun onError(exception: ImageCaptureException) {
                        listener?.onCameraError("Failed to take photo image", exception)
                    }
                })
        } else {
            val meta = ImageCapture.Metadata().apply {
                isReversedHorizontal = position == CameraPosition.FRONT
            }
            val options = ImageCapture.OutputFileOptions.Builder(file!!)
            options.setMetadata(meta)
            imageCapture?.takePicture(
                options.build(),
                imageCaptureExecutor,
                object : ImageCapture.OnImageSavedCallback {
                    override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                        processImageFile(fileName) // outputFileResults.savedUri.toString() is null
                    }

                    override fun onError(exception: ImageCaptureException) {
                        listener?.onCameraError("Failed to take photo image", exception)
                    }
                })
        }
    }

    private fun processImageProxy(image: ImageProxy, fileName: String) {
        var isError = false
        var outputStream: FileOutputStream? = null
        try {
            val meta = ImageCapture.Metadata().apply {
                isReversedHorizontal = position == CameraPosition.FRONT
            }

            val buffer = image.planes.first().buffer
            val bytes = ByteArray(buffer.remaining())
            buffer.get(bytes)

            val bm = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
            val matrix = Matrix()

            // Registering image's required rotation, provided by Androidx ImageAnalysis
            var imageTargetRotation = image.imageInfo.rotationDegrees
            matrix.postRotate(imageTargetRotation.toFloat())

            // Flipping over the image in case it is the front camera
            if (position == CameraPosition.FRONT)
                matrix.postScale(-1f, 1f)

            var originalWidth = bm.width
            var originalHeight = bm.height
            var offsetWidth = 0
            var offsetHeight = 0
            if (autoSquareCrop) {
                if (originalWidth < originalHeight) {
                    offsetHeight = (originalHeight - originalWidth) / 2;
                    originalHeight = originalWidth;
                } else {
                    offsetWidth = (originalWidth - originalHeight) / 2;
                    originalWidth = originalHeight;
                }
            }
            val rotated = Bitmap.createBitmap(
                bm,
                offsetWidth,
                offsetHeight,
                originalWidth,
                originalHeight,
                matrix,
                false
            )
            outputStream = FileOutputStream(file!!, false)
            var override: Bitmap? = null
            if (overridePhotoHeight > 0 && overridePhotoWidth > 0) {
                override = Bitmap.createScaledBitmap(
                    rotated,
                    overridePhotoWidth,
                    overridePhotoHeight,
                    false
                )
                override.compress(Bitmap.CompressFormat.JPEG, 92, outputStream)
            } else {
                rotated.compress(Bitmap.CompressFormat.JPEG, 92, outputStream)
            }


            val exif = ExifInterface(file!!.absolutePath)

            val now = System.currentTimeMillis()
            val datetime = convertToExifDateTime(now)

            exif.setAttribute(ExifInterface.TAG_DATETIME_ORIGINAL, datetime)
            exif.setAttribute(ExifInterface.TAG_DATETIME_DIGITIZED, datetime)

            try {
                val subsec = (now - convertFromExifDateTime(datetime).time).toString()
                exif.setAttribute(ExifInterface.TAG_SUBSEC_TIME_ORIGINAL, subsec)
                exif.setAttribute(ExifInterface.TAG_SUBSEC_TIME_DIGITIZED, subsec)
            } catch (e: ParseException) {
            }

            exif.rotate(image.imageInfo.rotationDegrees)
            if (meta.isReversedHorizontal) {
                exif.flipHorizontally()
            }
            if (meta.isReversedVertical) {
                exif.flipVertically()
            }
            if (meta.location != null) {
                exif.setGpsInfo(meta.location!!)
            }
            exif.saveAttributes()

            bm.recycle()
            rotated.recycle()
            override?.recycle()
        } catch (e: Exception) {
            isError = true
            listener?.onCameraError("Failed to save photo.", e)
        } finally {
            try {
                outputStream?.close()
            } catch (e: IOException) {
                //NOOP
            }
            try {
                image.close()
            } catch (e: Exception) {

            }
            if (!isError) {
                if (saveToGallery && hasStoragePermission()) {
                    val values = ContentValues().apply {
                        put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                        put(MediaStore.Images.Media.DATE_ADDED, System.currentTimeMillis())
                        put(MediaStore.MediaColumns.MIME_TYPE, "image/*")
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) { //this one
                            put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DCIM)
                            put(MediaStore.MediaColumns.IS_PENDING, 1)
                            put(MediaStore.Images.Media.DATE_TAKEN, System.currentTimeMillis())
                        }
                    }

                    val uri = context.contentResolver.insert(
                        MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                        values
                    )
                    if (uri == null) {
                        listener?.onCameraError(
                            "Failed to add photo to gallery",
                            Exception("Failed to create uri")
                        )
                    } else {
                        val fos = context.contentResolver.openOutputStream(uri)
                        val fis = FileInputStream(file!!)
                        fos.use {
                            if (it != null) {
                                fis.copyTo(it)
                                it.flush()
                                it.close()
                                fis.close()
                            }
                        }
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) { //this one
                            values.clear();
                            values.put(MediaStore.Images.Media.IS_PENDING, 0);
                            context.contentResolver.update(uri, values, null, null);
                        }
                        listener?.onCameraPhoto(file)
                    }

                } else {
                    listener?.onCameraPhoto(file)
                }

            }
        }
    }

    private fun processImageFile(fileName: String) {
        // Saving image to user gallery
        if (saveToGallery && hasStoragePermission()) {
            val values = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                put(MediaStore.Images.Media.DATE_ADDED, System.currentTimeMillis())

                put(MediaStore.MediaColumns.MIME_TYPE, "image/*")
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) { //this one
                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DCIM)
                    put(MediaStore.MediaColumns.IS_PENDING, 1)
                    put(MediaStore.Images.Media.DATE_TAKEN, System.currentTimeMillis())
                }
            }

            val uri =
                context.contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
            if (uri == null) {
                listener?.onCameraError(
                    "Failed to add photo to gallery",
                    Exception("Failed to create uri")
                )
            } else {
                val fos = context.contentResolver.openOutputStream(uri)
                val fis = FileInputStream(file!!)
                fos.use {
                    if (it != null) {
                        fis.copyTo(it)
                        it.flush()
                        it.close()
                        fis.close()
                    }
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) { //this one
                    values.clear()
                    values.put(MediaStore.Images.Media.IS_PENDING, 0)
                    context.contentResolver.update(uri, values, null, null)
                }
                listener?.onCameraPhoto(file)
            }

        } else {
            listener?.onCameraPhoto(file)
        }
    }

    override fun hasFlash(): Boolean {
        return camera?.cameraInfo?.hasFlashUnit() ?: false
    }

    override fun cameraRecording(): Boolean {
        return isRecording
    }


    override fun toggleCamera() {
        if (!isRecording) {
            position = when (position) {
                CameraPosition.BACK -> CameraPosition.FRONT
                CameraPosition.FRONT -> CameraPosition.BACK
            }
            safeUnbindAll()
            refreshCamera()
        }
    }

    override fun getSupportedRatios(): Array<String> {
        return cachedPreviewRatioSizeMap.keys.toTypedArray()
    }

    override fun getAvailablePictureSizes(ratio: String): Array<Size> {
        return cachedPictureRatioSizeMap[ratio]?.toTypedArray() ?: arrayOf()
    }

    override fun stop() {
        if (!isForceStopping) {
            if (isRecording) {
                isForceStopping = true
                stopRecording()
            } else {
                safeUnbindAll()
            }
        }
    }


    override fun release() {
        if (!isForceStopping) {
            if (isRecording) {
                isForceStopping = true
                stopRecording()
            } else {
                safeUnbindAll()
            }
            preview?.setSurfaceProvider(null)
            preview = null
            imageCapture = null
            videoCapture = null
            imageAnalysis = null
            camera = null
        }
        deInitListener()
    }


    /**
     * Our custom image analysis class.
     *
     * <p>All we need to do is override the function `analyze` with our desired operations. Here,
     * we compute the average luminosity of the image by looking at the Y plane of the YUV frame.
     */
    private class CameraAnalyzer(listener: CameraAnalyzerListener? = null) : ImageAnalysis.Analyzer {
        private val listeners = ArrayList<CameraAnalyzerListener>().apply { listener?.let { add(it) } }
        /**
         * Used to add listeners that will be called with each image
         */
        fun onFrameAnalyzed(listener: CameraAnalyzerListener) = listeners.add(listener)
        @SuppressLint("UnsafeOptInUsageError")
        override fun getTargetResolutionOverride(): android.util.Size? {
            return null
        }
        override fun analyze(image: ImageProxy) {
            // If there are no listeners attached, we don't need to perform analysis
            if (listeners.isEmpty()) {
                image.close()
                return
            }
            listeners.forEach { it(image) }

        }
    }
}