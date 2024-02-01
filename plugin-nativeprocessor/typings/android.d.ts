/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable no-redeclare */

/// <reference path="android-declarations.d.ts"/>

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export abstract class AbstractBiMap<K, V> extends MutableBiMap<any, any> {
                public static class: java.lang.Class<AbstractBiMap<any, any>>;
                public getKeys(): java.util.Set<any>;
                public getValues(): java.util.Set<any>;
                public get(param0: any): any;
                public putAll(param0: java.util.Map<any, any>): void;
                public values(): java.util.Set<any>;
                public merge(param0: any, param1: any, param2: any /* any<any,any,any>*/): any;
                public computeIfAbsent(param0: any, param1: any /* any*/): any;
                public getOrDefault(param0: any, param1: any): any;
                public containsKey(param0: any): boolean;
                public replaceAll(param0: any /* any<any,any,any>*/): void;
                public constructor();
                public remove(param0: any, param1: any): boolean;
                public putIfAbsent(param0: any, param1: any): any;
                public static copyOf(param0: java.util.Map<any, any>): java.util.Map<any, any>;
                public remove(param0: any): any;
                public getSize(): number;
                public hashCode(): number;
                public compute(param0: any, param1: any /* any<any,any,any>*/): any;
                public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any, any>>): java.util.Map<any, any>;
                public clear(): void;
                public equals(param0: any): boolean;
                public isEmpty(): boolean;
                public computeIfPresent(param0: any, param1: any /* any<any,any,any>*/): any;
                public containsValue(param0: any): boolean;
                public replace(param0: any, param1: any, param2: any): boolean;
                public values(): java.util.Collection<any>;
                public forcePut(param0: any, param1: any): any;
                public replace(param0: any, param1: any): any;
                public static entry(param0: any, param1: any): java.util.Map.Entry<any, any>;
                public getEntries(): java.util.Set<java.util.Map.Entry<any, any>>;
                public entrySet(): java.util.Set<java.util.Map.Entry<any, any>>;
                public constructor(param0: java.util.Map<any, any>, param1: java.util.Map<any, any>);
                public keySet(): java.util.Set<any>;
                public size(): number;
                public getInverse(): BiMap<any, any>;
                public put(param0: any, param1: any): any;
                public getkeyForValue(param0: any): any;
                public getInverse(): MutableBiMap<any, any>;
                public forEach(param0: any /* any*/): void;
            }
            export namespace AbstractBiMap {
                export class BiMapEntry extends java.lang.Object {
                    public static class: java.lang.Class<BiMapEntry>;
                    public equals(param0: any): boolean;
                    public getValue(): any;
                    public static comparingByKey(): java.util.Comparator<any>;
                    public static comparingByValue(): java.util.Comparator<any>;
                    public getKey(): any;
                    public static comparingByValue(param0: java.util.Comparator<any>): java.util.Comparator<any>;
                    public constructor(param0: java.util.Map.Entry<any, any>);
                    public hashCode(): number;
                    public setValue(param0: any): any;
                    public static comparingByKey(param0: java.util.Comparator<any>): java.util.Comparator<any>;
                }
                export class BiMapSet<T> extends java.lang.Object {
                    public static class: java.lang.Class<BiMapSet<any>>;
                    public constructor(param0: java.util.Set<T>, param1: any, param2: any);
                    public addAll(param0: java.util.Collection<any>): boolean;
                    public isEmpty(): boolean;
                    public add(param0: any): boolean;
                    public spliterator(): java.util.Spliterator<any>;
                    public containsAll(param0: java.util.Collection<any>): boolean;
                    public size(): number;
                    public static copyOf(param0: java.util.Collection<any>): java.util.Set<any>;
                    public getSize(): number;
                    public iterator(): java.util.Iterator<any>;
                    public clear(): void;
                    public hashCode(): number;
                    public toArray(param0: androidNative.Array<any>): androidNative.Array<any>;
                    public contains(param0: any): boolean;
                    public removeIf(param0: any /* any*/): boolean;
                    public removeAll(param0: java.util.Collection<any>): boolean;
                    public remove(param0: any): boolean;
                    public parallelStream(): java.util.stream.Stream<any>;
                    public toArray(): androidNative.Array<any>;
                    public iterator(): java.util.Iterator<T>;
                    public retainAll(param0: java.util.Collection<any>): boolean;
                    public equals(param0: any): boolean;
                    public toArray(param0: any /* any*/): androidNative.Array<any>;
                    public stream(): java.util.stream.Stream<any>;
                    public spliterator(): java.util.Spliterator<T>;
                    public forEach(param0: any /* any*/): void;
                    public add(param0: T): boolean;
                }
                export class BiMapSetIterator<T> extends java.lang.Object {
                    public static class: java.lang.Class<BiMapSetIterator<any>>;
                    public constructor(param0: java.util.Iterator<any>, param1: any, param2: any);
                    public next(): T;
                    public hasNext(): boolean;
                    public remove(): void;
                }
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class AutoScanHandler extends java.lang.Object {
                public static class: java.lang.Class<AutoScanHandler>;
                public clearAll(): void;
                public process(param0: java.util.List<any>): void;
                public getPreAutoScanDelay(): number;
                public setAutoScanDuration(param0: number): void;
                public startAutoScanJob(param0: java.util.List<any>): void;
                public constructor(param0: globalAndroid.content.Context, param1: CropView);
                public setEnabled(param0: boolean): void;
                public setDistanceThreshod(param0: number): void;
                public replaceHash(param0: number, param1: number): void;
                public startAutoScanPreJob(param0: java.util.List<any>): void;
                public constructor(param0: globalAndroid.content.Context);
                public getEnabled(): boolean;
                public getDistanceThreshod(): number;
                public getAutoScanDuration(): number;
                public constructor(param0: globalAndroid.content.Context, param1: CropView, param2: AutoScanHandler.OnAutoScan);
                public setPreAutoScanDelay(param0: number): void;
            }
            export namespace AutoScanHandler {
                export class Companion extends java.lang.Object {
                    public static class: java.lang.Class<Companion>;
                    public getTAG(): string;
                    public getHash(param0: java.util.List<any>): number;
                }
                export class OnAutoScan extends java.lang.Object {
                    public static class: java.lang.Class<OnAutoScan>;
                    /**
                     * Constructs a new instance of the com.akylas.documentscanner.AutoScanHandler$OnAutoScan interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                     */
                    public constructor(implementation: { onAutoScan(param0: string): void });
                    public constructor();
                    public onAutoScan(param0: string): void;
                }
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class BiMap<K, V> extends java.lang.Object {
                public static class: java.lang.Class<BiMap<any, any>>;
                /**
                 * Constructs a new instance of the com.akylas.documentscanner.BiMap<any,any> interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                 */
                public constructor(implementation: {
                    getValues(): java.util.Set<V>;
                    getInverse(): BiMap<V, K>;
                    size(): number;
                    isEmpty(): boolean;
                    containsKey(param0: any): boolean;
                    containsValue(param0: any): boolean;
                    get(param0: any): V;
                    put(param0: K, param1: V): V;
                    remove(param0: any): V;
                    putAll(param0: java.util.Map<any, any>): void;
                    clear(): void;
                    keySet(): java.util.Set<K>;
                    values(): java.util.Collection<V>;
                    entrySet(): java.util.Set<java.util.Map.Entry<K, V>>;
                    equals(param0: any): boolean;
                    hashCode(): number;
                    getOrDefault(param0: any, param1: V): V;
                    forEach(param0: any /* any*/): void;
                    replaceAll(param0: any /* any<any,any,any>*/): void;
                    putIfAbsent(param0: K, param1: V): V;
                    remove(param0: any, param1: any): boolean;
                    replace(param0: K, param1: V, param2: V): boolean;
                    replace(param0: K, param1: V): V;
                    computeIfAbsent(param0: K, param1: any /* any*/): V;
                    computeIfPresent(param0: K, param1: any /* any<any,any,any>*/): V;
                    compute(param0: K, param1: any /* any<any,any,any>*/): V;
                    merge(param0: K, param1: V, param2: any /* any<any,any,any>*/): V;
                    of(): java.util.Map<any, any>;
                    of(param0: any, param1: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any,
                        param14: any,
                        param15: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any,
                        param14: any,
                        param15: any,
                        param16: any,
                        param17: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any,
                        param14: any,
                        param15: any,
                        param16: any,
                        param17: any,
                        param18: any,
                        param19: any
                    ): java.util.Map<any, any>;
                    ofEntries(param0: androidNative.Array<java.util.Map.Entry<any, any>>): java.util.Map<any, any>;
                    entry(param0: any, param1: any): java.util.Map.Entry<any, any>;
                    copyOf(param0: java.util.Map<any, any>): java.util.Map<any, any>;
                });
                public constructor();
                public computeIfPresent(param0: K, param1: any /* any<any,any,any>*/): V;
                public entrySet(): java.util.Set<java.util.Map.Entry<K, V>>;
                public putAll(param0: java.util.Map<any, any>): void;
                public replace(param0: K, param1: V): V;
                public keySet(): java.util.Set<K>;
                public containsKey(param0: any): boolean;
                public replaceAll(param0: any /* any<any,any,any>*/): void;
                public put(param0: K, param1: V): V;
                public compute(param0: K, param1: any /* any<any,any,any>*/): V;
                public remove(param0: any, param1: any): boolean;
                public replace(param0: K, param1: V, param2: V): boolean;
                public remove(param0: any): V;
                public getOrDefault(param0: any, param1: V): V;
                public static copyOf(param0: java.util.Map<any, any>): java.util.Map<any, any>;
                public hashCode(): number;
                public getInverse(): BiMap<V, K>;
                public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any, any>>): java.util.Map<any, any>;
                public clear(): void;
                public equals(param0: any): boolean;
                public isEmpty(): boolean;
                public containsValue(param0: any): boolean;
                public getValues(): java.util.Set<V>;
                public static entry(param0: any, param1: any): java.util.Map.Entry<any, any>;
                public putIfAbsent(param0: K, param1: V): V;
                public computeIfAbsent(param0: K, param1: any /* any*/): V;
                public values(): java.util.Collection<V>;
                public size(): number;
                public get(param0: any): V;
                public forEach(param0: any /* any*/): void;
                public merge(param0: K, param1: V, param2: any /* any<any,any,any>*/): V;
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class CropView extends globalAndroid.view.View {
                public static class: java.lang.Class<CropView>;
                public getStrokeWidth(): number;
                public getScale(): number;
                public setProgressFillPaint(param0: globalAndroid.graphics.Paint): void;
                public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number);
                public onKeyDown(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
                public getLinePaint(): globalAndroid.graphics.Paint;
                public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number, param3: number);
                public sendAccessibilityEvent(param0: number): void;
                public onKeyUp(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
                public setQuadsAnimated(param0: java.util.List<any>): void;
                public onKeyLongPress(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
                public constructor(param0: globalAndroid.content.Context);
                public getImageHeight(): number;
                public onKeyMultiple(param0: number, param1: number, param2: globalAndroid.view.KeyEvent): boolean;
                public updateProgress(param0: number, param1: number): void;
                public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable): void;
                public setImageWidth(param0: number): void;
                public setDrawFill(param0: boolean): void;
                public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
                public setStrokeWidth(param0: number): void;
                public setColors(param0: java.util.List<java.lang.Integer>): void;
                public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet);
                public getColors(): java.util.List<java.lang.Integer>;
                public setScale(param0: number): void;
                public setFillPaint(param0: globalAndroid.graphics.Paint): void;
                public replaceProgressHash(param0: number, param1: number): void;
                public getQuads(): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
                public getProgressFillPaint(): globalAndroid.graphics.Paint;
                public invalidateDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
                public interpolatePoint(param0: globalAndroid.graphics.Point, param1: globalAndroid.graphics.Point, param2: number): globalAndroid.graphics.Point;
                public onDraw(param0: globalAndroid.graphics.Canvas): void;
                public sendAccessibilityEventUnchecked(param0: globalAndroid.view.accessibility.AccessibilityEvent): void;
                public setQuads(param0: java.util.List<any>): void;
                public getFillPaint(): globalAndroid.graphics.Paint;
                public setImageHeight(param0: number): void;
                public getAnimationDuration(): number;
                public scheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable, param2: number): void;
                public setAnimationDuration(param0: number): void;
                public getDrawFill(): boolean;
                public setImagePreviewBounds(param0: number, param1: number, param2: number, param3: number): void;
                public getImageWidth(): number;
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class CustomImageAnalysisCallback extends java.lang.Object {
                public static class: java.lang.Class<CustomImageAnalysisCallback>;
                public setDetectQRCodeOptions(param0: string): void;
                public process(param0: androidx.camera.core.ImageProxy, param1: androidx.camera.core.ImageInfo, param2: nativescript.cameraview.ImageAsyncProcessor): void;
                public getAutoScanHandler(): AutoScanHandler;
                public setDetectQRCode(param0: boolean): void;
                public getPreviewResizeThreshold(): number;
                public constructor(param0: globalAndroid.content.Context, param1: CropView, param2: CustomImageAnalysisCallback.OnQRCode);
                public constructor(param0: globalAndroid.content.Context, param1: CropView);
                public getDetectQRCode(): boolean;
                public setAutoScanHandler(param0: AutoScanHandler): void;
                public setTestBitmap(param0: globalAndroid.graphics.Bitmap): void;
                public setPreviewResizeThreshold(param0: number): void;
                public getDetectQRCodeOptions(): string;
                public constructor(param0: globalAndroid.content.Context);
                public getTestBitmap(): globalAndroid.graphics.Bitmap;
            }
            export namespace CustomImageAnalysisCallback {
                export class Companion extends java.lang.Object {
                    public static class: java.lang.Class<Companion>;
                    public static getJSONDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback, param2: number): void;
                    public static cropDocument(param0: globalAndroid.graphics.Bitmap, param1: java.util.List<any>, param2: FunctionCallback, param3: string): void;
                    public static pointsFromJSONString(param0: string): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
                    public static readQRCode(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback): void;
                    public static getDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: number): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
                    public static ocrDocument(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback, param2: string, param3: FunctionCallbackProgress): void;
                    public static cropDocument(param0: globalAndroid.graphics.Bitmap, param1: string, param2: FunctionCallback, param3: string): void;
                    public static getDocumentCorners(param0: globalAndroid.graphics.Bitmap): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
                    public static getJSONDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback): void;
                    public static pointFromJSONArray(param0: org.json.JSONArray, param1: number): java.util.List<globalAndroid.graphics.Point>;
                    public static pointsFromJSONArray(param0: org.json.JSONArray): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
                    public static getColorPalette(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback, param2: number): void;
                    public static generateQRCodeSync(param0: string, param1: string, param2: number, param3: number): globalAndroid.graphics.Bitmap;
                    public static readQRCodeSync(param0: globalAndroid.graphics.Bitmap): string;
                    public static generateQRCode(param0: string, param1: string, param2: number, param3: number, param4: FunctionCallback, param5: string): void;
                    public static getJSONDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback, param2: number, param3: number): void;
                    public static generateQRCode(param0: string, param1: string, param2: number, param3: number, param4: FunctionCallback): void;
                    public static cropDocument(param0: globalAndroid.graphics.Bitmap, param1: java.util.List<any>, param2: FunctionCallback): void;
                    public static cropDocument(param0: globalAndroid.graphics.Bitmap, param1: string, param2: FunctionCallback): void;
                    public static getColorPalette(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback, param2: number, param3: number, param4: number): void;
                    public static getColorPalette(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback, param2: number, param3: number): void;
                    public static readQRCodeSync(param0: globalAndroid.graphics.Bitmap, param1: string): string;
                    public static readQRCode(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback, param2: string): void;
                    public static ocrDocument(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback, param2: string): void;
                    public static getColorPalette(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback): void;
                    public static findDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: number, param2: number): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
                    public static ocrDocument(param0: globalAndroid.graphics.Bitmap, param1: FunctionCallback): void;
                    public static getDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: number, param2: number): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
                    public static generateQRCodeSync(param0: string, param1: string, param2: number, param3: number, param4: string): globalAndroid.graphics.Bitmap;
                    public static getDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: number, param2: number, param3: boolean): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
                }
                export class FunctionCallback extends java.lang.Object {
                    public static class: java.lang.Class<FunctionCallback>;
                    /**
                     * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$FunctionCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                     */
                    public constructor(implementation: { onResult(param0: java.lang.Exception, param1: any): void });
                    public constructor();
                    public onResult(param0: java.lang.Exception, param1: any): void;
                }
                export class FunctionCallbackProgress extends java.lang.Object {
                    public static class: java.lang.Class<FunctionCallbackProgress>;
                    /**
                     * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$FunctionCallbackProgress interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                     */
                    public constructor(implementation: { onProgress(param0: number): void });
                    public constructor();
                    public onProgress(param0: number): void;
                }
                export class OnQRCode extends java.lang.Object {
                    public static class: java.lang.Class<OnQRCode>;
                    /**
                     * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$OnQRCode interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                     */
                    public constructor(implementation: { onQRCode(param0: string, param1: string): void });
                    public constructor();
                    public onQRCode(param0: string, param1: string): void;
                }
                export class OnTestBitmap extends java.lang.Object {
                    public static class: java.lang.Class<OnTestBitmap>;
                    /**
                     * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$OnTestBitmap interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                     */
                    public constructor(implementation: { onTestBitmap(param0: globalAndroid.graphics.Bitmap): void });
                    public constructor();
                    public onTestBitmap(param0: globalAndroid.graphics.Bitmap): void;
                }
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class HashBiMap<K, V> extends AbstractBiMap<any, any> {
                public static class: java.lang.Class<HashBiMap<any, any>>;
                public getValues(): java.util.Set<any>;
                public forcePut(param0: any, param1: any): any;
                public constructor(param0: number);
                public constructor(param0: java.util.Map<any, any>, param1: java.util.Map<any, any>);
                public getInverse(): MutableBiMap<any, any>;
                public constructor();
            }
            export namespace HashBiMap {
                export class Companion extends java.lang.Object {
                    public static class: java.lang.Class<Companion>;
                    public create(param0: java.util.Map<any, any>): HashBiMap<any, any>;
                }
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class ImagePicker extends java.lang.Object {
                public static class: java.lang.Class<ImagePicker>;
                public constructor();
            }
            export namespace ImagePicker {
                export class OnResult extends java.lang.Object {
                    public static class: java.lang.Class<OnResult>;
                    /**
                     * Constructs a new instance of the com.akylas.documentscanner.ImagePicker$Companion$OnResult interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                     */
                    public constructor(implementation: { onResult(param0: java.lang.Exception, param1: any): void });
                    public constructor();
                    public onResult(param0: java.lang.Exception, param1: any): void;
                }
                export class Companion extends java.lang.Object {
                    public static class: java.lang.Class<Companion>;
                    public static pickImagesVideos(param0: androidx.appcompat.app.AppCompatActivity, param1: Companion.OnResult, param2: string): void;
                }
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class MaxSizeHashMap<K, V> extends java.util.LinkedHashMap<any, any> {
                public static class: java.lang.Class<MaxSizeHashMap<any, any>>;
                public constructor(param0: number, param1: number);
                public getKeys(): java.util.Set<any>;
                public get(param0: any): any;
                public putAll(param0: java.util.Map<any, any>): void;
                public merge(param0: any, param1: any, param2: any /* any<any,any,any>*/): any;
                public constructor(param0: java.util.Map<any, any>);
                public computeIfAbsent(param0: any, param1: any /* any*/): any;
                public getValues(): java.util.Collection<any>;
                public getOrDefault(param0: any, param1: any): any;
                public containsKey(param0: any): boolean;
                public replaceAll(param0: any /* any<any,any,any>*/): void;
                public removeEldestEntry(param0: java.util.Map.Entry<any, any>): boolean;
                public constructor();
                public remove(param0: any, param1: any): boolean;
                public putIfAbsent(param0: any, param1: any): any;
                public static copyOf(param0: java.util.Map<any, any>): java.util.Map<any, any>;
                public remove(param0: any): any;
                public getSize(): number;
                public hashCode(): number;
                public compute(param0: any, param1: any /* any<any,any,any>*/): any;
                public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any, any>>): java.util.Map<any, any>;
                public clear(): void;
                public equals(param0: any): boolean;
                public isEmpty(): boolean;
                public computeIfPresent(param0: any, param1: any /* any<any,any,any>*/): any;
                public containsValue(param0: any): boolean;
                public replace(param0: any, param1: any, param2: any): boolean;
                public values(): java.util.Collection<any>;
                public replace(param0: any, param1: any): any;
                public static entry(param0: any, param1: any): java.util.Map.Entry<any, any>;
                public getEntries(): java.util.Set<java.util.Map.Entry<any, any>>;
                public entrySet(): java.util.Set<java.util.Map.Entry<any, any>>;
                public keySet(): java.util.Set<any>;
                public size(): number;
                public constructor(param0: number, param1: number, param2: boolean);
                public put(param0: any, param1: any): any;
                public constructor(param0: number);
                public forEach(param0: any /* any*/): void;
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class MutableBiMap<K, V> extends java.lang.Object {
                public static class: java.lang.Class<MutableBiMap<any, any>>;
                /**
                 * Constructs a new instance of the com.akylas.documentscanner.MutableBiMap<any,any> interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                 */
                public constructor(implementation: {
                    getValues(): java.util.Set<V>;
                    getInverse(): MutableBiMap<V, K>;
                    forcePut(param0: K, param1: V): V;
                    getValues(): java.util.Set<V>;
                    getInverse(): BiMap<V, K>;
                    size(): number;
                    isEmpty(): boolean;
                    containsKey(param0: any): boolean;
                    containsValue(param0: any): boolean;
                    get(param0: any): V;
                    put(param0: K, param1: V): V;
                    remove(param0: any): V;
                    putAll(param0: java.util.Map<any, any>): void;
                    clear(): void;
                    keySet(): java.util.Set<K>;
                    values(): java.util.Collection<V>;
                    entrySet(): java.util.Set<java.util.Map.Entry<K, V>>;
                    equals(param0: any): boolean;
                    hashCode(): number;
                    getOrDefault(param0: any, param1: V): V;
                    forEach(param0: any /* any*/): void;
                    replaceAll(param0: any /* any<any,any,any>*/): void;
                    putIfAbsent(param0: K, param1: V): V;
                    remove(param0: any, param1: any): boolean;
                    replace(param0: K, param1: V, param2: V): boolean;
                    replace(param0: K, param1: V): V;
                    computeIfAbsent(param0: K, param1: any /* any*/): V;
                    computeIfPresent(param0: K, param1: any /* any<any,any,any>*/): V;
                    compute(param0: K, param1: any /* any<any,any,any>*/): V;
                    merge(param0: K, param1: V, param2: any /* any<any,any,any>*/): V;
                    of(): java.util.Map<any, any>;
                    of(param0: any, param1: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any,
                        param14: any,
                        param15: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any,
                        param14: any,
                        param15: any,
                        param16: any,
                        param17: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any,
                        param14: any,
                        param15: any,
                        param16: any,
                        param17: any,
                        param18: any,
                        param19: any
                    ): java.util.Map<any, any>;
                    ofEntries(param0: androidNative.Array<java.util.Map.Entry<any, any>>): java.util.Map<any, any>;
                    entry(param0: any, param1: any): java.util.Map.Entry<any, any>;
                    copyOf(param0: java.util.Map<any, any>): java.util.Map<any, any>;
                    size(): number;
                    isEmpty(): boolean;
                    containsKey(param0: any): boolean;
                    containsValue(param0: any): boolean;
                    get(param0: any): V;
                    put(param0: K, param1: V): V;
                    remove(param0: any): V;
                    putAll(param0: java.util.Map<any, any>): void;
                    clear(): void;
                    keySet(): java.util.Set<K>;
                    values(): java.util.Collection<V>;
                    entrySet(): java.util.Set<java.util.Map.Entry<K, V>>;
                    equals(param0: any): boolean;
                    hashCode(): number;
                    getOrDefault(param0: any, param1: V): V;
                    forEach(param0: any /* any*/): void;
                    replaceAll(param0: any /* any<any,any,any>*/): void;
                    putIfAbsent(param0: K, param1: V): V;
                    remove(param0: any, param1: any): boolean;
                    replace(param0: K, param1: V, param2: V): boolean;
                    replace(param0: K, param1: V): V;
                    computeIfAbsent(param0: K, param1: any /* any*/): V;
                    computeIfPresent(param0: K, param1: any /* any<any,any,any>*/): V;
                    compute(param0: K, param1: any /* any<any,any,any>*/): V;
                    merge(param0: K, param1: V, param2: any /* any<any,any,any>*/): V;
                    of(): java.util.Map<any, any>;
                    of(param0: any, param1: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any): java.util.Map<any, any>;
                    of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any,
                        param14: any,
                        param15: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any,
                        param14: any,
                        param15: any,
                        param16: any,
                        param17: any
                    ): java.util.Map<any, any>;
                    of(
                        param0: any,
                        param1: any,
                        param2: any,
                        param3: any,
                        param4: any,
                        param5: any,
                        param6: any,
                        param7: any,
                        param8: any,
                        param9: any,
                        param10: any,
                        param11: any,
                        param12: any,
                        param13: any,
                        param14: any,
                        param15: any,
                        param16: any,
                        param17: any,
                        param18: any,
                        param19: any
                    ): java.util.Map<any, any>;
                    ofEntries(param0: androidNative.Array<java.util.Map.Entry<any, any>>): java.util.Map<any, any>;
                    entry(param0: any, param1: any): java.util.Map.Entry<any, any>;
                    copyOf(param0: java.util.Map<any, any>): java.util.Map<any, any>;
                });
                public constructor();
                public computeIfPresent(param0: K, param1: any /* any<any,any,any>*/): V;
                public entrySet(): java.util.Set<java.util.Map.Entry<K, V>>;
                public putAll(param0: java.util.Map<any, any>): void;
                public replace(param0: K, param1: V): V;
                public keySet(): java.util.Set<K>;
                public containsKey(param0: any): boolean;
                public replaceAll(param0: any /* any<any,any,any>*/): void;
                public getInverse(): MutableBiMap<V, K>;
                public put(param0: K, param1: V): V;
                public compute(param0: K, param1: any /* any<any,any,any>*/): V;
                public remove(param0: any, param1: any): boolean;
                public replace(param0: K, param1: V, param2: V): boolean;
                public remove(param0: any): V;
                public getOrDefault(param0: any, param1: V): V;
                public static copyOf(param0: java.util.Map<any, any>): java.util.Map<any, any>;
                public hashCode(): number;
                public getInverse(): BiMap<V, K>;
                public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any, any>>): java.util.Map<any, any>;
                public clear(): void;
                public equals(param0: any): boolean;
                public isEmpty(): boolean;
                public containsValue(param0: any): boolean;
                public getValues(): java.util.Set<V>;
                public static entry(param0: any, param1: any): java.util.Map.Entry<any, any>;
                public forcePut(param0: K, param1: V): V;
                public putIfAbsent(param0: K, param1: V): V;
                public computeIfAbsent(param0: K, param1: any /* any*/): V;
                public values(): java.util.Collection<V>;
                public size(): number;
                public get(param0: any): V;
                public forEach(param0: any /* any*/): void;
                public merge(param0: K, param1: V, param2: any /* any<any,any,any>*/): V;
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class YuvByteBuffer extends java.lang.Object {
                public static class: java.lang.Class<YuvByteBuffer>;
                public constructor(param0: globalAndroid.media.Image, param1: java.nio.ByteBuffer);
                public getType(): number;
                public getBuffer(): java.nio.ByteBuffer;
            }
            export namespace YuvByteBuffer {
                export class ImageWrapper extends java.lang.Object {
                    public static class: java.lang.Class<ImageWrapper>;
                    public getY(): PlaneWrapper;
                    public getHeight(): number;
                    public getU(): PlaneWrapper;
                    public getWidth(): number;
                    public constructor(param0: globalAndroid.media.Image);
                    public getV(): PlaneWrapper;
                }
                export class PlaneWrapper extends java.lang.Object {
                    public static class: java.lang.Class<PlaneWrapper>;
                    public getRowStride(): number;
                    public getBuffer(): java.nio.ByteBuffer;
                    public getHeight(): number;
                    public getPixelStride(): number;
                    public getWidth(): number;
                    public constructor(param0: number, param1: number, param2: globalAndroid.media.Image.Plane);
                }
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class YuvToRgbConverter extends java.lang.Object {
                public static class: java.lang.Class<YuvToRgbConverter>;
                public destroy(): void;
                public constructor(param0: globalAndroid.content.Context);
                public yuvToRgb(param0: globalAndroid.media.Image, param1: globalAndroid.graphics.Bitmap): void;
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export class YuvType extends java.lang.Object implements java.lang.annotation.Annotation {
                public static class: java.lang.Class<YuvType>;
                /**
                 * Constructs a new instance of the com.akylas.documentscanner.YuvType interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                 */
                public constructor(implementation: { equals(param0: any): boolean; hashCode(): number; toString(): string; annotationType(): java.lang.Class<any> });
                public constructor();
                public hashCode(): number;
                public equals(param0: any): boolean;
                public annotationType(): java.lang.Class<any>;
                public toString(): string;
            }
        }
    }
}

declare namespace com {
    export namespace akylas {
        export namespace documentscanner {
            export namespace utils {
                export class ImageUtil extends java.lang.Object {
                    public static class: java.lang.Class<ImageUtil>;
                    public constructor();
                }
                export namespace ImageUtil {
                    export class Companion extends java.lang.Object {
                        public static class: java.lang.Class<Companion>;
                        public readBitmapFromFileUriString(param0: string, param1: globalAndroid.content.ContentResolver): globalAndroid.graphics.Bitmap;
                        public getImageFromFile(param0: java.io.File, param1: number): globalAndroid.graphics.Bitmap;
                    }
                }
            }
        }
    }
}

//Generics information:
//com.akylas.documentscanner.AbstractBiMap:2
//com.akylas.documentscanner.AbstractBiMap.BiMapSet:1
//com.akylas.documentscanner.AbstractBiMap.BiMapSetIterator:1
//com.akylas.documentscanner.BiMap:2
//com.akylas.documentscanner.HashBiMap:2
//com.akylas.documentscanner.MaxSizeHashMap:2
//com.akylas.documentscanner.MutableBiMap:2
