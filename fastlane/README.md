fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
### test
```
fastlane test
```
test lane
### checkGitStatus
```
fastlane checkGitStatus
```
Check Git Status
### tns_install
```
fastlane tns_install
```
Ensure deps are installed
### prepare
```
fastlane prepare
```
Prepare the application.
### build_flavor
```
fastlane build_flavor
```

### sentry_upload_sourcemaps
```
fastlane sentry_upload_sourcemaps
```

### get_changelog
```
fastlane get_changelog
```


----

## iOS
### ios registerDevice
```
fastlane ios registerDevice
```
Register device
### ios sentry_upload
```
fastlane ios sentry_upload
```
Upload Dsyms to Sentry
### ios upload_store
```
fastlane ios upload_store
```

### ios certificates
```
fastlane ios certificates
```
Fetch certificates and provisioning profiles
### ios build
```
fastlane ios build
```
Build the iOS application.
### ios beta
```
fastlane ios beta
```
Ship iOS build to Testflight.
### ios alpha
```
fastlane ios alpha
```
Ship iOS build to Testflight.

----

## Android
### android sentry_upload
```
fastlane android sentry_upload
```
Upload  to Sentry
### android write_changelog
```
fastlane android write_changelog
```

### android upload_store
```
fastlane android upload_store
```

### android build
```
fastlane android build
```
Build the Android application.
### android beta
```
fastlane android beta
```
Ship to Android Playstore Beta.
### android alpha
```
fastlane android alpha
```
Ship to Android Playstore Alpha.

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
