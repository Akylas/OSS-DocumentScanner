set -e
set -o pipefail

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

SOURCE_NAME="canvas"
ANDROID_SOURCE_DIR="$CURRENT_DIR"

PROJECT_NAME="$SOURCE_NAME"

BUILD_OUTPUT_DIR="$ANDROID_SOURCE_DIR/$PROJECT_NAME/build/outputs/aar/"

PLUGIN_TARGET_DIR="$CURRENT_DIR/../../plugin/platforms"
PLUGIN_TARGET_SUBDIR="$PLUGIN_TARGET_DIR/android"

cd $ANDROID_SOURCE_DIR

./gradlew clean assembleRelease

echo "$PROJECT_NAME-release.aar was built in $BUILD_OUTPUT_DIR"

if [ ! -d $PLUGIN_TARGET_DIR ]; then
    mkdir $PLUGIN_TARGET_DIR
fi

if [ ! -d $PLUGIN_TARGET_SUBDIR ]; then
    mkdir $PLUGIN_TARGET_SUBDIR
fi

# cp -R "$BUILD_OUTPUT_DIR/$PROJECT_NAME-release.aar" $PLUGIN_TARGET_SUBDIR

# echo "force livesync" > "$PLUGIN_TARGET_SUBDIR/sync"

# echo "Android library was copied to $PLUGIN_TARGET_SUBDIR"

cd $CURRENT_DIR
