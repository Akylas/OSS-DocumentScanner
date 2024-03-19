/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable no-redeclare */

/// <reference path="android-declarations.d.ts"/>

declare namespace com {
	export namespace akylas {
		export namespace documentscanner {
			export abstract class AbstractBiMap<K, V>  extends com.akylas.documentscanner.MutableBiMap<any,any> {
				public static class: java.lang.Class<com.akylas.documentscanner.AbstractBiMap<any,any>>;
				public getKeys(): java.util.Set<any>;
				public getValues(): java.util.Set<any>;
				public get(param0: any): any;
				public putAll(param0: java.util.Map<any,any>): void;
				public values(): java.util.Set<any>;
				public merge(param0: any, param1: any, param2: any /* any<any,any,any>*/): any;
				public computeIfAbsent(param0: any, param1: any /* any*/): any;
				public getOrDefault(param0: any, param1: any): any;
				public containsKey(param0: any): boolean;
				public replaceAll(param0: any /* any<any,any,any>*/): void;
				public constructor();
				public remove(param0: any, param1: any): boolean;
				public putIfAbsent(param0: any, param1: any): any;
				public static copyOf(param0: java.util.Map<any,any>): java.util.Map<any,any>;
				public remove(param0: any): any;
				public getSize(): number;
				public hashCode(): number;
				public compute(param0: any, param1: any /* any<any,any,any>*/): any;
				public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
				public clear(): void;
				public equals(param0: any): boolean;
				public isEmpty(): boolean;
				public computeIfPresent(param0: any, param1: any /* any<any,any,any>*/): any;
				public containsValue(param0: any): boolean;
				public replace(param0: any, param1: any, param2: any): boolean;
				public values(): java.util.Collection<any>;
				public forcePut(param0: any, param1: any): any;
				public replace(param0: any, param1: any): any;
				public static entry(param0: any, param1: any): java.util.Map.Entry<any,any>;
				public getEntries(): java.util.Set<java.util.Map.Entry<any,any>>;
				public entrySet(): java.util.Set<java.util.Map.Entry<any,any>>;
				public constructor(param0: java.util.Map<any,any>, param1: java.util.Map<any,any>);
				public keySet(): java.util.Set<any>;
				public size(): number;
				public getInverse(): com.akylas.documentscanner.BiMap<any,any>;
				public put(param0: any, param1: any): any;
				public getkeyForValue(param0: any): any;
				public getInverse(): com.akylas.documentscanner.MutableBiMap<any,any>;
				public forEach(param0: any /* any*/): void;
			}
			export namespace AbstractBiMap {
				export class BiMapEntry extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.AbstractBiMap.BiMapEntry>;
					public equals(param0: any): boolean;
					public getValue(): any;
					public static comparingByKey(): java.util.Comparator<any>;
					public static comparingByValue(): java.util.Comparator<any>;
					public getKey(): any;
					public static comparingByValue(param0: java.util.Comparator<any>): java.util.Comparator<any>;
					public constructor(param0: java.util.Map.Entry<any,any>);
					public hashCode(): number;
					public setValue(param0: any): any;
					public static comparingByKey(param0: java.util.Comparator<any>): java.util.Comparator<any>;
				}
				export class BiMapSet<T>  extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.AbstractBiMap.BiMapSet<any>>;
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
				export class BiMapSetIterator<T>  extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.AbstractBiMap.BiMapSetIterator<any>>;
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
				public static class: java.lang.Class<com.akylas.documentscanner.AutoScanHandler>;
				public clearAll(): void;
				public process(param0: java.util.List<any>): void;
				public getPreAutoScanDelay(): number;
				public setAutoScanDuration(param0: number): void;
				public startAutoScanJob(param0: java.util.List<any>): void;
				public constructor(param0: globalAndroid.content.Context, param1: com.akylas.documentscanner.CropView);
				public setEnabled(param0: boolean): void;
				public setDistanceThreshod(param0: number): void;
				public replaceHash(param0: number, param1: number): void;
				public startAutoScanPreJob(param0: java.util.List<any>): void;
				public constructor(param0: globalAndroid.content.Context);
				public getEnabled(): boolean;
				public getDistanceThreshod(): number;
				public getAutoScanDuration(): number;
				public constructor(param0: globalAndroid.content.Context, param1: com.akylas.documentscanner.CropView, param2: com.akylas.documentscanner.AutoScanHandler.OnAutoScan);
				public setPreAutoScanDelay(param0: number): void;
			}
			export namespace AutoScanHandler {
				export class Companion extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.AutoScanHandler.Companion>;
					public getTAG(): string;
					public getHash(param0: java.util.List<any>): number;
				}
				export class OnAutoScan extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.AutoScanHandler.OnAutoScan>;
					/**
					 * Constructs a new instance of the com.akylas.documentscanner.AutoScanHandler$OnAutoScan interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onAutoScan(param0: string): void;
					});
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
			export class BiMap<K, V>  extends java.lang.Object {
				public static class: java.lang.Class<com.akylas.documentscanner.BiMap<any,any>>;
				/**
				 * Constructs a new instance of the com.akylas.documentscanner.BiMap<any,any> interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					getValues(): java.util.Set<V>;
					getInverse(): com.akylas.documentscanner.BiMap<V,K>;
					size(): number;
					isEmpty(): boolean;
					containsKey(param0: any): boolean;
					containsValue(param0: any): boolean;
					get(param0: any): V;
					put(param0: K, param1: V): V;
					remove(param0: any): V;
					putAll(param0: java.util.Map<any,any>): void;
					clear(): void;
					keySet(): java.util.Set<K>;
					values(): java.util.Collection<V>;
					entrySet(): java.util.Set<java.util.Map.Entry<K,V>>;
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
					of(): java.util.Map<any,any>;
					of(param0: any, param1: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any, param14: any, param15: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any, param14: any, param15: any, param16: any, param17: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any, param14: any, param15: any, param16: any, param17: any, param18: any, param19: any): java.util.Map<any,any>;
					ofEntries(param0: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
					entry(param0: any, param1: any): java.util.Map.Entry<any,any>;
					copyOf(param0: java.util.Map<any,any>): java.util.Map<any,any>;
				});
				public constructor();
				public computeIfPresent(param0: K, param1: any /* any<any,any,any>*/): V;
				public entrySet(): java.util.Set<java.util.Map.Entry<K,V>>;
				public putAll(param0: java.util.Map<any,any>): void;
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
				public static copyOf(param0: java.util.Map<any,any>): java.util.Map<any,any>;
				public hashCode(): number;
				public getInverse(): com.akylas.documentscanner.BiMap<V,K>;
				public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
				public clear(): void;
				public equals(param0: any): boolean;
				public isEmpty(): boolean;
				public containsValue(param0: any): boolean;
				public getValues(): java.util.Set<V>;
				public static entry(param0: any, param1: any): java.util.Map.Entry<any,any>;
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
				public static class: java.lang.Class<com.akylas.documentscanner.CropView>;
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
				public getScaleType(): androidx.camera.view.PreviewView.ScaleType;
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
				public setScaleType(param0: androidx.camera.view.PreviewView.ScaleType): void;
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
				public getImageWidth(): number;
			}
		}
	}
}

declare namespace com {
	export namespace akylas {
		export namespace documentscanner {
			export class CustomImageAnalysisCallback extends java.lang.Object {
				public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback>;
				public setDetectQRCodeOptions(param0: string): void;
				public process(param0: androidx.camera.core.ImageProxy, param1: androidx.camera.core.ImageInfo, param2: com.nativescript.cameraview.ImageAsyncProcessor): void;
				public getAutoScanHandler(): com.akylas.documentscanner.AutoScanHandler;
				public setDetectQRCode(param0: boolean): void;
				public getPreviewResizeThreshold(): number;
				public constructor(param0: globalAndroid.content.Context, param1: com.akylas.documentscanner.CropView, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.OnQRCode);
				public constructor(param0: globalAndroid.content.Context, param1: com.akylas.documentscanner.CropView);
				public getDetectQRCode(): boolean;
				public setAutoScanHandler(param0: com.akylas.documentscanner.AutoScanHandler): void;
				public setTestBitmap(param0: globalAndroid.graphics.Bitmap): void;
				public setPreviewResizeThreshold(param0: number): void;
				public getDetectQRCodeOptions(): string;
				public constructor(param0: globalAndroid.content.Context);
				public getTestBitmap(): globalAndroid.graphics.Bitmap;
			}
			export namespace CustomImageAnalysisCallback {
				export class Companion extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback.Companion>;
					public static readQRCodeSync(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: string): void;
					public static pointsFromJSONString(param0: string): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
					public static cropDocumentSync(param0: globalAndroid.graphics.Bitmap, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string): void;
					public static ocrDocument(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: string, param3: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress): void;
					public static cropDocument(param0: globalAndroid.graphics.Bitmap, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string, param4: string): void;
					public static getColorPalette(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number): void;
					public static getJSONDocumentCornersSync(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number, param3: number): void;
					public static generateQRCode(param0: string, param1: string, param2: number, param3: number, param4: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param5: string): void;
					public static getJSONDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number, param3: number): void;
					public static getColorPaletteFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: number, param4: number, param5: string): void;
					public static getColorPaletteFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: number, param4: number, param5: number, param6: string): void;
					public static ocrDocumentFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string, param4: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress): void;
					public static generateQRCode(param0: string, param1: string, param2: number, param3: number, param4: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static cropDocumentSync(param0: globalAndroid.graphics.Bitmap, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string, param4: string, param5: string): void;
					public static getColorPalette(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number, param3: number): void;
					public static getJSONDocumentCornersFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string): void;
					public static ocrDocumentFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string): void;
					public static readQRCodeFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static getJSONDocumentCornersFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: number, param4: number, param5: string): void;
					public static ocrDocument(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static cropDocumentSync(param0: globalAndroid.graphics.Bitmap, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string, param4: string): void;
					public static ocrDocumentFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static getColorPaletteFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string): void;
					public static getJSONDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number): void;
					public static getColorPaletteSync(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number, param3: number): void;
					public static readQRCode(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static processFromFile(param0: globalAndroid.content.Context, param1: string, param2: string, param3: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param4: string): void;
					public static getColorPaletteFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: number, param4: string): void;
					public static getColorPaletteSync(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static cropDocument(param0: globalAndroid.graphics.Bitmap, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string): void;
					public static readQRCodeSync(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static readQRCodeFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string): void;
					public static getJSONDocumentCorners(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static pointFromJSONArray(param0: org.json.JSONArray, param1: number): java.util.List<globalAndroid.graphics.Point>;
					public static cropDocumentFromFile(param0: globalAndroid.content.Context, param1: string, param2: string, param3: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param4: string): void;
					public static pointsFromJSONArray(param0: org.json.JSONArray): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
					public static cropDocumentSync(param0: globalAndroid.graphics.Bitmap, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string, param4: string, param5: string, param6: number): void;
					public static generateQRCodeSync(param0: string, param1: string, param2: number, param3: number): globalAndroid.graphics.Bitmap;
					public static getColorPaletteSync(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number, param3: number, param4: number): void;
					public static getColorPalette(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number, param3: number, param4: number): void;
					public static cropDocument(param0: globalAndroid.graphics.Bitmap, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string, param4: string, param5: string, param6: number): void;
					public static getJSONDocumentCornersFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: number, param4: string): void;
					public static readQRCode(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: string): void;
					public static ocrDocument(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: string): void;
					public static getColorPalette(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static getJSONDocumentCornersSync(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number): void;
					public static getColorPaletteSync(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param2: number): void;
					public static getJSONDocumentCornersSync(param0: globalAndroid.graphics.Bitmap, param1: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback): void;
					public static generateQRCodeSync(param0: string, param1: string, param2: number, param3: number, param4: string): globalAndroid.graphics.Bitmap;
					public static cropDocument(param0: globalAndroid.graphics.Bitmap, param1: string, param2: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback, param3: string, param4: string, param5: string): void;
				}
				export class FunctionCallback extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallback>;
					/**
					 * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$FunctionCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onResult(param0: java.lang.Exception, param1: any): void;
					});
					public constructor();
					public onResult(param0: java.lang.Exception, param1: any): void;
				}
				export class FunctionCallbackProgress extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress>;
					/**
					 * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$FunctionCallbackProgress interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onProgress(param0: number): void;
					});
					public constructor();
					public onProgress(param0: number): void;
				}
				export class ImageNotFoundException extends java.lang.Exception {
					public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback.ImageNotFoundException>;
					public constructor(param0: string, param1: java.lang.Throwable, param2: boolean, param3: boolean);
					public constructor(param0: string, param1: java.lang.Throwable);
					public constructor(param0: string);
					public constructor(param0: java.lang.Throwable);
					public constructor();
				}
				export class OnQRCode extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback.OnQRCode>;
					/**
					 * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$OnQRCode interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onQRCode(param0: string, param1: string): void;
					});
					public constructor();
					public onQRCode(param0: string, param1: string): void;
				}
				export class OnTestBitmap extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback.OnTestBitmap>;
					/**
					 * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$OnTestBitmap interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onTestBitmap(param0: globalAndroid.graphics.Bitmap): void;
					});
					public constructor();
					public onTestBitmap(param0: globalAndroid.graphics.Bitmap): void;
				}
				export class WhenMappings extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback.WhenMappings>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace akylas {
		export namespace documentscanner {
			export class HashBiMap<K, V>  extends com.akylas.documentscanner.AbstractBiMap<any,any> {
				public static class: java.lang.Class<com.akylas.documentscanner.HashBiMap<any,any>>;
				public getValues(): java.util.Set<any>;
				public forcePut(param0: any, param1: any): any;
				public constructor(param0: number);
				public constructor(param0: java.util.Map<any,any>, param1: java.util.Map<any,any>);
				public getInverse(): com.akylas.documentscanner.MutableBiMap<any,any>;
				public constructor();
			}
			export namespace HashBiMap {
				export class Companion extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.HashBiMap.Companion>;
					public create(param0: java.util.Map<any,any>): com.akylas.documentscanner.HashBiMap<any,any>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace akylas {
		export namespace documentscanner {
			export class MaxSizeHashMap<K, V>  extends java.util.LinkedHashMap<any,any> {
				public static class: java.lang.Class<com.akylas.documentscanner.MaxSizeHashMap<any,any>>;
				public constructor(param0: number, param1: number);
				public getKeys(): java.util.Set<any>;
				public get(param0: any): any;
				public putAll(param0: java.util.Map<any,any>): void;
				public merge(param0: any, param1: any, param2: any /* any<any,any,any>*/): any;
				public constructor(param0: java.util.Map<any,any>);
				public computeIfAbsent(param0: any, param1: any /* any*/): any;
				public getValues(): java.util.Collection<any>;
				public getOrDefault(param0: any, param1: any): any;
				public containsKey(param0: any): boolean;
				public replaceAll(param0: any /* any<any,any,any>*/): void;
				public removeEldestEntry(param0: java.util.Map.Entry<any,any>): boolean;
				public constructor();
				public remove(param0: any, param1: any): boolean;
				public putIfAbsent(param0: any, param1: any): any;
				public static copyOf(param0: java.util.Map<any,any>): java.util.Map<any,any>;
				public remove(param0: any): any;
				public getSize(): number;
				public hashCode(): number;
				public compute(param0: any, param1: any /* any<any,any,any>*/): any;
				public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
				public clear(): void;
				public equals(param0: any): boolean;
				public isEmpty(): boolean;
				public computeIfPresent(param0: any, param1: any /* any<any,any,any>*/): any;
				public containsValue(param0: any): boolean;
				public replace(param0: any, param1: any, param2: any): boolean;
				public values(): java.util.Collection<any>;
				public replace(param0: any, param1: any): any;
				public static entry(param0: any, param1: any): java.util.Map.Entry<any,any>;
				public getEntries(): java.util.Set<java.util.Map.Entry<any,any>>;
				public entrySet(): java.util.Set<java.util.Map.Entry<any,any>>;
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
			export class MutableBiMap<K, V>  extends java.lang.Object {
				public static class: java.lang.Class<com.akylas.documentscanner.MutableBiMap<any,any>>;
				/**
				 * Constructs a new instance of the com.akylas.documentscanner.MutableBiMap<any,any> interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					getValues(): java.util.Set<V>;
					getInverse(): com.akylas.documentscanner.MutableBiMap<V,K>;
					forcePut(param0: K, param1: V): V;
					getValues(): java.util.Set<V>;
					getInverse(): com.akylas.documentscanner.BiMap<V,K>;
					size(): number;
					isEmpty(): boolean;
					containsKey(param0: any): boolean;
					containsValue(param0: any): boolean;
					get(param0: any): V;
					put(param0: K, param1: V): V;
					remove(param0: any): V;
					putAll(param0: java.util.Map<any,any>): void;
					clear(): void;
					keySet(): java.util.Set<K>;
					values(): java.util.Collection<V>;
					entrySet(): java.util.Set<java.util.Map.Entry<K,V>>;
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
					of(): java.util.Map<any,any>;
					of(param0: any, param1: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any, param14: any, param15: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any, param14: any, param15: any, param16: any, param17: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any, param14: any, param15: any, param16: any, param17: any, param18: any, param19: any): java.util.Map<any,any>;
					ofEntries(param0: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
					entry(param0: any, param1: any): java.util.Map.Entry<any,any>;
					copyOf(param0: java.util.Map<any,any>): java.util.Map<any,any>;
					size(): number;
					isEmpty(): boolean;
					containsKey(param0: any): boolean;
					containsValue(param0: any): boolean;
					get(param0: any): V;
					put(param0: K, param1: V): V;
					remove(param0: any): V;
					putAll(param0: java.util.Map<any,any>): void;
					clear(): void;
					keySet(): java.util.Set<K>;
					values(): java.util.Collection<V>;
					entrySet(): java.util.Set<java.util.Map.Entry<K,V>>;
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
					of(): java.util.Map<any,any>;
					of(param0: any, param1: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any, param14: any, param15: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any, param14: any, param15: any, param16: any, param17: any): java.util.Map<any,any>;
					of(param0: any, param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, param8: any, param9: any, param10: any, param11: any, param12: any, param13: any, param14: any, param15: any, param16: any, param17: any, param18: any, param19: any): java.util.Map<any,any>;
					ofEntries(param0: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
					entry(param0: any, param1: any): java.util.Map.Entry<any,any>;
					copyOf(param0: java.util.Map<any,any>): java.util.Map<any,any>;
				});
				public constructor();
				public computeIfPresent(param0: K, param1: any /* any<any,any,any>*/): V;
				public entrySet(): java.util.Set<java.util.Map.Entry<K,V>>;
				public putAll(param0: java.util.Map<any,any>): void;
				public replace(param0: K, param1: V): V;
				public keySet(): java.util.Set<K>;
				public containsKey(param0: any): boolean;
				public replaceAll(param0: any /* any<any,any,any>*/): void;
				public getInverse(): com.akylas.documentscanner.MutableBiMap<V,K>;
				public put(param0: K, param1: V): V;
				public compute(param0: K, param1: any /* any<any,any,any>*/): V;
				public remove(param0: any, param1: any): boolean;
				public replace(param0: K, param1: V, param2: V): boolean;
				public remove(param0: any): V;
				public getOrDefault(param0: any, param1: V): V;
				public static copyOf(param0: java.util.Map<any,any>): java.util.Map<any,any>;
				public hashCode(): number;
				public getInverse(): com.akylas.documentscanner.BiMap<V,K>;
				public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
				public clear(): void;
				public equals(param0: any): boolean;
				public isEmpty(): boolean;
				public containsValue(param0: any): boolean;
				public getValues(): java.util.Set<V>;
				public static entry(param0: any, param1: any): java.util.Map.Entry<any,any>;
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
				public static class: java.lang.Class<com.akylas.documentscanner.YuvByteBuffer>;
				public constructor(param0: globalAndroid.media.Image, param1: java.nio.ByteBuffer);
				public getType(): number;
				public getBuffer(): java.nio.ByteBuffer;
			}
			export namespace YuvByteBuffer {
				export class ImageWrapper extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.YuvByteBuffer.ImageWrapper>;
					public getY(): com.akylas.documentscanner.YuvByteBuffer.PlaneWrapper;
					public getHeight(): number;
					public getU(): com.akylas.documentscanner.YuvByteBuffer.PlaneWrapper;
					public getWidth(): number;
					public constructor(param0: globalAndroid.media.Image);
					public getV(): com.akylas.documentscanner.YuvByteBuffer.PlaneWrapper;
				}
				export class PlaneWrapper extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.YuvByteBuffer.PlaneWrapper>;
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
				public static class: java.lang.Class<com.akylas.documentscanner.YuvToRgbConverter>;
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
				public static class: java.lang.Class<com.akylas.documentscanner.YuvType>;
				/**
				 * Constructs a new instance of the com.akylas.documentscanner.YuvType interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					equals(param0: any): boolean;
					hashCode(): number;
					toString(): string;
					annotationType(): java.lang.Class<any>;
				});
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
					public static class: java.lang.Class<com.akylas.documentscanner.utils.ImageUtil>;
					public constructor();
				}
				export namespace ImageUtil {
					export class Companion extends java.lang.Object {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.ImageUtil.Companion>;
						public static getImageSize(param0: globalAndroid.content.Context, param1: string): number[];
						public static readBitmapFromFile(param0: globalAndroid.content.Context, param1: string, param2: com.akylas.documentscanner.utils.ImageUtil.LoadImageOptions): globalAndroid.graphics.Bitmap;
						public static readBitmapFromFile(param0: globalAndroid.content.Context, param1: string, param2: string): globalAndroid.graphics.Bitmap;
						public static calculateInSampleSize(param0: number, param1: number, param2: number, param3: number): number;
						public static getTargetFormat(param0: string): globalAndroid.graphics.Bitmap.CompressFormat;
					}
					export class ImageAssetOptions extends java.lang.Object {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.ImageUtil.ImageAssetOptions>;
						public setAutoScaleFactor(param0: boolean): void;
						public setWidth(param0: number): void;
						public getAutoScaleFactor(): boolean;
						public constructor(param0: globalAndroid.graphics.BitmapFactory.Options);
						public getWidth(): number;
						public setHeight(param0: number): void;
						public setKeepAspectRatio(param0: boolean): void;
						public getKeepAspectRatio(): boolean;
						public constructor(param0: globalAndroid.graphics.BitmapFactory.Options, param1: com.akylas.documentscanner.utils.ImageUtil.LoadImageOptions);
						public getHeight(): number;
					}
					export class LoadImageOptions extends java.lang.Object {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.ImageUtil.LoadImageOptions>;
						public setAutoScaleFactor(param0: boolean): void;
						public setWidth(param0: number): void;
						public setMaxHeight(param0: number): void;
						public setMaxWidth(param0: number): void;
						public getResizeThreshold(): number;
						public constructor(param0: org.json.JSONObject);
						public getHeight(): number;
						public initWithJSON(param0: org.json.JSONObject): void;
						public getAutoScaleFactor(): boolean;
						public getWidth(): number;
						public getMaxWidth(): number;
						public getMaxHeight(): number;
						public setHeight(param0: number): void;
						public setKeepAspectRatio(param0: boolean): void;
						public getKeepAspectRatio(): boolean;
						public setResizeThreshold(param0: number): void;
						public constructor(param0: string);
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

