import { Application, ApplicationEventData, Observable } from '@nativescript/core';
import { BiometricAuth, ERROR_CODES, VerifyBiometricOptions } from '@nativescript/biometrics';
import { booleanProperty, stringProperty } from './BackendService';
import { l, lc } from '~/helpers/locale';
import { showModal } from '~/utils/svelte/ui';
import { showSnack } from '~/utils/ui';

export interface PasscodeWindowOptions {
    creation?: boolean;
    change?: boolean;
    closeOnBack?: boolean;
    allowClose?: boolean;
    storePassword?: string;
}

const TAG = '[SecurityService]';

/**
 * Parent service class. Has common configs and methods.
 */
export default class SecurityService extends Observable {
    private biometricAuth = new BiometricAuth();
    @stringProperty storedPassword: string;
    @booleanProperty({ default: false }) biometricEnabled: boolean;
    @booleanProperty({ default: false }) pincodeEnabled: boolean;
    @booleanProperty({ default: false }) autoLockEnabled: boolean;
    biometricsAvailable = true;
    mIgnoreNextValidation = false;
    started = false;
    async start() {
        if (this.started) {
            return;
        }
        this.started = true;
        DEV_LOG && console.log(TAG, 'start', this.background);
        Application.on(Application.foregroundEvent, this.onAppForeground, this);
        Application.on(Application.backgroundEvent, this.onAppBackground, this);
        // Application.on(Application.exitEvent, this.onAppExit, this);
        const r = await this.biometricAuth.available();
        this.biometricsAvailable = r.biometrics || r.touch || r.face;
        if (this.biometricsAvailable) {
            this.validateSecurityOrClose();
        }
    }
    stop() {
        if (!this.started) {
            return;
        }
        DEV_LOG && console.log(TAG, 'stop', this.background, this.started);
        this.started = false;
        this.background = false;
        Application.off(Application.foregroundEvent, this.onAppForeground, this);
        Application.off(Application.backgroundEvent, this.onAppBackground, this);
        // Application.off(Application.exitEvent, this.onAppExit, this);
    }

    // launched = false;
    background = false;
    async onAppForeground(args: ApplicationEventData) {
        if (this.background) {
            this.background = false;
            DEV_LOG && console.log(TAG, 'onAppForeground', this.background, this.started, this.autoLockEnabled);
            if (this.started && this.autoLockEnabled) {
                // this.launched = true;
                await this.validateSecurityOrClose();
            }
        }
    }
    onAppBackground(args: ApplicationEventData) {
        DEV_LOG && console.log(TAG, 'onAppBackground', this.background, this.started, this.autoLockEnabled);
        if (!this.background) {
            this.background = true;
        }
    }
    // onAppExit(args: ApplicationEventData) {
    //     this.launched = false;
    // }
    clear() {
        this.storedPassword = null;
        this.autoLockEnabled = false;
        this.biometricEnabled = false;
    }
    passcodeSet() {
        return !!this.storedPassword;
    }
    validating = false;

    public ignoreNextValidation() {
        if (!this.biometricEnabled) {
            return;
        }
        this.mIgnoreNextValidation = true;
    }
    async validateSecurityOrClose(options = {}) {
        DEV_LOG && console.log('validateSecurityOrClose', this.validating, this.mIgnoreNextValidation);
        if (this.mIgnoreNextValidation) {
            this.mIgnoreNextValidation = false;
            return;
        }
        try {
            await this.validateSecurity({ closeOnBack: true, ...options });
        } catch (error) {
            DEV_LOG && console.error('validateSecurityOrClose error', error);
            if (error.code === 50 || error.code === 60 || error.code === -3) {
                if (__ANDROID__) {
                    Application.android.startActivity.finish();
                }
            } else {
                throw error;
            }
        }
    }

    async enableBiometric() {
        try {
            DEV_LOG && console.log('enableBiometric');
            this.biometricEnabled = await this.verifyFingerprint({});
            return this.biometricEnabled;
        } catch (error) {
            throw error;
        }
    }
    async disableBiometric() {
        try {
            if (this.biometricEnabled) {
                if (await this.verifyFingerprint()) {
                    this.clear();
                    this.biometricEnabled = false;
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    async createPasscode() {
        return this.showPasscodeWindow({
            creation: true
        }).then((r) => {
            this.storedPassword = r.passcode;
        });
    }
    async changePasscode() {
        const r = await this.showPasscodeWindow({
            change: true,
            storePassword: this.storedPassword
        });
        if (this.storedPassword === r.oldPasscode) {
            this.storedPassword = r.passcode;
            return true;
        }
        return false;
    }
    showingPasscodeWindow = false;
    async showPasscodeWindow(options?: PasscodeWindowOptions): Promise<{ passcode: string; oldPasscode?: string; validated?: boolean }> {
        if (this.showingPasscodeWindow) {
            return;
        }
        try {
            this.showingPasscodeWindow = true;
            const component = (await import('~/components/security/PasscodeWindow.svelte')).default;
            return showModal({
                page: component,
                animated: true,
                fullscreen: true,
                props: options
            });
        } catch (error) {
            throw error;
        } finally {
            this.showingPasscodeWindow = false;
        }
    }
    async shouldReAuth() {
        DEV_LOG && console.log('shouldReAuth', this.biometricEnabled);
        if (this.biometricEnabled !== true) {
            return false;
        }
        const changed = await this.biometricAuth.didBiometricDatabaseChange();
        return !changed;
    }
    async validateSecurity(options?: PasscodeWindowOptions) {
        if (!this.biometricEnabled || this.validating) {
            return;
        }
        this.validating = true;

        try {
            // if (!this.pincodeEnabled || options?.closeOnBack !== true) {
            // return this.verifyFingerprint();
            // } else {
            const result = await this.showPasscodeWindow({ allowClose: false, storePassword: this.storedPassword, ...options });
            const validated = result && (result.validated === true || result.passcode === this.storedPassword);
            if (!validated && result?.passcode) {
                setTimeout(() => showSnack({ message: l('wrong_passcode'), view: Application.getRootView() }), 300);
            }
            if (validated) {
                // ensure validating is set before notify
                // look at a proper way without duplicated code
                this.validating = false;
                this.notify({
                    eventName: 'validated'
                });
            }
            return validated;
            // }
        } catch (error) {
            throw error;
        } finally {
            this.validating = false;
        }
    }
    async verifyFingerprint(options: VerifyBiometricOptions = {}) {
        try {
            DEV_LOG && console.log('verifyFingerprint', options);
            const result = await this.biometricAuth.verifyBiometric({ message: lc('authenticate_security'), ...options });
            return result.code === ERROR_CODES.SUCCESS;
        } catch (error) {
            console.error(error, error.stack);
            throw error;
        }
    }
}

export const securityService = new SecurityService();
