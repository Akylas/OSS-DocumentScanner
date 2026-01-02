import { Observable } from '@nativescript/core';

/**
 * PKPass model representing an Apple Wallet Pass
 * Based on Apple's PassKit specification
 */

export enum PKPassStyle {
    BoardingPass = 'boardingPass',
    Coupon = 'coupon',
    EventTicket = 'eventTicket',
    Generic = 'generic',
    StoreCard = 'storeCard'
}

export enum PKPassTransitType {
    Air = 'PKTransitTypeAir',
    Boat = 'PKTransitTypeBoat',
    Bus = 'PKTransitTypeBus',
    Generic = 'PKTransitTypeGeneric',
    Train = 'PKTransitTypeTrain'
}

export enum PKBarcodeFormat {
    QR = 'PKBarcodeFormatQR',
    PDF417 = 'PKBarcodeFormatPDF417',
    Aztec = 'PKBarcodeFormatAztec',
    Code128 = 'PKBarcodeFormatCode128'
}

export interface PKPassBarcode {
    format: PKBarcodeFormat;
    message: string;
    messageEncoding: string;
    altText?: string;
}

export interface PKPassField {
    key: string;
    label?: string;
    value: string | number;
    textAlignment?: 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 'PKTextAlignmentRight' | 'PKTextAlignmentNatural';
    changeMessage?: string;
    dataDetectorTypes?: string[];
}

export interface PKPassLocation {
    latitude: number;
    longitude: number;
    altitude?: number;
    relevantText?: string;
}

export interface PKPassStructure {
    headerFields?: PKPassField[];
    primaryFields?: PKPassField[];
    secondaryFields?: PKPassField[];
    auxiliaryFields?: PKPassField[];
    backFields?: PKPassField[];
    transitType?: PKPassTransitType;
}

export interface PKPassData {
    // Standard keys
    formatVersion: number;
    passTypeIdentifier: string;
    serialNumber: string;
    teamIdentifier: string;
    organizationName: string;
    description: string;

    // Visual appearance
    logoText?: string;
    foregroundColor?: string;
    backgroundColor?: string;
    labelColor?: string;

    // Relevance
    locations?: PKPassLocation[];
    relevantDate?: string;
    expirationDate?: string;
    voided?: boolean;

    // Barcode
    barcode?: PKPassBarcode;
    barcodes?: PKPassBarcode[];

    // Pass structure (one of these will be present based on style)
    boardingPass?: PKPassStructure;
    coupon?: PKPassStructure;
    eventTicket?: PKPassStructure;
    generic?: PKPassStructure;
    storeCard?: PKPassStructure;

    // Web service
    webServiceURL?: string;
    authenticationToken?: string;
}

export interface PKPassImages {
    icon?: string;
    icon2x?: string;
    icon3x?: string;
    logo?: string;
    logo2x?: string;
    logo3x?: string;
    background?: string;
    background2x?: string;
    background3x?: string;
    footer?: string;
    footer2x?: string;
    footer3x?: string;
    strip?: string;
    strip2x?: string;
    strip3x?: string;
    thumbnail?: string;
    thumbnail2x?: string;
    thumbnail3x?: string;
}

export class PKPass extends Observable {
    id: string;
    document_id: string;

    // PKPass data
    passData: PKPassData;
    images: PKPassImages;

    // Storage paths
    passJsonPath?: string;
    imagesPath?: string;

    // Metadata
    createdDate: number;
    modifiedDate?: number;

    constructor(id: string, docId: string) {
        super();
        this.id = id;
        this.document_id = docId;
        this.createdDate = Date.now();
    }

    getPassStyle(): PKPassStyle {
        if (this.passData.boardingPass) return PKPassStyle.BoardingPass;
        if (this.passData.coupon) return PKPassStyle.Coupon;
        if (this.passData.eventTicket) return PKPassStyle.EventTicket;
        if (this.passData.storeCard) return PKPassStyle.StoreCard;
        return PKPassStyle.Generic;
    }

    getPassStructure(): PKPassStructure | undefined {
        const style = this.getPassStyle();
        switch (style) {
            case PKPassStyle.BoardingPass:
                return this.passData.boardingPass;
            case PKPassStyle.Coupon:
                return this.passData.coupon;
            case PKPassStyle.EventTicket:
                return this.passData.eventTicket;
            case PKPassStyle.StoreCard:
                return this.passData.storeCard;
            case PKPassStyle.Generic:
                return this.passData.generic;
        }
    }

    getPrimaryBarcode(): PKPassBarcode | undefined {
        // iOS 9+ uses barcodes array, older uses barcode
        if (this.passData.barcodes && this.passData.barcodes.length > 0) {
            return this.passData.barcodes[0];
        }
        return this.passData.barcode;
    }

    getAllBarcodes(): PKPassBarcode[] {
        const barcodes: PKPassBarcode[] = [];
        if (this.passData.barcodes) {
            barcodes.push(...this.passData.barcodes);
        } else if (this.passData.barcode) {
            barcodes.push(this.passData.barcode);
        }
        return barcodes;
    }

    isExpired(): boolean {
        if (!this.passData.expirationDate) {
            return false;
        }
        return new Date(this.passData.expirationDate) < new Date();
    }

    isVoided(): boolean {
        return this.passData.voided === true;
    }

    static fromJSON(jsonObj: any): PKPass {
        const pass = new PKPass(jsonObj.id, jsonObj.document_id);
        Object.assign(pass, {
            passData: typeof jsonObj.passData === 'string' ? JSON.parse(jsonObj.passData) : jsonObj.passData,
            images: typeof jsonObj.images === 'string' ? JSON.parse(jsonObj.images) : jsonObj.images,
            passJsonPath: jsonObj.passJsonPath,
            imagesPath: jsonObj.imagesPath,
            createdDate: jsonObj.createdDate,
            modifiedDate: jsonObj.modifiedDate
        });
        return pass;
    }

    toJSON() {
        return {
            id: this.id,
            document_id: this.document_id,
            passData: this.passData,
            images: this.images,
            passJsonPath: this.passJsonPath,
            imagesPath: this.imagesPath,
            createdDate: this.createdDate,
            modifiedDate: this.modifiedDate
        };
    }

    toString() {
        return JSON.stringify(this.toJSON());
    }
}
