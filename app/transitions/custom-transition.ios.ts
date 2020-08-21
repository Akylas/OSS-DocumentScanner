import { Transition } from '@nativescript/core/ui/transition';

export class CustomTransition extends Transition {
    public animateIOSTransition(containerView: UIView, fromView: UIView, toView: UIView, operation: UINavigationControllerOperation, completion: (finished: boolean) => void): void {
        const originalToViewTransform = toView.transform;
        const originalFromViewTransform = fromView.transform;

        // http://stackoverflow.com/questions/216076/uiview-scale-to-0-using-cgaffinetransformmakescale
        const scaleTransform = CGAffineTransformMakeScale(0.0001, 0.0001);

        toView.transform = scaleTransform;
        fromView.transform = CGAffineTransformIdentity;

        switch (operation) {
            case UINavigationControllerOperation.Push:
                containerView.insertSubviewAboveSubview(toView, fromView);
                break;
            case UINavigationControllerOperation.Pop:
                containerView.insertSubviewBelowSubview(toView, fromView);
                break;
        }

        const duration = this.getDuration();
        const curve = this.getCurve();
        UIView.animateWithDurationAnimationsCompletion(
            duration,
            () => {
                UIView.setAnimationCurve(curve);
                toView.transform = CGAffineTransformIdentity;
                fromView.transform = scaleTransform;
            },
            (finished: boolean) => {
                toView.transform = originalToViewTransform;
                fromView.transform = originalFromViewTransform;
                completion(finished);
            }
        );
    }
}
