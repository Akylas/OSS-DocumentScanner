const MIN_SCALE = 0.85;
const MIN_ALPHA = 0.5;

@NativeClass
@Interfaces([androidx.viewpager2.widget.ViewPager2.PageTransformer])
export default class ZoomOutTransformer extends java.lang.Object {
    constructor() {
        super();
        return global.__native(this);
    }

    public transformPage(page, position) {
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        if (position < -1) {
            // [ -Infinity,-1 )
            // This page is way off-screen to the left.
            page.setAlpha(0);
        } else if (position <= 1) {
            // [ -1,1 ]
            // Modify the default slide transition to shrink the page as well
            const scaleFactor = Math.max(MIN_SCALE, 1 - Math.abs(position));
            const vertMargin = (pageHeight * (1 - scaleFactor)) / 2;
            const horzMargin = (pageWidth * (1 - scaleFactor)) / 2;
            if (position < 0) {
                page.setTranslationX(horzMargin - vertMargin / 2);
            } else {
                page.setTranslationX(-horzMargin + vertMargin / 2);
            }

            // Scale the page down ( between MIN_SCALE and 1 )
            page.setScaleX(scaleFactor);
            page.setScaleY(scaleFactor);

            // Fade the page relative to its size.
            page.setAlpha(MIN_ALPHA + ((scaleFactor - MIN_SCALE) / (1 - MIN_SCALE)) * (1 - MIN_ALPHA));
        } else {
            // ( 1,+Infinity ]
            // This page is way off-screen to the right.
            page.setAlpha(0);
        }
    }
}
