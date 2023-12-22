package com.akylas.cardwallet.benchmark

import android.graphics.Point
import android.os.Build
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.benchmark.macro.junit4.BaselineProfileRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.uiautomator.By
import androidx.test.uiautomator.Direction
import androidx.test.uiautomator.Until
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class BaselineProfileGenerator {
    @RequiresApi(Build.VERSION_CODES.P)
    @get:Rule
    val baselineProfileRule = BaselineProfileRule()

    @Before
    fun grantPhonePermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            InstrumentationRegistry.getInstrumentation().uiAutomation.executeShellCommand(
                "pm grant $PACKAGE_NAME android.permission.READ_EXTERNAL_STORAGE"
            )
            InstrumentationRegistry.getInstrumentation().uiAutomation.executeShellCommand(
                "pm grant $PACKAGE_NAME android.permission.WRITE_EXTERNAL_STORAGE"
            )
        }
    }

    @RequiresApi(Build.VERSION_CODES.P)
    @Test
    fun startup() = baselineProfileRule.collect(
        packageName = PACKAGE_NAME,
        profileBlock = {
            startActivityAndWait()
            // access file permission on android 12+
            device.wait(Until.hasObject(By.checkable(true)), 1_000)
            val switch = device.findObject(By.checkable(true));
            if (switch != null) {
                switch.click()
                device.pressBack()
                device.waitForIdle()
            }
    
            // Waits for content to be visible, which represents time to fully drawn.
            val input = By.desc("cartoMap")
            device.wait(Until.hasObject(input), 2_000)
            val scrollable = device.findObject(input)
            // Setting a gesture margin is important otherwise gesture nav is triggered.
//            scrollable.setGestureMargin(device.displayWidth / 5)

            // From center we scroll 2/3 of it which is 1/3 of the screen.
            scrollable.drag(Point(0, scrollable.visibleCenter.y / 3))
            device.waitForIdle()
            device.pressBack()
        }
    )

    companion object {
        private const val PACKAGE_NAME = "com.akylas.cardwallet"
    }
}