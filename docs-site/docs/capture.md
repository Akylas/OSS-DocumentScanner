---
id: capture
title: Capture Documents
sidebar_position: 2
slug: /capture
---

# Capturing Documents

OSS Document Scanner provides powerful capture capabilities with automatic edge detection, multiple capture modes, and batch scanning support.

![Capture Screen](/img/capture-1.png)

## Capture Modes

### Auto Capture

The default capture mode uses intelligent edge detection to automatically capture documents when:

- The document is properly positioned within the viewfinder
- All four edges are detected
- The image is stable (no motion blur)

**How to use Auto Capture:**

1. Hold your device steady above the document
2. Wait for the green frame to appear around the document edges
3. The app will automatically capture when conditions are optimal

### Manual Capture

For situations where auto-capture doesn't work well (glossy surfaces, low contrast):

1. Tap the **Manual** button in the capture toolbar
2. Frame your document in the viewfinder
3. Tap the **shutter button** to capture

### Continuous Capture

Perfect for scanning multiple pages in quick succession:

1. Enable **Continuous Mode** from the capture settings
2. The app will capture pages one after another
3. A brief pause between captures allows you to flip pages

## Batch Scanning

Batch scanning allows you to scan multiple pages into a single document:

1. Start capturing pages as normal
2. Each captured page is added to the current batch
3. Review all pages in the batch preview
4. Tap **Done** when finished to create the document

### Managing Batch Pages

- **Reorder**: Drag and drop pages to rearrange
- **Delete**: Swipe to remove unwanted pages
- **Re-scan**: Tap a page to recapture it
- **Add**: Continue scanning to add more pages

## Auto Edge Detection

The app uses advanced computer vision (OpenCV) to detect document edges:

### How It Works

1. The camera feed is analyzed in real-time
2. Contours are detected in the image
3. Quadrilateral shapes are identified as potential documents
4. The largest valid quadrilateral is selected as the document boundary

### Tips for Better Detection

- **Good lighting**: Ensure even lighting without harsh shadows
- **Contrast**: Place documents on contrasting backgrounds
- **Flat surface**: Keep documents flat to avoid warped edges
- **Clean lens**: Wipe your camera lens for clear captures

### Manual Adjustment

If auto-detection doesn't perfectly identify edges:

1. After capture, the edge adjustment screen appears
2. Drag the corner handles to adjust the document boundaries
3. Drag edge midpoints for fine adjustments
4. Tap **Crop** to apply the selection

![Edge Adjustment](/img/edit-1.png)

## Camera Settings

Access camera settings by tapping the **gear icon** in the capture view:

### Resolution

Choose capture resolution based on your needs:

- **Standard**: Faster processing, smaller file sizes
- **High**: Good balance of quality and performance
- **Maximum**: Best quality, larger files, slower processing

### Flash Control

- **Auto**: Flash fires when needed in low light
- **On**: Flash always fires
- **Off**: Flash disabled

### Focus Mode

- **Auto Focus**: Tap to focus on specific areas
- **Continuous**: Camera continuously adjusts focus

## Source Code Reference

The capture functionality is implemented in:

| Component | Location |
|-----------|----------|
| Camera UI | `app/components/camera/` |
| Edge Detection | `opencv/` and `cpp/src/` |
| Native Camera Plugin | `plugin-nativeprocessor/` |
| Document Processing | `app/services/documents.ts` |

:::info Native Processing
The edge detection and image processing use OpenCV through native bindings. See `plugin-nativeprocessor/` for the NativeScript plugin that bridges JavaScript to native code.
:::

## Troubleshooting

### Document edges not detected

- Ensure good lighting conditions
- Use a contrasting background
- Try manual capture mode
- Clean your camera lens

### Blurry captures

- Hold the device steady
- Wait for auto-focus to complete
- Ensure adequate lighting
- Try manual focus by tapping the screen

### Auto-capture too sensitive/slow

- Adjust auto-capture sensitivity in settings
- Switch to manual capture for difficult documents
