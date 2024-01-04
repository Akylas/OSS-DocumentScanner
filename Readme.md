<!-- <p align="center"><img src="fastlane/metadata/android/en-US/images/featureGraphic.png" width="100%"></a></p> -->

<!-- <img title="" src="./fastlane/metadata/com.akylas.documentscanner/android/en-US/images/icon.png" align="right" width="64"> -->
<img title="" src="./featureGraphic.png">

<!-- # OSS Document Scanner -->

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](COC.md)
[![GitHub repo stars](https://img.shields.io/github/stars/Akylas/com.akylas.documentscanner?style=flat)](https://github.com/Akylas/com.akylas.documentscanner/stargazers)
[![GitHub License](https://img.shields.io/github/license/Akylas/com.akylas.documentscanner)](https://github.com/Akylas/com.akylas.documentscanner/blob/master/COPYING)
[![GitHub All Releases](https://img.shields.io/github/downloads/Akylas/com.akylas.documentscanner/total.svg)](https://github.com/Akylas/com.akylas.documentscanner/releases/)
[![GitHub release](https://img.shields.io/github/v/release/Akylas/com.akylas.documentscanner?display_name=release)](https://github.com/Akylas/com.akylas.documentscanner/releases/latest)
[![Small translation badge](https://hosted.weblate.org/widgets/neo-backup/-/svg-badge.svg)](https://hosted.weblate.org/engage/neo-backup/?utm_source=widget)

<!-- <h1 align="center">Scan all your documents</h1>
<p align="center">
  <a href="https://github.com/Akylas/com.akylas.documentscanner" alt="License"><img src="https://img.shields.io/badge/License-MIT-blue.svg"/></a>
 <a href="https://github.com/Akylas/com.akylas.documentscanner/releases" alt="Release version"><img src="https://img.shields.io/github/downloads/akylas/com.akylas.documentscanner/total"/></a> -->

 ## Installation

<!-- [<img src="https://fdroid.gitlab.io/artwork/badge/get-it-on.png" alt="Get it on F-Droid" height="80">](https://f-droid.org/packages/com.machiav3lli.backup/) -->
[<img src="https://gitlab.com/IzzyOnDroid/repo/-/raw/master/assets/IzzyOnDroid.png" alt="Get it on IzzyOnDroid" height="80">](https://apt.izzysoft.de/packages/com.akylas.documentscanner)
[<img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on PlayStore" height="80">](https://play.google.com/store/apps/details?id=com.akylas.documentscanner)
[<img src="badge_github.png" alt="Get it on GitHub" height="80">](https://github.com/Akylas/com.akylas.documentscanner/releases)
<div>

<a href="https://apps.apple.com/us/app/oss-document-scanner/id6472918564"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1496188800" alt="Download on the App Store" height="58"></a>
</div>
 
<!-- <p align="center">
<br>You can get the <a href="https://github.com/com.akylas.documentscanner/releases/latest">latest release on GitHub</a>
</p>
<div align="center">
<a href="https://apt.izzysoft.de/packages/com.akylas.documentscanner/"><img src="https://gitlab.com/IzzyOnDroid/repo/-/raw/master/assets/IzzyOnDroid.png" height="80"></a>
<a href='https://play.google.com/store/apps/details?id=com.akylas.documentscanner&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'  height="82"/></a>
<br>
<a href="https://testflight.apple.com/join/sxiV4ZKL"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1496188800" alt="Download on the App Store" height="58"></a>
</div>
</div> -->
<h2 align="center">Enjoying OSS Document Scanner?</h2>
<p align="center">Please consider making a small donation to help fund the project. Developing an application, especially one that is open source and completely free, takes a lot of time and effort.
<br>
<br>
<div align="center">
<a href="https://github.com/sponsors/farfromrefug">:heart: Sponsor</a>
</div>
<hr>

Open Source app to scan your documents.

## Screenshots

| <img src="fastlane/metadata/com.akylas.documentscanner/android/en-US/images/phoneScreenshots/1_en-US.png" width=276> | <img src="fastlane/metadata/com.akylas.documentscanner/android/en-US/images/phoneScreenshots/2_en-US.png" width=276> | <img src="fastlane/metadata/com.akylas.documentscanner/android/en-US/images/phoneScreenshots/3_en-US.png" width=276> |

### Having issues, suggestions and feedback?

You can,
- [Create an issue here](https://github.com/Akylas/com.akylas.documentscanner/issues)

### Contributors

Thanks to our contributors:
* [Enrico Dell'Oste](https://www.smartpixel.it/)

### Languages: [<img align="right" src="https://hosted.weblate.org/widgets/oss-document-scanner/-/287x66-white.png" alt="Übersetzungsstatus" />](https://hosted.weblate.org/engage/oss-document-scanner/?utm_source=widget)

[<img src="https://hosted.weblate.org/widgets/oss-document-scanner/-/multi-auto.svg" alt="Übersetzungsstatus" />](https://hosted.weblate.org/engage/oss-document-scanner/)

The Translations are hosted by [Weblate.org](https://hosted.weblate.org/engage/oss-document-scanner/).


<p align="center">
  <a href="https://raw.githubusercontent.com/farfromrefug/sponsorkit/main/sponsors.svg">
	<img src='https://raw.githubusercontent.com/farfromrefug/sponsorkit/main/sponsors.svg'/>
  </a>
</p>

### Building

This app uses opencv and tesseract. I did not include the libraries because there are huge and would make the github repo too big.

#### OpenCV

* **Android**:
You can download Opencv 4.8.0 for android [here](https://github.com/nihui/opencv-mobile/releases/latest/download/opencv-mobile-4.8.1-apple.zip).
Then place the necessary libs/includes in the `opencv/android` at the root of this repo like shown here:
![opencv directory structure](images/opencv_structure.png)

* **iOS** :
You can download Opencv 4.8.0 for iOS [here](https://github.com/opencv/opencv/releases/download/4.8.0/opencv-4.8.0-ios-framework.zip).
Then place the `opencv2.xcframework` in the `opencv/ios` at the root of this repo

This should be enough. Android and iOS build will use it using symlinks

#### Tesseract
It is a bit trickier for Tesseract as we need to compile it 

* **Android**:
    - clone [https://github.com/Akylas/Tesseract4Android](https://github.com/Akylas/Tesseract4Android)
    - build with `./gradlew assembleRelease`
    - search for the built static libs (search for `libtesseract.a`) in `tesseract4android/build/intermediates/cxx/*/obj`
    - copy the static libs and the includes(in `tesseract4android/src/main/cpp/tesseract/src/include`) in the `tesseract/android` at the root of this repo like shown here:
![opencv directory structure](images/tesseract_structure.png)

* **iOS**:
    - clone [https://github.com/Akylas/TesseractBuild](https://github.com/Akylas/TesseractBuild)
    - build with `./Scripts/Build_All.sh`
    - copy everything from `Root` to the `tesseract/ios` at the root of this repo

#### Yarn

You need to use yarn with this project as it uses the `portal:` protocol for some dependencies.
Note that the project has some `yarn link` for easy local dev for me. The best is for you to remove the `resolutions` part of the `package.json`
