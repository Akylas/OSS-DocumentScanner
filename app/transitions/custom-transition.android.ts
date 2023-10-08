import { Transition } from '@nativescript/core';
export class CustomTransition extends Transition {
    public createAndroidAnimator(transitionType: string): android.animation.Animator {
        const scaleValues = Array.create('float', 2);
        const opacityValues = Array.create('float', 2);
        switch (transitionType) {
            case Transition.AndroidTransitionType.enter:
                scaleValues[0] = 0.5;
                scaleValues[1] = 1;
                opacityValues[0] = 0;
                opacityValues[1] = 1;
                break;
            case Transition.AndroidTransitionType.popEnter:
                scaleValues[0] = 1.2;
                scaleValues[1] = 1;
                opacityValues[0] = 0;
                opacityValues[1] = 1;
                break;
            case Transition.AndroidTransitionType.exit:
                scaleValues[0] = 1;
                scaleValues[1] = 1.2;
                opacityValues[0] = 1;
                opacityValues[1] = 0;
                break;
            case Transition.AndroidTransitionType.popExit:
                scaleValues[0] = 1;
                scaleValues[1] = 0.8;
                opacityValues[0] = 1;
                opacityValues[1] = 0;
                break;
        }
        const objectAnimators = Array.create(android.animation.Animator, 3);
        objectAnimators[0] = android.animation.ObjectAnimator.ofFloat(null, 'scaleX', scaleValues);
        objectAnimators[1] = android.animation.ObjectAnimator.ofFloat(null, 'scaleY', scaleValues);
        objectAnimators[2] = android.animation.ObjectAnimator.ofFloat(null, 'alpha', opacityValues);

        const animatorSet = new android.animation.AnimatorSet();
        animatorSet.playTogether(objectAnimators);

        const duration = this.getDuration();
        if (duration !== undefined) {
            animatorSet.setDuration(duration);
        }

        animatorSet.setInterpolator(this.getCurve());
        return animatorSet;
    }
}
