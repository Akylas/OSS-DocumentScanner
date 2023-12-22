import { Application, ApplicationEventData, Observable } from '@nativescript/core';
import { BiometricAuth, ERROR_CODES } from '@nativescript/biometrics';
import { booleanProperty, stringProperty } from './BackendService';
import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { l, lc } from '~/helpers/locale';
import { showModal } from 'svelte-native';

export interface PasscodeWindowOptions {
    creation?: boolean;
    change?: boolean;
    closeOnBack?: boolean;
    allowClose?: boolean;
    storePassword?: string;
}

/**
 * Parent service class. Has common configs and methods.
 */
export default class SecurityService extends Observable {
    private biometricAuth = new BiometricAuth();
    @stringProperty storedPassword: string;
    @booleanProperty({ default: false }) biometricEnabled: boolean;
    @booleanProperty({ default: false }) pincodeEnabled: boolean;
    @booleanProperty({ default: false }) autoLockEnabled: boolean;
    async biometricsAvailable() {
        const r = await this.biometricAuth.available();
        DEV_LOG && console.log('biometricsAvailable', r);
        return r.biometrics || r.touch || r.face;
    }

    start() {
        Application.on(Application.resumeEvent, this.onAppResume, this);
        Application.on(Application.suspendEvent, this.onAppSuspend, this);
        Application.on(Application.exitEvent, this.onAppExit, this);
    }
    stop() {
        Application.off(Application.resumeEvent, this.onAppResume, this);
        Application.off(Application.suspendEvent, this.onAppSuspend, this);
        Application.off(Application.exitEvent, this.onAppExit, this);
    }

    launched = false;
    resumed = false;
    async onAppResume(args: ApplicationEventData) {
        DEV_LOG && console.log('onAppResume', this.launched, this.resumed);
        if (!this.launched) {
            this.resumed = true;
            this.launched = true;
            setTimeout(() => {
                this.validateSecurityOrClose();
            }, 500);
        } else if (!this.resumed) {
            this.resumed = true;
            if (this.autoLockEnabled) {
                await this.validateSecurityOrClose();
            }
        }
    }
    onAppSuspend(args: ApplicationEventData) {
        if (this.resumed) {
            this.resumed = false;
        }
    }
    onAppExit(args: ApplicationEventData) {
            this.launched = false;
    }
    clear() {
        this.storedPassword = null;
        this.autoLockEnabled = false;
        this.biometricEnabled = false;
    }
    passcodeSet() {
        return !!this.storedPassword;
    }

    async validateSecurityOrClose(options = {}) {
        try {
            await securityService.validateSecurity({ closeOnBack: true, ...options });
        } catch (error) {
            if (error.code === 50) {
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
            this.biometricEnabled = await this.verifyFingerprint();
            DEV_LOG && console.log('enableBiometric', this.biometricEnabled);
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
            const component = (await import('~/components/PasscodeWindow.svelte')).default;
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
        DEV_LOG && console.log('validateSecurity', this.biometricEnabled);
        if (!this.biometricEnabled) {
            return;
        }
        if (!this.pincodeEnabled || options?.closeOnBack !== true) {
            return this.verifyFingerprint();
        } else {
            const result = await this.showPasscodeWindow({ allowClose: false, storePassword: this.storedPassword, ...options });
            const validated = result && (result.validated === true || result.passcode === this.storedPassword);
            if (!validated && result?.passcode) {
                setTimeout(() => showSnack({ message: l('wrong_passcode'), view: Application.getRootView() }), 300);
            }
            return validated;
        }
    }
    async verifyFingerprint() {
        try {
            const result = await this.biometricAuth.verifyBiometric({ message: lc('authenticate_security'), pinFallback: true });
            DEV_LOG && console.log('verifyFingerprint', result);
            return result.code === ERROR_CODES.SUCCESS;
        } catch (error) {
            console.error(error, error.stack);
            throw error;
        }
    }
}

export const securityService = new SecurityService();
