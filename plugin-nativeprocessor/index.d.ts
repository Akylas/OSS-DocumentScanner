import { Color } from '@nativescript/core';

export * from './index.android';
export interface OCRData {
    text: string;
    blocks: {
        box: { x: number; y: number; width: number; height: number };
        text: string;
        confidence: number;
        fontFamily?: string;
        fontWeight?: string;
        fontStyle?: string;
        textDecoration?: string;
        fontSize?: number;
    }[];
    imageWidth: number;
    imageHeight: number;
}

export interface QRCodeSingleData {
    text: string;
    position: [number, number][];
    format: string;
}
export type QRCodeData = QRCodeSingleData[];
export type ColorPaletteData = string[];

export interface DetectOptions {
    rotation: number;
    adapThresholdBlockSize: number; // 391
    adapThresholdC: number; // 53

    detectContours: number;

    textDetectDilate: number; // 0
    textMorphologyEx1: number; // 34
    textMorphologyEx2: number; // 12

    dataPath: string;
    language: string;
    dpi: string;
    pageSegMode: number;
    iteratorLevel: number;
    oem: number;
    trim: boolean;
}

export interface DetectQRCodeOptions {
    resizeThreshold?: number;
    rotation?: number;
}

export interface GenerateColorOptions {
    resizeThreshold?: number;
    colorsFilterDistanceThreshold?: number;
    colorPalette?: number;
}

export interface GenerateQRCodeOptions {
    margin?: number;
    frontColor?: string | Color;
    backColor?: string | Color;
}
