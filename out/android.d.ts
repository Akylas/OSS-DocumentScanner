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
				public static copyOf(map: java.util.Map<any,any>): java.util.Map<any,any>;
				public get(param0: any): any;
				public containsKey(key: any): boolean;
				public putAll(param0: java.util.Map<any,any>): void;
				public values(): java.util.Set<any>;
				public replace(key: any, oldValue: any, newValue: any): boolean;
				public containsKey(param0: any): boolean;
				public forcePut(it: any, $i$a$-let-AbstractBiMap$forcePut$2: any): any;
				public constructor();
				public static ofEntries(entries: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
				public getOrDefault(key: any, defaultValue: any): any;
				public remove(it: any): any;
				public forEach(action: any /* any<any,any>*/): void;
				public replaceAll(function_: any /* any<any,any,any>*/): void;
				public static entry(k: any, v: any): java.util.Map.Entry<any,any>;
				public remove(param0: any): any;
				public getSize(): number;
				public hashCode(): number;
				public clear(): void;
				public equals(param0: any): boolean;
				public remove(key: any, value: any): boolean;
				public containsValue(value: any): boolean;
				public isEmpty(): boolean;
				public replace(key: any, value: any): any;
				public computeIfPresent(key: any, remappingFunction: any /* any<any,any,any>*/): any;
				public put(key: any, value: any): any;
				public containsValue(param0: any): boolean;
				public getkeyForValue(value: any): any;
				public values(): java.util.Collection<any>;
				public forcePut(param0: any, param1: any): any;
				public getEntries(): java.util.Set<java.util.Map.Entry<any,any>>;
				public constructor(direct: java.util.Map<any,any>, reverse: java.util.Map<any,any>);
				public entrySet(): java.util.Set<java.util.Map.Entry<any,any>>;
				public get(key: any): any;
				public putAll(it: java.util.Map<any,any>): void;
				public keySet(): java.util.Set<any>;
				public computeIfAbsent(key: any, mappingFunction: any /* any<any,any>*/): any;
				public size(): number;
				public getInverse(): com.akylas.documentscanner.BiMap<any,any>;
				public putIfAbsent(key: any, value: any): any;
				public put(param0: any, param1: any): any;
				public compute(key: any, remappingFunction: any /* any<any,any,any>*/): any;
				public getInverse(): com.akylas.documentscanner.MutableBiMap<any,any>;
				public merge(key: any, value: any, remappingFunction: any /* any<any,any,any>*/): any;
			}
			export namespace AbstractBiMap {
				export class BiMapEntry extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.AbstractBiMap.BiMapEntry>;
					public setValue($i$a$-check-AbstractBiMap$BiMapEntry$setValue$1: any): any;
					public equals(param0: any): boolean;
					public static comparingByValue(cmp: java.util.Comparator<any>): java.util.Comparator<any>;
					public getValue(): any;
					public static comparingByKey(): java.util.Comparator<any>;
					public static comparingByValue(): java.util.Comparator<any>;
					public static comparingByKey(cmp: java.util.Comparator<any>): java.util.Comparator<any>;
					public constructor(this$0: java.util.Map.Entry<any,any>);
					public getKey(): any;
					public hashCode(): number;
					public setValue(param0: any): any;
				}
				export class BiMapSet<T>  extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.AbstractBiMap.BiMapSet<any>>;
					public addAll(param0: java.util.Collection<any>): boolean;
					public isEmpty(): boolean;
					public add(param0: any): boolean;
					public spliterator(): java.util.Spliterator<any>;
					public removeAll(elements: java.util.Collection<any>): boolean;
					public containsAll(param0: java.util.Collection<any>): boolean;
					public size(): number;
					public addAll(elements: java.util.Collection<any>): boolean;
					public getSize(): number;
					public containsAll(elements: java.util.Collection<any>): boolean;
					public iterator(): java.util.Iterator<any>;
					public clear(): void;
					public contains(element: any): boolean;
					public toArray(generator: any /* any*/): androidNative.Array<any>;
					public hashCode(): number;
					public toArray(param0: androidNative.Array<any>): androidNative.Array<any>;
					public contains(param0: any): boolean;
					public forEach(action: any /* any*/): void;
					public remove(key: any): boolean;
					public remove(param0: any): boolean;
					public removeAll(param0: java.util.Collection<any>): boolean;
					public static copyOf(coll: java.util.Collection<any>): java.util.Set<any>;
					public constructor(this$0: java.util.Set<T>, elements: any<any,any>, keyGetter: any<any,any>);
					public parallelStream(): java.util.stream.Stream<any>;
					public toArray(): androidNative.Array<any>;
					public iterator(): java.util.Iterator<T>;
					public retainAll(param0: java.util.Collection<any>): boolean;
					public equals(param0: any): boolean;
					public add(element: T): boolean;
					public retainAll(elements: java.util.Collection<any>): boolean;
					public removeIf(filter: any /* any*/): boolean;
					public stream(): java.util.stream.Stream<any>;
					public spliterator(): java.util.Spliterator<T>;
					public toArray(array: androidNative.Array<any>): androidNative.Array<any>;
				}
				export class BiMapSetIterator<T>  extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.AbstractBiMap.BiMapSetIterator<any>>;
					public constructor(this$0: java.util.Iterator<any>, iterator: any<any,any>, keyGetter: any<any,any>);
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
				public constructor(context: globalAndroid.content.Context, cropView: com.akylas.documentscanner.CropView);
				public setPreAutoScanDelay(<set-?>: number): void;
				public constructor(context: globalAndroid.content.Context, cropView: com.akylas.documentscanner.CropView, onAutoScan: com.akylas.documentscanner.AutoScanHandler.OnAutoScan);
				public setDistanceThreshod(<set-?>: number): void;
				public setAutoScanDuration(<set-?>: number): void;
				public constructor(context: globalAndroid.content.Context);
				public getPreAutoScanDelay(): number;
				public replaceHash(exception: number, this_: number): void;
				public process(it: java.util.List<any>): void;
				public setEnabled(value: boolean): void;
				public startAutoScanPreJob(this_: java.util.List<any>): void;
				public getEnabled(): boolean;
				public getDistanceThreshod(): number;
				public startAutoScanJob(delayMs: java.util.List<any>): void;
				public getAutoScanDuration(): number;
			}
			export namespace AutoScanHandler {
				export class Companion extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.AutoScanHandler.Companion>;
					public getTAG(): string;
					public getHash(points: java.util.List<any>): number;
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
					getOrDefault(key: any, defaultValue: V): V;
					forEach(action: any /* any<any,any>*/): void;
					replaceAll(function_: any /* any<any,any,any>*/): void;
					putIfAbsent(key: K, value: V): V;
					remove(key: any, value: any): boolean;
					replace(key: K, oldValue: V, newValue: V): boolean;
					replace(key: K, value: V): V;
					computeIfAbsent(key: K, mappingFunction: any /* any<any,any>*/): V;
					computeIfPresent(key: K, remappingFunction: any /* any<any,any,any>*/): V;
					compute(key: K, remappingFunction: any /* any<any,any,any>*/): V;
					merge(key: K, value: V, remappingFunction: any /* any<any,any,any>*/): V;
					of(): java.util.Map<any,any>;
					of(k1: any, v1: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any, k8: any, v8: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any, k8: any, v8: any, k9: any, v9: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any, k8: any, v8: any, k9: any, v9: any, k10: any, v10: any): java.util.Map<any,any>;
					ofEntries(entries: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
					entry(k: any, v: any): java.util.Map.Entry<any,any>;
					copyOf(map: java.util.Map<any,any>): java.util.Map<any,any>;
				});
				public constructor();
				public static copyOf(map: java.util.Map<any,any>): java.util.Map<any,any>;
				public getOrDefault(key: any, defaultValue: V): V;
				public entrySet(): java.util.Set<java.util.Map.Entry<K,V>>;
				public putAll(param0: java.util.Map<any,any>): void;
				public computeIfPresent(key: K, remappingFunction: any /* any<any,any,any>*/): V;
				public merge(key: K, value: V, remappingFunction: any /* any<any,any,any>*/): V;
				public keySet(): java.util.Set<K>;
				public containsKey(param0: any): boolean;
				public replace(key: K, oldValue: V, newValue: V): boolean;
				public put(param0: K, param1: V): V;
				public computeIfAbsent(key: K, mappingFunction: any /* any<any,any>*/): V;
				public static ofEntries(entries: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
				public remove(param0: any): V;
				public forEach(action: any /* any<any,any>*/): void;
				public replaceAll(function_: any /* any<any,any,any>*/): void;
				public static entry(k: any, v: any): java.util.Map.Entry<any,any>;
				public hashCode(): number;
				public getInverse(): com.akylas.documentscanner.BiMap<V,K>;
				public clear(): void;
				public equals(param0: any): boolean;
				public remove(key: any, value: any): boolean;
				public putIfAbsent(key: K, value: V): V;
				public isEmpty(): boolean;
				public replace(key: K, value: V): V;
				public containsValue(param0: any): boolean;
				public getValues(): java.util.Set<V>;
				public values(): java.util.Collection<V>;
				public size(): number;
				public get(param0: any): V;
				public compute(key: K, remappingFunction: any /* any<any,any,any>*/): V;
			}
		}
	}
}

declare namespace com {
	export namespace akylas {
		export namespace documentscanner {
			export class CropView extends globalAndroid.view.View {
				public static class: java.lang.Class<com.akylas.documentscanner.CropView>;
				public setAnimationDuration(<set-?>: number): void;
				public getStrokeWidth(): number;
				public getScale(): number;
				public constructor(context: globalAndroid.content.Context);
				public onKeyDown(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
				public setScaleType(value: androidx.camera.view.PreviewView.ScaleType): void;
				public replaceProgressHash(oldValue: number, newValue: number): void;
				public setImageHeight(<set-?>: number): void;
				public getLinePaint(): globalAndroid.graphics.Paint;
				public unscheduleDrawable(who: globalAndroid.graphics.drawable.Drawable): void;
				public sendAccessibilityEvent(param0: number): void;
				public updateProgress(hash: number, i: number): void;
				public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet);
				public onKeyUp(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
				public onKeyLongPress(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
				public getImageHeight(): number;
				public getScaleType(): androidx.camera.view.PreviewView.ScaleType;
				public onKeyMultiple(param0: number, param1: number, param2: globalAndroid.view.KeyEvent): boolean;
				public setImageWidth(<set-?>: number): void;
				public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable): void;
				public setQuadsAnimated(this_: java.util.List<any>): void;
				public onDraw(alpha: globalAndroid.graphics.Canvas): void;
				public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet, defStyleAttr: number, defStyleRes: number);
				public getColors(): java.util.List<java.lang.Integer>;
				public setScale(<set-?>: number): void;
				public getQuads(): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
				public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet, defStyleAttr: number);
				public setProgressFillPaint(<set-?>: globalAndroid.graphics.Paint): void;
				public getProgressFillPaint(): globalAndroid.graphics.Paint;
				public invalidateDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
				public setStrokeWidth(<set-?>: number): void;
				public setFillPaint(<set-?>: globalAndroid.graphics.Paint): void;
				public sendAccessibilityEventUnchecked(param0: globalAndroid.view.accessibility.AccessibilityEvent): void;
				public setQuads(value: java.util.List<any>): void;
				public getFillPaint(): globalAndroid.graphics.Paint;
				public setDrawFill(<set-?>: boolean): void;
				public getAnimationDuration(): number;
				public scheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable, param2: number): void;
				public getDrawFill(): boolean;
				public getImageWidth(): number;
				public setColors(<set-?>: java.util.List<java.lang.Integer>): void;
				public interpolatePoint(point1: globalAndroid.graphics.Point, point2: globalAndroid.graphics.Point, value: number): globalAndroid.graphics.Point;
			}
		}
	}
}

declare namespace com {
	export namespace akylas {
		export namespace documentscanner {
			export class CustomImageAnalysisCallback extends java.lang.Object {
				public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback>;
				public setDetectQRCode(<set-?>: boolean): void;
				public constructor(context: globalAndroid.content.Context, cropView: com.akylas.documentscanner.CropView);
				public constructor(context: globalAndroid.content.Context);
				public getAutoScanHandler(): com.akylas.documentscanner.AutoScanHandler;
				public getDetectDocuments(): boolean;
				public getPreviewResizeThreshold(): number;
				public constructor(context: globalAndroid.content.Context, cropView: com.akylas.documentscanner.CropView, onQRCode: com.akylas.documentscanner.CustomImageAnalysisCallback.OnQRCode);
				public setAutoScanHandler(value: com.akylas.documentscanner.AutoScanHandler): void;
				public setDetectDocuments(<set-?>: boolean): void;
				public getDetectQRCode(): boolean;
				public getDetectQRCodeOptions(): string;
				public setPreviewResizeThreshold(<set-?>: number): void;
				public process(image: androidx.camera.core.ImageProxy, planes: androidx.camera.core.ImageInfo, imageWidth: com.nativescript.cameraview.ImageAsyncProcessor): void;
				public setDetectQRCodeOptions(<set-?>: string): void;
			}
			export namespace CustomImageAnalysisCallback {
				export class Companion extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback.Companion>;
					public generateQRCodeSVG(text: string, format: string, sizeHint: number, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public generateQRCodeSync(text: string, format: string, width: number, height: number): globalAndroid.graphics.Bitmap;
					public cropDocument(bitmap: globalAndroid.graphics.Bitmap, quads: string, callback: com.akylas.documentscanner.utils.FunctionCallback, transforms: string, saveInFolder: string, fileName: string): void;
					public getJSONDocumentCorners(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public ocrDocument(bitmap: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string, progress: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress): void;
					public getColorPalette(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public generateQRCodeSVGSync(text: string, format: string, sizeHint: number, options: string): string;
					public ocrDocument(bitmap: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public readQRCodeSync(bitmap: globalAndroid.graphics.Bitmap, options: string, scale: number): string;
					public getColorPaletteSync(bitmap: globalAndroid.graphics.Bitmap, shrunkImageHeight: number): string;
					public getColorPaletteSync(bitmap: globalAndroid.graphics.Bitmap, shrunkImageHeight: number, colorsFilterDistanceThreshold: number, nbColors: number): string;
					public pointFromJSONArray(i: org.json.JSONArray, list: number): java.util.List<globalAndroid.graphics.Point>;
					public ocrDocumentSync(bitmap: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public getJSONDocumentCorners(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, imageRotation: number, scale: number, options: string): void;
					public getJSONDocumentCornersSync(bitmap: globalAndroid.graphics.Bitmap, shrunkImageHeight: number): string;
					public cropDocumentFromFile(context: globalAndroid.content.Context, src: string, quads: string, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public ocrDocumentFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string, progress: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress): void;
					public readQRCodeSync(bitmap: globalAndroid.graphics.Bitmap): string;
					public generateQRCodeSync(text: string, format: string, width: number, height: number, options: string): globalAndroid.graphics.Bitmap;
					public ocrDocument(bitmap: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public getJSONDocumentCornersFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public getColorPaletteFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, colorsFilterDistanceThreshold: number, nbColors: number, colorPalette: number, options: string): void;
					public cropDocumentSync(bitmap: globalAndroid.graphics.Bitmap, quads: string, transforms: string, saveInFolder: string, fileName: string): any;
					public getJSONDocumentCornersSync(bitmap: globalAndroid.graphics.Bitmap): string;
					public cropDocumentSync(out: globalAndroid.graphics.Bitmap, imagePath: string, result: string, e: string, $i$a$-forEachIndexed-CustomImageAnalysisCallback$Companion$cropDocumentSync$1: string, cropWidth: string, cropHeight: number): any;
					public getColorPaletteFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public getColorPaletteFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, options: string): void;
					public getColorPalette(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, colorsFilterDistanceThreshold: number): void;
					public getJSONDocumentCornersSync(bitmap: globalAndroid.graphics.Bitmap, shrunkImageHeight: number, imageRotation: number, scale: number, options: string): string;
					public cropDocument(bitmap: globalAndroid.graphics.Bitmap, quads: string, callback: com.akylas.documentscanner.utils.FunctionCallback, transforms: string): void;
					public getJSONDocumentCorners(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, imageRotation: number, scale: number): void;
					public generateQRCodeSVGSync(text: string, format: string, sizeHint: number): string;
					public generateQRCode(text: string, format: string, width: number, height: number, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public ocrDocumentSync(this_: globalAndroid.graphics.Bitmap, bitmap: com.akylas.documentscanner.utils.FunctionCallback, callback: string, options: com.akylas.documentscanner.CustomImageAnalysisCallback.FunctionCallbackProgress): void;
					public getColorPalette(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, colorsFilterDistanceThreshold: number, nbColors: number, colorPalette: number): void;
					public pointsFromJSONArray(i: org.json.JSONArray): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
					public processFromFile(context: globalAndroid.content.Context, src: string, processes: string, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public ocrDocumentSync(bitmap: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public getColorPaletteSync(bitmap: globalAndroid.graphics.Bitmap, shrunkImageHeight: number, colorsFilterDistanceThreshold: number, nbColors: number, colorPalette: number): string;
					public ocrDocumentFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public getJSONDocumentCorners(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, imageRotation: number): void;
					public getJSONDocumentCornersFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, options: string): void;
					public cropDocument(bitmap: globalAndroid.graphics.Bitmap, quads: string, callback: com.akylas.documentscanner.utils.FunctionCallback, transforms: string, saveInFolder: string): void;
					public readQRCode(bitmap: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public getColorPalette(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number): void;
					public getColorPaletteFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, colorsFilterDistanceThreshold: number, nbColors: number, options: string): void;
					public readQRCodeSync(bitmap: globalAndroid.graphics.Bitmap, options: string): string;
					public cropDocument(bitmap: globalAndroid.graphics.Bitmap, quads: string, callback: com.akylas.documentscanner.utils.FunctionCallback, transforms: string, saveInFolder: string, fileName: string, compressFormat: string): void;
					public cropDocument(bitmap: globalAndroid.graphics.Bitmap, quads: string, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public cropDocumentSync(bitmap: globalAndroid.graphics.Bitmap, quads: string, saveInFolder: string, fileName: string): any;
					public getJSONDocumentCornersSync(bitmap: globalAndroid.graphics.Bitmap, shrunkImageHeight: number, imageRotation: number): string;
					public getColorPalette(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, colorsFilterDistanceThreshold: number, nbColors: number): void;
					public pointsFromJSONString(str: string): java.util.List<java.util.List<globalAndroid.graphics.Point>>;
					public generateQRCode(text: string, format: string, width: number, height: number, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public getColorPaletteFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number, colorsFilterDistanceThreshold: number, options: string): void;
					public readQRCodeFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public readQRCode(bitmap: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public getColorPaletteSync(bitmap: globalAndroid.graphics.Bitmap): string;
					public getJSONDocumentCornersSync(bitmap: globalAndroid.graphics.Bitmap, shrunkImageHeight: number, imageRotation: number, scale: number): string;
					public getColorPaletteSync(bitmap: globalAndroid.graphics.Bitmap, shrunkImageHeight: number, colorsFilterDistanceThreshold: number): string;
					public cropDocumentSync(bitmap: globalAndroid.graphics.Bitmap, quads: string, transforms: string, saveInFolder: string, fileName: string, compressFormat: string): any;
					public readQRCodeFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public generateQRCodeSVG(text: string, format: string, sizeHint: number, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
					public getJSONDocumentCorners(image: globalAndroid.graphics.Bitmap, callback: com.akylas.documentscanner.utils.FunctionCallback, shrunkImageHeight: number): void;
					public ocrDocumentFromFile(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
					public cropDocument(bitmap: globalAndroid.graphics.Bitmap, quads: string, callback: com.akylas.documentscanner.utils.FunctionCallback, transforms: string, saveInFolder: string, fileName: string, compressFormat: string, compressQuality: number): void;
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
				export class OnQRCode extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.CustomImageAnalysisCallback.OnQRCode>;
					/**
					 * Constructs a new instance of the com.akylas.documentscanner.CustomImageAnalysisCallback$OnQRCode interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onQRCodes(param0: string): void;
					});
					public constructor();
					public onQRCodes(param0: string): void;
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
				public constructor(direct: java.util.Map<any,any>, reverse: java.util.Map<any,any>);
				public constructor(capacity: number);
				public getInverse(): com.akylas.documentscanner.MutableBiMap<any,any>;
				public constructor();
			}
			export namespace HashBiMap {
				export class Companion extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.HashBiMap.Companion>;
					public create(this_: java.util.Map<any,any>): com.akylas.documentscanner.HashBiMap<any,any>;
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
				public getKeys(): java.util.Set<any>;
				public static copyOf(map: java.util.Map<any,any>): java.util.Map<any,any>;
				public get(param0: any): any;
				public putAll(param0: java.util.Map<any,any>): void;
				public constructor(maxSize: number);
				public constructor(initialCapacity: number, loadFactor: number, accessOrder: boolean);
				public replace(key: any, oldValue: any, newValue: any): boolean;
				public getValues(): java.util.Collection<any>;
				public containsKey(param0: any): boolean;
				public constructor();
				public static ofEntries(entries: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
				public getOrDefault(key: any, defaultValue: any): any;
				public forEach(action: any /* any<any,any>*/): void;
				public replaceAll(function_: any /* any<any,any,any>*/): void;
				public static entry(k: any, v: any): java.util.Map.Entry<any,any>;
				public remove(param0: any): any;
				public getSize(): number;
				public hashCode(): number;
				public clear(): void;
				public equals(param0: any): boolean;
				public remove(key: any, value: any): boolean;
				public isEmpty(): boolean;
				public replace(key: any, value: any): any;
				public computeIfPresent(key: any, remappingFunction: any /* any<any,any,any>*/): any;
				public containsValue(param0: any): boolean;
				public removeEldestEntry(eldest: java.util.Map.Entry<any,any>): boolean;
				public values(): java.util.Collection<any>;
				public getEntries(): java.util.Set<java.util.Map.Entry<any,any>>;
				public entrySet(): java.util.Set<java.util.Map.Entry<any,any>>;
				public constructor(initialCapacity: number, loadFactor: number);
				public keySet(): java.util.Set<any>;
				public computeIfAbsent(key: any, mappingFunction: any /* any<any,any>*/): any;
				public size(): number;
				public putIfAbsent(key: any, value: any): any;
				public put(param0: any, param1: any): any;
				public compute(key: any, remappingFunction: any /* any<any,any,any>*/): any;
				public constructor(m: java.util.Map<any,any>);
				public merge(key: any, value: any, remappingFunction: any /* any<any,any,any>*/): any;
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
					getOrDefault(key: any, defaultValue: V): V;
					forEach(action: any /* any<any,any>*/): void;
					replaceAll(function_: any /* any<any,any,any>*/): void;
					putIfAbsent(key: K, value: V): V;
					remove(key: any, value: any): boolean;
					replace(key: K, oldValue: V, newValue: V): boolean;
					replace(key: K, value: V): V;
					computeIfAbsent(key: K, mappingFunction: any /* any<any,any>*/): V;
					computeIfPresent(key: K, remappingFunction: any /* any<any,any,any>*/): V;
					compute(key: K, remappingFunction: any /* any<any,any,any>*/): V;
					merge(key: K, value: V, remappingFunction: any /* any<any,any,any>*/): V;
					of(): java.util.Map<any,any>;
					of(k1: any, v1: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any, k8: any, v8: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any, k8: any, v8: any, k9: any, v9: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any, k8: any, v8: any, k9: any, v9: any, k10: any, v10: any): java.util.Map<any,any>;
					ofEntries(entries: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
					entry(k: any, v: any): java.util.Map.Entry<any,any>;
					copyOf(map: java.util.Map<any,any>): java.util.Map<any,any>;
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
					getOrDefault(key: any, defaultValue: V): V;
					forEach(action: any /* any<any,any>*/): void;
					replaceAll(function_: any /* any<any,any,any>*/): void;
					putIfAbsent(key: K, value: V): V;
					remove(key: any, value: any): boolean;
					replace(key: K, oldValue: V, newValue: V): boolean;
					replace(key: K, value: V): V;
					computeIfAbsent(key: K, mappingFunction: any /* any<any,any>*/): V;
					computeIfPresent(key: K, remappingFunction: any /* any<any,any,any>*/): V;
					compute(key: K, remappingFunction: any /* any<any,any,any>*/): V;
					merge(key: K, value: V, remappingFunction: any /* any<any,any,any>*/): V;
					of(): java.util.Map<any,any>;
					of(k1: any, v1: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any, k8: any, v8: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any, k8: any, v8: any, k9: any, v9: any): java.util.Map<any,any>;
					of(k1: any, v1: any, k2: any, v2: any, k3: any, v3: any, k4: any, v4: any, k5: any, v5: any, k6: any, v6: any, k7: any, v7: any, k8: any, v8: any, k9: any, v9: any, k10: any, v10: any): java.util.Map<any,any>;
					ofEntries(entries: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
					entry(k: any, v: any): java.util.Map.Entry<any,any>;
					copyOf(map: java.util.Map<any,any>): java.util.Map<any,any>;
				});
				public constructor();
				public static copyOf(map: java.util.Map<any,any>): java.util.Map<any,any>;
				public getOrDefault(key: any, defaultValue: V): V;
				public entrySet(): java.util.Set<java.util.Map.Entry<K,V>>;
				public putAll(param0: java.util.Map<any,any>): void;
				public computeIfPresent(key: K, remappingFunction: any /* any<any,any,any>*/): V;
				public merge(key: K, value: V, remappingFunction: any /* any<any,any,any>*/): V;
				public keySet(): java.util.Set<K>;
				public containsKey(param0: any): boolean;
				public replace(key: K, oldValue: V, newValue: V): boolean;
				public getInverse(): com.akylas.documentscanner.MutableBiMap<V,K>;
				public put(param0: K, param1: V): V;
				public computeIfAbsent(key: K, mappingFunction: any /* any<any,any>*/): V;
				public static ofEntries(entries: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
				public remove(param0: any): V;
				public forEach(action: any /* any<any,any>*/): void;
				public replaceAll(function_: any /* any<any,any,any>*/): void;
				public static entry(k: any, v: any): java.util.Map.Entry<any,any>;
				public hashCode(): number;
				public getInverse(): com.akylas.documentscanner.BiMap<V,K>;
				public clear(): void;
				public equals(param0: any): boolean;
				public remove(key: any, value: any): boolean;
				public putIfAbsent(key: K, value: V): V;
				public isEmpty(): boolean;
				public replace(key: K, value: V): V;
				public containsValue(param0: any): boolean;
				public getValues(): java.util.Set<V>;
				public forcePut(param0: K, param1: V): V;
				public values(): java.util.Collection<V>;
				public size(): number;
				public get(param0: any): V;
				public compute(key: K, remappingFunction: any /* any<any,any,any>*/): V;
			}
		}
	}
}

declare namespace com {
	export namespace akylas {
		export namespace documentscanner {
			export class YuvByteBuffer extends java.lang.Object {
				public static class: java.lang.Class<com.akylas.documentscanner.YuvByteBuffer>;
				public getType(): number;
				public constructor(size: globalAndroid.media.Image, this_: java.nio.ByteBuffer);
				public getBuffer(): java.nio.ByteBuffer;
			}
			export namespace YuvByteBuffer {
				export class ImageWrapper extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.YuvByteBuffer.ImageWrapper>;
					public getY(): com.akylas.documentscanner.YuvByteBuffer.PlaneWrapper;
					public getHeight(): number;
					public getU(): com.akylas.documentscanner.YuvByteBuffer.PlaneWrapper;
					public getWidth(): number;
					public constructor($i$a$-require-YuvByteBuffer$ImageWrapper$2: globalAndroid.media.Image);
					public getV(): com.akylas.documentscanner.YuvByteBuffer.PlaneWrapper;
				}
				export class PlaneWrapper extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.YuvByteBuffer.PlaneWrapper>;
					public getRowStride(): number;
					public constructor(width: number, height: number, plane: globalAndroid.media.Image.Plane);
					public getBuffer(): java.nio.ByteBuffer;
					public getHeight(): number;
					public getPixelStride(): number;
					public getWidth(): number;
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
				public constructor(context: globalAndroid.content.Context);
				public yuvToRgb(rgbaType: globalAndroid.media.Image, yuvBuffer: globalAndroid.graphics.Bitmap): void;
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
				export class FileUtils extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.utils.FileUtils>;
					public constructor();
				}
				export namespace FileUtils {
					export class Companion extends java.lang.Object {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.FileUtils.Companion>;
						public getUriFromFile($i$a$-apply-FileUtils$Companion$getUriFromFile$values$1: globalAndroid.content.Context, $this$getUriFromFile_u24lambda_u240: string): globalAndroid.net.Uri;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace akylas {
		export namespace documentscanner {
			export namespace utils {
				export class FunctionCallback extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.utils.FunctionCallback>;
					/**
					 * Constructs a new instance of the com.akylas.documentscanner.utils.FunctionCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onResult(param0: java.lang.Exception, param1: any): void;
					});
					public constructor();
					public onResult(param0: java.lang.Exception, param1: any): void;
				}
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
						public getFileName(context: globalAndroid.content.Context, src: string): string;
						public getImageSizeSync(uri: globalAndroid.content.Context, resolver: string): androidNative.Array<number>;
						public readBitmapFromFile(resolver: globalAndroid.content.Context, matrix: string, rotationAngle: com.akylas.documentscanner.utils.ImageUtil.LoadImageOptions, opts: any<java.lang.Integer,java.lang.Integer>): globalAndroid.graphics.Bitmap;
						public calculateInSampleSize(halfWidth: number, totalPixels: number, totalReqPixelsCap: number, reqWidth: number): number;
						public getImageSize(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
						public getFileName(result: globalAndroid.content.Context, this_: globalAndroid.net.Uri): string;
						public getTargetFormat(format: string): globalAndroid.graphics.Bitmap.CompressFormat;
						public saveBitmapToGallery(e: globalAndroid.content.Context, values: globalAndroid.graphics.Bitmap, url: string, cr: number, this_: string): void;
						public readBitmapFromFile(context: globalAndroid.content.Context, src: string, opts: string): globalAndroid.graphics.Bitmap;
					}
					export class ImageAssetOptions extends java.lang.Object {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.ImageUtil.ImageAssetOptions>;
						public getAutoRotate(): boolean;
						public constructor(sourceSize: any<java.lang.Integer,java.lang.Integer>);
						public getAutoScaleFactor(): boolean;
						public getWidth(): number;
						public setWidth(<set-?>: number): void;
						public setHeight(<set-?>: number): void;
						public setAutoRotate(<set-?>: boolean): void;
						public getKeepAspectRatio(): boolean;
						public getHeight(): number;
						public constructor(sourceSize: any<java.lang.Integer,java.lang.Integer>, options: com.akylas.documentscanner.utils.ImageUtil.LoadImageOptions);
						public setKeepAspectRatio(<set-?>: boolean): void;
						public setAutoScaleFactor(<set-?>: boolean): void;
					}
					export class ImageNotFoundException extends java.lang.Exception {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.ImageUtil.ImageNotFoundException>;
						public constructor();
						public constructor(src: string);
						public constructor(message: string, cause: java.lang.Throwable, enableSuppression: boolean, writableStackTrace: boolean);
						public constructor(message: string, cause: java.lang.Throwable);
						public constructor(cause: java.lang.Throwable);
					}
					export class LoadImageOptions extends java.lang.Object {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.ImageUtil.LoadImageOptions>;
						public setMaxWidth(<set-?>: number): void;
						public getResizeThreshold(): number;
						public setSourceHeight(<set-?>: number): void;
						public getAutoScaleFactor(): boolean;
						public getMaxWidth(): number;
						public getMaxHeight(): number;
						public setResizeThreshold(<set-?>: number): void;
						public getSourceWidth(): number;
						public getKeepAspectRatio(): boolean;
						public setOptions(<set-?>: org.json.JSONObject): void;
						public getSourceHeight(): number;
						public setHeight(<set-?>: number): void;
						public getHeight(): number;
						public setSourceWidth(<set-?>: number): void;
						public setMaxHeight(<set-?>: number): void;
						public getAutoRotate(): boolean;
						public getWidth(): number;
						public constructor(this_: string);
						public setWidth(<set-?>: number): void;
						public setAutoRotate(<set-?>: boolean): void;
						public initWithJSON(jsonOpts: org.json.JSONObject): void;
						public getOptions(): org.json.JSONObject;
						public setKeepAspectRatio(<set-?>: boolean): void;
						public setAutoScaleFactor(<set-?>: boolean): void;
						public constructor(jsonOpts: org.json.JSONObject);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace akylas {
		export namespace documentscanner {
			export namespace utils {
				export class PDFUtils extends java.lang.Object {
					public static class: java.lang.Class<com.akylas.documentscanner.utils.PDFUtils>;
					public static BLACK_WHITE_COLOR_MATRIX: string; // "[0.2126,0.7152,0.0722,0,0,0.2126,0.7152,0.0722,0,0,0.2126,0.7152,0.0722,0,0,0,0,0,1,0]"
					public constructor();
				}
				export namespace PDFUtils {
					export class Companion extends java.lang.Object {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.PDFUtils.Companion>;
						public printPDF(printManager: globalAndroid.content.Context, this_: string, context: string): void;
						public importPdfToTempImages(context: globalAndroid.content.Context, src: string, callback: com.akylas.documentscanner.utils.FunctionCallback, options: string): void;
						public generatePDFASync(context: globalAndroid.content.Context, destFolder: string, fileName: string, options: string, callback: com.akylas.documentscanner.utils.FunctionCallback): void;
						public generatePDF(page: globalAndroid.content.Context, imageRotation: string, imageSrc: string, imageWidth: string): string;
						public compressPDF(imageBytes: string, imgBytes: string, imgRef: number, stream: number): void;
					}
					export class PDFLoadImageOptions extends java.lang.Object {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.PDFUtils.PDFLoadImageOptions>;
						public constructor();
						public getImageSizeThreshold(): number;
						public getImageScale(): number;
						public setImageScale(<set-?>: number): void;
						public setQuality(<set-?>: number): void;
						public getQuality(): number;
						public setImageSizeThreshold(<set-?>: number): void;
					}
					export class PDFPrintDocumentAdapter extends java.lang.Object {
						public static class: java.lang.Class<com.akylas.documentscanner.utils.PDFUtils.PDFPrintDocumentAdapter>;
						public onWrite(inputStream: androidNative.Array<any>, outputStream: globalAndroid.os.ParcelFileDescriptor, buffer: globalAndroid.os.CancellationSignal, bytesRead: any): void;
						public constructor();
						public onLayout(oldAttributes: any, newAttributes: any, cancellationSignal: globalAndroid.os.CancellationSignal, callback: any, extras: globalAndroid.os.Bundle): void;
						public constructor(context: globalAndroid.content.Context, pdfFilePath: string, documentName: string);
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

