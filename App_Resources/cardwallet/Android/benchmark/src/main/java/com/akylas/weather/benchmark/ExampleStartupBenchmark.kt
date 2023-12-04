package com.akylas.weather.benchmark

import android.content.Intent
import android.graphics.Point
import androidx.benchmark.macro.BaselineProfileMode
import androidx.benchmark.macro.CompilationMode
import androidx.benchmark.macro.MacrobenchmarkScope
import androidx.benchmark.macro.StartupMode
import androidx.benchmark.macro.StartupTimingMetric
import androidx.benchmark.macro.junit4.MacrobenchmarkRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.uiautomator.By
import androidx.test.uiautomator.Until
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * This is an example startup benchmark.
 *
 *
 * It navigates to the device's home screen, and launches the default activity.
 *
 *
 * Before running this benchmark:
 * 1) switch your app's active build variant in the Studio (affects Studio runs only)
 * 2) add `<profileable android:shell="true"></profileable>` to your app's manifest, within the `<application>` tag
</application> *
 *
 * Run this benchmark from Studio to see startup measurements, and captured system traces
 * for investigating your app's performance.
 */
@RunWith(AndroidJUnit4::class)
@LargeTest
class ExampleStartupBenchmark {
    @get:Rule
    val mBenchmarkRule = MacrobenchmarkRule()
    @Test
    fun startupNoCompilation() = startup(CompilationMode.None())

    @Test
    fun startupPartialWithBaselineProfiles() =
        startup(CompilationMode.Partial(baselineProfileMode = BaselineProfileMode.Require))

    @Test
    fun startupPartialCompilation() = startup(
        CompilationMode.Partial(
            baselineProfileMode = BaselineProfileMode.Disable,
            warmupIterations = 3
        )
    )

    @Test
    fun startupFullCompilation() = startup(CompilationMode.Full())

    private fun startup(compilationMode: CompilationMode) = mBenchmarkRule.measureRepeated(
        packageName = PACKAGE_NAME,
        metrics = listOf(StartupTimingMetric()),
        compilationMode = compilationMode,
        iterations = 10,
        startupMode = StartupMode.COLD,
        setupBlock = {
            pressHome()
        }
    ) {
        // Waits for the first rendered frame, which represents time to initial display.
        val intent = Intent()
        intent.setPackage(PACKAGE_NAME)
        startActivityAndWait(intent)

        // Waits for content to be visible, which represents time to fully drawn.
        device.wait(Until.hasObject(By.scrollable(true)), 5_000)
        val recycler = device.findObject(By.scrollable(true))
        // Setting a gesture margin is important otherwise gesture nav is triggered.
        recycler.setGestureMargin(device.displayWidth / 5)

        // From center we scroll 2/3 up to trigger a refresh
        recycler.drag(Point(0, -recycler.visibleCenter.y / 3))

        // From center we scroll 2/3 of it which is 1/3 of the screen.
        recycler.drag(Point(0, recycler.visibleCenter.y / 3))
        device.waitForIdle()
        device.pressBack()
    }


    companion object {
        private const val PACKAGE_NAME = "akylas.alpi.maps"

    }
}