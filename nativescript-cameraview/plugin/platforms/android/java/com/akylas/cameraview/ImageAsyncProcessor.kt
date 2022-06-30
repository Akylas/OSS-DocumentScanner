package com.akylas.cameraview

import java.lang.Exception
import java.util.concurrent.CountDownLatch

class ImageAsyncProcessor(l: CountDownLatch) {
    var latch: CountDownLatch;
    init {
        latch = l
    }
    fun finished() {
        latch.countDown()
    }
}