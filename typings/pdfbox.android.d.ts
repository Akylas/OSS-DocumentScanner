/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable no-redeclare */

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export class EncodedFont extends java.lang.Object {
				public static class: java.lang.Class<com.tom_roush.fontbox.EncodedFont>;
				/**
				 * Constructs a new instance of the com.tom_roush.fontbox.EncodedFont interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					getEncoding(): com.tom_roush.fontbox.encoding.Encoding;
				});
				public constructor();
				public getEncoding(): com.tom_roush.fontbox.encoding.Encoding;
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export class FontBoxFont extends java.lang.Object {
				public static class: java.lang.Class<com.tom_roush.fontbox.FontBoxFont>;
				/**
				 * Constructs a new instance of the com.tom_roush.fontbox.FontBoxFont interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					getName(): string;
					getFontBBox(): com.tom_roush.fontbox.util.BoundingBox;
					getFontMatrix(): java.util.List<java.lang.Number>;
					getPath(param0: string): globalAndroid.graphics.Path;
					getWidth(param0: string): number;
					hasGlyph(param0: string): boolean;
				});
				public constructor();
				public getFontBBox(): com.tom_roush.fontbox.util.BoundingBox;
				public hasGlyph(param0: string): boolean;
				public getFontMatrix(): java.util.List<java.lang.Number>;
				public getPath(param0: string): globalAndroid.graphics.Path;
				public getName(): string;
				public getWidth(param0: string): number;
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace afm {
				export class AFMParser extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.afm.AFMParser>;
					public static COMMENT: string = "Comment";
					public static START_FONT_METRICS: string = "StartFontMetrics";
					public static END_FONT_METRICS: string = "EndFontMetrics";
					public static FONT_NAME: string = "FontName";
					public static FULL_NAME: string = "FullName";
					public static FAMILY_NAME: string = "FamilyName";
					public static WEIGHT: string = "Weight";
					public static FONT_BBOX: string = "FontBBox";
					public static VERSION: string = "Version";
					public static NOTICE: string = "Notice";
					public static ENCODING_SCHEME: string = "EncodingScheme";
					public static MAPPING_SCHEME: string = "MappingScheme";
					public static ESC_CHAR: string = "EscChar";
					public static CHARACTER_SET: string = "CharacterSet";
					public static CHARACTERS: string = "Characters";
					public static IS_BASE_FONT: string = "IsBaseFont";
					public static V_VECTOR: string = "VVector";
					public static IS_FIXED_V: string = "IsFixedV";
					public static CAP_HEIGHT: string = "CapHeight";
					public static X_HEIGHT: string = "XHeight";
					public static ASCENDER: string = "Ascender";
					public static DESCENDER: string = "Descender";
					public static UNDERLINE_POSITION: string = "UnderlinePosition";
					public static UNDERLINE_THICKNESS: string = "UnderlineThickness";
					public static ITALIC_ANGLE: string = "ItalicAngle";
					public static CHAR_WIDTH: string = "CharWidth";
					public static IS_FIXED_PITCH: string = "IsFixedPitch";
					public static START_CHAR_METRICS: string = "StartCharMetrics";
					public static END_CHAR_METRICS: string = "EndCharMetrics";
					public static CHARMETRICS_C: string = "C";
					public static CHARMETRICS_CH: string = "CH";
					public static CHARMETRICS_WX: string = "WX";
					public static CHARMETRICS_W0X: string = "W0X";
					public static CHARMETRICS_W1X: string = "W1X";
					public static CHARMETRICS_WY: string = "WY";
					public static CHARMETRICS_W0Y: string = "W0Y";
					public static CHARMETRICS_W1Y: string = "W1Y";
					public static CHARMETRICS_W: string = "W";
					public static CHARMETRICS_W0: string = "W0";
					public static CHARMETRICS_W1: string = "W1";
					public static CHARMETRICS_VV: string = "VV";
					public static CHARMETRICS_N: string = "N";
					public static CHARMETRICS_B: string = "B";
					public static CHARMETRICS_L: string = "L";
					public static STD_HW: string = "StdHW";
					public static STD_VW: string = "StdVW";
					public static START_TRACK_KERN: string = "StartTrackKern";
					public static END_TRACK_KERN: string = "EndTrackKern";
					public static START_KERN_DATA: string = "StartKernData";
					public static END_KERN_DATA: string = "EndKernData";
					public static START_KERN_PAIRS: string = "StartKernPairs";
					public static END_KERN_PAIRS: string = "EndKernPairs";
					public static START_KERN_PAIRS0: string = "StartKernPairs0";
					public static START_KERN_PAIRS1: string = "StartKernPairs1";
					public static START_COMPOSITES: string = "StartComposites";
					public static END_COMPOSITES: string = "EndComposites";
					public static PCC: string = "PCC";
					public static KERN_PAIR_KP: string = "KP";
					public static KERN_PAIR_KPH: string = "KPH";
					public static KERN_PAIR_KPX: string = "KPX";
					public static KERN_PAIR_KPY: string = "KPY";
					public parse(): com.tom_roush.fontbox.afm.FontMetrics;
					public constructor(param0: java.io.InputStream);
					public parse(param0: boolean): com.tom_roush.fontbox.afm.FontMetrics;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace afm {
				export class CharMetric extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.afm.CharMetric>;
					public getVv(): androidNative.Array<number>;
					public getW1y(): number;
					public getCharacterCode(): number;
					public setVv(param0: androidNative.Array<number>): void;
					public setW0y(param0: number): void;
					public getWy(): number;
					public setBoundingBox(param0: com.tom_roush.fontbox.util.BoundingBox): void;
					public setW0(param0: androidNative.Array<number>): void;
					public setW1x(param0: number): void;
					public constructor();
					public setWy(param0: number): void;
					public setCharacterCode(param0: number): void;
					public setLigatures(param0: java.util.List<com.tom_roush.fontbox.afm.Ligature>): void;
					public getW0y(): number;
					public getW1(): androidNative.Array<number>;
					public setW(param0: androidNative.Array<number>): void;
					public getLigatures(): java.util.List<com.tom_roush.fontbox.afm.Ligature>;
					public getW1x(): number;
					public setW0x(param0: number): void;
					public setW1(param0: androidNative.Array<number>): void;
					public setName(param0: string): void;
					public getW0x(): number;
					public addLigature(param0: com.tom_roush.fontbox.afm.Ligature): void;
					public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					public getName(): string;
					public getWx(): number;
					public setWx(param0: number): void;
					public getW(): androidNative.Array<number>;
					public setW1y(param0: number): void;
					public getW0(): androidNative.Array<number>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace afm {
				export class Composite extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.afm.Composite>;
					public setParts(param0: java.util.List<com.tom_roush.fontbox.afm.CompositePart>): void;
					public getParts(): java.util.List<com.tom_roush.fontbox.afm.CompositePart>;
					public constructor();
					public getName(): string;
					public addPart(param0: com.tom_roush.fontbox.afm.CompositePart): void;
					public setName(param0: string): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace afm {
				export class CompositePart extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.afm.CompositePart>;
					public setYDisplacement(param0: number): void;
					public setXDisplacement(param0: number): void;
					public constructor();
					public getName(): string;
					public getXDisplacement(): number;
					public setName(param0: string): void;
					public getYDisplacement(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace afm {
				export class FontMetrics extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.afm.FontMetrics>;
					public setWeight(param0: string): void;
					public isFixedPitch(): boolean;
					public setStandardVerticalWidth(param0: number): void;
					public setMappingScheme(param0: number): void;
					public getVVector(): androidNative.Array<number>;
					public setCapHeight(param0: number): void;
					public setXHeight(param0: number): void;
					public setItalicAngle(param0: number): void;
					public getCharacterHeight(param0: string): number;
					public getUnderlinePosition(): number;
					public getFamilyName(): string;
					public setFontBBox(param0: com.tom_roush.fontbox.util.BoundingBox): void;
					public getEscChar(): number;
					public setMetricSets(param0: number): void;
					public getCharacterSet(): string;
					public constructor();
					public getXHeight(): number;
					public setFontVersion(param0: string): void;
					public setUnderlinePosition(param0: number): void;
					public setFamilyName(param0: string): void;
					public getFontName(): string;
					public setNotice(param0: string): void;
					public getWeight(): string;
					public setCharacterSet(param0: string): void;
					public setCharWidth(param0: androidNative.Array<number>): void;
					public setFixedPitch(param0: boolean): void;
					public setCharMetrics(param0: java.util.List<com.tom_roush.fontbox.afm.CharMetric>): void;
					public addComment(param0: string): void;
					public getCharacters(): number;
					public getComments(): java.util.List<string>;
					public setEscChar(param0: number): void;
					public getNotice(): string;
					public setIsBaseFont(param0: boolean): void;
					public getUnderlineThickness(): number;
					public getAscender(): number;
					public getCharMetrics(): java.util.List<com.tom_roush.fontbox.afm.CharMetric>;
					public getItalicAngle(): number;
					public getCapHeight(): number;
					public getCharacterWidth(param0: string): number;
					public setFontName(param0: string): void;
					public addTrackKern(param0: com.tom_roush.fontbox.afm.TrackKern): void;
					public getFontBBox(): com.tom_roush.fontbox.util.BoundingBox;
					public setAFMVersion(param0: number): void;
					public getDescender(): number;
					public setIsFixedV(param0: boolean): void;
					public getTrackKern(): java.util.List<com.tom_roush.fontbox.afm.TrackKern>;
					public isBaseFont(): boolean;
					public addKernPair0(param0: com.tom_roush.fontbox.afm.KernPair): void;
					public setCharacters(param0: number): void;
					public setVVector(param0: androidNative.Array<number>): void;
					public setDescender(param0: number): void;
					public getKernPairs0(): java.util.List<com.tom_roush.fontbox.afm.KernPair>;
					public addKernPair1(param0: com.tom_roush.fontbox.afm.KernPair): void;
					public setKernPairs0(param0: java.util.List<com.tom_roush.fontbox.afm.KernPair>): void;
					public setFullName(param0: string): void;
					public getStandardHorizontalWidth(): number;
					public addComposite(param0: com.tom_roush.fontbox.afm.Composite): void;
					public setKernPairs1(param0: java.util.List<com.tom_roush.fontbox.afm.KernPair>): void;
					public getComposites(): java.util.List<com.tom_roush.fontbox.afm.Composite>;
					public setKernPairs(param0: java.util.List<com.tom_roush.fontbox.afm.KernPair>): void;
					public getKernPairs1(): java.util.List<com.tom_roush.fontbox.afm.KernPair>;
					public setAscender(param0: number): void;
					public setStandardHorizontalWidth(param0: number): void;
					public isFixedV(): boolean;
					public getAverageCharacterWidth(): number;
					public getFontVersion(): string;
					public getFullName(): string;
					public getCharWidth(): androidNative.Array<number>;
					public setEncodingScheme(param0: string): void;
					public getMappingScheme(): number;
					public getEncodingScheme(): string;
					public getMetricSets(): number;
					public getKernPairs(): java.util.List<com.tom_roush.fontbox.afm.KernPair>;
					public setComposites(param0: java.util.List<com.tom_roush.fontbox.afm.Composite>): void;
					public getAFMVersion(): number;
					public addCharMetric(param0: com.tom_roush.fontbox.afm.CharMetric): void;
					public setUnderlineThickness(param0: number): void;
					public setTrackKern(param0: java.util.List<com.tom_roush.fontbox.afm.TrackKern>): void;
					public getStandardVerticalWidth(): number;
					public addKernPair(param0: com.tom_roush.fontbox.afm.KernPair): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace afm {
				export class KernPair extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.afm.KernPair>;
					public setY(param0: number): void;
					public constructor();
					public getFirstKernCharacter(): string;
					public setFirstKernCharacter(param0: string): void;
					public setSecondKernCharacter(param0: string): void;
					public getX(): number;
					public getSecondKernCharacter(): string;
					public setX(param0: number): void;
					public getY(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace afm {
				export class Ligature extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.afm.Ligature>;
					public getLigature(): string;
					public constructor();
					public setSuccessor(param0: string): void;
					public getSuccessor(): string;
					public setLigature(param0: string): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace afm {
				export class TrackKern extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.afm.TrackKern>;
					public getMaxKern(): number;
					public setMaxKern(param0: number): void;
					public setMaxPointSize(param0: number): void;
					public getMinPointSize(): number;
					public constructor();
					public getDegree(): number;
					public getMaxPointSize(): number;
					public setMinPointSize(param0: number): void;
					public setMinKern(param0: number): void;
					public getMinKern(): number;
					public setDegree(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFCIDFont extends com.tom_roush.fontbox.cff.CFFFont {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFCIDFont>;
					public getRegistry(): string;
					public getFontDicts(): java.util.List<java.util.Map<string,any>>;
					public getFdSelect(): com.tom_roush.fontbox.cff.FDSelect;
					public getSupplement(): number;
					public getFontMatrix(): java.util.List<java.lang.Number>;
					public getOrdering(): string;
					public getType2CharString(param0: number): com.tom_roush.fontbox.cff.Type2CharString;
					public getPath(param0: string): globalAndroid.graphics.Path;
					public constructor();
					public getName(): string;
					public getPrivDicts(): java.util.List<java.util.Map<string,any>>;
					public getType2CharString(param0: number): com.tom_roush.fontbox.cff.CIDKeyedType2CharString;
					public getWidth(param0: string): number;
					public hasGlyph(param0: string): boolean;
					public getFontBBox(): com.tom_roush.fontbox.util.BoundingBox;
				}
				export namespace CFFCIDFont {
					export class PrivateType1CharStringReader extends java.lang.Object implements com.tom_roush.fontbox.type1.Type1CharStringReader {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFCIDFont.PrivateType1CharStringReader>;
						public getType1CharString(param0: string): com.tom_roush.fontbox.cff.Type1CharString;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export abstract class CFFCharset extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFCharset>;
					public getCIDForGID(param0: number): number;
					public isCIDFont(): boolean;
					public addCID(param0: number, param1: number): void;
					public getGIDForCID(param0: number): number;
					public getNameForGID(param0: number): string;
					public addSID(param0: number, param1: number, param2: string): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFDataInput extends com.tom_roush.fontbox.cff.DataInput {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFDataInput>;
					public readOffset(param0: number): number;
					public readOffSize(): number;
					public readSID(): number;
					public readCard8(): number;
					public constructor(param0: androidNative.Array<number>);
					public readCard16(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export abstract class CFFEncoding extends com.tom_roush.fontbox.encoding.Encoding {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFEncoding>;
					public add(param0: number, param1: number): void;
					public add(param0: number, param1: number, param2: string): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFExpertCharset extends com.tom_roush.fontbox.cff.CFFCharset {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFExpertCharset>;
					public static getInstance(): com.tom_roush.fontbox.cff.CFFExpertCharset;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFExpertEncoding extends com.tom_roush.fontbox.cff.CFFEncoding {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFExpertEncoding>;
					public static getInstance(): com.tom_roush.fontbox.cff.CFFExpertEncoding;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFExpertSubsetCharset extends com.tom_roush.fontbox.cff.CFFCharset {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFExpertSubsetCharset>;
					public static getInstance(): com.tom_roush.fontbox.cff.CFFExpertSubsetCharset;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export abstract class CFFFont extends java.lang.Object implements com.tom_roush.fontbox.FontBoxFont {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFFont>;
					public fontName: string;
					public topDict: java.util.Map<string,any>;
					public charset: com.tom_roush.fontbox.cff.CFFCharset;
					public charStrings: androidNative.Array<androidNative.Array<number>>;
					public globalSubrIndex: androidNative.Array<androidNative.Array<number>>;
					public addValueToTopDict(param0: string, param1: any): void;
					public getCharset(): com.tom_roush.fontbox.cff.CFFCharset;
					public getGlobalSubrIndex(): java.util.List<androidNative.Array<number>>;
					public getFontMatrix(): java.util.List<java.lang.Number>;
					public toString(): string;
					public getType2CharString(param0: number): com.tom_roush.fontbox.cff.Type2CharString;
					public getPath(param0: string): globalAndroid.graphics.Path;
					public constructor();
					public getName(): string;
					public getData(): androidNative.Array<number>;
					public getNumCharStrings(): number;
					public getTopDict(): java.util.Map<string,any>;
					public getCharStringBytes(): java.util.List<androidNative.Array<number>>;
					public getFontBBox(): com.tom_roush.fontbox.util.BoundingBox;
					public getWidth(param0: string): number;
					public hasGlyph(param0: string): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFISOAdobeCharset extends com.tom_roush.fontbox.cff.CFFCharset {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFISOAdobeCharset>;
					public static getInstance(): com.tom_roush.fontbox.cff.CFFISOAdobeCharset;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFOperator extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFOperator>;
					public equals(param0: any): boolean;
					public toString(): string;
					public static getOperator(param0: com.tom_roush.fontbox.cff.CFFOperator.Key): com.tom_roush.fontbox.cff.CFFOperator;
					public getName(): string;
					public getKey(): com.tom_roush.fontbox.cff.CFFOperator.Key;
					public hashCode(): number;
					public static getOperator(param0: string): com.tom_roush.fontbox.cff.CFFOperator;
				}
				export namespace CFFOperator {
					export class Key extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFOperator.Key>;
						public constructor(param0: number);
						public hashCode(): number;
						public equals(param0: any): boolean;
						public getValue(): androidNative.Array<number>;
						public constructor(param0: number, param1: number);
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFParser extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser>;
					public toString(): string;
					public constructor();
					public parse(param0: androidNative.Array<number>, param1: com.tom_roush.fontbox.cff.CFFParser.ByteSource): java.util.List<com.tom_roush.fontbox.cff.CFFFont>;
					public parse(param0: androidNative.Array<number>): java.util.List<com.tom_roush.fontbox.cff.CFFFont>;
				}
				export namespace CFFParser {
					export class ByteSource extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.ByteSource>;
						/**
						 * Constructs a new instance of the com.tom_roush.fontbox.cff.CFFParser$ByteSource interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getBytes(): androidNative.Array<number>;
						});
						public constructor();
						public getBytes(): androidNative.Array<number>;
					}
					export abstract class CFFBuiltInEncoding extends com.tom_roush.fontbox.cff.CFFEncoding {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.CFFBuiltInEncoding>;
					}
					export namespace CFFBuiltInEncoding {
						export class Supplement extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.CFFBuiltInEncoding.Supplement>;
							public getName(): string;
							public toString(): string;
							public getCode(): number;
							public getSID(): number;
						}
					}
					export class DictData extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.DictData>;
						public add(param0: com.tom_roush.fontbox.cff.CFFParser.DictData.Entry): void;
						public getEntry(param0: string): com.tom_roush.fontbox.cff.CFFParser.DictData.Entry;
						public getArray(param0: string, param1: java.util.List<java.lang.Number>): java.util.List<java.lang.Number>;
						public getNumber(param0: string, param1: java.lang.Number): java.lang.Number;
						public getDelta(param0: string, param1: java.util.List<java.lang.Number>): java.util.List<java.lang.Number>;
						public getBoolean(param0: string, param1: boolean): java.lang.Boolean;
						public toString(): string;
					}
					export namespace DictData {
						export class Entry extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.DictData.Entry>;
							public size(): number;
							public getNumber(param0: number): java.lang.Number;
							public hasOperands(): boolean;
							public getBoolean(param0: number, param1: java.lang.Boolean): java.lang.Boolean;
							public getDelta(): java.util.List<java.lang.Number>;
							public toString(): string;
							public getArray(): java.util.List<java.lang.Number>;
							/** @deprecated */
							public getBoolean(param0: number): java.lang.Boolean;
						}
					}
					export abstract class EmbeddedCharset extends com.tom_roush.fontbox.cff.CFFCharset {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.EmbeddedCharset>;
						public constructor(param0: boolean);
					}
					export class EmptyCharset extends com.tom_roush.fontbox.cff.CFFParser.EmbeddedCharset {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.EmptyCharset>;
						public constructor(param0: number);
						public constructor(param0: boolean);
						public toString(): string;
					}
					export class Format0Charset extends com.tom_roush.fontbox.cff.CFFParser.EmbeddedCharset {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.Format0Charset>;
						public constructor(param0: boolean);
						public toString(): string;
					}
					export class Format0Encoding extends com.tom_roush.fontbox.cff.CFFParser.CFFBuiltInEncoding {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.Format0Encoding>;
						public toString(): string;
					}
					export class Format0FDSelect extends com.tom_roush.fontbox.cff.FDSelect {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.Format0FDSelect>;
						public getFDIndex(param0: number): number;
						public toString(): string;
					}
					export class Format1Charset extends com.tom_roush.fontbox.cff.CFFParser.EmbeddedCharset {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.Format1Charset>;
						public getCIDForGID(param0: number): number;
						public constructor(param0: boolean);
						public getGIDForCID(param0: number): number;
						public toString(): string;
					}
					export class Format1Encoding extends com.tom_roush.fontbox.cff.CFFParser.CFFBuiltInEncoding {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.Format1Encoding>;
						public toString(): string;
					}
					export class Format2Charset extends com.tom_roush.fontbox.cff.CFFParser.EmbeddedCharset {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.Format2Charset>;
						public getCIDForGID(param0: number): number;
						public constructor(param0: boolean);
						public getGIDForCID(param0: number): number;
						public toString(): string;
					}
					export class Format3FDSelect extends com.tom_roush.fontbox.cff.FDSelect {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.Format3FDSelect>;
						public getFDIndex(param0: number): number;
						public toString(): string;
					}
					export class Header extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.Header>;
						public toString(): string;
					}
					export class Range3 extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.Range3>;
						public toString(): string;
					}
					export class RangeMapping extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFParser.RangeMapping>;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFStandardEncoding extends com.tom_roush.fontbox.cff.CFFEncoding {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFStandardEncoding>;
					public static getInstance(): com.tom_roush.fontbox.cff.CFFStandardEncoding;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFStandardString extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFStandardString>;
					public static getName(param0: number): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CFFType1Font extends com.tom_roush.fontbox.cff.CFFFont implements com.tom_roush.fontbox.EncodedFont {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFType1Font>;
					public getEncoding(): com.tom_roush.fontbox.cff.CFFEncoding;
					public getFontMatrix(): java.util.List<java.lang.Number>;
					public getType2CharString(param0: number): com.tom_roush.fontbox.cff.Type2CharString;
					public getPath(param0: string): globalAndroid.graphics.Path;
					public constructor();
					public getName(): string;
					public getEncoding(): com.tom_roush.fontbox.encoding.Encoding;
					public getPrivateDict(): java.util.Map<string,any>;
					public nameToGID(param0: string): number;
					public getWidth(param0: string): number;
					public hasGlyph(param0: string): boolean;
					public getFontBBox(): com.tom_roush.fontbox.util.BoundingBox;
					public getType1CharString(param0: string): com.tom_roush.fontbox.cff.Type1CharString;
				}
				export namespace CFFType1Font {
					export class PrivateType1CharStringReader extends java.lang.Object implements com.tom_roush.fontbox.type1.Type1CharStringReader {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CFFType1Font.PrivateType1CharStringReader>;
						public getType1CharString(param0: string): com.tom_roush.fontbox.cff.Type1CharString;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CIDKeyedType2CharString extends com.tom_roush.fontbox.cff.Type2CharString {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CIDKeyedType2CharString>;
					public constructor(param0: com.tom_roush.fontbox.type1.Type1CharStringReader, param1: string, param2: number, param3: number, param4: java.util.List<any>, param5: number, param6: number);
					public constructor(param0: com.tom_roush.fontbox.type1.Type1CharStringReader, param1: string, param2: string, param3: java.util.List<any>);
					public getCID(): number;
					public constructor(param0: com.tom_roush.fontbox.type1.Type1CharStringReader, param1: string, param2: string, param3: number, param4: java.util.List<any>, param5: number, param6: number);
					public constructor(param0: com.tom_roush.fontbox.type1.Type1CharStringReader, param1: string, param2: string);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class CharStringCommand extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CharStringCommand>;
					public static TYPE1_VOCABULARY: java.util.Map<com.tom_roush.fontbox.cff.CharStringCommand.Key,string>;
					public static TYPE2_VOCABULARY: java.util.Map<com.tom_roush.fontbox.cff.CharStringCommand.Key,string>;
					public equals(param0: any): boolean;
					public toString(): string;
					public getKey(): com.tom_roush.fontbox.cff.CharStringCommand.Key;
					public hashCode(): number;
					public constructor(param0: androidNative.Array<number>);
					public constructor(param0: number);
					public constructor(param0: number, param1: number);
				}
				export namespace CharStringCommand {
					export class Key extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.cff.CharStringCommand.Key>;
						public constructor(param0: androidNative.Array<number>);
						public constructor(param0: number);
						public hashCode(): number;
						public equals(param0: any): boolean;
						public getValue(): androidNative.Array<number>;
						public constructor(param0: number, param1: number);
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export abstract class CharStringHandler extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.CharStringHandler>;
					public constructor();
					public handleSequence(param0: java.util.List<any>): java.util.List<java.lang.Number>;
					public handleCommand(param0: java.util.List<java.lang.Number>, param1: com.tom_roush.fontbox.cff.CharStringCommand): java.util.List<java.lang.Number>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class DataInput extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.DataInput>;
					public hasRemaining(): boolean;
					public readBytes(param0: number): androidNative.Array<number>;
					public peekUnsignedByte(param0: number): number;
					public readUnsignedShort(): number;
					public setPosition(param0: number): void;
					public readByte(): number;
					public getString(): string;
					public readShort(): number;
					public length(): number;
					public constructor(param0: androidNative.Array<number>);
					public getPosition(): number;
					public readUnsignedByte(): number;
					public readInt(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class DataOutput extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.DataOutput>;
					public print(param0: string): void;
					public constructor(param0: string);
					public constructor();
					public write(param0: androidNative.Array<number>): void;
					public getBytes(): androidNative.Array<number>;
					public write(param0: number): void;
					public println(param0: string): void;
					public println(): void;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export abstract class FDSelect extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.FDSelect>;
					public owner: com.tom_roush.fontbox.cff.CFFCIDFont;
					public constructor(param0: com.tom_roush.fontbox.cff.CFFCIDFont);
					public getFDIndex(param0: number): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class Type1CharString extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.Type1CharString>;
					public type1Sequence: java.util.List<any>;
					public commandCount: number;
					public constructor(param0: com.tom_roush.fontbox.type1.Type1CharStringReader, param1: string, param2: string, param3: java.util.List<any>);
					public getType1Sequence(): java.util.List<any>;
					public toString(): string;
					public getName(): string;
					public getWidth(): number;
					public constructor(param0: com.tom_roush.fontbox.type1.Type1CharStringReader, param1: string, param2: string);
					public getPath(): globalAndroid.graphics.Path;
					public getBounds(): globalAndroid.graphics.RectF;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class Type1CharStringParser extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.Type1CharStringParser>;
					public constructor(param0: string, param1: string);
					public parse(param0: androidNative.Array<number>, param1: java.util.List<androidNative.Array<number>>): java.util.List<any>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class Type1FontUtil extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.Type1FontUtil>;
					public static eexecDecrypt(param0: androidNative.Array<number>): androidNative.Array<number>;
					public static hexDecode(param0: string): androidNative.Array<number>;
					public static charstringDecrypt(param0: androidNative.Array<number>, param1: number): androidNative.Array<number>;
					public static eexecEncrypt(param0: androidNative.Array<number>): androidNative.Array<number>;
					public static hexEncode(param0: androidNative.Array<number>): string;
					public static charstringEncrypt(param0: androidNative.Array<number>, param1: number): androidNative.Array<number>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class Type2CharString extends com.tom_roush.fontbox.cff.Type1CharString {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.Type2CharString>;
					public constructor(param0: com.tom_roush.fontbox.type1.Type1CharStringReader, param1: string, param2: string, param3: java.util.List<any>);
					public getGID(): number;
					public constructor(param0: com.tom_roush.fontbox.type1.Type1CharStringReader, param1: string, param2: string);
					public constructor(param0: com.tom_roush.fontbox.type1.Type1CharStringReader, param1: string, param2: string, param3: number, param4: java.util.List<any>, param5: number, param6: number);
					public getType2Sequence(): java.util.List<any>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cff {
				export class Type2CharStringParser extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cff.Type2CharStringParser>;
					public constructor(param0: string, param1: string);
					public parse(param0: androidNative.Array<number>, param1: androidNative.Array<androidNative.Array<number>>, param2: androidNative.Array<androidNative.Array<number>>): java.util.List<any>;
					public constructor(param0: string, param1: number);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cmap {
				export class CIDRange extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cmap.CIDRange>;
					public unmap(param0: number): number;
					public map(param0: string): number;
					public extend(param0: string, param1: string, param2: number): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cmap {
				export class CMap extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cmap.CMap>;
					public getType(): number;
					public getRegistry(): string;
					public getVersion(): string;
					public setOrdering(param0: string): void;
					public toUnicode(param0: number): string;
					public hasUnicodeMappings(): boolean;
					public getSupplement(): number;
					public setRegistry(param0: string): void;
					public setName(param0: string): void;
					public getWMode(): number;
					public setVersion(param0: string): void;
					public getOrdering(): string;
					public toString(): string;
					public setSupplement(param0: number): void;
					public toCID(param0: number): number;
					public getName(): string;
					public hasCIDMappings(): boolean;
					public setType(param0: number): void;
					public setWMode(param0: number): void;
					public getCodesFromUnicode(param0: string): androidNative.Array<number>;
					public getSpaceMapping(): number;
					public readCode(param0: java.io.InputStream): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cmap {
				export class CMapParser extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cmap.CMapParser>;
					public parse(param0: java.io.InputStream): com.tom_roush.fontbox.cmap.CMap;
					public constructor(param0: boolean);
					public constructor();
					public parsePredefined(param0: string): com.tom_roush.fontbox.cmap.CMap;
					public getExternalCMap(param0: string): java.io.InputStream;
					public parse(param0: java.io.File): com.tom_roush.fontbox.cmap.CMap;
				}
				export namespace CMapParser {
					export class LiteralName extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.cmap.CMapParser.LiteralName>;
					}
					export class Operator extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.cmap.CMapParser.Operator>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace cmap {
				export class CodespaceRange extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.cmap.CodespaceRange>;
					/** @deprecated */
					public constructor();
					public getCodeLength(): number;
					/** @deprecated */
					public getEnd(): androidNative.Array<number>;
					public matches(param0: androidNative.Array<number>): boolean;
					public isFullMatch(param0: androidNative.Array<number>, param1: number): boolean;
					/** @deprecated */
					public getStart(): androidNative.Array<number>;
					public constructor(param0: androidNative.Array<number>, param1: androidNative.Array<number>);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace encoding {
				export class BuiltInEncoding extends com.tom_roush.fontbox.encoding.Encoding {
					public static class: java.lang.Class<com.tom_roush.fontbox.encoding.BuiltInEncoding>;
					public constructor();
					public constructor(param0: java.util.Map<java.lang.Integer,string>);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace encoding {
				export abstract class Encoding extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.encoding.Encoding>;
					public codeToName: java.util.Map<java.lang.Integer,string>;
					public nameToCode: java.util.Map<string,java.lang.Integer>;
					public constructor();
					public getName(param0: number): string;
					public getCode(param0: string): java.lang.Integer;
					public getCodeToNameMap(): java.util.Map<java.lang.Integer,string>;
					public addCharacterEncoding(param0: number, param1: string): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace encoding {
				export class MacRomanEncoding extends com.tom_roush.fontbox.encoding.Encoding {
					public static class: java.lang.Class<com.tom_roush.fontbox.encoding.MacRomanEncoding>;
					public static INSTANCE: com.tom_roush.fontbox.encoding.MacRomanEncoding;
					public constructor();
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace encoding {
				export class StandardEncoding extends com.tom_roush.fontbox.encoding.Encoding {
					public static class: java.lang.Class<com.tom_roush.fontbox.encoding.StandardEncoding>;
					public static INSTANCE: com.tom_roush.fontbox.encoding.StandardEncoding;
					public constructor();
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace pfb {
				export class PfbParser extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.pfb.PfbParser>;
					public constructor(param0: string);
					public constructor(param0: java.io.InputStream);
					public getSegment2(): androidNative.Array<number>;
					public getLengths(): androidNative.Array<number>;
					public getInputStream(): java.io.InputStream;
					public size(): number;
					public constructor(param0: androidNative.Array<number>);
					public getPfbdata(): androidNative.Array<number>;
					public getSegment1(): androidNative.Array<number>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class BufferedRandomAccessFile extends java.io.RandomAccessFile {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.BufferedRandomAccessFile>;
					public readLine(): string;
					public writeChar(param0: number): void;
					public writeBytes(param0: string): void;
					public readLong(): number;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public writeChars(param0: string): void;
					public readFully(param0: androidNative.Array<number>): void;
					public writeShort(param0: number): void;
					public readShort(): number;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public constructor(param0: string, param1: string);
					public readBoolean(): boolean;
					public constructor(param0: string, param1: string, param2: number);
					public close(): void;
					public writeLong(param0: number): void;
					public writeFloat(param0: number): void;
					public seek(param0: number): void;
					public readFloat(): number;
					public readUnsignedByte(): number;
					public readUTF(): string;
					public constructor(param0: java.io.File, param1: string);
					public readInt(): number;
					public skipBytes(param0: number): number;
					public read(): number;
					public readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public writeDouble(param0: number): void;
					public write(param0: number): void;
					public readUnsignedShort(): number;
					public readByte(): number;
					public readDouble(): number;
					public getFilePointer(): number;
					public constructor(param0: java.io.File, param1: string, param2: number);
					public writeBoolean(param0: boolean): void;
					public write(param0: androidNative.Array<number>): void;
					public writeByte(param0: number): void;
					public writeInt(param0: number): void;
					public writeUTF(param0: string): void;
					public read(param0: androidNative.Array<number>): number;
					public readChar(): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class CFFTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.CFFTable>;
					public static TAG: string = "CFF ";
					public getFont(): com.tom_roush.fontbox.cff.CFFFont;
				}
				export namespace CFFTable {
					export class CFFBytesource extends java.lang.Object implements com.tom_roush.fontbox.cff.CFFParser.ByteSource {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.CFFTable.CFFBytesource>;
						public getBytes(): androidNative.Array<number>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class CmapLookup extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.CmapLookup>;
					/**
					 * Constructs a new instance of the com.tom_roush.fontbox.ttf.CmapLookup interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getGlyphId(param0: number): number;
						getCharCodes(param0: number): java.util.List<java.lang.Integer>;
					});
					public constructor();
					public getCharCodes(param0: number): java.util.List<java.lang.Integer>;
					public getGlyphId(param0: number): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class CmapSubtable extends java.lang.Object implements com.tom_roush.fontbox.ttf.CmapLookup {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.CmapSubtable>;
					public setPlatformEncodingId(param0: number): void;
					public toString(): string;
					public constructor();
					public getPlatformEncodingId(): number;
					public getCharCodes(param0: number): java.util.List<java.lang.Integer>;
					/** @deprecated */
					public getCharacterCode(param0: number): java.lang.Integer;
					public setPlatformId(param0: number): void;
					public getPlatformId(): number;
					public getGlyphId(param0: number): number;
				}
				export namespace CmapSubtable {
					export class SubHeader extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.CmapSubtable.SubHeader>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class CmapTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.CmapTable>;
					public static TAG: string = "cmap";
					public static PLATFORM_UNICODE: number = 0;
					public static PLATFORM_MACINTOSH: number = 1;
					public static PLATFORM_WINDOWS: number = 3;
					public static ENCODING_MAC_ROMAN: number = 0;
					public static ENCODING_WIN_SYMBOL: number = 0;
					public static ENCODING_WIN_UNICODE_BMP: number = 1;
					public static ENCODING_WIN_SHIFT_JIS: number = 2;
					public static ENCODING_WIN_BIG5: number = 3;
					public static ENCODING_WIN_PRC: number = 4;
					public static ENCODING_WIN_WANSUNG: number = 5;
					public static ENCODING_WIN_JOHAB: number = 6;
					public static ENCODING_WIN_UNICODE_FULL: number = 10;
					public static ENCODING_UNICODE_1_0: number = 0;
					public static ENCODING_UNICODE_1_1: number = 1;
					public static ENCODING_UNICODE_2_0_BMP: number = 3;
					public static ENCODING_UNICODE_2_0_FULL: number = 4;
					public getCmaps(): androidNative.Array<com.tom_roush.fontbox.ttf.CmapSubtable>;
					public getSubtable(param0: number, param1: number): com.tom_roush.fontbox.ttf.CmapSubtable;
					public setCmaps(param0: androidNative.Array<com.tom_roush.fontbox.ttf.CmapSubtable>): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class DigitalSignatureTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.DigitalSignatureTable>;
					public static TAG: string = "DSIG";
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class GlyfCompositeComp extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyfCompositeComp>;
					public static ARG_1_AND_2_ARE_WORDS: number = 1;
					public static ARGS_ARE_XY_VALUES: number = 2;
					public static ROUND_XY_TO_GRID: number = 4;
					public static WE_HAVE_A_SCALE: number = 8;
					public static MORE_COMPONENTS: number = 32;
					public static WE_HAVE_AN_X_AND_Y_SCALE: number = 64;
					public static WE_HAVE_A_TWO_BY_TWO: number = 128;
					public static WE_HAVE_INSTRUCTIONS: number = 256;
					public static USE_MY_METRICS: number = 512;
					public getScale10(): number;
					public setFirstIndex(param0: number): void;
					public getYTranslate(): number;
					public setFirstContour(param0: number): void;
					public getFlags(): number;
					public getGlyphIndex(): number;
					public getArgument1(): number;
					public getXScale(): number;
					public getScale01(): number;
					public getYScale(): number;
					public getXTranslate(): number;
					public getFirstIndex(): number;
					public scaleY(param0: number, param1: number): number;
					public getFirstContour(): number;
					public scaleX(param0: number, param1: number): number;
					public getArgument2(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class GlyfCompositeDescript extends com.tom_roush.fontbox.ttf.GlyfDescript {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyfCompositeDescript>;
					public getPointCount(): number;
					public getComponentCount(): number;
					public isComposite(): boolean;
					public getEndPtOfContours(param0: number): number;
					public getXCoordinate(param0: number): number;
					public getYCoordinate(param0: number): number;
					public resolve(): void;
					public getFlags(param0: number): number;
					public getContourCount(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export abstract class GlyfDescript extends java.lang.Object implements com.tom_roush.fontbox.ttf.GlyphDescription {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyfDescript>;
					public static ON_CURVE: number = 1;
					public static X_SHORT_VECTOR: number = 2;
					public static Y_SHORT_VECTOR: number = 4;
					public static REPEAT: number = 8;
					public static X_DUAL: number = 16;
					public static Y_DUAL: number = 32;
					public getInstructions(): androidNative.Array<number>;
					public getPointCount(): number;
					public isComposite(): boolean;
					public getEndPtOfContours(param0: number): number;
					public getXCoordinate(param0: number): number;
					public getYCoordinate(param0: number): number;
					public resolve(): void;
					public getFlags(param0: number): number;
					public getContourCount(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class GlyfSimpleDescript extends com.tom_roush.fontbox.ttf.GlyfDescript {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyfSimpleDescript>;
					public getPointCount(): number;
					public isComposite(): boolean;
					public getEndPtOfContours(param0: number): number;
					public getXCoordinate(param0: number): number;
					public getYCoordinate(param0: number): number;
					public resolve(): void;
					public getFlags(param0: number): number;
					public getContourCount(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class GlyphData extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphData>;
					public setNumberOfContours(param0: number): void;
					public constructor();
					public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					public getXMaximum(): number;
					public getYMaximum(): number;
					public getNumberOfContours(): number;
					public getXMinimum(): number;
					public getPath(): globalAndroid.graphics.Path;
					public getYMinimum(): number;
					public setBoundingBox(param0: com.tom_roush.fontbox.util.BoundingBox): void;
					public getDescription(): com.tom_roush.fontbox.ttf.GlyphDescription;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class GlyphDescription extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphDescription>;
					/**
					 * Constructs a new instance of the com.tom_roush.fontbox.ttf.GlyphDescription interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getEndPtOfContours(param0: number): number;
						getFlags(param0: number): number;
						getXCoordinate(param0: number): number;
						getYCoordinate(param0: number): number;
						isComposite(): boolean;
						getPointCount(): number;
						getContourCount(): number;
						resolve(): void;
					});
					public constructor();
					public getPointCount(): number;
					public isComposite(): boolean;
					public getEndPtOfContours(param0: number): number;
					public getXCoordinate(param0: number): number;
					public getYCoordinate(param0: number): number;
					public resolve(): void;
					public getFlags(param0: number): number;
					public getContourCount(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class GlyphRenderer extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphRenderer>;
					public getPath(): globalAndroid.graphics.Path;
				}
				export namespace GlyphRenderer {
					export class Point extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphRenderer.Point>;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class GlyphSubstitutionTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable>;
					public static TAG: string = "GSUB";
					public getUnsubstitution(param0: number): number;
					public getSubstitution(param0: number, param1: androidNative.Array<string>, param2: java.util.List<string>): number;
				}
				export namespace GlyphSubstitutionTable {
					export abstract class CoverageTable extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.CoverageTable>;
					}
					export class CoverageTableFormat1 extends com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.CoverageTable {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.CoverageTableFormat1>;
						public toString(): string;
					}
					export class CoverageTableFormat2 extends com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.CoverageTable {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.CoverageTableFormat2>;
						public toString(): string;
					}
					export class FeatureRecord extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.FeatureRecord>;
						public toString(): string;
					}
					export class FeatureTable extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.FeatureTable>;
						public toString(): string;
					}
					export class LangSysRecord extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.LangSysRecord>;
						public toString(): string;
					}
					export class LangSysTable extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.LangSysTable>;
						public toString(): string;
					}
					export abstract class LookupSubTable extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.LookupSubTable>;
					}
					export class LookupTable extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.LookupTable>;
						public toString(): string;
					}
					export class LookupTypeSingleSubstFormat1 extends com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.LookupSubTable {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.LookupTypeSingleSubstFormat1>;
						public toString(): string;
					}
					export class LookupTypeSingleSubstFormat2 extends com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.LookupSubTable {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.LookupTypeSingleSubstFormat2>;
						public toString(): string;
					}
					export class RangeRecord extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.RangeRecord>;
						public toString(): string;
					}
					export class ScriptRecord extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.ScriptRecord>;
						public toString(): string;
					}
					export class ScriptTable extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphSubstitutionTable.ScriptTable>;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class GlyphTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.GlyphTable>;
					public static TAG: string = "glyf";
					/** @deprecated */
					public getGlyphs(): androidNative.Array<com.tom_roush.fontbox.ttf.GlyphData>;
					public getGlyph(param0: number): com.tom_roush.fontbox.ttf.GlyphData;
					public setGlyphs(param0: androidNative.Array<com.tom_roush.fontbox.ttf.GlyphData>): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class HeaderTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.HeaderTable>;
					public static TAG: string = "head";
					public static MAC_STYLE_BOLD: number = 1;
					public static MAC_STYLE_ITALIC: number = 2;
					public getFlags(): number;
					public getFontDirectionHint(): number;
					public getGlyphDataFormat(): number;
					public getUnitsPerEm(): number;
					public setFontDirectionHint(param0: number): void;
					public setXMin(param0: number): void;
					public getXMin(): number;
					public setCreated(param0: java.util.Calendar): void;
					public getYMax(): number;
					public setLowestRecPPEM(param0: number): void;
					public setMacStyle(param0: number): void;
					public setYMax(param0: number): void;
					public setYMin(param0: number): void;
					public setFlags(param0: number): void;
					public getYMin(): number;
					public getMacStyle(): number;
					public setModified(param0: java.util.Calendar): void;
					public getCheckSumAdjustment(): number;
					public getIndexToLocFormat(): number;
					public setGlyphDataFormat(param0: number): void;
					public setMagicNumber(param0: number): void;
					public getVersion(): number;
					public setCheckSumAdjustment(param0: number): void;
					public getMagicNumber(): number;
					public getModified(): java.util.Calendar;
					public getXMax(): number;
					public getLowestRecPPEM(): number;
					public setUnitsPerEm(param0: number): void;
					public getCreated(): java.util.Calendar;
					public getFontRevision(): number;
					public setIndexToLocFormat(param0: number): void;
					public setVersion(param0: number): void;
					public setFontRevision(param0: number): void;
					public setXMax(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class HorizontalHeaderTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.HorizontalHeaderTable>;
					public static TAG: string = "hhea";
					public getDescender(): number;
					public getMinLeftSideBearing(): number;
					public setXMaxExtent(param0: number): void;
					public getReserved2(): number;
					public setDescender(param0: number): void;
					public setMetricDataFormat(param0: number): void;
					public setMinRightSideBearing(param0: number): void;
					public setReserved4(param0: number): void;
					public setAdvanceWidthMax(param0: number): void;
					public getMinRightSideBearing(): number;
					public getNumberOfHMetrics(): number;
					public setReserved2(param0: number): void;
					public setNumberOfHMetrics(param0: number): void;
					public getReserved3(): number;
					public getLineGap(): number;
					public setAscender(param0: number): void;
					public getReserved4(): number;
					public getReserved1(): number;
					public setCaretSlopeRise(param0: number): void;
					public getVersion(): number;
					public getCaretSlopeRun(): number;
					public setLineGap(param0: number): void;
					public setReserved1(param0: number): void;
					public setCaretSlopeRun(param0: number): void;
					public setReserved5(param0: number): void;
					public setReserved3(param0: number): void;
					public getAscender(): number;
					public getReserved5(): number;
					public getXMaxExtent(): number;
					public getMetricDataFormat(): number;
					public setVersion(param0: number): void;
					public getAdvanceWidthMax(): number;
					public setMinLeftSideBearing(param0: number): void;
					public getCaretSlopeRise(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class HorizontalMetricsTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.HorizontalMetricsTable>;
					public static TAG: string = "hmtx";
					public getAdvanceWidth(param0: number): number;
					public getLeftSideBearing(param0: number): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class IndexToLocationTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.IndexToLocationTable>;
					public static TAG: string = "loca";
					public setOffsets(param0: androidNative.Array<number>): void;
					public getOffsets(): androidNative.Array<number>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class KerningSubtable extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.KerningSubtable>;
					public isHorizontalKerning(): boolean;
					public isHorizontalKerning(param0: boolean): boolean;
					public getKerning(param0: number, param1: number): number;
					public getKerning(param0: androidNative.Array<number>): androidNative.Array<number>;
				}
				export namespace KerningSubtable {
					export class PairData extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.KerningSubtable.PairData>;
						/**
						 * Constructs a new instance of the com.tom_roush.fontbox.ttf.KerningSubtable$PairData interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							read(param0: com.tom_roush.fontbox.ttf.TTFDataStream): void;
							getKerning(param0: number, param1: number): number;
						});
						public constructor();
						public read(param0: com.tom_roush.fontbox.ttf.TTFDataStream): void;
						public getKerning(param0: number, param1: number): number;
					}
					export class PairData0Format0 extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.KerningSubtable.PairData0Format0>;
						public thenComparing(param0: any /* any*/, param1: java.util.Comparator<any>): java.util.Comparator<any>;
						public static comparing(param0: any /* any*/, param1: java.util.Comparator<any>): java.util.Comparator<any>;
						public thenComparingLong(param0: any /* any*/): java.util.Comparator<any>;
						public equals(param0: any): boolean;
						public static comparingInt(param0: any /* any*/): java.util.Comparator<any>;
						public static comparingDouble(param0: any /* any*/): java.util.Comparator<any>;
						public static reverseOrder(): java.util.Comparator<any>;
						public static comparing(param0: any /* any*/): java.util.Comparator<any>;
						public thenComparingInt(param0: any /* any*/): java.util.Comparator<any>;
						public compare(param0: androidNative.Array<number>, param1: androidNative.Array<number>): number;
						public reversed(): java.util.Comparator<any>;
						public static nullsFirst(param0: java.util.Comparator<any>): java.util.Comparator<any>;
						public read(param0: com.tom_roush.fontbox.ttf.TTFDataStream): void;
						public getKerning(param0: number, param1: number): number;
						public thenComparingDouble(param0: any /* any*/): java.util.Comparator<any>;
						public static nullsLast(param0: java.util.Comparator<any>): java.util.Comparator<any>;
						public thenComparing(param0: any /* any*/): java.util.Comparator<any>;
						public static naturalOrder(): java.util.Comparator<any>;
						public compare(param0: any, param1: any): number;
						public thenComparing(param0: java.util.Comparator<any>): java.util.Comparator<any>;
						public static comparingLong(param0: any /* any*/): java.util.Comparator<any>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class KerningTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.KerningTable>;
					public static TAG: string = "kern";
					public getHorizontalKerningSubtable(): com.tom_roush.fontbox.ttf.KerningSubtable;
					public getHorizontalKerningSubtable(param0: boolean): com.tom_roush.fontbox.ttf.KerningSubtable;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class MaximumProfileTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.MaximumProfileTable>;
					public static TAG: string = "maxp";
					public getMaxCompositeContours(): number;
					public setMaxStackElements(param0: number): void;
					public getMaxSizeOfInstructions(): number;
					public setMaxPoints(param0: number): void;
					public setMaxSizeOfInstructions(param0: number): void;
					public setMaxComponentElements(param0: number): void;
					public getMaxFunctionDefs(): number;
					public getMaxComponentElements(): number;
					public getMaxZones(): number;
					public getMaxContours(): number;
					public getMaxPoints(): number;
					public getMaxInstructionDefs(): number;
					public setMaxInstructionDefs(param0: number): void;
					public getMaxStorage(): number;
					public setMaxStorage(param0: number): void;
					public getNumGlyphs(): number;
					public setMaxComponentDepth(param0: number): void;
					public getMaxStackElements(): number;
					public setNumGlyphs(param0: number): void;
					public getVersion(): number;
					public getMaxTwilightPoints(): number;
					public setMaxCompositeContours(param0: number): void;
					public setMaxContours(param0: number): void;
					public setMaxTwilightPoints(param0: number): void;
					public setMaxZones(param0: number): void;
					public getMaxCompositePoints(): number;
					public setVersion(param0: number): void;
					public setMaxCompositePoints(param0: number): void;
					public setMaxFunctionDefs(param0: number): void;
					public getMaxComponentDepth(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class MemoryTTFDataStream extends com.tom_roush.fontbox.ttf.TTFDataStream {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.MemoryTTFDataStream>;
					public read(): number;
					public readSignedShort(): number;
					public getOriginalData(): java.io.InputStream;
					public readLong(): number;
					public close(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: number): androidNative.Array<number>;
					public getCurrentPosition(): number;
					public readSignedInt(): number;
					public readUnsignedShort(): number;
					public seek(param0: number): void;
					public getOriginalDataSize(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class NameRecord extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.NameRecord>;
					public static PLATFORM_UNICODE: number = 0;
					public static PLATFORM_MACINTOSH: number = 1;
					public static PLATFORM_ISO: number = 2;
					public static PLATFORM_WINDOWS: number = 3;
					public static ENCODING_UNICODE_1_0: number = 0;
					public static ENCODING_UNICODE_1_1: number = 1;
					public static ENCODING_UNICODE_2_0_BMP: number = 3;
					public static ENCODING_UNICODE_2_0_FULL: number = 4;
					public static LANGUGAE_UNICODE: number = 0;
					public static LANGUAGE_UNICODE: number = 0;
					public static ENCODING_WINDOWS_SYMBOL: number = 0;
					public static ENCODING_WINDOWS_UNICODE_BMP: number = 1;
					public static ENCODING_WINDOWS_UNICODE_UCS4: number = 10;
					public static LANGUGAE_WINDOWS_EN_US: number = 1033;
					public static LANGUAGE_WINDOWS_EN_US: number = 1033;
					public static ENCODING_MACINTOSH_ROMAN: number = 0;
					public static LANGUGAE_MACINTOSH_ENGLISH: number = 0;
					public static LANGUAGE_MACINTOSH_ENGLISH: number = 0;
					public static NAME_COPYRIGHT: number = 0;
					public static NAME_FONT_FAMILY_NAME: number = 1;
					public static NAME_FONT_SUB_FAMILY_NAME: number = 2;
					public static NAME_UNIQUE_FONT_ID: number = 3;
					public static NAME_FULL_FONT_NAME: number = 4;
					public static NAME_VERSION: number = 5;
					public static NAME_POSTSCRIPT_NAME: number = 6;
					public static NAME_TRADEMARK: number = 7;
					public getStringOffset(): number;
					public getPlatformEncodingId(): number;
					public setStringOffset(param0: number): void;
					public setStringLength(param0: number): void;
					public setPlatformId(param0: number): void;
					public getPlatformId(): number;
					public getString(): string;
					public getLanguageId(): number;
					public getStringLength(): number;
					public setPlatformEncodingId(param0: number): void;
					public toString(): string;
					public setString(param0: string): void;
					public setNameId(param0: number): void;
					public constructor();
					public setLanguageId(param0: number): void;
					public getNameId(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class NamingTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.NamingTable>;
					public static TAG: string = "name";
					public getFontFamily(): string;
					public getPostScriptName(): string;
					public getName(param0: number, param1: number, param2: number, param3: number): string;
					public getNameRecords(): java.util.List<com.tom_roush.fontbox.ttf.NameRecord>;
					public getFontSubFamily(): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class OS2WindowsMetricsTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.OS2WindowsMetricsTable>;
					public static WEIGHT_CLASS_THIN: number = 100;
					public static WEIGHT_CLASS_ULTRA_LIGHT: number = 200;
					public static WEIGHT_CLASS_LIGHT: number = 300;
					public static WEIGHT_CLASS_NORMAL: number = 400;
					public static WEIGHT_CLASS_MEDIUM: number = 500;
					public static WEIGHT_CLASS_SEMI_BOLD: number = 600;
					public static WEIGHT_CLASS_BOLD: number = 700;
					public static WEIGHT_CLASS_EXTRA_BOLD: number = 800;
					public static WEIGHT_CLASS_BLACK: number = 900;
					public static WIDTH_CLASS_ULTRA_CONDENSED: number = 1;
					public static WIDTH_CLASS_EXTRA_CONDENSED: number = 2;
					public static WIDTH_CLASS_CONDENSED: number = 3;
					public static WIDTH_CLASS_SEMI_CONDENSED: number = 4;
					public static WIDTH_CLASS_MEDIUM: number = 5;
					public static WIDTH_CLASS_SEMI_EXPANDED: number = 6;
					public static WIDTH_CLASS_EXPANDED: number = 7;
					public static WIDTH_CLASS_EXTRA_EXPANDED: number = 8;
					public static WIDTH_CLASS_ULTRA_EXPANDED: number = 9;
					public static FAMILY_CLASS_NO_CLASSIFICATION: number = 0;
					public static FAMILY_CLASS_OLDSTYLE_SERIFS: number = 1;
					public static FAMILY_CLASS_TRANSITIONAL_SERIFS: number = 2;
					public static FAMILY_CLASS_MODERN_SERIFS: number = 3;
					public static FAMILY_CLASS_CLAREDON_SERIFS: number = 4;
					public static FAMILY_CLASS_SLAB_SERIFS: number = 5;
					public static FAMILY_CLASS_FREEFORM_SERIFS: number = 7;
					public static FAMILY_CLASS_SANS_SERIF: number = 8;
					public static FAMILY_CLASS_ORNAMENTALS: number = 9;
					public static FAMILY_CLASS_SCRIPTS: number = 10;
					public static FAMILY_CLASS_SYMBOLIC: number = 12;
					public static FSTYPE_RESTRICTED: number = 2;
					public static FSTYPE_PREVIEW_AND_PRINT: number = 4;
					public static FSTYPE_EDITIBLE: number = 8;
					public static FSTYPE_NO_SUBSETTING: number = 256;
					public static FSTYPE_BITMAP_ONLY: number = 512;
					public static TAG: string = "OS/2";
					public getSubscriptYOffset(): number;
					public setWeightClass(param0: number): void;
					public getSubscriptXOffset(): number;
					public getUnicodeRange2(): number;
					public setCodePageRange2(param0: number): void;
					public getFsSelection(): number;
					public setUnicodeRange3(param0: number): void;
					public getTypoDescender(): number;
					public getTypoLineGap(): number;
					public getSuperscriptXSize(): number;
					public getTypoAscender(): number;
					public getFamilyClass(): number;
					public getSubscriptYSize(): number;
					public getCodePageRange1(): number;
					public setWinDescent(param0: number): void;
					public getHeight(): number;
					public getVersion(): number;
					public setAverageCharWidth(param0: number): void;
					public setFsSelection(param0: number): void;
					public setFamilyClass(param0: number): void;
					public getMaxContext(): number;
					public setUnicodeRange4(param0: number): void;
					public setSuperscriptYSize(param0: number): void;
					public setSubscriptYOffset(param0: number): void;
					public getSuperscriptYSize(): number;
					public getWidthClass(): number;
					public setCodePageRange1(param0: number): void;
					public setSubscriptXSize(param0: number): void;
					public getCapHeight(): number;
					public setVersion(param0: number): void;
					public getWinAscent(): number;
					public getFsType(): number;
					public setFsType(param0: number): void;
					public setTypoAscender(param0: number): void;
					public setSuperscriptYOffset(param0: number): void;
					public setSuperscriptXSize(param0: number): void;
					public getAchVendId(): string;
					public getSubscriptXSize(): number;
					public setStrikeoutPosition(param0: number): void;
					public setTypoDescender(param0: number): void;
					public setUnicodeRange2(param0: number): void;
					public getWinDescent(): number;
					public getCodePageRange2(): number;
					public setPanose(param0: androidNative.Array<number>): void;
					public getUnicodeRange4(): number;
					public getBreakChar(): number;
					public getFirstCharIndex(): number;
					public setSuperscriptXOffset(param0: number): void;
					public getLastCharIndex(): number;
					public setSubscriptYSize(param0: number): void;
					public getAverageCharWidth(): number;
					public getSuperscriptXOffset(): number;
					public getUnicodeRange3(): number;
					public setLastCharIndex(param0: number): void;
					public getWeightClass(): number;
					public setWidthClass(param0: number): void;
					public setTypoLineGap(param0: number): void;
					public setUnicodeRange1(param0: number): void;
					public getSuperscriptYOffset(): number;
					public setStrikeoutSize(param0: number): void;
					public getStrikeoutPosition(): number;
					public setFirstCharIndex(param0: number): void;
					public getStrikeoutSize(): number;
					public getPanose(): androidNative.Array<number>;
					public getDefaultChar(): number;
					public setAchVendId(param0: string): void;
					public setWinAscent(param0: number): void;
					public getUnicodeRange1(): number;
					public setSubscriptXOffset(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class OTFParser extends com.tom_roush.fontbox.ttf.TTFParser {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.OTFParser>;
					public parse(param0: string): com.tom_roush.fontbox.ttf.OpenTypeFont;
					public constructor(param0: boolean, param1: boolean);
					public parse(param0: java.io.File): com.tom_roush.fontbox.ttf.TrueTypeFont;
					public constructor(param0: boolean);
					public parse(param0: java.io.InputStream): com.tom_roush.fontbox.ttf.TrueTypeFont;
					public constructor();
					public parse(param0: java.io.File): com.tom_roush.fontbox.ttf.OpenTypeFont;
					public parse(param0: string): com.tom_roush.fontbox.ttf.TrueTypeFont;
					public parse(param0: java.io.InputStream): com.tom_roush.fontbox.ttf.OpenTypeFont;
					public readTable(param0: com.tom_roush.fontbox.ttf.TrueTypeFont, param1: string): com.tom_roush.fontbox.ttf.TTFTable;
					public allowCFF(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class OTLTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.OTLTable>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class OpenTypeFont extends com.tom_roush.fontbox.ttf.TrueTypeFont {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.OpenTypeFont>;
					public getCFF(): com.tom_roush.fontbox.ttf.CFFTable;
					public getGlyph(): com.tom_roush.fontbox.ttf.GlyphTable;
					public hasLayoutTables(): boolean;
					public getPath(param0: string): globalAndroid.graphics.Path;
					public getName(): string;
					public close(): void;
					public isPostScript(): boolean;
					public getFontBBox(): com.tom_roush.fontbox.util.BoundingBox;
					public getWidth(param0: string): number;
					public hasGlyph(param0: string): boolean;
					public getFontMatrix(): java.util.List<java.lang.Number>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class OpenTypeScript extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.OpenTypeScript>;
					public static INHERITED: string = "Inherited";
					public static UNKNOWN: string = "Unknown";
					public static TAG_DEFAULT: string = "DFLT";
					public static getScriptTags(param0: number): androidNative.Array<string>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class PostScriptTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.PostScriptTable>;
					public static TAG: string = "post";
					public getMinMemType1(): number;
					public setItalicAngle(param0: number): void;
					public getMaxMemType1(): number;
					public setMinMemType42(param0: number): void;
					public getUnderlinePosition(): number;
					public getName(param0: number): string;
					public getFormatType(): number;
					public setMimMemType1(param0: number): void;
					public setMaxMemType42(param0: number): void;
					public getUnderlineThickness(): number;
					public getIsFixedPitch(): number;
					public getMaxMemType42(): number;
					public getItalicAngle(): number;
					public getGlyphNames(): androidNative.Array<string>;
					public setMaxMemType1(param0: number): void;
					public setGlyphNames(param0: androidNative.Array<string>): void;
					public getMinMemType42(): number;
					public setUnderlinePosition(param0: number): void;
					public setIsFixedPitch(param0: number): void;
					public setUnderlineThickness(param0: number): void;
					public setFormatType(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class RAFDataStream extends com.tom_roush.fontbox.ttf.TTFDataStream {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.RAFDataStream>;
					public readSignedShort(): number;
					public read(): number;
					public getOriginalData(): java.io.InputStream;
					public readLong(): number;
					public close(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public getCurrentPosition(): number;
					public read(param0: number): androidNative.Array<number>;
					public readUnsignedShort(): number;
					public seek(param0: number): void;
					public getOriginalDataSize(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class SubstitutingCmapLookup extends java.lang.Object implements com.tom_roush.fontbox.ttf.CmapLookup {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.SubstitutingCmapLookup>;
					public constructor(param0: com.tom_roush.fontbox.ttf.CmapSubtable, param1: com.tom_roush.fontbox.ttf.GlyphSubstitutionTable, param2: java.util.List<string>);
					public getCharCodes(param0: number): java.util.List<java.lang.Integer>;
					public getGlyphId(param0: number): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class TTCDataStream extends com.tom_roush.fontbox.ttf.TTFDataStream {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.TTCDataStream>;
					public read(): number;
					public readSignedShort(): number;
					public getOriginalData(): java.io.InputStream;
					public readLong(): number;
					public close(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: number): androidNative.Array<number>;
					public getCurrentPosition(): number;
					public readUnsignedShort(): number;
					public seek(param0: number): void;
					public getOriginalDataSize(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export abstract class TTFDataStream extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.TTFDataStream>;
					public readUnsignedShortArray(param0: number): androidNative.Array<number>;
					public readTag(): string;
					public read(): number;
					public readString(param0: number): string;
					public readString(param0: number, param1: java.nio.charset.Charset): string;
					public readString(param0: number, param1: string): string;
					public readLong(): number;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: number): androidNative.Array<number>;
					public read32Fixed(): number;
					public readUnsignedShort(): number;
					public getOriginalDataSize(): number;
					public readSignedShort(): number;
					public getOriginalData(): java.io.InputStream;
					public readInternationalDate(): java.util.Calendar;
					public close(): void;
					public getCurrentPosition(): number;
					public readUnsignedByteArray(param0: number): androidNative.Array<number>;
					public seek(param0: number): void;
					public readSignedByte(): number;
					public readUnsignedByte(): number;
					public readUnsignedInt(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class TTFParser extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.TTFParser>;
					public constructor(param0: boolean, param1: boolean);
					public parse(param0: java.io.File): com.tom_roush.fontbox.ttf.TrueTypeFont;
					public constructor(param0: boolean);
					public parse(param0: java.io.InputStream): com.tom_roush.fontbox.ttf.TrueTypeFont;
					public constructor();
					public parseEmbedded(param0: java.io.InputStream): com.tom_roush.fontbox.ttf.TrueTypeFont;
					public parse(param0: string): com.tom_roush.fontbox.ttf.TrueTypeFont;
					public readTable(param0: com.tom_roush.fontbox.ttf.TrueTypeFont, param1: string): com.tom_roush.fontbox.ttf.TTFTable;
					public allowCFF(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class TTFSubsetter extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.TTFSubsetter>;
					public setPrefix(param0: string): void;
					public writeToStream(param0: java.io.OutputStream): void;
					public constructor(param0: com.tom_roush.fontbox.ttf.TrueTypeFont, param1: java.util.List<string>);
					public add(param0: number): void;
					public constructor(param0: com.tom_roush.fontbox.ttf.TrueTypeFont);
					public addAll(param0: java.util.Set<java.lang.Integer>): void;
					public getGIDMap(): java.util.Map<java.lang.Integer,java.lang.Integer>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class TTFTable extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.TTFTable>;
					public initialized: boolean;
					public font: com.tom_roush.fontbox.ttf.TrueTypeFont;
					public getLength(): number;
					public getInitialized(): boolean;
					public getCheckSum(): number;
					public getOffset(): number;
					public getTag(): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class TrueTypeCollection extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.TrueTypeCollection>;
					public constructor(param0: java.io.InputStream);
					public close(): void;
					public processAllFonts(param0: com.tom_roush.fontbox.ttf.TrueTypeCollection.TrueTypeFontProcessor): void;
					public getFontByName(param0: string): com.tom_roush.fontbox.ttf.TrueTypeFont;
					public constructor(param0: java.io.File);
				}
				export namespace TrueTypeCollection {
					export class TrueTypeFontProcessor extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.ttf.TrueTypeCollection.TrueTypeFontProcessor>;
						/**
						 * Constructs a new instance of the com.tom_roush.fontbox.ttf.TrueTypeCollection$TrueTypeFontProcessor interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							process(param0: com.tom_roush.fontbox.ttf.TrueTypeFont): void;
						});
						public constructor();
						public process(param0: com.tom_roush.fontbox.ttf.TrueTypeFont): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class TrueTypeFont extends java.lang.Object implements com.tom_roush.fontbox.FontBoxFont, java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.TrueTypeFont>;
					public tables: java.util.Map<string,com.tom_roush.fontbox.ttf.TTFTable>;
					public getVerticalHeader(): com.tom_roush.fontbox.ttf.VerticalHeaderTable;
					public getVerticalMetrics(): com.tom_roush.fontbox.ttf.VerticalMetricsTable;
					public getHorizontalMetrics(): com.tom_roush.fontbox.ttf.HorizontalMetricsTable;
					public enableGsubFeature(param0: string): void;
					public getUnitsPerEm(): number;
					public enableVerticalSubstitutions(): void;
					public finalize(): void;
					public getUnicodeCmapLookup(param0: boolean): com.tom_roush.fontbox.ttf.CmapLookup;
					public getTableBytes(param0: com.tom_roush.fontbox.ttf.TTFTable): androidNative.Array<number>;
					public getVerticalOrigin(): com.tom_roush.fontbox.ttf.VerticalOriginTable;
					public getOriginalData(): java.io.InputStream;
					public toString(): string;
					public getGlyph(): com.tom_roush.fontbox.ttf.GlyphTable;
					public getMaximumProfile(): com.tom_roush.fontbox.ttf.MaximumProfileTable;
					public getKerning(): com.tom_roush.fontbox.ttf.KerningTable;
					public close(): void;
					public getAdvanceWidth(param0: number): number;
					public getTable(param0: string): com.tom_roush.fontbox.ttf.TTFTable;
					public getHorizontalHeader(): com.tom_roush.fontbox.ttf.HorizontalHeaderTable;
					public getOS2Windows(): com.tom_roush.fontbox.ttf.OS2WindowsMetricsTable;
					public nameToGID(param0: string): number;
					public getNumberOfGlyphs(): number;
					public hasGlyph(param0: string): boolean;
					public getIndexToLocation(): com.tom_roush.fontbox.ttf.IndexToLocationTable;
					public getVersion(): number;
					/** @deprecated */
					public getUnicodeCmap(): com.tom_roush.fontbox.ttf.CmapSubtable;
					public getUnicodeCmapLookup(): com.tom_roush.fontbox.ttf.CmapLookup;
					/** @deprecated */
					public getUnicodeCmap(param0: boolean): com.tom_roush.fontbox.ttf.CmapSubtable;
					public getTables(): java.util.Collection<com.tom_roush.fontbox.ttf.TTFTable>;
					public getNaming(): com.tom_roush.fontbox.ttf.NamingTable;
					public getOriginalDataSize(): number;
					public getFontMatrix(): java.util.List<java.lang.Number>;
					public getPostScript(): com.tom_roush.fontbox.ttf.PostScriptTable;
					public getTableMap(): java.util.Map<string,com.tom_roush.fontbox.ttf.TTFTable>;
					public getPath(param0: string): globalAndroid.graphics.Path;
					public getName(): string;
					public getHeader(): com.tom_roush.fontbox.ttf.HeaderTable;
					public disableGsubFeature(param0: string): void;
					public getAdvanceHeight(param0: number): number;
					public getCmap(): com.tom_roush.fontbox.ttf.CmapTable;
					public getGsub(): com.tom_roush.fontbox.ttf.GlyphSubstitutionTable;
					public getWidth(param0: string): number;
					public getFontBBox(): com.tom_roush.fontbox.util.BoundingBox;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class VerticalHeaderTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.VerticalHeaderTable>;
					public static TAG: string = "vhea";
					public getAdvanceHeightMax(): number;
					public getDescender(): number;
					public getMinBottomSideBearing(): number;
					public getReserved4(): number;
					public getReserved1(): number;
					public getVersion(): number;
					public getReserved2(): number;
					public getCaretSlopeRun(): number;
					public getNumberOfVMetrics(): number;
					public getAscender(): number;
					public getMinTopSideBearing(): number;
					public getCaretOffset(): number;
					public getMetricDataFormat(): number;
					public getYMaxExtent(): number;
					public getCaretSlopeRise(): number;
					public getReserved3(): number;
					public getLineGap(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class VerticalMetricsTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.VerticalMetricsTable>;
					public static TAG: string = "vmtx";
					public getAdvanceHeight(param0: number): number;
					public getTopSideBearing(param0: number): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class VerticalOriginTable extends com.tom_roush.fontbox.ttf.TTFTable {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.VerticalOriginTable>;
					public static TAG: string = "VORG";
					public getOriginY(param0: number): number;
					public getVersion(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace ttf {
				export class WGL4Names extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.ttf.WGL4Names>;
					public static NUMBER_OF_MAC_GLYPHS: number = 258;
					public static MAC_GLYPH_NAMES: androidNative.Array<string>;
					public static MAC_GLYPH_NAMES_INDICES: java.util.Map<string,java.lang.Integer>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace type1 {
				export class DamagedFontException extends java.io.IOException {
					public static class: java.lang.Class<com.tom_roush.fontbox.type1.DamagedFontException>;
					public constructor(param0: string, param1: java.lang.Throwable, param2: boolean, param3: boolean);
					public constructor(param0: string, param1: java.lang.Throwable);
					public constructor(param0: string);
					public constructor(param0: java.lang.Throwable);
					public constructor();
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace type1 {
				export class Token extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.type1.Token>;
					public intValue(): number;
					public toString(): string;
					public getText(): string;
					public getData(): androidNative.Array<number>;
					public floatValue(): number;
					public booleanValue(): boolean;
					public getKind(): com.tom_roush.fontbox.type1.Token.Kind;
				}
				export namespace Token {
					export class Kind {
						public static class: java.lang.Class<com.tom_roush.fontbox.type1.Token.Kind>;
						public static NONE: com.tom_roush.fontbox.type1.Token.Kind;
						public static STRING: com.tom_roush.fontbox.type1.Token.Kind;
						public static NAME: com.tom_roush.fontbox.type1.Token.Kind;
						public static LITERAL: com.tom_roush.fontbox.type1.Token.Kind;
						public static REAL: com.tom_roush.fontbox.type1.Token.Kind;
						public static INTEGER: com.tom_roush.fontbox.type1.Token.Kind;
						public static START_ARRAY: com.tom_roush.fontbox.type1.Token.Kind;
						public static END_ARRAY: com.tom_roush.fontbox.type1.Token.Kind;
						public static START_PROC: com.tom_roush.fontbox.type1.Token.Kind;
						public static END_PROC: com.tom_roush.fontbox.type1.Token.Kind;
						public static START_DICT: com.tom_roush.fontbox.type1.Token.Kind;
						public static END_DICT: com.tom_roush.fontbox.type1.Token.Kind;
						public static CHARSTRING: com.tom_roush.fontbox.type1.Token.Kind;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): androidNative.Array<com.tom_roush.fontbox.type1.Token.Kind>;
						public static valueOf(param0: string): com.tom_roush.fontbox.type1.Token.Kind;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace type1 {
				export class Type1CharStringReader extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.type1.Type1CharStringReader>;
					/**
					 * Constructs a new instance of the com.tom_roush.fontbox.type1.Type1CharStringReader interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getType1CharString(param0: string): com.tom_roush.fontbox.cff.Type1CharString;
					});
					public constructor();
					public getType1CharString(param0: string): com.tom_roush.fontbox.cff.Type1CharString;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace type1 {
				export class Type1Font extends java.lang.Object implements com.tom_roush.fontbox.type1.Type1CharStringReader, com.tom_roush.fontbox.EncodedFont, com.tom_roush.fontbox.FontBoxFont {
					public static class: java.lang.Class<com.tom_roush.fontbox.type1.Type1Font>;
					public isFixedPitch(): boolean;
					public getBlueScale(): number;
					public getVersion(): string;
					public getBinarySegment(): androidNative.Array<number>;
					public getUnderlinePosition(): number;
					public getFamilyName(): string;
					public isForceBold(): boolean;
					public getFamilyBlues(): java.util.List<java.lang.Number>;
					public getStemSnapV(): java.util.List<java.lang.Number>;
					public getFamilyOtherBlues(): java.util.List<java.lang.Number>;
					public toString(): string;
					public getUniqueID(): number;
					public static createWithPFB(param0: java.io.InputStream): com.tom_roush.fontbox.type1.Type1Font;
					public getBlueValues(): java.util.List<java.lang.Number>;
					public getBlueShift(): number;
					public getASCIISegment(): androidNative.Array<number>;
					public getStdHW(): java.util.List<java.lang.Number>;
					public hasGlyph(param0: string): boolean;
					public getType1CharString(param0: string): com.tom_roush.fontbox.cff.Type1CharString;
					public static createWithSegments(param0: androidNative.Array<number>, param1: androidNative.Array<number>): com.tom_roush.fontbox.type1.Type1Font;
					public getFontName(): string;
					public getStrokeWidth(): number;
					public static createWithPFB(param0: androidNative.Array<number>): com.tom_roush.fontbox.type1.Type1Font;
					public getWeight(): string;
					public getBlueFuzz(): number;
					public getOtherBlues(): java.util.List<java.lang.Number>;
					public getStemSnapH(): java.util.List<java.lang.Number>;
					public getSubrsArray(): java.util.List<androidNative.Array<number>>;
					public getFullName(): string;
					public getLanguageGroup(): number;
					public getPaintType(): number;
					public getFontMatrix(): java.util.List<java.lang.Number>;
					public getNotice(): string;
					public getUnderlineThickness(): number;
					public getItalicAngle(): number;
					public getPath(param0: string): globalAndroid.graphics.Path;
					public getName(): string;
					public getEncoding(): com.tom_roush.fontbox.encoding.Encoding;
					public getFontID(): string;
					public getFontType(): number;
					public getStdVW(): java.util.List<java.lang.Number>;
					public getCharStringsDict(): java.util.Map<string,androidNative.Array<number>>;
					public getWidth(param0: string): number;
					public getFontBBox(): com.tom_roush.fontbox.util.BoundingBox;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace type1 {
				export class Type1Lexer extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.type1.Type1Lexer>;
					public peekToken(): com.tom_roush.fontbox.type1.Token;
					public nextToken(): com.tom_roush.fontbox.type1.Token;
					public peekKind(param0: com.tom_roush.fontbox.type1.Token.Kind): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace type1 {
				export class Type1Parser extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.type1.Type1Parser>;
					public parse(param0: androidNative.Array<number>, param1: androidNative.Array<number>): com.tom_roush.fontbox.type1.Type1Font;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export class BoundingBox extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.util.BoundingBox>;
					public getLowerLeftX(): number;
					public getHeight(): number;
					public contains(param0: number, param1: number): boolean;
					public getUpperRightY(): number;
					public getWidth(): number;
					public constructor(param0: java.util.List<java.lang.Number>);
					public constructor(param0: number, param1: number, param2: number, param3: number);
					public toString(): string;
					public setLowerLeftY(param0: number): void;
					public constructor();
					public setLowerLeftX(param0: number): void;
					public getLowerLeftY(): number;
					public getUpperRightX(): number;
					public setUpperRightX(param0: number): void;
					public setUpperRightY(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export class Charsets extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.fontbox.util.Charsets>;
					public static ISO_8859_1: java.nio.charset.Charset;
					public static UTF_16: java.nio.charset.Charset;
					public static UTF_16BE: java.nio.charset.Charset;
					public static US_ASCII: java.nio.charset.Charset;
					public static ISO_10646: java.nio.charset.Charset;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export namespace autodetect {
					export class AndroidFontDirFinder extends com.tom_roush.fontbox.util.autodetect.NativeFontDirFinder {
						public static class: java.lang.Class<com.tom_roush.fontbox.util.autodetect.AndroidFontDirFinder>;
						public constructor();
						public getSearchableDirectories(): androidNative.Array<string>;
						public find(): java.util.List<java.io.File>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export namespace autodetect {
					export class FontDirFinder extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.util.autodetect.FontDirFinder>;
						/**
						 * Constructs a new instance of the com.tom_roush.fontbox.util.autodetect.FontDirFinder interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							find(): java.util.List<java.io.File>;
						});
						public constructor();
						public find(): java.util.List<java.io.File>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export namespace autodetect {
					export class FontFileFinder extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.fontbox.util.autodetect.FontFileFinder>;
						public constructor();
						public find(): java.util.List<java.net.URI>;
						public find(param0: string): java.util.List<java.net.URI>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export namespace autodetect {
					export class MacFontDirFinder extends com.tom_roush.fontbox.util.autodetect.NativeFontDirFinder {
						public static class: java.lang.Class<com.tom_roush.fontbox.util.autodetect.MacFontDirFinder>;
						public constructor();
						public getSearchableDirectories(): androidNative.Array<string>;
						public find(): java.util.List<java.io.File>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export namespace autodetect {
					export abstract class NativeFontDirFinder extends java.lang.Object implements com.tom_roush.fontbox.util.autodetect.FontDirFinder {
						public static class: java.lang.Class<com.tom_roush.fontbox.util.autodetect.NativeFontDirFinder>;
						public constructor();
						public getSearchableDirectories(): androidNative.Array<string>;
						public find(): java.util.List<java.io.File>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export namespace autodetect {
					export class OS400FontDirFinder extends com.tom_roush.fontbox.util.autodetect.NativeFontDirFinder {
						public static class: java.lang.Class<com.tom_roush.fontbox.util.autodetect.OS400FontDirFinder>;
						public constructor();
						public getSearchableDirectories(): androidNative.Array<string>;
						public find(): java.util.List<java.io.File>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export namespace autodetect {
					export class UnixFontDirFinder extends com.tom_roush.fontbox.util.autodetect.NativeFontDirFinder {
						public static class: java.lang.Class<com.tom_roush.fontbox.util.autodetect.UnixFontDirFinder>;
						public constructor();
						public getSearchableDirectories(): androidNative.Array<string>;
						public find(): java.util.List<java.io.File>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace fontbox {
			export namespace util {
				export namespace autodetect {
					export class WindowsFontDirFinder extends java.lang.Object implements com.tom_roush.fontbox.util.autodetect.FontDirFinder {
						public static class: java.lang.Class<com.tom_roush.fontbox.util.autodetect.WindowsFontDirFinder>;
						public constructor();
						public find(): java.util.List<java.io.File>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace awt {
				export class AWTColor extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.harmony.awt.AWTColor>;
					public static white: com.tom_roush.harmony.awt.AWTColor;
					public static WHITE: com.tom_roush.harmony.awt.AWTColor;
					public static lightGray: com.tom_roush.harmony.awt.AWTColor;
					public static LIGHT_GRAY: com.tom_roush.harmony.awt.AWTColor;
					public static gray: com.tom_roush.harmony.awt.AWTColor;
					public static GRAY: com.tom_roush.harmony.awt.AWTColor;
					public static darkGray: com.tom_roush.harmony.awt.AWTColor;
					public static DARK_GRAY: com.tom_roush.harmony.awt.AWTColor;
					public static black: com.tom_roush.harmony.awt.AWTColor;
					public static BLACK: com.tom_roush.harmony.awt.AWTColor;
					public static red: com.tom_roush.harmony.awt.AWTColor;
					public static RED: com.tom_roush.harmony.awt.AWTColor;
					public static pink: com.tom_roush.harmony.awt.AWTColor;
					public static PINK: com.tom_roush.harmony.awt.AWTColor;
					public static orange: com.tom_roush.harmony.awt.AWTColor;
					public static ORANGE: com.tom_roush.harmony.awt.AWTColor;
					public static yellow: com.tom_roush.harmony.awt.AWTColor;
					public static YELLOW: com.tom_roush.harmony.awt.AWTColor;
					public static green: com.tom_roush.harmony.awt.AWTColor;
					public static GREEN: com.tom_roush.harmony.awt.AWTColor;
					public static magenta: com.tom_roush.harmony.awt.AWTColor;
					public static MAGENTA: com.tom_roush.harmony.awt.AWTColor;
					public static cyan: com.tom_roush.harmony.awt.AWTColor;
					public static CYAN: com.tom_roush.harmony.awt.AWTColor;
					public static blue: com.tom_roush.harmony.awt.AWTColor;
					public static BLUE: com.tom_roush.harmony.awt.AWTColor;
					public color: number;
					public constructor(param0: number, param1: number, param2: number, param3: number);
					public getBlue(): number;
					public getAlpha(): number;
					public getRed(): number;
					public constructor(param0: number, param1: number, param2: number);
					public getRGBColorComponents(param0: androidNative.Array<number>): androidNative.Array<number>;
					public getGreen(): number;
					public constructor(param0: number);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace awt {
				export namespace geom {
					export class AffineTransform extends java.lang.Object implements java.lang.Cloneable, java.io.Serializable {
						public static class: java.lang.Class<com.tom_roush.harmony.awt.geom.AffineTransform>;
						public static TYPE_IDENTITY: number = 0;
						public static TYPE_TRANSLATION: number = 1;
						public static TYPE_UNIFORM_SCALE: number = 2;
						public static TYPE_GENERAL_SCALE: number = 4;
						public static TYPE_QUADRANT_ROTATION: number = 8;
						public static TYPE_GENERAL_ROTATION: number = 16;
						public static TYPE_GENERAL_TRANSFORM: number = 32;
						public static TYPE_FLIP: number = 64;
						public static TYPE_MASK_SCALE: number = 6;
						public static TYPE_MASK_ROTATION: number = 24;
						public getTranslateY(): number;
						public static getRotateInstance(param0: number, param1: number, param2: number): com.tom_roush.harmony.awt.geom.AffineTransform;
						public setToShear(param0: number, param1: number): void;
						public getShearY(): number;
						public setToRotation(param0: number): void;
						public static getShearInstance(param0: number, param1: number): com.tom_roush.harmony.awt.geom.AffineTransform;
						public concatenate(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
						public equals(param0: any): boolean;
						public setToIdentity(): void;
						public static getScaleInstance(param0: number, param1: number): com.tom_roush.harmony.awt.geom.AffineTransform;
						public rotate(param0: number): void;
						public static getTranslateInstance(param0: number, param1: number): com.tom_roush.harmony.awt.geom.AffineTransform;
						public getDeterminant(): number;
						public setToScale(param0: number, param1: number): void;
						public constructor(param0: androidNative.Array<number>);
						public getShearX(): number;
						public inverseTransform(param0: androidNative.Array<number>, param1: number, param2: androidNative.Array<number>, param3: number, param4: number): void;
						public getScaleY(): number;
						public setTransform(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
						public rotate(param0: number, param1: number, param2: number): void;
						public setToTranslation(param0: number, param1: number): void;
						public constructor(param0: com.tom_roush.harmony.awt.geom.AffineTransform);
						public createInverse(): com.tom_roush.harmony.awt.geom.AffineTransform;
						public toMatrix(): globalAndroid.graphics.Matrix;
						public constructor(param0: globalAndroid.graphics.Matrix);
						public constructor();
						public getScaleX(): number;
						public clone(): any;
						public isIdentity(): boolean;
						public getType(): number;
						public deltaTransform(param0: androidNative.Array<number>, param1: number, param2: androidNative.Array<number>, param3: number, param4: number): void;
						public setTransform(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
						public getTranslateX(): number;
						public static getRotateInstance(param0: number): com.tom_roush.harmony.awt.geom.AffineTransform;
						public toString(): string;
						public setToRotation(param0: number, param1: number, param2: number): void;
						public shear(param0: number, param1: number): void;
						public transform(param0: globalAndroid.graphics.PointF, param1: globalAndroid.graphics.PointF): globalAndroid.graphics.PointF;
						public getMatrix(param0: androidNative.Array<number>): void;
						public translate(param0: number, param1: number): void;
						public preConcatenate(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
						public constructor(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number);
						public scale(param0: number, param1: number): void;
						public deltaTransform(param0: globalAndroid.graphics.PointF, param1: globalAndroid.graphics.PointF): globalAndroid.graphics.PointF;
						public transform(param0: androidNative.Array<globalAndroid.graphics.PointF>, param1: number, param2: androidNative.Array<globalAndroid.graphics.PointF>, param3: number, param4: number): void;
						public transform(param0: androidNative.Array<number>, param1: number, param2: androidNative.Array<number>, param3: number, param4: number): void;
						public inverseTransform(param0: globalAndroid.graphics.PointF, param1: globalAndroid.graphics.PointF): globalAndroid.graphics.PointF;
					}
					export namespace AffineTransform {
						export class NoninvertibleTransformException extends java.lang.Exception {
							public static class: java.lang.Class<com.tom_roush.harmony.awt.geom.AffineTransform.NoninvertibleTransformException>;
							public constructor();
							public constructor(param0: string);
							public constructor(param0: java.lang.Throwable);
							public constructor(param0: com.tom_roush.harmony.awt.geom.AffineTransform, param1: string);
							public constructor(param0: string, param1: java.lang.Throwable, param2: boolean, param3: boolean);
							public constructor(param0: string, param1: java.lang.Throwable);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace javax {
				export namespace imageio {
					export namespace stream {
						export class IIOByteBuffer extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.harmony.javax.imageio.stream.IIOByteBuffer>;
							public getLength(): number;
							public getData(): androidNative.Array<number>;
							public setData(param0: androidNative.Array<number>): void;
							public constructor(param0: androidNative.Array<number>, param1: number, param2: number);
							public setLength(param0: number): void;
							public setOffset(param0: number): void;
							public getOffset(): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace javax {
				export namespace imageio {
					export namespace stream {
						export class ImageInputStream extends java.lang.Object implements java.io.DataInput {
							public static class: java.lang.Class<com.tom_roush.harmony.javax.imageio.stream.ImageInputStream>;
							/**
							 * Constructs a new instance of the com.tom_roush.harmony.javax.imageio.stream.ImageInputStream interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								setByteOrder(param0: java.nio.ByteOrder): void;
								getByteOrder(): java.nio.ByteOrder;
								read(): number;
								read(param0: androidNative.Array<number>): number;
								read(param0: androidNative.Array<number>, param1: number, param2: number): number;
								readBytes(param0: com.tom_roush.harmony.javax.imageio.stream.IIOByteBuffer, param1: number): void;
								readBoolean(): boolean;
								readByte(): number;
								readUnsignedByte(): number;
								readShort(): number;
								readUnsignedShort(): number;
								readChar(): string;
								readInt(): number;
								readUnsignedInt(): number;
								readLong(): number;
								readFloat(): number;
								readDouble(): number;
								readLine(): string;
								readUTF(): string;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<string>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								getStreamPosition(): number;
								getBitOffset(): number;
								setBitOffset(param0: number): void;
								readBit(): number;
								readBits(param0: number): number;
								length(): number;
								skipBytes(param0: number): number;
								skipBytes(param0: number): number;
								seek(param0: number): void;
								mark(): void;
								reset(): void;
								flushBefore(param0: number): void;
								flush(): void;
								getFlushedPosition(): number;
								isCached(): boolean;
								isCachedMemory(): boolean;
								isCachedFile(): boolean;
								close(): void;
								readFully(param0: androidNative.Array<number>): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								skipBytes(param0: number): number;
								readBoolean(): boolean;
								readByte(): number;
								readUnsignedByte(): number;
								readShort(): number;
								readUnsignedShort(): number;
								readChar(): string;
								readInt(): number;
								readLong(): number;
								readFloat(): number;
								readDouble(): number;
								readLine(): string;
								readUTF(): string;
							});
							public constructor();
							public getFlushedPosition(): number;
							public close(): void;
							public readByte(): number;
							public flushBefore(param0: number): void;
							public readFully(param0: androidNative.Array<string>, param1: number, param2: number): void;
							public length(): number;
							public reset(): void;
							public readBoolean(): boolean;
							public read(param0: androidNative.Array<number>): number;
							public readDouble(): number;
							public seek(param0: number): void;
							public skipBytes(param0: number): number;
							public readChar(): string;
							public setBitOffset(param0: number): void;
							public isCachedMemory(): boolean;
							public isCachedFile(): boolean;
							public readBits(param0: number): number;
							public readUTF(): string;
							public readInt(): number;
							public readFully(param0: androidNative.Array<number>): void;
							public readShort(): number;
							public readBit(): number;
							public mark(): void;
							public read(): number;
							public readUnsignedByte(): number;
							public readFloat(): number;
							public getStreamPosition(): number;
							public isCached(): boolean;
							public readUnsignedInt(): number;
							public setByteOrder(param0: java.nio.ByteOrder): void;
							public readLine(): string;
							public flush(): void;
							public getBitOffset(): number;
							public readUnsignedShort(): number;
							public getByteOrder(): java.nio.ByteOrder;
							public readLong(): number;
							public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
							public readBytes(param0: com.tom_roush.harmony.javax.imageio.stream.IIOByteBuffer, param1: number): void;
							public readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace javax {
				export namespace imageio {
					export namespace stream {
						export abstract class ImageInputStreamImpl extends java.lang.Object implements com.tom_roush.harmony.javax.imageio.stream.ImageInputStream {
							public static class: java.lang.Class<com.tom_roush.harmony.javax.imageio.stream.ImageInputStreamImpl>;
							public byteOrder: java.nio.ByteOrder;
							public streamPos: number;
							public flushedPos: number;
							public bitOffset: number;
							public getFlushedPosition(): number;
							public close(): void;
							public readByte(): number;
							public flushBefore(param0: number): void;
							public readFully(param0: androidNative.Array<string>, param1: number, param2: number): void;
							public length(): number;
							public reset(): void;
							public readBoolean(): boolean;
							public read(param0: androidNative.Array<number>): number;
							public readDouble(): number;
							public seek(param0: number): void;
							public skipBytes(param0: number): number;
							public readChar(): string;
							public setBitOffset(param0: number): void;
							public isCachedMemory(): boolean;
							public isCachedFile(): boolean;
							public readBits(param0: number): number;
							public readUTF(): string;
							public readInt(): number;
							public constructor();
							public readFully(param0: androidNative.Array<number>): void;
							public readShort(): number;
							public readBit(): number;
							public mark(): void;
							public finalize(): void;
							public read(): number;
							public readUnsignedByte(): number;
							public readFloat(): number;
							public getStreamPosition(): number;
							public isCached(): boolean;
							public readUnsignedInt(): number;
							public checkClosed(): void;
							public setByteOrder(param0: java.nio.ByteOrder): void;
							public readLine(): string;
							public flush(): void;
							public getBitOffset(): number;
							public readUnsignedShort(): number;
							public getByteOrder(): java.nio.ByteOrder;
							public readLong(): number;
							public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
							public readBytes(param0: com.tom_roush.harmony.javax.imageio.stream.IIOByteBuffer, param1: number): void;
							public readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
						}
						export namespace ImageInputStreamImpl {
							export class PositionStack extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.harmony.javax.imageio.stream.ImageInputStreamImpl.PositionStack>;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace javax {
				export namespace imageio {
					export namespace stream {
						export class ImageOutputStream extends java.lang.Object implements java.io.DataOutput, com.tom_roush.harmony.javax.imageio.stream.ImageInputStream {
							public static class: java.lang.Class<com.tom_roush.harmony.javax.imageio.stream.ImageOutputStream>;
							/**
							 * Constructs a new instance of the com.tom_roush.harmony.javax.imageio.stream.ImageOutputStream interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								write(param0: number): void;
								write(param0: androidNative.Array<number>): void;
								write(param0: androidNative.Array<number>, param1: number, param2: number): void;
								writeBoolean(param0: boolean): void;
								writeByte(param0: number): void;
								writeShort(param0: number): void;
								writeChar(param0: number): void;
								writeInt(param0: number): void;
								writeLong(param0: number): void;
								writeFloat(param0: number): void;
								writeDouble(param0: number): void;
								writeBytes(param0: string): void;
								writeChars(param0: string): void;
								writeUTF(param0: string): void;
								flushBefore(param0: number): void;
								writeShorts(param0: androidNative.Array<number>, param1: number, param2: number): void;
								writeChars(param0: androidNative.Array<string>, param1: number, param2: number): void;
								writeInts(param0: androidNative.Array<number>, param1: number, param2: number): void;
								writeLongs(param0: androidNative.Array<number>, param1: number, param2: number): void;
								writeFloats(param0: androidNative.Array<number>, param1: number, param2: number): void;
								writeDoubles(param0: androidNative.Array<number>, param1: number, param2: number): void;
								writeBit(param0: number): void;
								writeBits(param0: number, param1: number): void;
								write(param0: number): void;
								write(param0: androidNative.Array<number>): void;
								write(param0: androidNative.Array<number>, param1: number, param2: number): void;
								writeBoolean(param0: boolean): void;
								writeByte(param0: number): void;
								writeShort(param0: number): void;
								writeChar(param0: number): void;
								writeInt(param0: number): void;
								writeLong(param0: number): void;
								writeFloat(param0: number): void;
								writeDouble(param0: number): void;
								writeBytes(param0: string): void;
								writeChars(param0: string): void;
								writeUTF(param0: string): void;
								setByteOrder(param0: java.nio.ByteOrder): void;
								getByteOrder(): java.nio.ByteOrder;
								read(): number;
								read(param0: androidNative.Array<number>): number;
								read(param0: androidNative.Array<number>, param1: number, param2: number): number;
								readBytes(param0: com.tom_roush.harmony.javax.imageio.stream.IIOByteBuffer, param1: number): void;
								readBoolean(): boolean;
								readByte(): number;
								readUnsignedByte(): number;
								readShort(): number;
								readUnsignedShort(): number;
								readChar(): string;
								readInt(): number;
								readUnsignedInt(): number;
								readLong(): number;
								readFloat(): number;
								readDouble(): number;
								readLine(): string;
								readUTF(): string;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<string>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								getStreamPosition(): number;
								getBitOffset(): number;
								setBitOffset(param0: number): void;
								readBit(): number;
								readBits(param0: number): number;
								length(): number;
								skipBytes(param0: number): number;
								skipBytes(param0: number): number;
								seek(param0: number): void;
								mark(): void;
								reset(): void;
								flushBefore(param0: number): void;
								flush(): void;
								getFlushedPosition(): number;
								isCached(): boolean;
								isCachedMemory(): boolean;
								isCachedFile(): boolean;
								close(): void;
								readFully(param0: androidNative.Array<number>): void;
								readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
								skipBytes(param0: number): number;
								readBoolean(): boolean;
								readByte(): number;
								readUnsignedByte(): number;
								readShort(): number;
								readUnsignedShort(): number;
								readChar(): string;
								readInt(): number;
								readLong(): number;
								readFloat(): number;
								readDouble(): number;
								readLine(): string;
								readUTF(): string;
							});
							public constructor();
							public close(): void;
							public readByte(): number;
							public length(): number;
							public reset(): void;
							public write(param0: androidNative.Array<number>): void;
							public readDouble(): number;
							public skipBytes(param0: number): number;
							public readBits(param0: number): number;
							public writeChars(param0: androidNative.Array<string>, param1: number, param2: number): void;
							public readInt(): number;
							public readShort(): number;
							public readBit(): number;
							public writeBoolean(param0: boolean): void;
							public writeFloats(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public mark(): void;
							public writeBits(param0: number, param1: number): void;
							public readFloat(): number;
							public getStreamPosition(): number;
							public isCached(): boolean;
							public writeByte(param0: number): void;
							public writeInts(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public writeLongs(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public setByteOrder(param0: java.nio.ByteOrder): void;
							public readLong(): number;
							public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
							public readBytes(param0: com.tom_roush.harmony.javax.imageio.stream.IIOByteBuffer, param1: number): void;
							public readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public writeChar(param0: number): void;
							public getFlushedPosition(): number;
							public flushBefore(param0: number): void;
							public readFully(param0: androidNative.Array<string>, param1: number, param2: number): void;
							public writeInt(param0: number): void;
							public readBoolean(): boolean;
							public writeLong(param0: number): void;
							public read(param0: androidNative.Array<number>): number;
							public seek(param0: number): void;
							public readChar(): string;
							public setBitOffset(param0: number): void;
							public writeUTF(param0: string): void;
							public writeBit(param0: number): void;
							public isCachedMemory(): boolean;
							public isCachedFile(): boolean;
							public readUTF(): string;
							public readFully(param0: androidNative.Array<number>): void;
							public writeBytes(param0: string): void;
							public writeChars(param0: string): void;
							public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public read(): number;
							public writeShorts(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public writeShort(param0: number): void;
							public readUnsignedByte(): number;
							public writeDouble(param0: number): void;
							public writeDoubles(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public readUnsignedInt(): number;
							public readLine(): string;
							public writeFloat(param0: number): void;
							public flush(): void;
							public write(param0: number): void;
							public getBitOffset(): number;
							public readUnsignedShort(): number;
							public getByteOrder(): java.nio.ByteOrder;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace javax {
				export namespace imageio {
					export namespace stream {
						export abstract class ImageOutputStreamImpl extends com.tom_roush.harmony.javax.imageio.stream.ImageInputStreamImpl implements com.tom_roush.harmony.javax.imageio.stream.ImageOutputStream {
							public static class: java.lang.Class<com.tom_roush.harmony.javax.imageio.stream.ImageOutputStreamImpl>;
							public close(): void;
							public readByte(): number;
							public length(): number;
							public reset(): void;
							public write(param0: androidNative.Array<number>): void;
							public readDouble(): number;
							public skipBytes(param0: number): number;
							public readBits(param0: number): number;
							public writeChars(param0: androidNative.Array<string>, param1: number, param2: number): void;
							public readInt(): number;
							public readShort(): number;
							public readBit(): number;
							public writeBoolean(param0: boolean): void;
							public writeFloats(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public mark(): void;
							public writeBits(param0: number, param1: number): void;
							public readFloat(): number;
							public getStreamPosition(): number;
							public isCached(): boolean;
							public writeByte(param0: number): void;
							public writeInts(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public writeLongs(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public setByteOrder(param0: java.nio.ByteOrder): void;
							public readLong(): number;
							public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
							public readBytes(param0: com.tom_roush.harmony.javax.imageio.stream.IIOByteBuffer, param1: number): void;
							public readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public writeChar(param0: number): void;
							public getFlushedPosition(): number;
							public flushBefore(param0: number): void;
							public readFully(param0: androidNative.Array<string>, param1: number, param2: number): void;
							public writeInt(param0: number): void;
							public readBoolean(): boolean;
							public writeLong(param0: number): void;
							public read(param0: androidNative.Array<number>): number;
							public seek(param0: number): void;
							public readChar(): string;
							public setBitOffset(param0: number): void;
							public flushBits(): void;
							public writeUTF(param0: string): void;
							public writeBit(param0: number): void;
							public isCachedMemory(): boolean;
							public isCachedFile(): boolean;
							public readUTF(): string;
							public constructor();
							public readFully(param0: androidNative.Array<number>): void;
							public writeBytes(param0: string): void;
							public writeChars(param0: string): void;
							public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public read(): number;
							public writeShorts(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public writeShort(param0: number): void;
							public readUnsignedByte(): number;
							public writeDouble(param0: number): void;
							public writeDoubles(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public readUnsignedInt(): number;
							public readLine(): string;
							public writeFloat(param0: number): void;
							public flush(): void;
							public write(param0: number): void;
							public getBitOffset(): number;
							public readUnsignedShort(): number;
							public getByteOrder(): java.nio.ByteOrder;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace javax {
				export namespace imageio {
					export namespace stream {
						export class MemoryCacheImageInputStream extends com.tom_roush.harmony.javax.imageio.stream.ImageInputStreamImpl {
							public static class: java.lang.Class<com.tom_roush.harmony.javax.imageio.stream.MemoryCacheImageInputStream>;
							public getFlushedPosition(): number;
							public close(): void;
							public readByte(): number;
							public constructor(param0: java.io.InputStream);
							public flushBefore(param0: number): void;
							public readFully(param0: androidNative.Array<string>, param1: number, param2: number): void;
							public length(): number;
							public reset(): void;
							public readBoolean(): boolean;
							public read(param0: androidNative.Array<number>): number;
							public readDouble(): number;
							public seek(param0: number): void;
							public skipBytes(param0: number): number;
							public readChar(): string;
							public setBitOffset(param0: number): void;
							public isCachedFile(): boolean;
							public isCachedMemory(): boolean;
							public readBits(param0: number): number;
							public readUTF(): string;
							public readInt(): number;
							public constructor();
							public readFully(param0: androidNative.Array<number>): void;
							public readShort(): number;
							public readBit(): number;
							public mark(): void;
							public read(): number;
							public readUnsignedByte(): number;
							public isCached(): boolean;
							public readFloat(): number;
							public getStreamPosition(): number;
							public readUnsignedInt(): number;
							public setByteOrder(param0: java.nio.ByteOrder): void;
							public readLine(): string;
							public flush(): void;
							public getBitOffset(): number;
							public readUnsignedShort(): number;
							public getByteOrder(): java.nio.ByteOrder;
							public readLong(): number;
							public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
							public readBytes(param0: com.tom_roush.harmony.javax.imageio.stream.IIOByteBuffer, param1: number): void;
							public readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace javax {
				export namespace imageio {
					export namespace stream {
						export class MemoryCacheImageOutputStream extends com.tom_roush.harmony.javax.imageio.stream.ImageOutputStreamImpl {
							public static class: java.lang.Class<com.tom_roush.harmony.javax.imageio.stream.MemoryCacheImageOutputStream>;
							public constructor(param0: java.io.OutputStream);
							public close(): void;
							public readByte(): number;
							public length(): number;
							public reset(): void;
							public write(param0: androidNative.Array<number>): void;
							public readDouble(): number;
							public skipBytes(param0: number): number;
							public readBits(param0: number): number;
							public writeChars(param0: androidNative.Array<string>, param1: number, param2: number): void;
							public readInt(): number;
							public readShort(): number;
							public readBit(): number;
							public mark(): void;
							public writeBoolean(param0: boolean): void;
							public writeFloats(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public writeBits(param0: number, param1: number): void;
							public isCached(): boolean;
							public readFloat(): number;
							public getStreamPosition(): number;
							public writeByte(param0: number): void;
							public writeInts(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public writeLongs(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public setByteOrder(param0: java.nio.ByteOrder): void;
							public readLong(): number;
							public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
							public readBytes(param0: com.tom_roush.harmony.javax.imageio.stream.IIOByteBuffer, param1: number): void;
							public readFully(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public getFlushedPosition(): number;
							public writeChar(param0: number): void;
							public flushBefore(param0: number): void;
							public readFully(param0: androidNative.Array<string>, param1: number, param2: number): void;
							public readBoolean(): boolean;
							public writeInt(param0: number): void;
							public read(param0: androidNative.Array<number>): number;
							public writeLong(param0: number): void;
							public seek(param0: number): void;
							public readChar(): string;
							public setBitOffset(param0: number): void;
							public isCachedMemory(): boolean;
							public isCachedFile(): boolean;
							public writeUTF(param0: string): void;
							public writeBit(param0: number): void;
							public readUTF(): string;
							public constructor();
							public readFully(param0: androidNative.Array<number>): void;
							public writeBytes(param0: string): void;
							public writeChars(param0: string): void;
							public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public read(): number;
							public writeShorts(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public writeShort(param0: number): void;
							public readUnsignedByte(): number;
							public writeDouble(param0: number): void;
							public writeDoubles(param0: androidNative.Array<number>, param1: number, param2: number): void;
							public readUnsignedInt(): number;
							public readLine(): string;
							public flush(): void;
							public writeFloat(param0: number): void;
							public write(param0: number): void;
							public getBitOffset(): number;
							public readUnsignedShort(): number;
							public getByteOrder(): java.nio.ByteOrder;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace harmony {
			export namespace javax {
				export namespace imageio {
					export namespace stream {
						export class RandomAccessMemoryCache extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.harmony.javax.imageio.stream.RandomAccessMemoryCache>;
							public constructor();
							public close(): void;
							public getData(param0: java.io.OutputStream, param1: number, param2: number): void;
							public putData(param0: androidNative.Array<number>, param1: number, param2: number, param3: number): void;
							public appendData(param0: java.io.InputStream, param1: number): number;
							public freeBefore(param0: number): void;
							public length(): number;
							public getData(param0: number): number;
							public putData(param0: number, param1: number): void;
							public getData(param0: androidNative.Array<number>, param1: number, param2: number, param3: number): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export class BuildConfig extends java.lang.Object {
				public static class: java.lang.Class<com.tom_roush.pdfbox.BuildConfig>;
				public static DEBUG: boolean = 0;
				public static LIBRARY_PACKAGE_NAME: string = "com.tom_roush.pdfbox";
				public static BUILD_TYPE: string = "release";
				public constructor();
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export class R extends java.lang.Object {
				public static class: java.lang.Class<com.tom_roush.pdfbox.R>;
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace android {
				export class PDFBoxConfig extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.android.PDFBoxConfig>;
					public static FONT_LOAD_LEVEL: com.tom_roush.pdfbox.android.PDFBoxConfig.FontLoadLevel;
					public static isDebugEnabled(): boolean;
					public constructor();
					public static getFontLoadLevel(): com.tom_roush.pdfbox.android.PDFBoxConfig.FontLoadLevel;
					public static setFontLoadLevel(param0: com.tom_roush.pdfbox.android.PDFBoxConfig.FontLoadLevel): void;
					public static setDebugLoggingEnabled(param0: boolean): void;
				}
				export namespace PDFBoxConfig {
					export class FontLoadLevel {
						public static class: java.lang.Class<com.tom_roush.pdfbox.android.PDFBoxConfig.FontLoadLevel>;
						public static FULL: com.tom_roush.pdfbox.android.PDFBoxConfig.FontLoadLevel;
						public static MINIMUM: com.tom_roush.pdfbox.android.PDFBoxConfig.FontLoadLevel;
						public static NONE: com.tom_roush.pdfbox.android.PDFBoxConfig.FontLoadLevel;
						public static values(): androidNative.Array<com.tom_roush.pdfbox.android.PDFBoxConfig.FontLoadLevel>;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static valueOf(param0: string): com.tom_roush.pdfbox.android.PDFBoxConfig.FontLoadLevel;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace android {
				export class PDFBoxResourceLoader extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.android.PDFBoxResourceLoader>;
					public static init(param0: globalAndroid.content.Context): void;
					public static isReady(): boolean;
					public constructor();
					public static getStream(param0: string): java.io.InputStream;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export class PDContentStream extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.PDContentStream>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.contentstream.PDContentStream interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getContents(): java.io.InputStream;
						getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
						getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						getMatrix(): com.tom_roush.pdfbox.util.Matrix;
					});
					public constructor();
					public getContents(): java.io.InputStream;
					public getMatrix(): com.tom_roush.pdfbox.util.Matrix;
					public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
					public getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export abstract class PDFGraphicsStreamEngine extends com.tom_roush.pdfbox.contentstream.PDFStreamEngine {
					public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.PDFGraphicsStreamEngine>;
					public endPath(): void;
					public moveTo(param0: number, param1: number): void;
					public getCurrentPoint(): globalAndroid.graphics.PointF;
					public strokePath(): void;
					public clip(param0: globalAndroid.graphics.Path.FillType): void;
					public shadingFill(param0: com.tom_roush.pdfbox.cos.COSName): void;
					public fillPath(param0: globalAndroid.graphics.Path.FillType): void;
					public fillAndStrokePath(param0: globalAndroid.graphics.Path.FillType): void;
					public curveTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public constructor();
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDPage);
					public getPage(): com.tom_roush.pdfbox.pdmodel.PDPage;
					public lineTo(param0: number, param1: number): void;
					public appendRectangle(param0: globalAndroid.graphics.PointF, param1: globalAndroid.graphics.PointF, param2: globalAndroid.graphics.PointF, param3: globalAndroid.graphics.PointF): void;
					public closePath(): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImage): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export abstract class PDFStreamEngine extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.PDFStreamEngine>;
					public showText(param0: androidNative.Array<number>): void;
					public processPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public setTextMatrix(param0: com.tom_roush.pdfbox.util.Matrix): void;
					public getCurrentPage(): com.tom_roush.pdfbox.pdmodel.PDPage;
					public setTextLineMatrix(param0: com.tom_roush.pdfbox.util.Matrix): void;
					public restoreGraphicsStack(param0: java.util.Deque<com.tom_roush.pdfbox.pdmodel.graphics.state.PDGraphicsState>): void;
					public processTilingPattern(param0: com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDTilingPattern, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor, param2: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
					public getAppearance(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream;
					/** @deprecated */
					public showFontGlyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont, param2: number, param3: string, param4: com.tom_roush.pdfbox.util.Vector): void;
					public transformWidth(param0: number): number;
					public constructor();
					public processOperator(param0: string, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
					public processChildStream(param0: com.tom_roush.pdfbox.contentstream.PDContentStream, param1: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public showTextStrings(param0: com.tom_roush.pdfbox.cos.COSArray): void;
					public showGlyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont, param2: number, param3: com.tom_roush.pdfbox.util.Vector): void;
					public showTransparencyGroup(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDTransparencyGroup): void;
					public unsupportedOperator(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
					public showFontGlyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont, param2: number, param3: com.tom_roush.pdfbox.util.Vector): void;
					public processOperator(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
					public getTextMatrix(): com.tom_roush.pdfbox.util.Matrix;
					/** @deprecated */
					public registerOperatorProcessor(param0: string, param1: com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor): void;
					public decreaseLevel(): void;
					public processAnnotation(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream): void;
					public showType3Glyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDType3Font, param2: number, param3: com.tom_roush.pdfbox.util.Vector): void;
					public increaseLevel(): void;
					public setLineDashPattern(param0: com.tom_roush.pdfbox.cos.COSArray, param1: number): void;
					public getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
					public transformedPoint(param0: number, param1: number): globalAndroid.graphics.PointF;
					public showTextString(param0: androidNative.Array<number>): void;
					/** @deprecated */
					public showType3Glyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDType3Font, param2: number, param3: string, param4: com.tom_roush.pdfbox.util.Vector): void;
					/** @deprecated */
					public showGlyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont, param2: number, param3: string, param4: com.tom_roush.pdfbox.util.Vector): void;
					public restoreGraphicsState(): void;
					public getTextLineMatrix(): com.tom_roush.pdfbox.util.Matrix;
					public addOperator(param0: com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor): void;
					public getGraphicsStackSize(): number;
					public endMarkedContentSequence(): void;
					public getGraphicsState(): com.tom_roush.pdfbox.pdmodel.graphics.state.PDGraphicsState;
					public saveGraphicsStack(): java.util.Deque<com.tom_roush.pdfbox.pdmodel.graphics.state.PDGraphicsState>;
					public getInitialMatrix(): com.tom_roush.pdfbox.util.Matrix;
					public endText(): void;
					public operatorException(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>, param2: java.io.IOException): void;
					public saveGraphicsState(): void;
					public processTransparencyGroup(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDTransparencyGroup): void;
					public processSoftMask(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDTransparencyGroup): void;
					public processTilingPattern(param0: com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDTilingPattern, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor, param2: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace, param3: com.tom_roush.pdfbox.util.Matrix): void;
					public processType3Stream(param0: com.tom_roush.pdfbox.pdmodel.font.PDType3CharProc, param1: com.tom_roush.pdfbox.util.Matrix): void;
					public getLevel(): number;
					public beginText(): void;
					public showAnnotation(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation): void;
					public applyTextAdjustment(param0: number, param1: number): void;
					public showForm(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject): void;
					public beginMarkedContentSequence(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSDictionary): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export class DrawObject extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
						public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.DrawObject>;
						public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
						public constructor();
						public getName(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export class MissingOperandException extends java.io.IOException {
						public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.MissingOperandException>;
						public constructor();
						public constructor(param0: java.lang.Throwable);
						public constructor(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>);
						public constructor(param0: string, param1: java.lang.Throwable);
						public constructor(param0: string, param1: java.lang.Throwable, param2: boolean, param3: boolean);
						public constructor(param0: string);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export class Operator extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.Operator>;
						public setImageParameters(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
						public static getOperator(param0: string): com.tom_roush.pdfbox.contentstream.operator.Operator;
						public getImageParameters(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getImageData(): androidNative.Array<number>;
						public getName(): string;
						public setImageData(param0: androidNative.Array<number>): void;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export class OperatorName extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.OperatorName>;
						public static NON_STROKING_COLOR: string = "sc";
						public static NON_STROKING_COLOR_N: string = "scn";
						public static NON_STROKING_RGB: string = "rg";
						public static NON_STROKING_GRAY: string = "g";
						public static NON_STROKING_CMYK: string = "k";
						public static NON_STROKING_COLORSPACE: string = "cs";
						public static STROKING_COLOR: string = "SC";
						public static STROKING_COLOR_N: string = "SCN";
						public static STROKING_COLOR_RGB: string = "RG";
						public static STROKING_COLOR_GRAY: string = "G";
						public static STROKING_COLOR_CMYK: string = "K";
						public static STROKING_COLORSPACE: string = "CS";
						public static BEGIN_MARKED_CONTENT_SEQ: string = "BDC";
						public static BEGIN_MARKED_CONTENT: string = "BMC";
						public static END_MARKED_CONTENT: string = "EMC";
						public static MARKED_CONTENT_POINT_WITH_PROPS: string = "DP";
						public static MARKED_CONTENT_POINT: string = "MP";
						public static DRAW_OBJECT: string = "Do";
						public static CONCAT: string = "cm";
						public static RESTORE: string = "Q";
						public static SAVE: string = "q";
						public static SET_FLATNESS: string = "i";
						public static SET_GRAPHICS_STATE_PARAMS: string = "gs";
						public static SET_LINE_CAPSTYLE: string = "J";
						public static SET_LINE_DASHPATTERN: string = "d";
						public static SET_LINE_JOINSTYLE: string = "j";
						public static SET_LINE_MITERLIMIT: string = "M";
						public static SET_LINE_WIDTH: string = "w";
						public static SET_MATRIX: string = "Tm";
						public static SET_RENDERINGINTENT: string = "ri";
						public static APPEND_RECT: string = "re";
						public static BEGIN_INLINE_IMAGE: string = "BI";
						public static BEGIN_INLINE_IMAGE_DATA: string = "ID";
						public static END_INLINE_IMAGE: string = "EI";
						public static CLIP_EVEN_ODD: string = "W*";
						public static CLIP_NON_ZERO: string = "W";
						public static CLOSE_AND_STROKE: string = "s";
						public static CLOSE_FILL_EVEN_ODD_AND_STROKE: string = "b*";
						public static CLOSE_FILL_NON_ZERO_AND_STROKE: string = "b";
						public static CLOSE_PATH: string = "h";
						public static CURVE_TO: string = "c";
						public static CURVE_TO_REPLICATE_FINAL_POINT: string = "y";
						public static CURVE_TO_REPLICATE_INITIAL_POINT: string = "v";
						public static ENDPATH: string = "n";
						public static FILL_EVEN_ODD_AND_STROKE: string = "B*";
						public static FILL_EVEN_ODD: string = "f*";
						public static FILL_NON_ZERO_AND_STROKE: string = "B";
						public static FILL_NON_ZERO: string = "f";
						public static LEGACY_FILL_NON_ZERO: string = "F";
						public static LINE_TO: string = "l";
						public static MOVE_TO: string = "m";
						public static SHADING_FILL: string = "sh";
						public static STROKE_PATH: string = "S";
						public static BEGIN_TEXT: string = "BT";
						public static END_TEXT: string = "ET";
						public static MOVE_TEXT: string = "Td";
						public static MOVE_TEXT_SET_LEADING: string = "TD";
						public static NEXT_LINE: string = "T*";
						public static SET_CHAR_SPACING: string = "Tc";
						public static SET_FONT_AND_SIZE: string = "Tf";
						public static SET_TEXT_HORIZONTAL_SCALING: string = "Tz";
						public static SET_TEXT_LEADING: string = "TL";
						public static SET_TEXT_RENDERINGMODE: string = "Tr";
						public static SET_TEXT_RISE: string = "Ts";
						public static SET_WORD_SPACING: string = "Tw";
						public static SHOW_TEXT: string = "Tj";
						public static SHOW_TEXT_ADJUSTED: string = "TJ";
						public static SHOW_TEXT_LINE: string = "\'";
						public static SHOW_TEXT_LINE_AND_SPACE: string = "\"";
						public static TYPE3_D0: string = "d0";
						public static TYPE3_D1: string = "d1";
						public static BEGIN_COMPATIBILITY_SECTION: string = "BX";
						public static END_COMPATIBILITY_SECTION: string = "EX";
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export abstract class OperatorProcessor extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor>;
						public context: com.tom_roush.pdfbox.contentstream.PDFStreamEngine;
						public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
						public constructor();
						public getContext(): com.tom_roush.pdfbox.contentstream.PDFStreamEngine;
						public checkArrayTypesClass(param0: java.util.List<com.tom_roush.pdfbox.cos.COSBase>, param1: java.lang.Class<any>): boolean;
						public setContext(param0: com.tom_roush.pdfbox.contentstream.PDFStreamEngine): void;
						public getName(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export abstract class SetColor extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetColor>;
							public constructor();
							public getColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public setColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetNonStrokingColor extends com.tom_roush.pdfbox.contentstream.operator.color.SetColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingColor>;
							public constructor();
							public getColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public setColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetNonStrokingColorN extends com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingColorN>;
							public constructor();
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetNonStrokingColorSpace extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingColorSpace>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetNonStrokingDeviceCMYKColor extends com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingDeviceCMYKColor>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetNonStrokingDeviceGrayColor extends com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingDeviceGrayColor>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetNonStrokingDeviceRGBColor extends com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetNonStrokingDeviceRGBColor>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetStrokingColor extends com.tom_roush.pdfbox.contentstream.operator.color.SetColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingColor>;
							public constructor();
							public getColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public setColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetStrokingColorN extends com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingColorN>;
							public constructor();
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetStrokingColorSpace extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingColorSpace>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetStrokingDeviceCMYKColor extends com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingDeviceCMYKColor>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetStrokingDeviceGrayColor extends com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingDeviceGrayColor>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace color {
						export class SetStrokingDeviceRGBColor extends com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingColor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.color.SetStrokingDeviceRGBColor>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class AppendRectangleToPath extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.AppendRectangleToPath>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class BeginInlineImage extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.BeginInlineImage>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class ClipEvenOddRule extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.ClipEvenOddRule>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class ClipNonZeroRule extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.ClipNonZeroRule>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class CloseAndStrokePath extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.CloseAndStrokePath>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class CloseFillEvenOddAndStrokePath extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.CloseFillEvenOddAndStrokePath>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class CloseFillNonZeroAndStrokePath extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.CloseFillNonZeroAndStrokePath>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class ClosePath extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.ClosePath>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class CurveTo extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.CurveTo>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class CurveToReplicateFinalPoint extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.CurveToReplicateFinalPoint>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class CurveToReplicateInitialPoint extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.CurveToReplicateInitialPoint>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class DrawObject extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.DrawObject>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class EndPath extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.EndPath>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class FillEvenOddAndStrokePath extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.FillEvenOddAndStrokePath>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class FillEvenOddRule extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.FillEvenOddRule>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class FillNonZeroAndStrokePath extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.FillNonZeroAndStrokePath>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class FillNonZeroRule extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.FillNonZeroRule>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export abstract class GraphicsOperatorProcessor extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor>;
							public context: com.tom_roush.pdfbox.contentstream.PDFGraphicsStreamEngine;
							public constructor();
							public setContext(param0: com.tom_roush.pdfbox.contentstream.PDFStreamEngine): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class LegacyFillNonZeroRule extends com.tom_roush.pdfbox.contentstream.operator.graphics.FillNonZeroRule {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.LegacyFillNonZeroRule>;
							public constructor();
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class LineTo extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.LineTo>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class MoveTo extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.MoveTo>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class ShadingFill extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.ShadingFill>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace graphics {
						export class StrokePath extends com.tom_roush.pdfbox.contentstream.operator.graphics.GraphicsOperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.graphics.StrokePath>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace markedcontent {
						export class BeginMarkedContentSequence extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.markedcontent.BeginMarkedContentSequence>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace markedcontent {
						export class BeginMarkedContentSequenceWithProperties extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.markedcontent.BeginMarkedContentSequenceWithProperties>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace markedcontent {
						export class DrawObject extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.markedcontent.DrawObject>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace markedcontent {
						export class EndMarkedContentSequence extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.markedcontent.EndMarkedContentSequence>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class Concatenate extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.Concatenate>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class EmptyGraphicsStackException extends java.io.IOException {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.EmptyGraphicsStackException>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class Restore extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.Restore>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class Save extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.Save>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class SetFlatness extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.SetFlatness>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class SetGraphicsStateParameters extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.SetGraphicsStateParameters>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class SetLineCapStyle extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.SetLineCapStyle>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class SetLineDashPattern extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.SetLineDashPattern>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class SetLineJoinStyle extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.SetLineJoinStyle>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class SetLineMiterLimit extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.SetLineMiterLimit>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class SetLineWidth extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.SetLineWidth>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class SetMatrix extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.SetMatrix>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace state {
						export class SetRenderingIntent extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.state.SetRenderingIntent>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class BeginText extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.BeginText>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class EndText extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.EndText>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class MoveText extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.MoveText>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class MoveTextSetLeading extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.MoveTextSetLeading>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class NextLine extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.NextLine>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class SetCharSpacing extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.SetCharSpacing>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class SetFontAndSize extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.SetFontAndSize>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class SetTextHorizontalScaling extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.SetTextHorizontalScaling>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class SetTextLeading extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.SetTextLeading>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class SetTextRenderingMode extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.SetTextRenderingMode>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class SetTextRise extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.SetTextRise>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class SetWordSpacing extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.SetWordSpacing>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class ShowText extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.ShowText>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class ShowTextAdjusted extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.ShowTextAdjusted>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class ShowTextLine extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.ShowTextLine>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace contentstream {
				export namespace operator {
					export namespace text {
						export class ShowTextLineAndSpace extends com.tom_roush.pdfbox.contentstream.operator.OperatorProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.contentstream.operator.text.ShowTextLineAndSpace>;
							public constructor();
							public process(param0: com.tom_roush.pdfbox.contentstream.operator.Operator, param1: java.util.List<com.tom_roush.pdfbox.cos.COSBase>): void;
							public getName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSArray extends com.tom_roush.pdfbox.cos.COSBase {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSArray>;
					public retainAll(param0: java.util.Collection<com.tom_roush.pdfbox.cos.COSBase>): void;
					public removeObject(param0: com.tom_roush.pdfbox.cos.COSBase): boolean;
					public set(param0: number, param1: com.tom_roush.pdfbox.cos.COSBase): void;
					public spliterator(): java.util.Spliterator<any>;
					public addAll(param0: number, param1: java.util.Collection<com.tom_roush.pdfbox.cos.COSBase>): void;
					public getName(param0: number): string;
					public size(): number;
					public getObject(param0: number): com.tom_roush.pdfbox.cos.COSBase;
					public growToSize(param0: number, param1: com.tom_roush.pdfbox.cos.COSBase): void;
					public indexOfObject(param0: com.tom_roush.pdfbox.cos.COSBase): number;
					public toString(): string;
					public growToSize(param0: number): void;
					public iterator(): java.util.Iterator<any>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public setString(param0: number, param1: string): void;
					public toFloatArray(): androidNative.Array<number>;
					public constructor();
					public clear(): void;
					public removeAll(param0: java.util.Collection<com.tom_roush.pdfbox.cos.COSBase>): void;
					public setName(param0: number, param1: string): void;
					public add(param0: com.tom_roush.pdfbox.pdmodel.common.COSObjectable): void;
					public getString(param0: number, param1: string): string;
					public get(param0: number): com.tom_roush.pdfbox.cos.COSBase;
					public add(param0: com.tom_roush.pdfbox.cos.COSBase): void;
					public setNeedToBeUpdated(param0: boolean): void;
					public indexOf(param0: com.tom_roush.pdfbox.cos.COSBase): number;
					public remove(param0: number): com.tom_roush.pdfbox.cos.COSBase;
					public add(param0: number, param1: com.tom_roush.pdfbox.cos.COSBase): void;
					public getString(param0: number): string;
					public addAll(param0: com.tom_roush.pdfbox.cos.COSArray): void;
					public isNeedToBeUpdated(): boolean;
					public getName(param0: number, param1: string): string;
					public getInt(param0: number): number;
					public set(param0: number, param1: com.tom_roush.pdfbox.pdmodel.common.COSObjectable): void;
					public setFloatArray(param0: androidNative.Array<number>): void;
					public addAll(param0: java.util.Collection<com.tom_roush.pdfbox.cos.COSBase>): void;
					public remove(param0: com.tom_roush.pdfbox.cos.COSBase): boolean;
					public set(param0: number, param1: number): void;
					public setInt(param0: number, param1: number): void;
					public iterator(): java.util.Iterator<com.tom_roush.pdfbox.cos.COSBase>;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public toList(): java.util.List<any>;
					public getInt(param0: number, param1: number): number;
					public forEach(param0: any /* any*/): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export abstract class COSBase extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSBase>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public setDirect(param0: boolean): void;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public isDirect(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSBoolean extends com.tom_roush.pdfbox.cos.COSBase {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSBoolean>;
					public static TRUE_BYTES: androidNative.Array<number>;
					public static FALSE_BYTES: androidNative.Array<number>;
					public static TRUE: com.tom_roush.pdfbox.cos.COSBoolean;
					public static FALSE: com.tom_roush.pdfbox.cos.COSBoolean;
					public getValueAsObject(): java.lang.Boolean;
					public toString(): string;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public static getBoolean(param0: boolean): com.tom_roush.pdfbox.cos.COSBoolean;
					public getValue(): boolean;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public static getBoolean(param0: java.lang.Boolean): com.tom_roush.pdfbox.cos.COSBoolean;
					public writePDF(param0: java.io.OutputStream): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSDictionary extends com.tom_roush.pdfbox.cos.COSBase implements com.tom_roush.pdfbox.cos.COSUpdateInfo {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSDictionary>;
					public items: java.util.Map<com.tom_roush.pdfbox.cos.COSName,com.tom_roush.pdfbox.cos.COSBase>;
					public setDate(param0: string, param1: java.util.Calendar): void;
					public getLong(param0: com.tom_roush.pdfbox.cos.COSName): number;
					public size(): number;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public setName(param0: string, param1: string): void;
					public getNameAsString(param0: string, param1: string): string;
					public getEmbeddedString(param0: string, param1: com.tom_roush.pdfbox.cos.COSName, param2: string): string;
					public setString(param0: string, param1: string): void;
					public setItem(param0: string, param1: com.tom_roush.pdfbox.cos.COSBase): void;
					public getInt(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSName): number;
					public getEmbeddedInt(param0: string, param1: com.tom_roush.pdfbox.cos.COSName, param2: number): number;
					public constructor();
					public setEmbeddedDate(param0: string, param1: string, param2: java.util.Calendar): void;
					public setEmbeddedInt(param0: string, param1: string, param2: number): void;
					public getCOSDictionary(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSDictionary;
					public getEmbeddedDate(param0: string, param1: string): java.util.Calendar;
					public getLong(param0: string, param1: number): number;
					public getEmbeddedDate(param0: string, param1: com.tom_roush.pdfbox.cos.COSName, param2: java.util.Calendar): java.util.Calendar;
					/** @deprecated */
					public getLong(param0: androidNative.Array<string>, param1: number): number;
					public entrySet(): java.util.Set<java.util.Map.Entry<com.tom_roush.pdfbox.cos.COSName,com.tom_roush.pdfbox.cos.COSBase>>;
					public getEmbeddedDate(param0: string, param1: string, param2: java.util.Calendar): java.util.Calendar;
					public getItem(param0: string): com.tom_roush.pdfbox.cos.COSBase;
					public getFloat(param0: string, param1: number): number;
					public getInt(param0: com.tom_roush.pdfbox.cos.COSName, param1: number): number;
					public getNameAsString(param0: com.tom_roush.pdfbox.cos.COSName): string;
					public getBoolean(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSName, param2: boolean): boolean;
					public setDate(param0: com.tom_roush.pdfbox.cos.COSName, param1: java.util.Calendar): void;
					public setLong(param0: com.tom_roush.pdfbox.cos.COSName, param1: number): void;
					public getEmbeddedInt(param0: string, param1: string): number;
					public getEmbeddedString(param0: string, param1: com.tom_roush.pdfbox.cos.COSName): string;
					public containsValue(param0: any): boolean;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public getNameAsString(param0: com.tom_roush.pdfbox.cos.COSName, param1: string): string;
					public setInt(param0: com.tom_roush.pdfbox.cos.COSName, param1: number): void;
					public getNameAsString(param0: string): string;
					public getCOSStream(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSStream;
					public setNeedToBeUpdated(param0: boolean): void;
					public setEmbeddedDate(param0: string, param1: com.tom_roush.pdfbox.cos.COSName, param2: java.util.Calendar): void;
					public getInt(param0: string): number;
					public setBoolean(param0: com.tom_roush.pdfbox.cos.COSName, param1: boolean): void;
					public getFloat(param0: string): number;
					public getKeyForValue(param0: any): com.tom_roush.pdfbox.cos.COSName;
					public getObjectFromPath(param0: string): com.tom_roush.pdfbox.cos.COSBase;
					public getString(param0: string): string;
					public isNeedToBeUpdated(): boolean;
					public getFlag(param0: com.tom_roush.pdfbox.cos.COSName, param1: number): boolean;
					public getEmbeddedString(param0: string, param1: string, param2: string): string;
					public setEmbeddedString(param0: string, param1: string, param2: string): void;
					public setInt(param0: string, param1: number): void;
					public getBoolean(param0: com.tom_roush.pdfbox.cos.COSName, param1: boolean): boolean;
					public setFlag(param0: com.tom_roush.pdfbox.cos.COSName, param1: number, param2: boolean): void;
					public setItem(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSBase): void;
					public setLong(param0: string, param1: number): void;
					public setString(param0: com.tom_roush.pdfbox.cos.COSName, param1: string): void;
					public getString(param0: string, param1: string): string;
					public getString(param0: com.tom_roush.pdfbox.cos.COSName): string;
					public getFloat(param0: com.tom_roush.pdfbox.cos.COSName, param1: number): number;
					public getDictionaryObject(param0: string): com.tom_roush.pdfbox.cos.COSBase;
					public asUnmodifiableDictionary(): com.tom_roush.pdfbox.cos.COSDictionary;
					public getCOSName(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSName;
					/** @deprecated */
					public getInt(param0: androidNative.Array<string>, param1: number): number;
					public getDate(param0: string, param1: java.util.Calendar): java.util.Calendar;
					public setFloat(param0: com.tom_roush.pdfbox.cos.COSName, param1: number): void;
					public getDate(param0: com.tom_roush.pdfbox.cos.COSName, param1: java.util.Calendar): java.util.Calendar;
					public getCOSName(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSName;
					public getEmbeddedDate(param0: string, param1: com.tom_roush.pdfbox.cos.COSName): java.util.Calendar;
					public getEmbeddedInt(param0: string, param1: com.tom_roush.pdfbox.cos.COSName): number;
					public containsKey(param0: string): boolean;
					public getCOSObject(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSObject;
					public addAll(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public getItem(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSBase;
					public containsKey(param0: com.tom_roush.pdfbox.cos.COSName): boolean;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public getLong(param0: com.tom_roush.pdfbox.cos.COSName, param1: number): number;
					public setEmbeddedString(param0: string, param1: com.tom_roush.pdfbox.cos.COSName, param2: string): void;
					public getEmbeddedInt(param0: string, param1: string, param2: number): number;
					public getInt(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSName, param2: number): number;
					public setEmbeddedInt(param0: string, param1: com.tom_roush.pdfbox.cos.COSName, param2: number): void;
					public getDictionaryObject(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSBase;
					public toString(): string;
					public clear(): void;
					public getCOSArray(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSArray;
					public getFloat(param0: com.tom_roush.pdfbox.cos.COSName): number;
					public setItem(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.common.COSObjectable): void;
					public getLong(param0: string): number;
					public getDate(param0: string): java.util.Calendar;
					public getDictionaryObject(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSBase;
					public removeItem(param0: com.tom_roush.pdfbox.cos.COSName): void;
					/** @deprecated */
					public mergeInto(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public setItem(param0: string, param1: com.tom_roush.pdfbox.pdmodel.common.COSObjectable): void;
					public getBoolean(param0: string, param1: boolean): boolean;
					public setName(param0: com.tom_roush.pdfbox.cos.COSName, param1: string): void;
					public getValues(): java.util.Collection<com.tom_roush.pdfbox.cos.COSBase>;
					public getEmbeddedString(param0: string, param1: string): string;
					public getDate(param0: com.tom_roush.pdfbox.cos.COSName): java.util.Calendar;
					/** @deprecated */
					public getDictionaryObject(param0: androidNative.Array<string>): com.tom_roush.pdfbox.cos.COSBase;
					public setBoolean(param0: string, param1: boolean): void;
					public getInt(param0: com.tom_roush.pdfbox.cos.COSName): number;
					public setFloat(param0: string, param1: number): void;
					public getItem(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSBase;
					public getString(param0: com.tom_roush.pdfbox.cos.COSName, param1: string): string;
					public getInt(param0: string, param1: number): number;
					public keySet(): java.util.Set<com.tom_roush.pdfbox.cos.COSName>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSDocument extends com.tom_roush.pdfbox.cos.COSBase implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSDocument>;
					public print(): void;
					public setTrailer(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public getObjectByType(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSObject;
					public finalize(): void;
					public setEncryptionDictionary(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public createCOSStream(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.cos.COSStream;
					public getObjectsByType(param0: com.tom_roush.pdfbox.cos.COSName): java.util.List<com.tom_roush.pdfbox.cos.COSObject>;
					public getStartXref(): number;
					public getObjectsByType(param0: string): java.util.List<com.tom_roush.pdfbox.cos.COSObject>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public close(): void;
					public addXRefTable(param0: java.util.Map<com.tom_roush.pdfbox.cos.COSObjectKey,java.lang.Long>): void;
					public setStartXref(param0: number): void;
					public dereferenceObjectStreams(): void;
					public getDocumentID(): com.tom_roush.pdfbox.cos.COSArray;
					public setIsXRefStream(param0: boolean): void;
					public getTrailer(): com.tom_roush.pdfbox.cos.COSDictionary;
					public getObjects(): java.util.List<com.tom_roush.pdfbox.cos.COSObject>;
					public constructor(param0: com.tom_roush.pdfbox.io.ScratchFile);
					public createCOSStream(): com.tom_roush.pdfbox.cos.COSStream;
					public isEncrypted(): boolean;
					public getObjectFromPool(param0: com.tom_roush.pdfbox.cos.COSObjectKey): com.tom_roush.pdfbox.cos.COSObject;
					public getKey(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.cos.COSObjectKey;
					public getVersion(): number;
					public setWarnMissingClose(param0: boolean): void;
					public setDecrypted(): void;
					/** @deprecated */
					public getCatalog(): com.tom_roush.pdfbox.cos.COSObject;
					public getXrefTable(): java.util.Map<com.tom_roush.pdfbox.cos.COSObjectKey,java.lang.Long>;
					public setDocumentID(param0: com.tom_roush.pdfbox.cos.COSArray): void;
					public removeObject(param0: com.tom_roush.pdfbox.cos.COSObjectKey): com.tom_roush.pdfbox.cos.COSObject;
					public setHighestXRefObjectNumber(param0: number): void;
					public setVersion(param0: number): void;
					public isDecrypted(): boolean;
					public isXRefStream(): boolean;
					public getHighestXRefObjectNumber(): number;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public getEncryptionDictionary(): com.tom_roush.pdfbox.cos.COSDictionary;
					public isClosed(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSFloat extends com.tom_roush.pdfbox.cos.COSNumber {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSFloat>;
					public constructor(param0: string);
					public floatValue(): number;
					public writePDF(param0: java.io.OutputStream): void;
					/** @deprecated */
					public doubleValue(): number;
					public equals(param0: any): boolean;
					public intValue(): number;
					public toString(): string;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public longValue(): number;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public hashCode(): number;
					public constructor(param0: number);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSInputStream extends java.io.FilterInputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSInputStream>;
					public close(): void;
					public getDecodeResult(): com.tom_roush.pdfbox.filter.DecodeResult;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSInteger extends com.tom_roush.pdfbox.cos.COSNumber {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSInteger>;
					public static ZERO: com.tom_roush.pdfbox.cos.COSInteger;
					public static ONE: com.tom_roush.pdfbox.cos.COSInteger;
					public static TWO: com.tom_roush.pdfbox.cos.COSInteger;
					public static THREE: com.tom_roush.pdfbox.cos.COSInteger;
					public static OUT_OF_RANGE_MAX: com.tom_roush.pdfbox.cos.COSInteger;
					public static OUT_OF_RANGE_MIN: com.tom_roush.pdfbox.cos.COSInteger;
					public floatValue(): number;
					public static get(param0: number): com.tom_roush.pdfbox.cos.COSInteger;
					public writePDF(param0: java.io.OutputStream): void;
					/** @deprecated */
					public doubleValue(): number;
					public equals(param0: any): boolean;
					public intValue(): number;
					public toString(): string;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public isValid(): boolean;
					public longValue(): number;
					public static get(param0: string): com.tom_roush.pdfbox.cos.COSNumber;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public hashCode(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSName extends com.tom_roush.pdfbox.cos.COSBase implements java.lang.Comparable<com.tom_roush.pdfbox.cos.COSName>  {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSName>;
					public static ABSOLUTE_COLORIMETRIC: com.tom_roush.pdfbox.cos.COSName;
					public static ACRO_FORM: com.tom_roush.pdfbox.cos.COSName;
					public static ACTUAL_TEXT: com.tom_roush.pdfbox.cos.COSName;
					public static ADBE_PKCS7_DETACHED: com.tom_roush.pdfbox.cos.COSName;
					public static ADBE_PKCS7_SHA1: com.tom_roush.pdfbox.cos.COSName;
					public static ADBE_X509_RSA_SHA1: com.tom_roush.pdfbox.cos.COSName;
					public static ADOBE_PPKLITE: com.tom_roush.pdfbox.cos.COSName;
					public static AESV2: com.tom_roush.pdfbox.cos.COSName;
					public static AESV3: com.tom_roush.pdfbox.cos.COSName;
					public static AFTER: com.tom_roush.pdfbox.cos.COSName;
					public static AI_META_DATA: com.tom_roush.pdfbox.cos.COSName;
					public static AIS: com.tom_roush.pdfbox.cos.COSName;
					public static ALL_OFF: com.tom_roush.pdfbox.cos.COSName;
					public static ALL_ON: com.tom_roush.pdfbox.cos.COSName;
					public static ALT: com.tom_roush.pdfbox.cos.COSName;
					public static ALPHA: com.tom_roush.pdfbox.cos.COSName;
					public static ALTERNATE: com.tom_roush.pdfbox.cos.COSName;
					public static ANNOT: com.tom_roush.pdfbox.cos.COSName;
					public static ANNOTS: com.tom_roush.pdfbox.cos.COSName;
					public static ANTI_ALIAS: com.tom_roush.pdfbox.cos.COSName;
					public static ANY_OFF: com.tom_roush.pdfbox.cos.COSName;
					public static ANY_ON: com.tom_roush.pdfbox.cos.COSName;
					public static AP_REF: com.tom_roush.pdfbox.cos.COSName;
					public static APP: com.tom_roush.pdfbox.cos.COSName;
					public static ART_BOX: com.tom_roush.pdfbox.cos.COSName;
					public static ARTIFACT: com.tom_roush.pdfbox.cos.COSName;
					public static ASCENT: com.tom_roush.pdfbox.cos.COSName;
					public static ASCII_HEX_DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static ASCII_HEX_DECODE_ABBREVIATION: com.tom_roush.pdfbox.cos.COSName;
					public static ASCII85_DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static ASCII85_DECODE_ABBREVIATION: com.tom_roush.pdfbox.cos.COSName;
					public static ATTACHED: com.tom_roush.pdfbox.cos.COSName;
					public static AUTHOR: com.tom_roush.pdfbox.cos.COSName;
					public static AVG_WIDTH: com.tom_roush.pdfbox.cos.COSName;
					public static BACKGROUND: com.tom_roush.pdfbox.cos.COSName;
					public static BASE_ENCODING: com.tom_roush.pdfbox.cos.COSName;
					public static BASE_FONT: com.tom_roush.pdfbox.cos.COSName;
					public static BASE_STATE: com.tom_roush.pdfbox.cos.COSName;
					public static BBOX: com.tom_roush.pdfbox.cos.COSName;
					public static BEFORE: com.tom_roush.pdfbox.cos.COSName;
					public static BITS_PER_COMPONENT: com.tom_roush.pdfbox.cos.COSName;
					public static BITS_PER_COORDINATE: com.tom_roush.pdfbox.cos.COSName;
					public static BITS_PER_FLAG: com.tom_roush.pdfbox.cos.COSName;
					public static BITS_PER_SAMPLE: com.tom_roush.pdfbox.cos.COSName;
					public static BLACK_IS_1: com.tom_roush.pdfbox.cos.COSName;
					public static BLACK_POINT: com.tom_roush.pdfbox.cos.COSName;
					public static BLEED_BOX: com.tom_roush.pdfbox.cos.COSName;
					public static BORDER: com.tom_roush.pdfbox.cos.COSName;
					public static BOUNDS: com.tom_roush.pdfbox.cos.COSName;
					public static BPC: com.tom_roush.pdfbox.cos.COSName;
					public static BTN: com.tom_roush.pdfbox.cos.COSName;
					public static BYTERANGE: com.tom_roush.pdfbox.cos.COSName;
					public static CA_NS: com.tom_roush.pdfbox.cos.COSName;
					public static CALGRAY: com.tom_roush.pdfbox.cos.COSName;
					public static CALRGB: com.tom_roush.pdfbox.cos.COSName;
					public static CAP: com.tom_roush.pdfbox.cos.COSName;
					public static CAP_HEIGHT: com.tom_roush.pdfbox.cos.COSName;
					public static CATALOG: com.tom_roush.pdfbox.cos.COSName;
					public static CCITTFAX_DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static CCITTFAX_DECODE_ABBREVIATION: com.tom_roush.pdfbox.cos.COSName;
					public static CENTER_WINDOW: com.tom_roush.pdfbox.cos.COSName;
					public static CERT: com.tom_roush.pdfbox.cos.COSName;
					public static CFM: com.tom_roush.pdfbox.cos.COSName;
					public static CHAR_PROCS: com.tom_roush.pdfbox.cos.COSName;
					public static CHAR_SET: com.tom_roush.pdfbox.cos.COSName;
					public static CICI_SIGNIT: com.tom_roush.pdfbox.cos.COSName;
					public static CID_FONT_TYPE0: com.tom_roush.pdfbox.cos.COSName;
					public static CID_FONT_TYPE2: com.tom_roush.pdfbox.cos.COSName;
					public static CID_TO_GID_MAP: com.tom_roush.pdfbox.cos.COSName;
					public static CID_SET: com.tom_roush.pdfbox.cos.COSName;
					public static CIDSYSTEMINFO: com.tom_roush.pdfbox.cos.COSName;
					public static CLR_F: com.tom_roush.pdfbox.cos.COSName;
					public static CLR_FF: com.tom_roush.pdfbox.cos.COSName;
					public static CMAP: com.tom_roush.pdfbox.cos.COSName;
					public static CMAPNAME: com.tom_roush.pdfbox.cos.COSName;
					public static CMYK: com.tom_roush.pdfbox.cos.COSName;
					public static COLOR: com.tom_roush.pdfbox.cos.COSName;
					public static COLLECTION: com.tom_roush.pdfbox.cos.COSName;
					public static COLLECTION_ITEM: com.tom_roush.pdfbox.cos.COSName;
					public static COLLECTION_FIELD: com.tom_roush.pdfbox.cos.COSName;
					public static COLLECTION_SCHEMA: com.tom_roush.pdfbox.cos.COSName;
					public static COLLECTION_SORT: com.tom_roush.pdfbox.cos.COSName;
					public static COLLECTION_SUBITEM: com.tom_roush.pdfbox.cos.COSName;
					public static COLOR_BURN: com.tom_roush.pdfbox.cos.COSName;
					public static COLOR_DODGE: com.tom_roush.pdfbox.cos.COSName;
					public static COLORANTS: com.tom_roush.pdfbox.cos.COSName;
					public static COLORS: com.tom_roush.pdfbox.cos.COSName;
					public static COLORSPACE: com.tom_roush.pdfbox.cos.COSName;
					public static COLUMNS: com.tom_roush.pdfbox.cos.COSName;
					public static COMPATIBLE: com.tom_roush.pdfbox.cos.COSName;
					public static COMPONENTS: com.tom_roush.pdfbox.cos.COSName;
					public static CONTACT_INFO: com.tom_roush.pdfbox.cos.COSName;
					public static CONTENTS: com.tom_roush.pdfbox.cos.COSName;
					public static COORDS: com.tom_roush.pdfbox.cos.COSName;
					public static COUNT: com.tom_roush.pdfbox.cos.COSName;
					public static CREATION_DATE: com.tom_roush.pdfbox.cos.COSName;
					public static CREATOR: com.tom_roush.pdfbox.cos.COSName;
					public static CROP_BOX: com.tom_roush.pdfbox.cos.COSName;
					public static CRYPT: com.tom_roush.pdfbox.cos.COSName;
					public static DARKEN: com.tom_roush.pdfbox.cos.COSName;
					public static DATE: com.tom_roush.pdfbox.cos.COSName;
					public static DCT_DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static DCT_DECODE_ABBREVIATION: com.tom_roush.pdfbox.cos.COSName;
					public static DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static DECODE_PARMS: com.tom_roush.pdfbox.cos.COSName;
					public static DEFAULT: com.tom_roush.pdfbox.cos.COSName;
					public static DEFAULT_CMYK: com.tom_roush.pdfbox.cos.COSName;
					public static DEFAULT_CRYPT_FILTER: com.tom_roush.pdfbox.cos.COSName;
					public static DEFAULT_GRAY: com.tom_roush.pdfbox.cos.COSName;
					public static DEFAULT_RGB: com.tom_roush.pdfbox.cos.COSName;
					public static DESC: com.tom_roush.pdfbox.cos.COSName;
					public static DESCENDANT_FONTS: com.tom_roush.pdfbox.cos.COSName;
					public static DESCENT: com.tom_roush.pdfbox.cos.COSName;
					public static DEST: com.tom_roush.pdfbox.cos.COSName;
					public static DEST_OUTPUT_PROFILE: com.tom_roush.pdfbox.cos.COSName;
					public static DESTS: com.tom_roush.pdfbox.cos.COSName;
					public static DEVICECMYK: com.tom_roush.pdfbox.cos.COSName;
					public static DEVICEGRAY: com.tom_roush.pdfbox.cos.COSName;
					public static DEVICEN: com.tom_roush.pdfbox.cos.COSName;
					public static DEVICERGB: com.tom_roush.pdfbox.cos.COSName;
					public static DIFFERENCE: com.tom_roush.pdfbox.cos.COSName;
					public static DIFFERENCES: com.tom_roush.pdfbox.cos.COSName;
					public static DIGEST_METHOD: com.tom_roush.pdfbox.cos.COSName;
					public static DIGEST_RIPEMD160: com.tom_roush.pdfbox.cos.COSName;
					public static DIGEST_SHA1: com.tom_roush.pdfbox.cos.COSName;
					public static DIGEST_SHA256: com.tom_roush.pdfbox.cos.COSName;
					public static DIGEST_SHA384: com.tom_roush.pdfbox.cos.COSName;
					public static DIGEST_SHA512: com.tom_roush.pdfbox.cos.COSName;
					public static DIRECTION: com.tom_roush.pdfbox.cos.COSName;
					public static DISPLAY_DOC_TITLE: com.tom_roush.pdfbox.cos.COSName;
					public static DOC: com.tom_roush.pdfbox.cos.COSName;
					public static DOC_CHECKSUM: com.tom_roush.pdfbox.cos.COSName;
					public static DOC_TIME_STAMP: com.tom_roush.pdfbox.cos.COSName;
					public static DOCMDP: com.tom_roush.pdfbox.cos.COSName;
					public static DOCUMENT: com.tom_roush.pdfbox.cos.COSName;
					public static DOMAIN: com.tom_roush.pdfbox.cos.COSName;
					public static DOS: com.tom_roush.pdfbox.cos.COSName;
					public static DUPLEX: com.tom_roush.pdfbox.cos.COSName;
					public static DUR: com.tom_roush.pdfbox.cos.COSName;
					public static DW2: com.tom_roush.pdfbox.cos.COSName;
					public static EARLY_CHANGE: com.tom_roush.pdfbox.cos.COSName;
					public static EMBEDDED_FDFS: com.tom_roush.pdfbox.cos.COSName;
					public static EMBEDDED_FILES: com.tom_roush.pdfbox.cos.COSName;
					public static EMPTY: com.tom_roush.pdfbox.cos.COSName;
					public static ENCODE: com.tom_roush.pdfbox.cos.COSName;
					public static ENCODED_BYTE_ALIGN: com.tom_roush.pdfbox.cos.COSName;
					public static ENCODING: com.tom_roush.pdfbox.cos.COSName;
					public static ENCODING_90MS_RKSJ_H: com.tom_roush.pdfbox.cos.COSName;
					public static ENCODING_90MS_RKSJ_V: com.tom_roush.pdfbox.cos.COSName;
					public static ENCODING_ETEN_B5_H: com.tom_roush.pdfbox.cos.COSName;
					public static ENCODING_ETEN_B5_V: com.tom_roush.pdfbox.cos.COSName;
					public static ENCRYPT: com.tom_roush.pdfbox.cos.COSName;
					public static ENCRYPT_META_DATA: com.tom_roush.pdfbox.cos.COSName;
					public static END_OF_LINE: com.tom_roush.pdfbox.cos.COSName;
					public static ENTRUST_PPKEF: com.tom_roush.pdfbox.cos.COSName;
					public static EXCLUSION: com.tom_roush.pdfbox.cos.COSName;
					public static EXT_G_STATE: com.tom_roush.pdfbox.cos.COSName;
					public static EXTEND: com.tom_roush.pdfbox.cos.COSName;
					public static EXTENDS: com.tom_roush.pdfbox.cos.COSName;
					public static F_DECODE_PARMS: com.tom_roush.pdfbox.cos.COSName;
					public static F_FILTER: com.tom_roush.pdfbox.cos.COSName;
					public static FDF: com.tom_roush.pdfbox.cos.COSName;
					public static FIELDS: com.tom_roush.pdfbox.cos.COSName;
					public static FILESPEC: com.tom_roush.pdfbox.cos.COSName;
					public static FILTER: com.tom_roush.pdfbox.cos.COSName;
					public static FIRST: com.tom_roush.pdfbox.cos.COSName;
					public static FIRST_CHAR: com.tom_roush.pdfbox.cos.COSName;
					public static FIT_WINDOW: com.tom_roush.pdfbox.cos.COSName;
					public static FLAGS: com.tom_roush.pdfbox.cos.COSName;
					public static FLATE_DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static FLATE_DECODE_ABBREVIATION: com.tom_roush.pdfbox.cos.COSName;
					public static FOLDERS: com.tom_roush.pdfbox.cos.COSName;
					public static FONT: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_BBOX: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_DESC: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_FAMILY: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_FILE: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_FILE2: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_FILE3: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_MATRIX: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_NAME: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_STRETCH: com.tom_roush.pdfbox.cos.COSName;
					public static FONT_WEIGHT: com.tom_roush.pdfbox.cos.COSName;
					public static FORM: com.tom_roush.pdfbox.cos.COSName;
					public static FORMTYPE: com.tom_roush.pdfbox.cos.COSName;
					public static FRM: com.tom_roush.pdfbox.cos.COSName;
					public static FUNCTION: com.tom_roush.pdfbox.cos.COSName;
					public static FUNCTION_TYPE: com.tom_roush.pdfbox.cos.COSName;
					public static FUNCTIONS: com.tom_roush.pdfbox.cos.COSName;
					public static GAMMA: com.tom_roush.pdfbox.cos.COSName;
					public static GROUP: com.tom_roush.pdfbox.cos.COSName;
					public static GTS_PDFA1: com.tom_roush.pdfbox.cos.COSName;
					public static HARD_LIGHT: com.tom_roush.pdfbox.cos.COSName;
					public static HEIGHT: com.tom_roush.pdfbox.cos.COSName;
					public static HELV: com.tom_roush.pdfbox.cos.COSName;
					public static HIDE_MENUBAR: com.tom_roush.pdfbox.cos.COSName;
					public static HIDE_TOOLBAR: com.tom_roush.pdfbox.cos.COSName;
					public static HIDE_WINDOWUI: com.tom_roush.pdfbox.cos.COSName;
					public static HUE: com.tom_roush.pdfbox.cos.COSName;
					public static ICCBASED: com.tom_roush.pdfbox.cos.COSName;
					public static ID_TREE: com.tom_roush.pdfbox.cos.COSName;
					public static IDENTITY: com.tom_roush.pdfbox.cos.COSName;
					public static IDENTITY_H: com.tom_roush.pdfbox.cos.COSName;
					public static IDENTITY_V: com.tom_roush.pdfbox.cos.COSName;
					public static ILLUSTRATOR: com.tom_roush.pdfbox.cos.COSName;
					public static IMAGE: com.tom_roush.pdfbox.cos.COSName;
					public static IMAGE_MASK: com.tom_roush.pdfbox.cos.COSName;
					public static INDEX: com.tom_roush.pdfbox.cos.COSName;
					public static INDEXED: com.tom_roush.pdfbox.cos.COSName;
					public static INFO: com.tom_roush.pdfbox.cos.COSName;
					public static INKLIST: com.tom_roush.pdfbox.cos.COSName;
					public static INTENT: com.tom_roush.pdfbox.cos.COSName;
					public static INTERPOLATE: com.tom_roush.pdfbox.cos.COSName;
					public static ITALIC_ANGLE: com.tom_roush.pdfbox.cos.COSName;
					public static ISSUER: com.tom_roush.pdfbox.cos.COSName;
					public static JAVA_SCRIPT: com.tom_roush.pdfbox.cos.COSName;
					public static JBIG2_DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static JBIG2_GLOBALS: com.tom_roush.pdfbox.cos.COSName;
					public static JPX_DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static KEYWORDS: com.tom_roush.pdfbox.cos.COSName;
					public static KEY_USAGE: com.tom_roush.pdfbox.cos.COSName;
					public static KIDS: com.tom_roush.pdfbox.cos.COSName;
					public static LAB: com.tom_roush.pdfbox.cos.COSName;
					public static LANG: com.tom_roush.pdfbox.cos.COSName;
					public static LAST: com.tom_roush.pdfbox.cos.COSName;
					public static LAST_CHAR: com.tom_roush.pdfbox.cos.COSName;
					public static LAST_MODIFIED: com.tom_roush.pdfbox.cos.COSName;
					public static LEADING: com.tom_roush.pdfbox.cos.COSName;
					public static LEGAL_ATTESTATION: com.tom_roush.pdfbox.cos.COSName;
					public static LENGTH: com.tom_roush.pdfbox.cos.COSName;
					public static LENGTH1: com.tom_roush.pdfbox.cos.COSName;
					public static LENGTH2: com.tom_roush.pdfbox.cos.COSName;
					public static LIGHTEN: com.tom_roush.pdfbox.cos.COSName;
					public static LIMITS: com.tom_roush.pdfbox.cos.COSName;
					public static LLE: com.tom_roush.pdfbox.cos.COSName;
					public static LLO: com.tom_roush.pdfbox.cos.COSName;
					public static LOCATION: com.tom_roush.pdfbox.cos.COSName;
					public static LUMINOSITY: com.tom_roush.pdfbox.cos.COSName;
					public static LZW_DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static LZW_DECODE_ABBREVIATION: com.tom_roush.pdfbox.cos.COSName;
					public static MAC: com.tom_roush.pdfbox.cos.COSName;
					public static MAC_EXPERT_ENCODING: com.tom_roush.pdfbox.cos.COSName;
					public static MAC_ROMAN_ENCODING: com.tom_roush.pdfbox.cos.COSName;
					public static MARK_INFO: com.tom_roush.pdfbox.cos.COSName;
					public static MASK: com.tom_roush.pdfbox.cos.COSName;
					public static MATRIX: com.tom_roush.pdfbox.cos.COSName;
					public static MATTE: com.tom_roush.pdfbox.cos.COSName;
					public static MAX_LEN: com.tom_roush.pdfbox.cos.COSName;
					public static MAX_WIDTH: com.tom_roush.pdfbox.cos.COSName;
					public static MCID: com.tom_roush.pdfbox.cos.COSName;
					public static MDP: com.tom_roush.pdfbox.cos.COSName;
					public static MEDIA_BOX: com.tom_roush.pdfbox.cos.COSName;
					public static MEASURE: com.tom_roush.pdfbox.cos.COSName;
					public static METADATA: com.tom_roush.pdfbox.cos.COSName;
					public static MISSING_WIDTH: com.tom_roush.pdfbox.cos.COSName;
					public static MIX: com.tom_roush.pdfbox.cos.COSName;
					public static MM_TYPE1: com.tom_roush.pdfbox.cos.COSName;
					public static MOD_DATE: com.tom_roush.pdfbox.cos.COSName;
					public static MULTIPLY: com.tom_roush.pdfbox.cos.COSName;
					public static NAME: com.tom_roush.pdfbox.cos.COSName;
					public static NAMES: com.tom_roush.pdfbox.cos.COSName;
					public static NAVIGATOR: com.tom_roush.pdfbox.cos.COSName;
					public static NEED_APPEARANCES: com.tom_roush.pdfbox.cos.COSName;
					public static NEW_WINDOW: com.tom_roush.pdfbox.cos.COSName;
					public static NEXT: com.tom_roush.pdfbox.cos.COSName;
					public static NON_EFONT_NO_WARN: com.tom_roush.pdfbox.cos.COSName;
					public static NON_FULL_SCREEN_PAGE_MODE: com.tom_roush.pdfbox.cos.COSName;
					public static NONE: com.tom_roush.pdfbox.cos.COSName;
					public static NORMAL: com.tom_roush.pdfbox.cos.COSName;
					public static NUMS: com.tom_roush.pdfbox.cos.COSName;
					public static OBJ: com.tom_roush.pdfbox.cos.COSName;
					public static OBJ_STM: com.tom_roush.pdfbox.cos.COSName;
					public static OCG: com.tom_roush.pdfbox.cos.COSName;
					public static OCGS: com.tom_roush.pdfbox.cos.COSName;
					public static OCMD: com.tom_roush.pdfbox.cos.COSName;
					public static OCPROPERTIES: com.tom_roush.pdfbox.cos.COSName;
					public static OID: com.tom_roush.pdfbox.cos.COSName;
					public static OFF: com.tom_roush.pdfbox.cos.COSName;
					public static Off: com.tom_roush.pdfbox.cos.COSName;
					public static OP_NS: com.tom_roush.pdfbox.cos.COSName;
					public static OPEN_ACTION: com.tom_roush.pdfbox.cos.COSName;
					public static OPEN_TYPE: com.tom_roush.pdfbox.cos.COSName;
					public static OPM: com.tom_roush.pdfbox.cos.COSName;
					public static OPT: com.tom_roush.pdfbox.cos.COSName;
					public static ORDER: com.tom_roush.pdfbox.cos.COSName;
					public static ORDERING: com.tom_roush.pdfbox.cos.COSName;
					public static OUTLINES: com.tom_roush.pdfbox.cos.COSName;
					public static OUTPUT_CONDITION: com.tom_roush.pdfbox.cos.COSName;
					public static OUTPUT_CONDITION_IDENTIFIER: com.tom_roush.pdfbox.cos.COSName;
					public static OUTPUT_INTENT: com.tom_roush.pdfbox.cos.COSName;
					public static OUTPUT_INTENTS: com.tom_roush.pdfbox.cos.COSName;
					public static OVERLAY: com.tom_roush.pdfbox.cos.COSName;
					public static PAGE: com.tom_roush.pdfbox.cos.COSName;
					public static PAGE_LABELS: com.tom_roush.pdfbox.cos.COSName;
					public static PAGE_LAYOUT: com.tom_roush.pdfbox.cos.COSName;
					public static PAGE_MODE: com.tom_roush.pdfbox.cos.COSName;
					public static PAGES: com.tom_roush.pdfbox.cos.COSName;
					public static PAINT_TYPE: com.tom_roush.pdfbox.cos.COSName;
					public static PANOSE: com.tom_roush.pdfbox.cos.COSName;
					public static PARAMS: com.tom_roush.pdfbox.cos.COSName;
					public static PARENT: com.tom_roush.pdfbox.cos.COSName;
					public static PARENT_TREE: com.tom_roush.pdfbox.cos.COSName;
					public static PARENT_TREE_NEXT_KEY: com.tom_roush.pdfbox.cos.COSName;
					public static PART: com.tom_roush.pdfbox.cos.COSName;
					public static PATH: com.tom_roush.pdfbox.cos.COSName;
					public static PATTERN: com.tom_roush.pdfbox.cos.COSName;
					public static PATTERN_TYPE: com.tom_roush.pdfbox.cos.COSName;
					public static PDF_DOC_ENCODING: com.tom_roush.pdfbox.cos.COSName;
					public static PERMS: com.tom_roush.pdfbox.cos.COSName;
					public static PERCEPTUAL: com.tom_roush.pdfbox.cos.COSName;
					public static PIECE_INFO: com.tom_roush.pdfbox.cos.COSName;
					public static PRE_RELEASE: com.tom_roush.pdfbox.cos.COSName;
					public static PREDICTOR: com.tom_roush.pdfbox.cos.COSName;
					public static PREV: com.tom_roush.pdfbox.cos.COSName;
					public static PRINT_AREA: com.tom_roush.pdfbox.cos.COSName;
					public static PRINT_CLIP: com.tom_roush.pdfbox.cos.COSName;
					public static PRINT_SCALING: com.tom_roush.pdfbox.cos.COSName;
					public static PRIVATE: com.tom_roush.pdfbox.cos.COSName;
					public static PROC_SET: com.tom_roush.pdfbox.cos.COSName;
					public static PROCESS: com.tom_roush.pdfbox.cos.COSName;
					public static PRODUCER: com.tom_roush.pdfbox.cos.COSName;
					public static PROP_BUILD: com.tom_roush.pdfbox.cos.COSName;
					public static PROPERTIES: com.tom_roush.pdfbox.cos.COSName;
					public static PUB_SEC: com.tom_roush.pdfbox.cos.COSName;
					public static QUADPOINTS: com.tom_roush.pdfbox.cos.COSName;
					public static R: com.tom_roush.pdfbox.cos.COSName;
					public static RANGE: com.tom_roush.pdfbox.cos.COSName;
					public static REASON: com.tom_roush.pdfbox.cos.COSName;
					public static REASONS: com.tom_roush.pdfbox.cos.COSName;
					public static RELATIVE_COLORIMETRIC: com.tom_roush.pdfbox.cos.COSName;
					public static REPEAT: com.tom_roush.pdfbox.cos.COSName;
					public static RECIPIENTS: com.tom_roush.pdfbox.cos.COSName;
					public static RECT: com.tom_roush.pdfbox.cos.COSName;
					public static REFERENCE: com.tom_roush.pdfbox.cos.COSName;
					public static REGISTRY: com.tom_roush.pdfbox.cos.COSName;
					public static REGISTRY_NAME: com.tom_roush.pdfbox.cos.COSName;
					public static RENAME: com.tom_roush.pdfbox.cos.COSName;
					public static RESOURCES: com.tom_roush.pdfbox.cos.COSName;
					public static RGB: com.tom_roush.pdfbox.cos.COSName;
					public static ROLE_MAP: com.tom_roush.pdfbox.cos.COSName;
					public static ROOT: com.tom_roush.pdfbox.cos.COSName;
					public static ROTATE: com.tom_roush.pdfbox.cos.COSName;
					public static ROWS: com.tom_roush.pdfbox.cos.COSName;
					public static RUN_LENGTH_DECODE: com.tom_roush.pdfbox.cos.COSName;
					public static RUN_LENGTH_DECODE_ABBREVIATION: com.tom_roush.pdfbox.cos.COSName;
					public static SATURATION: com.tom_roush.pdfbox.cos.COSName;
					public static SCHEMA: com.tom_roush.pdfbox.cos.COSName;
					public static SCREEN: com.tom_roush.pdfbox.cos.COSName;
					public static SEPARATION: com.tom_roush.pdfbox.cos.COSName;
					public static SET_F: com.tom_roush.pdfbox.cos.COSName;
					public static SET_FF: com.tom_roush.pdfbox.cos.COSName;
					public static SHADING: com.tom_roush.pdfbox.cos.COSName;
					public static SHADING_TYPE: com.tom_roush.pdfbox.cos.COSName;
					public static SIG: com.tom_roush.pdfbox.cos.COSName;
					public static SIG_FLAGS: com.tom_roush.pdfbox.cos.COSName;
					public static SIG_REF: com.tom_roush.pdfbox.cos.COSName;
					public static SIZE: com.tom_roush.pdfbox.cos.COSName;
					public static SMASK: com.tom_roush.pdfbox.cos.COSName;
					public static SOFT_LIGHT: com.tom_roush.pdfbox.cos.COSName;
					public static SORT: com.tom_roush.pdfbox.cos.COSName;
					public static SOUND: com.tom_roush.pdfbox.cos.COSName;
					public static SPLIT: com.tom_roush.pdfbox.cos.COSName;
					public static STANDARD_ENCODING: com.tom_roush.pdfbox.cos.COSName;
					public static STATE: com.tom_roush.pdfbox.cos.COSName;
					public static STATE_MODEL: com.tom_roush.pdfbox.cos.COSName;
					public static STATUS: com.tom_roush.pdfbox.cos.COSName;
					public static STD_CF: com.tom_roush.pdfbox.cos.COSName;
					public static STEM_H: com.tom_roush.pdfbox.cos.COSName;
					public static STEM_V: com.tom_roush.pdfbox.cos.COSName;
					public static STM_F: com.tom_roush.pdfbox.cos.COSName;
					public static STR_F: com.tom_roush.pdfbox.cos.COSName;
					public static STRUCT_ELEM: com.tom_roush.pdfbox.cos.COSName;
					public static STRUCT_PARENT: com.tom_roush.pdfbox.cos.COSName;
					public static STRUCT_PARENTS: com.tom_roush.pdfbox.cos.COSName;
					public static STRUCT_TREE_ROOT: com.tom_roush.pdfbox.cos.COSName;
					public static STYLE: com.tom_roush.pdfbox.cos.COSName;
					public static SUB_FILTER: com.tom_roush.pdfbox.cos.COSName;
					public static SUBJ: com.tom_roush.pdfbox.cos.COSName;
					public static SUBJECT: com.tom_roush.pdfbox.cos.COSName;
					public static SUBJECT_DN: com.tom_roush.pdfbox.cos.COSName;
					public static SUBTYPE: com.tom_roush.pdfbox.cos.COSName;
					public static SUPPLEMENT: com.tom_roush.pdfbox.cos.COSName;
					public static SV_CERT: com.tom_roush.pdfbox.cos.COSName;
					public static SYNCHRONOUS: com.tom_roush.pdfbox.cos.COSName;
					public static TARGET: com.tom_roush.pdfbox.cos.COSName;
					public static TEMPLATES: com.tom_roush.pdfbox.cos.COSName;
					public static THREADS: com.tom_roush.pdfbox.cos.COSName;
					public static THUMB: com.tom_roush.pdfbox.cos.COSName;
					public static TILING_TYPE: com.tom_roush.pdfbox.cos.COSName;
					public static TIME_STAMP: com.tom_roush.pdfbox.cos.COSName;
					public static TITLE: com.tom_roush.pdfbox.cos.COSName;
					public static TO_UNICODE: com.tom_roush.pdfbox.cos.COSName;
					public static TR2: com.tom_roush.pdfbox.cos.COSName;
					public static TRAPPED: com.tom_roush.pdfbox.cos.COSName;
					public static TRANS: com.tom_roush.pdfbox.cos.COSName;
					public static TRANSFORM_METHOD: com.tom_roush.pdfbox.cos.COSName;
					public static TRANSFORM_PARAMS: com.tom_roush.pdfbox.cos.COSName;
					public static TRANSPARENCY: com.tom_roush.pdfbox.cos.COSName;
					public static TREF: com.tom_roush.pdfbox.cos.COSName;
					public static TRIM_BOX: com.tom_roush.pdfbox.cos.COSName;
					public static TRUE_TYPE: com.tom_roush.pdfbox.cos.COSName;
					public static TRUSTED_MODE: com.tom_roush.pdfbox.cos.COSName;
					public static TYPE: com.tom_roush.pdfbox.cos.COSName;
					public static TYPE0: com.tom_roush.pdfbox.cos.COSName;
					public static TYPE1: com.tom_roush.pdfbox.cos.COSName;
					public static TYPE3: com.tom_roush.pdfbox.cos.COSName;
					public static UNCHANGED: com.tom_roush.pdfbox.cos.COSName;
					public static UNIX: com.tom_roush.pdfbox.cos.COSName;
					public static URI: com.tom_roush.pdfbox.cos.COSName;
					public static URL: com.tom_roush.pdfbox.cos.COSName;
					public static URL_TYPE: com.tom_roush.pdfbox.cos.COSName;
					public static USER_UNIT: com.tom_roush.pdfbox.cos.COSName;
					public static VERISIGN_PPKVS: com.tom_roush.pdfbox.cos.COSName;
					public static VERSION: com.tom_roush.pdfbox.cos.COSName;
					public static VERTICES: com.tom_roush.pdfbox.cos.COSName;
					public static VERTICES_PER_ROW: com.tom_roush.pdfbox.cos.COSName;
					public static VIEW: com.tom_roush.pdfbox.cos.COSName;
					public static VIEW_AREA: com.tom_roush.pdfbox.cos.COSName;
					public static VIEW_CLIP: com.tom_roush.pdfbox.cos.COSName;
					public static VIEWER_PREFERENCES: com.tom_roush.pdfbox.cos.COSName;
					public static VOLUME: com.tom_roush.pdfbox.cos.COSName;
					public static WHITE_POINT: com.tom_roush.pdfbox.cos.COSName;
					public static WIDGET: com.tom_roush.pdfbox.cos.COSName;
					public static WIDTH: com.tom_roush.pdfbox.cos.COSName;
					public static WIDTHS: com.tom_roush.pdfbox.cos.COSName;
					public static WIN_ANSI_ENCODING: com.tom_roush.pdfbox.cos.COSName;
					public static XFA: com.tom_roush.pdfbox.cos.COSName;
					public static X_STEP: com.tom_roush.pdfbox.cos.COSName;
					public static XHEIGHT: com.tom_roush.pdfbox.cos.COSName;
					public static XOBJECT: com.tom_roush.pdfbox.cos.COSName;
					public static XREF: com.tom_roush.pdfbox.cos.COSName;
					public static XREF_STM: com.tom_roush.pdfbox.cos.COSName;
					public static Y_STEP: com.tom_roush.pdfbox.cos.COSName;
					public static YES: com.tom_roush.pdfbox.cos.COSName;
					public static ZA_DB: com.tom_roush.pdfbox.cos.COSName;
					public equals(param0: any): boolean;
					public toString(): string;
					public isEmpty(): boolean;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public static getPDFName(param0: string): com.tom_roush.pdfbox.cos.COSName;
					public getName(): string;
					public compareTo(param0: com.tom_roush.pdfbox.cos.COSName): number;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public hashCode(): number;
					public writePDF(param0: java.io.OutputStream): void;
					public static clearResources(): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSNull extends com.tom_roush.pdfbox.cos.COSBase {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSNull>;
					public static NULL_BYTES: androidNative.Array<number>;
					public static NULL: com.tom_roush.pdfbox.cos.COSNull;
					public toString(): string;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public writePDF(param0: java.io.OutputStream): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export abstract class COSNumber extends com.tom_roush.pdfbox.cos.COSBase {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSNumber>;
					public static ZERO: com.tom_roush.pdfbox.cos.COSInteger;
					public static ONE: com.tom_roush.pdfbox.cos.COSInteger;
					public intValue(): number;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public floatValue(): number;
					public longValue(): number;
					public static get(param0: string): com.tom_roush.pdfbox.cos.COSNumber;
					/** @deprecated */
					public doubleValue(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSObject extends com.tom_roush.pdfbox.cos.COSBase implements com.tom_roush.pdfbox.cos.COSUpdateInfo {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSObject>;
					public getObjectNumber(): number;
					public getGenerationNumber(): number;
					public setNeedToBeUpdated(param0: boolean): void;
					public dereferencingStarted(): void;
					public isNeedToBeUpdated(): boolean;
					public dereferencingFinished(): void;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSBase);
					public derefencingInProgress(): boolean;
					public getDictionaryObject(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSBase;
					public toString(): string;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public getItem(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSBase;
					public setObjectNumber(param0: number): void;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public getObject(): com.tom_roush.pdfbox.cos.COSBase;
					public setObject(param0: com.tom_roush.pdfbox.cos.COSBase): void;
					public setGenerationNumber(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSObjectKey extends java.lang.Comparable<com.tom_roush.pdfbox.cos.COSObjectKey> {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSObjectKey>;
					public equals(param0: any): boolean;
					public toString(): string;
					public getGeneration(): number;
					public getNumber(): number;
					/** @deprecated */
					public fixGeneration(param0: number): void;
					public hashCode(): number;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSObject);
					public constructor(param0: number, param1: number);
					public compareTo(param0: com.tom_roush.pdfbox.cos.COSObjectKey): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSOutputStream extends java.io.FilterOutputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSOutputStream>;
					public write(param0: androidNative.Array<number>): void;
					public close(): void;
					public write(param0: number): void;
					public flush(): void;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSStream extends com.tom_roush.pdfbox.cos.COSDictionary implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSStream>;
					public getLength(): number;
					/** @deprecated */
					public createFilteredStream(): java.io.OutputStream;
					public createOutputStream(param0: com.tom_roush.pdfbox.cos.COSBase): java.io.OutputStream;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public getString(param0: string, param1: string): string;
					public getString(param0: com.tom_roush.pdfbox.cos.COSName): string;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public getFilters(): com.tom_roush.pdfbox.cos.COSBase;
					public createRawOutputStream(): java.io.OutputStream;
					public close(): void;
					/** @deprecated */
					public createUnfilteredStream(): java.io.OutputStream;
					/** @deprecated */
					public setFilters(param0: com.tom_roush.pdfbox.cos.COSBase): void;
					public constructor(param0: com.tom_roush.pdfbox.io.ScratchFile);
					/** @deprecated */
					public getUnfilteredStream(): java.io.InputStream;
					public setNeedToBeUpdated(param0: boolean): void;
					/** @deprecated */
					public getFilteredStream(): java.io.InputStream;
					public getString(param0: string): string;
					public createInputStream(param0: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.cos.COSInputStream;
					public isNeedToBeUpdated(): boolean;
					public toTextString(): string;
					public createInputStream(): com.tom_roush.pdfbox.cos.COSInputStream;
					public createOutputStream(): java.io.OutputStream;
					public getCOSObject(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSObject;
					public createRawInputStream(): java.io.InputStream;
					public getString(param0: com.tom_roush.pdfbox.cos.COSName, param1: string): string;
					/** @deprecated */
					public getString(): string;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSString extends com.tom_roush.pdfbox.cos.COSBase {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSString>;
					public static FORCE_PARSING: boolean;
					public getASCII(): string;
					public constructor(param0: string);
					public setValue(param0: androidNative.Array<number>): void;
					public getString(): string;
					public setForceHexForm(param0: boolean): void;
					public equals(param0: any): boolean;
					public toString(): string;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public getForceHexForm(): boolean;
					public getBytes(): androidNative.Array<number>;
					public static parseHex(param0: string): com.tom_roush.pdfbox.cos.COSString;
					public accept(param0: com.tom_roush.pdfbox.cos.ICOSVisitor): any;
					public toHexString(): string;
					public hashCode(): number;
					public constructor(param0: androidNative.Array<number>);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class COSUpdateInfo extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.COSUpdateInfo>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.cos.COSUpdateInfo interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						isNeedToBeUpdated(): boolean;
						setNeedToBeUpdated(param0: boolean): void;
					});
					public constructor();
					public setNeedToBeUpdated(param0: boolean): void;
					public isNeedToBeUpdated(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class ICOSVisitor extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.ICOSVisitor>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.cos.ICOSVisitor interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						visitFromArray(param0: com.tom_roush.pdfbox.cos.COSArray): any;
						visitFromBoolean(param0: com.tom_roush.pdfbox.cos.COSBoolean): any;
						visitFromDictionary(param0: com.tom_roush.pdfbox.cos.COSDictionary): any;
						visitFromDocument(param0: com.tom_roush.pdfbox.cos.COSDocument): any;
						visitFromFloat(param0: com.tom_roush.pdfbox.cos.COSFloat): any;
						visitFromInt(param0: com.tom_roush.pdfbox.cos.COSInteger): any;
						visitFromName(param0: com.tom_roush.pdfbox.cos.COSName): any;
						visitFromNull(param0: com.tom_roush.pdfbox.cos.COSNull): any;
						visitFromStream(param0: com.tom_roush.pdfbox.cos.COSStream): any;
						visitFromString(param0: com.tom_roush.pdfbox.cos.COSString): any;
					});
					public constructor();
					public visitFromDocument(param0: com.tom_roush.pdfbox.cos.COSDocument): any;
					public visitFromNull(param0: com.tom_roush.pdfbox.cos.COSNull): any;
					public visitFromDictionary(param0: com.tom_roush.pdfbox.cos.COSDictionary): any;
					public visitFromArray(param0: com.tom_roush.pdfbox.cos.COSArray): any;
					public visitFromBoolean(param0: com.tom_roush.pdfbox.cos.COSBoolean): any;
					public visitFromFloat(param0: com.tom_roush.pdfbox.cos.COSFloat): any;
					public visitFromInt(param0: com.tom_roush.pdfbox.cos.COSInteger): any;
					public visitFromStream(param0: com.tom_roush.pdfbox.cos.COSStream): any;
					public visitFromString(param0: com.tom_roush.pdfbox.cos.COSString): any;
					public visitFromName(param0: com.tom_roush.pdfbox.cos.COSName): any;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class PDFDocEncoding extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.PDFDocEncoding>;
					public toString(): string;
					public static containsChar(param0: string): boolean;
					public static getBytes(param0: string): androidNative.Array<number>;
					public static toString(param0: androidNative.Array<number>): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace cos {
				export class UnmodifiableCOSDictionary extends com.tom_roush.pdfbox.cos.COSDictionary {
					public static class: java.lang.Class<com.tom_roush.pdfbox.cos.UnmodifiableCOSDictionary>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public setNeedToBeUpdated(param0: boolean): void;
					public getCOSObject(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSObject;
					public mergeInto(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
					/** @deprecated */
					public mergeInto(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public isNeedToBeUpdated(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class ASCII85Filter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.ASCII85Filter>;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class ASCII85InputStream extends java.io.FilterInputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.ASCII85InputStream>;
					public available(): number;
					public read(): number;
					public reset(): void;
					public markSupported(): boolean;
					public close(): void;
					public skip(param0: number): number;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: androidNative.Array<number>): number;
					public mark(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class ASCII85OutputStream extends java.io.FilterOutputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.ASCII85OutputStream>;
					public setLineLength(param0: number): void;
					public write(param0: androidNative.Array<number>): void;
					public close(): void;
					public getLineLength(): number;
					public setTerminator(param0: string): void;
					public getTerminator(): string;
					public write(param0: number): void;
					public flush(): void;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class ASCIIHexFilter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.ASCIIHexFilter>;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class CCITTFaxDecoderStream extends java.io.FilterInputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.CCITTFaxDecoderStream>;
					public static WHITE_CODES: androidNative.Array<androidNative.Array<number>>;
					public static WHITE_RUN_LENGTHS: androidNative.Array<androidNative.Array<number>>;
					public read(): number;
					public reset(): void;
					public constructor(param0: java.io.InputStream);
					public constructor();
					public markSupported(): boolean;
					public skip(param0: number): number;
					public close(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: androidNative.Array<number>): number;
					public constructor(param0: java.io.InputStream, param1: number, param2: number, param3: number, param4: boolean);
				}
				export namespace CCITTFaxDecoderStream {
					export class Node extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.filter.CCITTFaxDecoderStream.Node>;
						public toString(): string;
					}
					export class Tree extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.filter.CCITTFaxDecoderStream.Tree>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class CCITTFaxEncoderStream extends java.io.OutputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.CCITTFaxEncoderStream>;
					public write(param0: androidNative.Array<number>): void;
					public close(): void;
					public write(param0: number): void;
					public flush(): void;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
				}
				export namespace CCITTFaxEncoderStream {
					export class Code extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.filter.CCITTFaxEncoderStream.Code>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class CCITTFaxFilter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.CCITTFaxFilter>;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class CryptFilter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.CryptFilter>;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class DCTFilter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.DCTFilter>;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class DecodeOptions extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.DecodeOptions>;
					public static DEFAULT: com.tom_roush.pdfbox.filter.DecodeOptions;
					public setSubsamplingX(param0: number): void;
					public getSourceRegion(): globalAndroid.graphics.Rect;
					public setSubsamplingY(param0: number): void;
					public getSubsamplingOffsetY(): number;
					public setSourceRegion(param0: globalAndroid.graphics.Rect): void;
					public setSubsamplingOffsetY(param0: number): void;
					public constructor(param0: globalAndroid.graphics.Rect);
					public constructor(param0: number, param1: number, param2: number, param3: number);
					public getSubsamplingY(): number;
					public getSubsamplingOffsetX(): number;
					public setSubsamplingOffsetX(param0: number): void;
					public constructor();
					public isFilterSubsampled(): boolean;
					public getSubsamplingX(): number;
					public constructor(param0: number);
				}
				export namespace DecodeOptions {
					export class FinalDecodeOptions extends com.tom_roush.pdfbox.filter.DecodeOptions {
						public static class: java.lang.Class<com.tom_roush.pdfbox.filter.DecodeOptions.FinalDecodeOptions>;
						public setSubsamplingOffsetY(param0: number): void;
						public setSubsamplingX(param0: number): void;
						public setSubsamplingY(param0: number): void;
						public setSourceRegion(param0: globalAndroid.graphics.Rect): void;
						public setSubsamplingOffsetX(param0: number): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class DecodeResult extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.DecodeResult>;
					public static DEFAULT: com.tom_roush.pdfbox.filter.DecodeResult;
					public getJPXColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDJPXColorSpace;
					public getParameters(): com.tom_roush.pdfbox.cos.COSDictionary;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export abstract class Filter extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.Filter>;
					public static SYSPROP_DEFLATELEVEL: string = "com.tom_roush.pdfbox.filter.deflatelevel";
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public static getCompressionLevel(): number;
					public getDecodeParams(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: number): com.tom_roush.pdfbox.cos.COSDictionary;
					public constructor();
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class FilterFactory extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.FilterFactory>;
					public static INSTANCE: com.tom_roush.pdfbox.filter.FilterFactory;
					public getFilter(param0: string): com.tom_roush.pdfbox.filter.Filter;
					public getFilter(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.filter.Filter;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class FlateFilter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.FlateFilter>;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class IdentityFilter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.IdentityFilter>;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class JPXFilter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.JPXFilter>;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public constructor();
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class LZWFilter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.LZWFilter>;
					public static CLEAR_TABLE: number = 256;
					public static EOD: number = 257;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public constructor();
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class MissingImageReaderException extends java.io.IOException {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.MissingImageReaderException>;
					public constructor(param0: string, param1: java.lang.Throwable, param2: boolean, param3: boolean);
					public constructor(param0: string, param1: java.lang.Throwable);
					public constructor(param0: string);
					public constructor(param0: java.lang.Throwable);
					public constructor();
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class Predictor extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.Predictor>;
				}
				export namespace Predictor {
					export class PredictorOutputStream extends java.io.FilterOutputStream {
						public static class: java.lang.Class<com.tom_roush.pdfbox.filter.Predictor.PredictorOutputStream>;
						public close(): void;
						public write(param0: number): void;
						public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
						public flush(): void;
						public write(param0: androidNative.Array<number>): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class RunLengthDecodeFilter extends com.tom_roush.pdfbox.filter.Filter {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.RunLengthDecodeFilter>;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public decode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number, param4: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.filter.DecodeResult;
					public encode(param0: java.io.InputStream, param1: java.io.OutputStream, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace filter {
				export class TIFFExtension extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.filter.TIFFExtension>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.filter.TIFFExtension interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
					});
					public constructor();
					public static COMPRESSION_DEFLATE: number = 32946;
					public static FILL_RIGHT_TO_LEFT: number = 2;
					public static SAMPLEFORMAT_FP: number = 3;
					public static SAMPLEFORMAT_UNDEFINED: number = 4;
					public static GROUP3OPT_FILLBITS: number = 4;
					public static COMPRESSION_JPEG: number = 7;
					public static PHOTOMETRIC_CIELAB: number = 8;
					public static GROUP4OPT_UNCOMPRESSED: number = 2;
					public static ORIENTATION_BOTRIGHT: number = 3;
					public static ORIENTATION_RIGHTTOP: number = 6;
					public static COMPRESSION_OLD_JPEG: number = 6;
					public static PHOTOMETRIC_YCBCR: number = 6;
					public static ORIENTATION_LEFTTOP: number = 5;
					public static PREDICTOR_HORIZONTAL_DIFFERENCING: number = 2;
					public static YCBCR_POSITIONING_CENTERED: number = 1;
					public static PREDICTOR_HORIZONTAL_FLOATINGPOINT: number = 3;
					public static PHOTOMETRIC_SEPARATED: number = 5;
					public static ORIENTATION_LEFTBOT: number = 8;
					public static GROUP3OPT_BYTEALIGNED: number = 8;
					public static ORIENTATION_TOPRIGHT: number = 2;
					public static ORIENTATION_BOTLEFT: number = 4;
					public static ORIENTATION_RIGHTBOT: number = 7;
					public static GROUP3OPT_UNCOMPRESSED: number = 2;
					public static JPEG_PROC_BASELINE: number = 1;
					public static PHOTOMETRIC_ICCLAB: number = 9;
					public static JPEG_PROC_LOSSLESS: number = 14;
					public static COMPRESSION_CCITT_T6: number = 4;
					public static SAMPLEFORMAT_INT: number = 2;
					public static PLANARCONFIG_PLANAR: number = 2;
					public static PHOTOMETRIC_ITULAB: number = 10;
					public static GROUP4OPT_BYTEALIGNED: number = 4;
					public static FILL_LEFT_TO_RIGHT: number = 1;
					public static COMPRESSION_LZW: number = 5;
					public static GROUP3OPT_2DENCODING: number = 1;
					public static COMPRESSION_CCITT_MODIFIED_HUFFMAN_RLE: number = 2;
					public static YCBCR_POSITIONING_COSITED: number = 2;
					public static INKSET_CMYK: number = 1;
					public static COMPRESSION_CCITT_T4: number = 3;
					public static COMPRESSION_ZLIB: number = 8;
					public static INKSET_NOT_CMYK: number = 2;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class IOUtils extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.IOUtils>;
					public static populateBuffer(param0: java.io.InputStream, param1: androidNative.Array<number>): number;
					public static closeQuietly(param0: java.io.Closeable): void;
					public static toByteArray(param0: java.io.InputStream): androidNative.Array<number>;
					public static copy(param0: java.io.InputStream, param1: java.io.OutputStream): number;
					public static closeAndLogException(param0: java.io.Closeable, param1: string, param2: java.io.IOException): java.io.IOException;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class MemoryUsageSetting extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.MemoryUsageSetting>;
					public getPartitionedCopy(param0: number): com.tom_roush.pdfbox.io.MemoryUsageSetting;
					public getMaxStorageBytes(): number;
					public static setupTempFileOnly(): com.tom_roush.pdfbox.io.MemoryUsageSetting;
					public static setupTempFileOnly(param0: number): com.tom_roush.pdfbox.io.MemoryUsageSetting;
					public getTempDir(): java.io.File;
					public isMainMemoryRestricted(): boolean;
					public static setupMainMemoryOnly(): com.tom_roush.pdfbox.io.MemoryUsageSetting;
					public getMaxMainMemoryBytes(): number;
					public toString(): string;
					public static setupMixed(param0: number, param1: number): com.tom_roush.pdfbox.io.MemoryUsageSetting;
					public setTempDir(param0: java.io.File): com.tom_roush.pdfbox.io.MemoryUsageSetting;
					public static setupMixed(param0: number): com.tom_roush.pdfbox.io.MemoryUsageSetting;
					public useMainMemory(): boolean;
					public static setupMainMemoryOnly(param0: number): com.tom_roush.pdfbox.io.MemoryUsageSetting;
					public useTempFile(): boolean;
					public isStorageRestricted(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class RandomAccess extends java.lang.Object implements com.tom_roush.pdfbox.io.RandomAccessRead, com.tom_roush.pdfbox.io.RandomAccessWrite {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.RandomAccess>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.io.RandomAccess interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						read(): number;
						read(param0: androidNative.Array<number>): number;
						read(param0: androidNative.Array<number>, param1: number, param2: number): number;
						getPosition(): number;
						seek(param0: number): void;
						length(): number;
						isClosed(): boolean;
						peek(): number;
						rewind(param0: number): void;
						readFully(param0: number): androidNative.Array<number>;
						isEOF(): boolean;
						available(): number;
						write(param0: number): void;
						write(param0: androidNative.Array<number>): void;
						write(param0: androidNative.Array<number>, param1: number, param2: number): void;
						clear(): void;
						close(): void;
						close(): void;
						close(): void;
						close(): void;
					});
					public constructor();
					public read(): number;
					public readFully(param0: number): androidNative.Array<number>;
					public rewind(param0: number): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public write(param0: number): void;
					public length(): number;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public available(): number;
					public isEOF(): boolean;
					public peek(): number;
					public write(param0: androidNative.Array<number>): void;
					public clear(): void;
					public close(): void;
					public seek(param0: number): void;
					public read(param0: androidNative.Array<number>): number;
					public getPosition(): number;
					public isClosed(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class RandomAccessBuffer extends java.lang.Object implements com.tom_roush.pdfbox.io.RandomAccess, java.lang.Cloneable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.RandomAccessBuffer>;
					public read(): number;
					public readFully(param0: number): androidNative.Array<number>;
					public rewind(param0: number): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public write(param0: number): void;
					public length(): number;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public available(): number;
					public clone(): any;
					public isEOF(): boolean;
					public constructor(param0: java.io.InputStream);
					public clone(): com.tom_roush.pdfbox.io.RandomAccessBuffer;
					public constructor();
					public peek(): number;
					public write(param0: androidNative.Array<number>): void;
					public close(): void;
					public clear(): void;
					public seek(param0: number): void;
					public constructor(param0: androidNative.Array<number>);
					public getPosition(): number;
					public read(param0: androidNative.Array<number>): number;
					public isClosed(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class RandomAccessBufferedFileInputStream extends java.io.InputStream implements com.tom_roush.pdfbox.io.RandomAccessRead {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.RandomAccessBufferedFileInputStream>;
					public read(): number;
					public readFully(param0: number): androidNative.Array<number>;
					public rewind(param0: number): void;
					public constructor(param0: string);
					public skip(param0: number): number;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public length(): number;
					public available(): number;
					public isEOF(): boolean;
					public constructor(param0: java.io.InputStream);
					public constructor();
					public peek(): number;
					public close(): void;
					public seek(param0: number): void;
					public getPosition(): number;
					public read(param0: androidNative.Array<number>): number;
					public constructor(param0: java.io.File);
					public isClosed(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class RandomAccessFile extends java.lang.Object implements com.tom_roush.pdfbox.io.RandomAccess {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.RandomAccessFile>;
					public read(): number;
					public readFully(param0: number): androidNative.Array<number>;
					public rewind(param0: number): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public write(param0: number): void;
					public length(): number;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public available(): number;
					public isEOF(): boolean;
					public peek(): number;
					public write(param0: androidNative.Array<number>): void;
					public close(): void;
					public clear(): void;
					public seek(param0: number): void;
					public getPosition(): number;
					public read(param0: androidNative.Array<number>): number;
					public constructor(param0: java.io.File, param1: string);
					public isClosed(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class RandomAccessInputStream extends java.io.InputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.RandomAccessInputStream>;
					public available(): number;
					public read(): number;
					public constructor();
					public skip(param0: number): number;
					public close(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: androidNative.Array<number>): number;
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class RandomAccessOutputStream extends java.io.OutputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.RandomAccessOutputStream>;
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessWrite);
					public constructor();
					public write(param0: androidNative.Array<number>): void;
					public close(): void;
					public write(param0: number): void;
					public flush(): void;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class RandomAccessRead extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.RandomAccessRead>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.io.RandomAccessRead interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						read(): number;
						read(param0: androidNative.Array<number>): number;
						read(param0: androidNative.Array<number>, param1: number, param2: number): number;
						getPosition(): number;
						seek(param0: number): void;
						length(): number;
						isClosed(): boolean;
						peek(): number;
						rewind(param0: number): void;
						readFully(param0: number): androidNative.Array<number>;
						isEOF(): boolean;
						available(): number;
						close(): void;
						close(): void;
					});
					public constructor();
					public read(): number;
					public readFully(param0: number): androidNative.Array<number>;
					public rewind(param0: number): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public length(): number;
					public available(): number;
					public isEOF(): boolean;
					public peek(): number;
					public close(): void;
					public seek(param0: number): void;
					public read(param0: androidNative.Array<number>): number;
					public getPosition(): number;
					public isClosed(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class RandomAccessWrite extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.RandomAccessWrite>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.io.RandomAccessWrite interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						write(param0: number): void;
						write(param0: androidNative.Array<number>): void;
						write(param0: androidNative.Array<number>, param1: number, param2: number): void;
						clear(): void;
						close(): void;
						close(): void;
					});
					public constructor();
					public write(param0: androidNative.Array<number>): void;
					public clear(): void;
					public close(): void;
					public write(param0: number): void;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class ScratchFile extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.ScratchFile>;
					public createBuffer(): com.tom_roush.pdfbox.io.RandomAccess;
					public constructor(param0: com.tom_roush.pdfbox.io.MemoryUsageSetting);
					public static getMainMemoryOnlyInstance(): com.tom_roush.pdfbox.io.ScratchFile;
					public createBuffer(param0: java.io.InputStream): com.tom_roush.pdfbox.io.RandomAccess;
					public close(): void;
					public constructor(param0: java.io.File);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class ScratchFileBuffer extends java.lang.Object implements com.tom_roush.pdfbox.io.RandomAccess {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.ScratchFileBuffer>;
					public read(): number;
					public readFully(param0: number): androidNative.Array<number>;
					public rewind(param0: number): void;
					public finalize(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public write(param0: number): void;
					public length(): number;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public available(): number;
					public isEOF(): boolean;
					public peek(): number;
					public write(param0: androidNative.Array<number>): void;
					public clear(): void;
					public close(): void;
					public seek(param0: number): void;
					public getPosition(): number;
					public read(param0: androidNative.Array<number>): number;
					public isClosed(): boolean;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace io {
				export class SequentialRead extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.io.SequentialRead>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.io.SequentialRead interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						read(): number;
						read(param0: androidNative.Array<number>): number;
						read(param0: androidNative.Array<number>, param1: number, param2: number): number;
						close(): void;
						close(): void;
					});
					public constructor();
					public read(): number;
					public close(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: androidNative.Array<number>): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace multipdf {
				export class LayerUtility extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.LayerUtility>;
					public importPageAsForm(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: number): com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject;
					public appendFormAsLayer(param0: com.tom_roush.pdfbox.pdmodel.PDPage, param1: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param2: com.tom_roush.harmony.awt.geom.AffineTransform, param3: string): com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup;
					public importPageAsForm(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.PDPage): com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject;
					public wrapInSaveRestore(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
					public getDocument(): com.tom_roush.pdfbox.pdmodel.PDDocument;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace multipdf {
				export class Overlay extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.Overlay>;
					public setDefaultOverlayFile(param0: string): void;
					public setAllPagesOverlayFile(param0: string): void;
					public setInputPDF(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public setOddPageOverlayFile(param0: string): void;
					public setFirstPageOverlayPDF(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public setEvenPageOverlayFile(param0: string): void;
					public setEvenPageOverlayPDF(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public setDefaultOverlayPDF(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public constructor();
					public setInputFile(param0: string): void;
					public overlay(param0: java.util.Map<java.lang.Integer,string>): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public setLastPageOverlayFile(param0: string): void;
					public setAllPagesOverlayPDF(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public close(): void;
					public setLastPageOverlayPDF(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public overlayDocuments(param0: java.util.Map<java.lang.Integer,com.tom_roush.pdfbox.pdmodel.PDDocument>): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public getInputFile(): string;
					public setFirstPageOverlayFile(param0: string): void;
					public setOverlayPosition(param0: com.tom_roush.pdfbox.multipdf.Overlay.Position): void;
					public getDefaultOverlayFile(): string;
					public calculateAffineTransform(param0: com.tom_roush.pdfbox.pdmodel.PDPage, param1: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): com.tom_roush.harmony.awt.geom.AffineTransform;
					public setOddPageOverlayPDF(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
				}
				export namespace Overlay {
					export class LayoutPage extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.Overlay.LayoutPage>;
					}
					export class Position {
						public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.Overlay.Position>;
						public static FOREGROUND: com.tom_roush.pdfbox.multipdf.Overlay.Position;
						public static BACKGROUND: com.tom_roush.pdfbox.multipdf.Overlay.Position;
						public static valueOf(param0: string): com.tom_roush.pdfbox.multipdf.Overlay.Position;
						public static values(): androidNative.Array<com.tom_roush.pdfbox.multipdf.Overlay.Position>;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace multipdf {
				export class PDFCloneUtility extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.PDFCloneUtility>;
					public cloneMerge(param0: com.tom_roush.pdfbox.pdmodel.common.COSObjectable, param1: com.tom_roush.pdfbox.pdmodel.common.COSObjectable): void;
					public getDestination(): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public cloneForNewDocument(param0: any): com.tom_roush.pdfbox.cos.COSBase;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace multipdf {
				export class PDFMergerUtility extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.PDFMergerUtility>;
					public setDestinationDocumentInformation(param0: com.tom_roush.pdfbox.pdmodel.PDDocumentInformation): void;
					public setDestinationFileName(param0: string): void;
					public setIgnoreAcroFormErrors(param0: boolean): void;
					public getDestinationStream(): java.io.OutputStream;
					public setAcroFormMergeMode(param0: com.tom_roush.pdfbox.multipdf.PDFMergerUtility.AcroFormMergeMode): void;
					public getDestinationDocumentInformation(): com.tom_roush.pdfbox.pdmodel.PDDocumentInformation;
					public setDestinationMetadata(param0: com.tom_roush.pdfbox.pdmodel.common.PDMetadata): void;
					/** @deprecated */
					public mergeDocuments(): void;
					public setDocumentMergeMode(param0: com.tom_roush.pdfbox.multipdf.PDFMergerUtility.DocumentMergeMode): void;
					public addSource(param0: java.io.File): void;
					public addSources(param0: java.util.List<java.io.InputStream>): void;
					public getDestinationFileName(): string;
					public getAcroFormMergeMode(): com.tom_roush.pdfbox.multipdf.PDFMergerUtility.AcroFormMergeMode;
					public constructor();
					public getDocumentMergeMode(): com.tom_roush.pdfbox.multipdf.PDFMergerUtility.DocumentMergeMode;
					public appendDocument(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public isIgnoreAcroFormErrors(): boolean;
					public addSource(param0: string): void;
					public mergeDocuments(param0: com.tom_roush.pdfbox.io.MemoryUsageSetting): void;
					public setDestinationStream(param0: java.io.OutputStream): void;
					public addSource(param0: java.io.InputStream): void;
					public getDestinationMetadata(): com.tom_roush.pdfbox.pdmodel.common.PDMetadata;
				}
				export namespace PDFMergerUtility {
					export class AcroFormMergeMode {
						public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.PDFMergerUtility.AcroFormMergeMode>;
						public static JOIN_FORM_FIELDS_MODE: com.tom_roush.pdfbox.multipdf.PDFMergerUtility.AcroFormMergeMode;
						public static PDFBOX_LEGACY_MODE: com.tom_roush.pdfbox.multipdf.PDFMergerUtility.AcroFormMergeMode;
						public static valueOf(param0: string): com.tom_roush.pdfbox.multipdf.PDFMergerUtility.AcroFormMergeMode;
						public static values(): androidNative.Array<com.tom_roush.pdfbox.multipdf.PDFMergerUtility.AcroFormMergeMode>;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
					}
					export class DocumentMergeMode {
						public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.PDFMergerUtility.DocumentMergeMode>;
						public static OPTIMIZE_RESOURCES_MODE: com.tom_roush.pdfbox.multipdf.PDFMergerUtility.DocumentMergeMode;
						public static PDFBOX_LEGACY_MODE: com.tom_roush.pdfbox.multipdf.PDFMergerUtility.DocumentMergeMode;
						public static valueOf(param0: string): com.tom_roush.pdfbox.multipdf.PDFMergerUtility.DocumentMergeMode;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): androidNative.Array<com.tom_roush.pdfbox.multipdf.PDFMergerUtility.DocumentMergeMode>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace multipdf {
				export class PageExtractor extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.PageExtractor>;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: number, param2: number);
					public setStartPage(param0: number): void;
					public getStartPage(): number;
					public extract(): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
					public setEndPage(param0: number): void;
					public getEndPage(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace multipdf {
				export class Splitter extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.multipdf.Splitter>;
					public processPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public getMemoryUsageSetting(): com.tom_roush.pdfbox.io.MemoryUsageSetting;
					public setStartPage(param0: number): void;
					public getDestinationDocument(): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public constructor();
					public setMemoryUsageSetting(param0: com.tom_roush.pdfbox.io.MemoryUsageSetting): void;
					public split(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): java.util.List<com.tom_roush.pdfbox.pdmodel.PDDocument>;
					public createNewDocument(): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public getSourceDocument(): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public setSplitAtPage(param0: number): void;
					public splitAtPage(param0: number): boolean;
					public setEndPage(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export abstract class BaseParser extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.BaseParser>;
					public static R: number = 114;
					public static DEF: string = "def";
					public static ENDOBJ_STRING: string = "endobj";
					public static ENDSTREAM_STRING: string = "endstream";
					public static STREAM_STRING: string = "stream";
					public static ASCII_LF: number = 10;
					public static ASCII_CR: number = 13;
					public document: com.tom_roush.pdfbox.cos.COSDocument;
					public readLine(): string;
					public readString(param0: number): string;
					public readExpectedString(param0: androidNative.Array<string>, param1: boolean): void;
					public isSpace(param0: number): boolean;
					public readLong(): number;
					public parseCOSArray(): com.tom_roush.pdfbox.cos.COSArray;
					public skipSpaces(): void;
					public isEOL(param0: number): boolean;
					public isWhitespace(param0: number): boolean;
					public readExpectedString(param0: string): void;
					public readGenerationNumber(): number;
					public parseCOSName(): com.tom_roush.pdfbox.cos.COSName;
					public readInt(): number;
					public parseBoolean(): com.tom_roush.pdfbox.cos.COSBoolean;
					public isDigit(): boolean;
					public skipWhiteSpaces(): void;
					public isClosing(): boolean;
					public readObjectNumber(): number;
					public isClosing(param0: number): boolean;
					public isEndOfName(param0: number): boolean;
					public readExpectedChar(param0: string): void;
					public isSpace(): boolean;
					public static isDigit(param0: number): boolean;
					public isWhitespace(): boolean;
					public parseCOSDictionary(): com.tom_roush.pdfbox.cos.COSDictionary;
					public parseDirObject(): com.tom_roush.pdfbox.cos.COSBase;
					public parseCOSString(): com.tom_roush.pdfbox.cos.COSString;
					public isEOL(): boolean;
					public readStringNumber(): java.lang.StringBuilder;
					public readString(): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class COSParser extends com.tom_roush.pdfbox.pdfparser.BaseParser {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.COSParser>;
					public source: com.tom_roush.pdfbox.io.RandomAccessRead;
					public static SYSPROP_PARSEMINIMAL: string = "com.tom_roush.pdfbox.pdfparser.nonSequentialPDFParser.parseMinimal";
					public static SYSPROP_EOFLOOKUPRANGE: string = "com.tom_roush.pdfbox.pdfparser.nonSequentialPDFParser.eofLookupRange";
					public static EOF_MARKER: androidNative.Array<string>;
					public static OBJ_MARKER: androidNative.Array<string>;
					public fileLen: number;
					public initialParseDone: boolean;
					public securityHandler: com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandler;
					public xrefTrailerResolver: com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver;
					public static TMP_FILE_PREFIX: string = "tmpPDF";
					public parseXrefTable(param0: number): boolean;
					public parseObjectDynamically(param0: com.tom_roush.pdfbox.cos.COSObject, param1: boolean): com.tom_roush.pdfbox.cos.COSBase;
					public isCatalog(param0: com.tom_roush.pdfbox.cos.COSDictionary): boolean;
					public isLenient(): boolean;
					public checkPages(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public parseFDFHeader(): boolean;
					public getDocument(): com.tom_roush.pdfbox.cos.COSDocument;
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead, param1: string, param2: java.io.InputStream, param3: string);
					public getEncryption(): com.tom_roush.pdfbox.pdmodel.encryption.PDEncryption;
					public parseCOSStream(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.cos.COSStream;
					public setLenient(param0: boolean): void;
					public retrieveTrailer(): com.tom_roush.pdfbox.cos.COSDictionary;
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead);
					public setEOFLookupRange(param0: number): void;
					public parseDictObjects(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: androidNative.Array<com.tom_roush.pdfbox.cos.COSName>): void;
					public parseTrailerValuesDynamically(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.cos.COSBase;
					public parseObjectDynamically(param0: number, param1: number, param2: boolean): com.tom_roush.pdfbox.cos.COSBase;
					public lastIndexOf(param0: androidNative.Array<string>, param1: androidNative.Array<number>, param2: number): number;
					public rebuildTrailer(): com.tom_roush.pdfbox.cos.COSDictionary;
					public getStartxrefOffset(): number;
					public getAccessPermission(): com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission;
					public parsePDFHeader(): boolean;
					public parseXref(param0: number): com.tom_roush.pdfbox.cos.COSDictionary;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class EndstreamOutputStream extends java.io.BufferedOutputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.EndstreamOutputStream>;
					public write(param0: androidNative.Array<number>): void;
					public close(): void;
					public write(param0: number): void;
					public flush(): void;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class FDFParser extends com.tom_roush.pdfbox.pdfparser.COSParser {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.FDFParser>;
					public isCatalog(param0: com.tom_roush.pdfbox.cos.COSDictionary): boolean;
					public parse(): void;
					public constructor(param0: string);
					public constructor(param0: java.io.InputStream);
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead, param1: string, param2: java.io.InputStream, param3: string);
					public constructor(param0: java.io.File);
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class InputStreamSource extends java.lang.Object implements com.tom_roush.pdfbox.pdfparser.SequentialSource {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.InputStreamSource>;
					public unread(param0: androidNative.Array<number>): void;
					public read(): number;
					public unread(param0: number): void;
					public readFully(param0: number): androidNative.Array<number>;
					public isEOF(): boolean;
					public peek(): number;
					public unread(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public close(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: androidNative.Array<number>): number;
					public getPosition(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class PDFObjectStreamParser extends com.tom_roush.pdfbox.pdfparser.BaseParser {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFObjectStreamParser>;
					public parse(): void;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.cos.COSDocument);
					public getObjects(): java.util.List<com.tom_roush.pdfbox.cos.COSObject>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class PDFParser extends com.tom_roush.pdfbox.pdfparser.COSParser {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFParser>;
					public getPDDocument(): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public parse(): void;
					public initialParse(): void;
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead, param1: string, param2: java.io.InputStream, param3: string);
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead, param1: string);
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead, param1: com.tom_roush.pdfbox.io.ScratchFile);
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead, param1: string, param2: java.io.InputStream, param3: string, param4: com.tom_roush.pdfbox.io.ScratchFile);
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead, param1: string, param2: com.tom_roush.pdfbox.io.ScratchFile);
					public constructor(param0: com.tom_roush.pdfbox.io.RandomAccessRead);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class PDFStreamParser extends com.tom_roush.pdfbox.pdfparser.BaseParser {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFStreamParser>;
					public parse(): void;
					public parseNextToken(): any;
					public getTokens(): java.util.List<any>;
					public readOperator(): string;
					/** @deprecated */
					public constructor(param0: com.tom_roush.pdfbox.cos.COSStream);
					/** @deprecated */
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream);
					public constructor(param0: com.tom_roush.pdfbox.contentstream.PDContentStream);
					public constructor(param0: androidNative.Array<number>);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class PDFXRef extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFXRef>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.pdfparser.PDFXRef interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getObject(param0: number): com.tom_roush.pdfbox.cos.COSObject;
					});
					public constructor();
					public getObject(param0: number): com.tom_roush.pdfbox.cos.COSObject;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class PDFXRefStream extends java.lang.Object implements com.tom_roush.pdfbox.pdfparser.PDFXRef {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFXRefStream>;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDocument);
					/** @deprecated */
					public constructor();
					public getStream(): com.tom_roush.pdfbox.cos.COSStream;
					public addTrailerInfo(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public setSize(param0: number): void;
					public getObject(param0: number): com.tom_roush.pdfbox.cos.COSObject;
					public addEntry(param0: com.tom_roush.pdfbox.pdfwriter.COSWriterXRefEntry): void;
				}
				export namespace PDFXRefStream {
					export class FreeReference extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFXRefStream.FreeReference>;
					}
					export class NormalReference extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFXRefStream.NormalReference>;
					}
					export class ObjectStreamReference extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFXRefStream.ObjectStreamReference>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class PDFXrefStreamParser extends com.tom_roush.pdfbox.pdfparser.BaseParser {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFXrefStreamParser>;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.cos.COSDocument, param2: com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver);
					public parse(): void;
				}
				export namespace PDFXrefStreamParser {
					export class ObjectNumbers extends java.util.Iterator<java.lang.Long> {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.PDFXrefStreamParser.ObjectNumbers>;
						public hasNext(): boolean;
						public next(): java.lang.Long;
						public remove(): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class RandomAccessSource extends java.lang.Object implements com.tom_roush.pdfbox.pdfparser.SequentialSource {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.RandomAccessSource>;
					public unread(param0: androidNative.Array<number>): void;
					public read(): number;
					public unread(param0: number): void;
					public readFully(param0: number): androidNative.Array<number>;
					public isEOF(): boolean;
					public peek(): number;
					public unread(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public close(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: androidNative.Array<number>): number;
					public getPosition(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class SequentialSource extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.SequentialSource>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.pdfparser.SequentialSource interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						read(): number;
						read(param0: androidNative.Array<number>): number;
						read(param0: androidNative.Array<number>, param1: number, param2: number): number;
						getPosition(): number;
						peek(): number;
						unread(param0: number): void;
						unread(param0: androidNative.Array<number>): void;
						unread(param0: androidNative.Array<number>, param1: number, param2: number): void;
						readFully(param0: number): androidNative.Array<number>;
						isEOF(): boolean;
						close(): void;
						close(): void;
					});
					public constructor();
					public unread(param0: androidNative.Array<number>): void;
					public read(): number;
					public unread(param0: number): void;
					public readFully(param0: number): androidNative.Array<number>;
					public isEOF(): boolean;
					public peek(): number;
					public unread(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public close(): void;
					public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
					public read(param0: androidNative.Array<number>): number;
					public getPosition(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfparser {
				export class XrefTrailerResolver extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver>;
					public reset(): void;
					public setTrailer(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public getFirstTrailer(): com.tom_roush.pdfbox.cos.COSDictionary;
					public setXRef(param0: com.tom_roush.pdfbox.cos.COSObjectKey, param1: number): void;
					public setStartxref(param0: number): void;
					public getXrefTable(): java.util.Map<com.tom_roush.pdfbox.cos.COSObjectKey,java.lang.Long>;
					public getTrailerCount(): number;
					public getLastTrailer(): com.tom_roush.pdfbox.cos.COSDictionary;
					public constructor();
					public getXrefType(): com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver.XRefType;
					public getCurrentTrailer(): com.tom_roush.pdfbox.cos.COSDictionary;
					public getContainedObjectNumbers(param0: number): java.util.Set<java.lang.Long>;
					public getTrailer(): com.tom_roush.pdfbox.cos.COSDictionary;
					public nextXrefObj(param0: number, param1: com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver.XRefType): void;
				}
				export namespace XrefTrailerResolver {
					export class XRefType {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver.XRefType>;
						public static TABLE: com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver.XRefType;
						public static STREAM: com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver.XRefType;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static valueOf(param0: string): com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver.XRefType;
						public static values(): androidNative.Array<com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver.XRefType>;
					}
					export class XrefTrailerObj extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdfparser.XrefTrailerResolver.XrefTrailerObj>;
						public trailer: com.tom_roush.pdfbox.cos.COSDictionary;
						public reset(): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfwriter {
				export class COSStandardOutputStream extends java.io.FilterOutputStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfwriter.COSStandardOutputStream>;
					public static CRLF: androidNative.Array<number>;
					public static EOL: androidNative.Array<number>;
					public constructor(param0: java.io.OutputStream);
					/** @deprecated */
					public constructor(param0: java.io.OutputStream, param1: number);
					public constructor(param0: java.io.OutputStream, param1: number);
					public setOnNewLine(param0: boolean): void;
					public write(param0: number): void;
					public flush(): void;
					public getPos(): number;
					public writeEOL(): void;
					public write(param0: androidNative.Array<number>, param1: number, param2: number): void;
					public isOnNewLine(): boolean;
					public constructor();
					public write(param0: androidNative.Array<number>): void;
					public writeCRLF(): void;
					public close(): void;
					public writeLF(): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfwriter {
				export class COSWriter extends java.lang.Object implements com.tom_roush.pdfbox.cos.ICOSVisitor, java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfwriter.COSWriter>;
					public static DICT_OPEN: androidNative.Array<number>;
					public static DICT_CLOSE: androidNative.Array<number>;
					public static SPACE: androidNative.Array<number>;
					public static COMMENT: androidNative.Array<number>;
					public static VERSION: androidNative.Array<number>;
					public static GARBAGE: androidNative.Array<number>;
					public static EOF: androidNative.Array<number>;
					public static REFERENCE: androidNative.Array<number>;
					public static XREF: androidNative.Array<number>;
					public static XREF_FREE: androidNative.Array<number>;
					public static XREF_USED: androidNative.Array<number>;
					public static TRAILER: androidNative.Array<number>;
					public static STARTXREF: androidNative.Array<number>;
					public static OBJ: androidNative.Array<number>;
					public static ENDOBJ: androidNative.Array<number>;
					public static ARRAY_OPEN: androidNative.Array<number>;
					public static ARRAY_CLOSE: androidNative.Array<number>;
					public static STREAM: androidNative.Array<number>;
					public static ENDSTREAM: androidNative.Array<number>;
					public constructor(param0: java.io.OutputStream, param1: com.tom_roush.pdfbox.io.RandomAccessRead);
					public constructor(param0: java.io.OutputStream);
					public getNumber(): number;
					public getStartxref(): number;
					public setNumber(param0: number): void;
					public visitFromStream(param0: com.tom_roush.pdfbox.cos.COSStream): any;
					public static writeString(param0: androidNative.Array<number>, param1: java.io.OutputStream): void;
					public visitFromName(param0: com.tom_roush.pdfbox.cos.COSName): any;
					public writeExternalSignature(param0: androidNative.Array<number>): void;
					public constructor(param0: java.io.OutputStream, param1: com.tom_roush.pdfbox.io.RandomAccessRead, param2: java.util.Set<com.tom_roush.pdfbox.cos.COSDictionary>);
					public doWriteHeader(param0: com.tom_roush.pdfbox.cos.COSDocument): void;
					public write(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public getXRefEntries(): java.util.List<com.tom_roush.pdfbox.pdfwriter.COSWriterXRefEntry>;
					public write(param0: com.tom_roush.pdfbox.cos.COSDocument): void;
					public getObjectKeys(): java.util.Map<com.tom_roush.pdfbox.cos.COSBase,com.tom_roush.pdfbox.cos.COSObjectKey>;
					public visitFromNull(param0: com.tom_roush.pdfbox.cos.COSNull): any;
					public close(): void;
					public visitFromDictionary(param0: com.tom_roush.pdfbox.cos.COSDictionary): any;
					public visitFromArray(param0: com.tom_roush.pdfbox.cos.COSArray): any;
					public doWriteTrailer(param0: com.tom_roush.pdfbox.cos.COSDocument): void;
					public visitFromInt(param0: com.tom_roush.pdfbox.cos.COSInteger): any;
					public getXRefRanges(param0: java.util.List<com.tom_roush.pdfbox.pdfwriter.COSWriterXRefEntry>): androidNative.Array<java.lang.Long>;
					public doWriteObject(param0: com.tom_roush.pdfbox.cos.COSBase): void;
					public write(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureInterface): void;
					public setStartxref(param0: number): void;
					public getStandardOutput(): com.tom_roush.pdfbox.pdfwriter.COSStandardOutputStream;
					public visitFromString(param0: com.tom_roush.pdfbox.cos.COSString): any;
					public addXRefEntry(param0: com.tom_roush.pdfbox.pdfwriter.COSWriterXRefEntry): void;
					public doWriteBody(param0: com.tom_roush.pdfbox.cos.COSDocument): void;
					public writeReference(param0: com.tom_roush.pdfbox.cos.COSBase): void;
					public getOutput(): java.io.OutputStream;
					public getDataToSign(): java.io.InputStream;
					public visitFromDocument(param0: com.tom_roush.pdfbox.cos.COSDocument): any;
					public visitFromBoolean(param0: com.tom_roush.pdfbox.cos.COSBoolean): any;
					public visitFromFloat(param0: com.tom_roush.pdfbox.cos.COSFloat): any;
					public static writeString(param0: com.tom_roush.pdfbox.cos.COSString, param1: java.io.OutputStream): void;
					public write(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfwriter {
				export class COSWriterXRefEntry extends java.lang.Comparable<com.tom_roush.pdfbox.pdfwriter.COSWriterXRefEntry> {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfwriter.COSWriterXRefEntry>;
					public constructor(param0: number, param1: com.tom_roush.pdfbox.cos.COSBase, param2: com.tom_roush.pdfbox.cos.COSObjectKey);
					public isFree(): boolean;
					public compareTo(param0: com.tom_roush.pdfbox.pdfwriter.COSWriterXRefEntry): number;
					public setOffset(param0: number): void;
					public getOffset(): number;
					public getObject(): com.tom_roush.pdfbox.cos.COSBase;
					public setFree(param0: boolean): void;
					public getKey(): com.tom_roush.pdfbox.cos.COSObjectKey;
					public static getNullEntry(): com.tom_roush.pdfbox.pdfwriter.COSWriterXRefEntry;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdfwriter {
				export class ContentStreamWriter extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdfwriter.ContentStreamWriter>;
					public static SPACE: androidNative.Array<number>;
					public static EOL: androidNative.Array<number>;
					public constructor(param0: java.io.OutputStream);
					public writeToken(param0: com.tom_roush.pdfbox.contentstream.operator.Operator): void;
					public writeTokens(param0: androidNative.Array<any>): void;
					public writeTokens(param0: java.util.List<any>): void;
					public writeToken(param0: com.tom_roush.pdfbox.cos.COSBase): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class DefaultResourceCache extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.ResourceCache {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.DefaultResourceCache>;
					public getFont(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.font.PDFont;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject): void;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): void;
					public getExtGState(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
					public getPattern(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern;
					public getColorSpace(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading): void;
					public getShading(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading;
					public getXObject(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.PDXObject;
					public constructor();
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont): void;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern): void;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState): void;
					public getProperties(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class MissingResourceException extends java.io.IOException {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.MissingResourceException>;
					public constructor(param0: string, param1: java.lang.Throwable, param2: boolean, param3: boolean);
					public constructor(param0: string, param1: java.lang.Throwable);
					public constructor(param0: string);
					public constructor(param0: java.lang.Throwable);
					public constructor();
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export abstract class PDAbstractContentStream extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDAbstractContentStream>;
					public document: com.tom_roush.pdfbox.pdmodel.PDDocument;
					public outputStream: java.io.OutputStream;
					public resources: com.tom_roush.pdfbox.pdmodel.PDResources;
					public inTextMode: boolean;
					public fontStack: java.util.Deque<com.tom_roush.pdfbox.pdmodel.font.PDFont>;
					public nonStrokingColorSpaceStack: java.util.Deque<com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace>;
					public strokingColorSpaceStack: java.util.Deque<com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace>;
					public setTextMatrix(param0: com.tom_roush.pdfbox.util.Matrix): void;
					public setWordSpacing(param0: number): void;
					public setStrokingColor(param0: number, param1: number, param2: number): void;
					public setNonStrokingColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
					/** @deprecated */
					public setNonStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					public fillEvenOdd(): void;
					/** @deprecated */
					public setStrokingColor(param0: number, param1: number, param2: number): void;
					public writeBytes(param0: androidNative.Array<number>): void;
					public setStrokingColor(param0: number): void;
					public addRect(param0: number, param1: number, param2: number, param3: number): void;
					public newLine(): void;
					public stroke(): void;
					public fillAndStroke(): void;
					public writeOperator(param0: string): void;
					public setNonStrokingColor(param0: number): void;
					public write(param0: string): void;
					public close(): void;
					public lineTo(param0: number, param1: number): void;
					public showTextInternal(param0: string): void;
					public setStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject, param1: number, param2: number, param3: number, param4: number): void;
					public closePath(): void;
					public newLineAtOffset(param0: number, param1: number): void;
					public setLineCapStyle(param0: number): void;
					public beginMarkedContent(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): void;
					public getName(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): com.tom_roush.pdfbox.cos.COSName;
					public setNonStrokingColor(param0: number, param1: number, param2: number): void;
					public setLineJoinStyle(param0: number): void;
					public fill(): void;
					/** @deprecated */
					public setNonStrokingColor(param0: number): void;
					public drawForm(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject): void;
					public addComment(param0: string): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject, param1: number, param2: number): void;
					public closeAndFillAndStrokeEvenOdd(): void;
					public write(param0: androidNative.Array<number>): void;
					public setCharacterSpacing(param0: number): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDInlineImage, param1: number, param2: number, param3: number, param4: number): void;
					public setNonStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					public setLeading(param0: number): void;
					public setLineDashPattern(param0: androidNative.Array<number>, param1: number): void;
					public clipEvenOdd(): void;
					public transform(param0: com.tom_roush.pdfbox.util.Matrix): void;
					public restoreGraphicsState(): void;
					public setHorizontalScaling(param0: number): void;
					public setFont(param0: com.tom_roush.pdfbox.pdmodel.font.PDFont, param1: number): void;
					public setRenderingMode(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode): void;
					public clip(): void;
					public setStrokingColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject, param1: com.tom_roush.pdfbox.util.Matrix): void;
					public setGraphicsStateParameters(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState): void;
					public curveTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public setStrokingColorSpaceStack(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDInlineImage, param1: number, param2: number): void;
					public fillAndStrokeEvenOdd(): void;
					public curveTo2(param0: number, param1: number, param2: number, param3: number): void;
					public closeAndStroke(): void;
					public writeOperand(param0: com.tom_roush.pdfbox.cos.COSName): void;
					public setNonStrokingColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
					public endText(): void;
					public moveTo(param0: number, param1: number): void;
					public saveGraphicsState(): void;
					public setMaximumFractionDigits(param0: number): void;
					public setMiterLimit(param0: number): void;
					public isOutside255Interval(param0: number): boolean;
					public beginText(): void;
					public showTextWithPositioning(param0: androidNative.Array<any>): void;
					public beginMarkedContent(param0: com.tom_roush.pdfbox.cos.COSName): void;
					public endMarkedContent(): void;
					public showText(param0: string): void;
					public shadingFill(param0: com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading): void;
					public curveTo1(param0: number, param1: number, param2: number, param3: number): void;
					public closeAndFillAndStroke(): void;
					public setStrokingColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
					public writeOperand(param0: number): void;
					public writeLine(): void;
					/** @deprecated */
					public setNonStrokingColor(param0: number, param1: number, param2: number): void;
					public setLineWidth(param0: number): void;
					public setNonStrokingColorSpaceStack(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
					public setTextRise(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDAppearanceContentStream extends com.tom_roush.pdfbox.pdmodel.PDAbstractContentStream implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDAppearanceContentStream>;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream);
					public setStrokingColor(param0: number, param1: number, param2: number): void;
					public setNonStrokingColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
					/** @deprecated */
					public setNonStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					public setNonStrokingColor(param0: androidNative.Array<number>): void;
					/** @deprecated */
					public setStrokingColor(param0: number, param1: number, param2: number): void;
					public setStrokingColor(param0: number): void;
					public setStrokingColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
					public setNonStrokingColor(param0: number): void;
					public drawShape(param0: number, param1: boolean, param2: boolean): void;
					public setNonStrokingColorOnDemand(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): boolean;
					public close(): void;
					public setStrokingColor(param0: androidNative.Array<number>): void;
					public setNonStrokingColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
					public setStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					public setBorderLine(param0: number, param1: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary, param2: com.tom_roush.pdfbox.cos.COSArray): void;
					public setLineWidthOnDemand(param0: number): void;
					public setNonStrokingColor(param0: number, param1: number, param2: number): void;
					/** @deprecated */
					public setNonStrokingColor(param0: number): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream, param1: boolean);
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream, param1: java.io.OutputStream);
					public setNonStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					public setStrokingColorOnDemand(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): boolean;
					public setStrokingColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
					/** @deprecated */
					public setNonStrokingColor(param0: number, param1: number, param2: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDDestinationNameTreeNode extends com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination> {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDDestinationNameTreeNode>;
					public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<any>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): any;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDDocument extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDDocument>;
					public getDocumentCatalog(): com.tom_roush.pdfbox.pdmodel.PDDocumentCatalog;
					public setDocumentId(param0: java.lang.Long): void;
					public getSignatureDictionaries(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature>;
					public static load(param0: java.io.File): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public static load(param0: java.io.File, param1: string): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public save(param0: java.io.File): void;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDocument, param1: com.tom_roush.pdfbox.io.RandomAccessRead);
					public constructor(param0: com.tom_roush.pdfbox.io.MemoryUsageSetting);
					public constructor();
					public close(): void;
					public getDocumentId(): java.lang.Long;
					public saveIncremental(param0: java.io.OutputStream): void;
					public addSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature, param1: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureOptions): void;
					public static load(param0: java.io.InputStream, param1: string, param2: com.tom_roush.pdfbox.io.MemoryUsageSetting): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public save(param0: java.io.OutputStream): void;
					public registerTrueTypeFontForClosing(param0: com.tom_roush.fontbox.ttf.TrueTypeFont): void;
					/** @deprecated */
					public addSignatureField(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField>, param1: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureInterface, param2: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureOptions): void;
					public getSignatureFields(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField>;
					public getVersion(): number;
					public getDocumentInformation(): com.tom_roush.pdfbox.pdmodel.PDDocumentInformation;
					public getEncryption(): com.tom_roush.pdfbox.pdmodel.encryption.PDEncryption;
					public addPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public removePage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDocument, param1: com.tom_roush.pdfbox.io.RandomAccessRead, param2: com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission);
					public static load(param0: java.io.File, param1: string, param2: com.tom_roush.pdfbox.io.MemoryUsageSetting): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public getNumberOfPages(): number;
					public addSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature, param1: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureInterface): void;
					public static load(param0: androidNative.Array<number>): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public static load(param0: java.io.InputStream, param1: com.tom_roush.pdfbox.io.MemoryUsageSetting): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public setVersion(param0: number): void;
					public setAllSecurityToBeRemoved(param0: boolean): void;
					public importPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): com.tom_roush.pdfbox.pdmodel.PDPage;
					public isAllSecurityToBeRemoved(): boolean;
					public getCurrentAccessPermission(): com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission;
					public getPage(param0: number): com.tom_roush.pdfbox.pdmodel.PDPage;
					public static load(param0: java.io.InputStream): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public static load(param0: androidNative.Array<number>, param1: string): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public addSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature, param1: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureInterface, param2: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureOptions): void;
					public setEncryptionDictionary(param0: com.tom_roush.pdfbox.pdmodel.encryption.PDEncryption): void;
					public static load(param0: java.io.File, param1: string, param2: java.io.InputStream, param3: string): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public saveIncremental(param0: java.io.OutputStream, param1: java.util.Set<com.tom_roush.pdfbox.cos.COSDictionary>): void;
					public static load(param0: androidNative.Array<number>, param1: string, param2: java.io.InputStream, param3: string): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public saveIncrementalForExternalSigning(param0: java.io.OutputStream): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.ExternalSigningSupport;
					public getPages(): com.tom_roush.pdfbox.pdmodel.PDPageTree;
					public static load(param0: java.io.InputStream, param1: string, param2: java.io.InputStream, param3: string): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public static load(param0: java.io.File, param1: com.tom_roush.pdfbox.io.MemoryUsageSetting): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public static load(param0: androidNative.Array<number>, param1: string, param2: java.io.InputStream, param3: string, param4: com.tom_roush.pdfbox.io.MemoryUsageSetting): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDocument);
					public isEncrypted(): boolean;
					public static load(param0: java.io.File, param1: string, param2: java.io.InputStream, param3: string, param4: com.tom_roush.pdfbox.io.MemoryUsageSetting): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public setResourceCache(param0: com.tom_roush.pdfbox.pdmodel.ResourceCache): void;
					public getDocument(): com.tom_roush.pdfbox.cos.COSDocument;
					public static load(param0: java.io.InputStream, param1: string): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public setDocumentInformation(param0: com.tom_roush.pdfbox.pdmodel.PDDocumentInformation): void;
					public getLastSignatureDictionary(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;
					public save(param0: string): void;
					public removePage(param0: number): void;
					public addSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature): void;
					public static load(param0: java.io.InputStream, param1: string, param2: java.io.InputStream, param3: string, param4: com.tom_roush.pdfbox.io.MemoryUsageSetting): com.tom_roush.pdfbox.pdmodel.PDDocument;
					public protect(param0: com.tom_roush.pdfbox.pdmodel.encryption.ProtectionPolicy): void;
					public getResourceCache(): com.tom_roush.pdfbox.pdmodel.ResourceCache;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDDocumentCatalog extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDDocumentCatalog>;
					public getDocumentOutline(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDDocumentOutline;
					public getVersion(): string;
					public setPageLayout(param0: com.tom_roush.pdfbox.pdmodel.PageLayout): void;
					public setOCProperties(param0: com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties): void;
					public getAcroForm(param0: com.tom_roush.pdfbox.pdmodel.fixup.PDDocumentFixup): com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm;
					public setOpenAction(param0: com.tom_roush.pdfbox.pdmodel.common.PDDestinationOrAction): void;
					public getStructureTreeRoot(): com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureTreeRoot;
					public getPageMode(): com.tom_roush.pdfbox.pdmodel.PageMode;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
					public getThreads(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThread>;
					public setOutputIntents(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.graphics.color.PDOutputIntent>): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.cos.COSDictionary);
					public getMarkInfo(): com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDMarkInfo;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public getPages(): com.tom_roush.pdfbox.pdmodel.PDPageTree;
					public setDocumentOutline(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDDocumentOutline): void;
					public setActions(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDDocumentCatalogAdditionalActions): void;
					public setViewerPreferences(param0: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences): void;
					public getNames(): com.tom_roush.pdfbox.pdmodel.PDDocumentNameDictionary;
					public setPageMode(param0: com.tom_roush.pdfbox.pdmodel.PageMode): void;
					public getActions(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDDocumentCatalogAdditionalActions;
					public findNamedDestinationPage(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDNamedDestination): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination;
					public setMetadata(param0: com.tom_roush.pdfbox.pdmodel.common.PDMetadata): void;
					public setStructureTreeRoot(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureTreeRoot): void;
					public getMetadata(): com.tom_roush.pdfbox.pdmodel.common.PDMetadata;
					public getDests(): com.tom_roush.pdfbox.pdmodel.PDDocumentNameDestinationDictionary;
					public setAcroForm(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm): void;
					public getViewerPreferences(): com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences;
					public setPageLabels(param0: com.tom_roush.pdfbox.pdmodel.common.PDPageLabels): void;
					public setThreads(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThread>): void;
					public getOpenAction(): com.tom_roush.pdfbox.pdmodel.common.PDDestinationOrAction;
					public getOCProperties(): com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties;
					public setNames(param0: com.tom_roush.pdfbox.pdmodel.PDDocumentNameDictionary): void;
					public getOutputIntents(): java.util.List<com.tom_roush.pdfbox.pdmodel.graphics.color.PDOutputIntent>;
					public addOutputIntent(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDOutputIntent): void;
					public getURI(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDURIDictionary;
					public setVersion(param0: string): void;
					public getPageLayout(): com.tom_roush.pdfbox.pdmodel.PageLayout;
					public setLanguage(param0: string): void;
					public getPageLabels(): com.tom_roush.pdfbox.pdmodel.common.PDPageLabels;
					public getAcroForm(): com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm;
					public getLanguage(): string;
					public setMarkInfo(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDMarkInfo): void;
					public setURI(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDURIDictionary): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDDocumentInformation extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDDocumentInformation>;
					public getTitle(): string;
					public setCustomMetadataValue(param0: string, param1: string): void;
					public setProducer(param0: string): void;
					public setModificationDate(param0: java.util.Calendar): void;
					public setTitle(param0: string): void;
					public getProducer(): string;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public getSubject(): string;
					public getMetadataKeys(): java.util.Set<string>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public setCreationDate(param0: java.util.Calendar): void;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public setSubject(param0: string): void;
					public constructor();
					public getCustomMetadataValue(param0: string): string;
					public getTrapped(): string;
					public getCreator(): string;
					public getCreationDate(): java.util.Calendar;
					public setTrapped(param0: string): void;
					public setCreator(param0: string): void;
					public getModificationDate(): java.util.Calendar;
					public getPropertyStringValue(param0: string): any;
					public getKeywords(): string;
					public setKeywords(param0: string): void;
					public getAuthor(): string;
					public setAuthor(param0: string): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDDocumentNameDestinationDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDDocumentNameDestinationDictionary>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public getDestination(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDDocumentNameDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDDocumentNameDictionary>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public setJavascript(param0: com.tom_roush.pdfbox.pdmodel.PDJavascriptNameTreeNode): void;
					public getDests(): com.tom_roush.pdfbox.pdmodel.PDDestinationNameTreeNode;
					public setDests(param0: com.tom_roush.pdfbox.pdmodel.PDDestinationNameTreeNode): void;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public getJavaScript(): com.tom_roush.pdfbox.pdmodel.PDJavascriptNameTreeNode;
					public getEmbeddedFiles(): com.tom_roush.pdfbox.pdmodel.PDEmbeddedFilesNameTreeNode;
					public setEmbeddedFiles(param0: com.tom_roush.pdfbox.pdmodel.PDEmbeddedFilesNameTreeNode): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocumentCatalog, param1: com.tom_roush.pdfbox.cos.COSDictionary);
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocumentCatalog);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDEmbeddedFilesNameTreeNode extends com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.common.filespecification.PDComplexFileSpecification> {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDEmbeddedFilesNameTreeNode>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<any>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDComplexFileSpecification;
					public constructor();
					public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): any;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.common.filespecification.PDComplexFileSpecification>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDFormContentStream extends com.tom_roush.pdfbox.pdmodel.PDAbstractContentStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDFormContentStream>;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject);
					public close(): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDJavascriptNameTreeNode extends com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript> {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDJavascriptNameTreeNode>;
					public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<any>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): any;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDPage extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable, com.tom_roush.pdfbox.contentstream.PDContentStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDPage>;
					public setThreadBeads(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead>): void;
					public setAnnotations(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation>): void;
					public setCropBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public setStructParents(param0: number): void;
					public getAnnotations(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation>;
					public setResources(param0: com.tom_roush.pdfbox.pdmodel.PDResources): void;
					public getThreadBeads(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead>;
					public getBleedBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public setContents(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream): void;
					public setRotation(param0: number): void;
					public setActions(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDPageAdditionalActions): void;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public getTrimBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
					public getMediaBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
					public setTrimBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
					public getStructParents(): number;
					public setTransition(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransition): void;
					public getArtBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
					public hashCode(): number;
					public hasContents(): boolean;
					public getViewports(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDViewportDictionary>;
					public setMetadata(param0: com.tom_roush.pdfbox.pdmodel.common.PDMetadata): void;
					public getUserUnit(): number;
					public getTransition(): com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransition;
					public getAnnotations(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.AnnotationFilter): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation>;
					public getContents(): java.io.InputStream;
					public getMetadata(): com.tom_roush.pdfbox.pdmodel.common.PDMetadata;
					public getContentStreams(): java.util.Iterator<com.tom_roush.pdfbox.pdmodel.common.PDStream>;
					public setUserUnit(param0: number): void;
					public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
					public setMediaBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
					public setArtBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
					public equals(param0: any): boolean;
					public setTransition(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransition, param1: number): void;
					public getRotation(): number;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle);
					public getMatrix(): com.tom_roush.pdfbox.util.Matrix;
					public getActions(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDPageAdditionalActions;
					public setBleedBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
					public setViewports(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDViewportDictionary>): void;
					public getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
					public getResourceCache(): com.tom_roush.pdfbox.pdmodel.ResourceCache;
					public getCropBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
					public setContents(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.common.PDStream>): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDPageContentStream extends java.lang.Object implements java.io.Closeable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDPageContentStream>;
					public setWordSpacing(param0: number): void;
					public setNonStrokingColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
					/** @deprecated */
					public fill(param0: globalAndroid.graphics.Path.FillType): void;
					public fillEvenOdd(): void;
					/** @deprecated */
					public setStrokingColor(param0: number, param1: number, param2: number): void;
					public setStrokingColor(param0: number): void;
					public addRect(param0: number, param1: number, param2: number, param3: number): void;
					public newLine(): void;
					/** @deprecated */
					public beginMarkedContentSequence(param0: com.tom_roush.pdfbox.cos.COSName): void;
					public setNonStrokingColor(param0: number): void;
					/** @deprecated */
					public concatenate2CTM(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public close(): void;
					public showTextInternal(param0: string): void;
					public setStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject, param1: number, param2: number, param3: number, param4: number): void;
					public newLineAtOffset(param0: number, param1: number): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.PDPage);
					public setLineCapStyle(param0: number): void;
					/** @deprecated */
					public appendRawCommands(param0: androidNative.Array<number>): void;
					public beginMarkedContent(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDTilingPattern, param2: java.io.OutputStream);
					/** @deprecated */
					public drawString(param0: string): void;
					public setNonStrokingColor(param0: number, param1: number, param2: number): void;
					public drawForm(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject): void;
					public addComment(param0: string): void;
					/** @deprecated */
					public drawPolygon(param0: androidNative.Array<number>, param1: androidNative.Array<number>): void;
					/** @deprecated */
					public setNonStrokingColor(param0: androidNative.Array<number>): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject, param1: number, param2: number): void;
					/** @deprecated */
					public appendRawCommands(param0: string): void;
					public setCharacterSpacing(param0: number): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDInlineImage, param1: number, param2: number, param3: number, param4: number): void;
					/** @deprecated */
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: boolean, param3: boolean);
					public setFont(param0: com.tom_roush.pdfbox.pdmodel.font.PDFont, param1: number): void;
					/** @deprecated */
					public addBezier312(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream);
					/** @deprecated */
					public setStrokingColor(param0: number): void;
					public setRenderingMode(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode): void;
					public setStrokingColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject, param1: com.tom_roush.pdfbox.util.Matrix): void;
					/** @deprecated */
					public setStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					public curveTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public fillAndStrokeEvenOdd(): void;
					/** @deprecated */
					public setTextMatrix(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public curveTo2(param0: number, param1: number, param2: number, param3: number): void;
					/** @deprecated */
					public setTextRotation(param0: number, param1: number, param2: number): void;
					public setNonStrokingColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
					/** @deprecated */
					public concatenate2CTM(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
					/** @deprecated */
					public drawXObject(param0: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject, param1: com.tom_roush.harmony.awt.geom.AffineTransform): void;
					public saveGraphicsState(): void;
					public beginText(): void;
					public showTextWithPositioning(param0: androidNative.Array<any>): void;
					public beginMarkedContent(param0: com.tom_roush.pdfbox.cos.COSName): void;
					public endMarkedContent(): void;
					public showText(param0: string): void;
					public shadingFill(param0: com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param2: java.io.OutputStream);
					public curveTo1(param0: number, param1: number, param2: number, param3: number): void;
					public closeAndFillAndStroke(): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: com.tom_roush.pdfbox.pdmodel.PDPageContentStream.AppendMode, param3: boolean, param4: boolean);
					public setStrokingColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
					/** @deprecated */
					public setNonStrokingColor(param0: number, param1: number, param2: number): void;
					public setLineWidth(param0: number): void;
					public setTextRise(param0: number): void;
					public setTextMatrix(param0: com.tom_roush.pdfbox.util.Matrix): void;
					/** @deprecated */
					public drawXObject(param0: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject, param1: number, param2: number, param3: number, param4: number): void;
					public setStrokingColor(param0: number, param1: number, param2: number): void;
					/** @deprecated */
					public setNonStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					/** @deprecated */
					public clipPath(param0: globalAndroid.graphics.Path.FillType): void;
					/** @deprecated */
					public moveTextPositionByAmount(param0: number, param1: number): void;
					public stroke(): void;
					public fillAndStroke(): void;
					/** @deprecated */
					public setTextScaling(param0: number, param1: number, param2: number, param3: number): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: com.tom_roush.pdfbox.pdmodel.PDPageContentStream.AppendMode, param3: boolean);
					/** @deprecated */
					public setTextMatrix(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
					public lineTo(param0: number, param1: number): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream, param2: java.io.OutputStream);
					public closePath(): void;
					/** @deprecated */
					public setNonStrokingColorSpace(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
					public setLineJoinStyle(param0: number): void;
					public fill(): void;
					/** @deprecated */
					public setTextTranslation(param0: number, param1: number): void;
					/** @deprecated */
					public setNonStrokingColor(param0: number): void;
					/** @deprecated */
					public addLine(param0: number, param1: number, param2: number, param3: number): void;
					public closeAndFillAndStrokeEvenOdd(): void;
					public setNonStrokingColor(param0: number, param1: number, param2: number, param3: number): void;
					/** @deprecated */
					public addPolygon(param0: androidNative.Array<number>, param1: androidNative.Array<number>): void;
					public setLeading(param0: number): void;
					/** @deprecated */
					public appendRawCommands(param0: number): void;
					public setLineDashPattern(param0: androidNative.Array<number>, param1: number): void;
					/** @deprecated */
					public fillPolygon(param0: androidNative.Array<number>, param1: androidNative.Array<number>): void;
					public clipEvenOdd(): void;
					public transform(param0: com.tom_roush.pdfbox.util.Matrix): void;
					public restoreGraphicsState(): void;
					public setHorizontalScaling(param0: number): void;
					/** @deprecated */
					public setStrokingColor(param0: androidNative.Array<number>): void;
					/** @deprecated */
					public beginMarkedContentSequence(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSName): void;
					public clip(): void;
					/** @deprecated */
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: boolean, param3: boolean, param4: boolean);
					/** @deprecated */
					public setLeading(param0: number): void;
					/** @deprecated */
					public drawInlineImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDInlineImage, param1: number, param2: number, param3: number, param4: number): void;
					public setGraphicsStateParameters(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDInlineImage, param1: number, param2: number): void;
					public closeAndStroke(): void;
					/** @deprecated */
					public appendCOSName(param0: com.tom_roush.pdfbox.cos.COSName): void;
					/** @deprecated */
					public fillRect(param0: number, param1: number, param2: number, param3: number): void;
					/** @deprecated */
					public addBezier31(param0: number, param1: number, param2: number, param3: number): void;
					/** @deprecated */
					public closeSubPath(): void;
					/** @deprecated */
					public drawLine(param0: number, param1: number, param2: number, param3: number): void;
					public endText(): void;
					public moveTo(param0: number, param1: number): void;
					/** @deprecated */
					public drawInlineImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDInlineImage, param1: number, param2: number): void;
					public setMiterLimit(param0: number): void;
					/** @deprecated */
					public setStrokingColorSpace(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
					/** @deprecated */
					public addBezier32(param0: number, param1: number, param2: number, param3: number): void;
					public writeOperand(param0: number): void;
					/** @deprecated */
					public endMarkedContentSequence(): void;
				}
				export namespace PDPageContentStream {
					export class AppendMode {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDPageContentStream.AppendMode>;
						public static OVERWRITE: com.tom_roush.pdfbox.pdmodel.PDPageContentStream.AppendMode;
						public static APPEND: com.tom_roush.pdfbox.pdmodel.PDPageContentStream.AppendMode;
						public static PREPEND: com.tom_roush.pdfbox.pdmodel.PDPageContentStream.AppendMode;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.PDPageContentStream.AppendMode;
						public isOverwrite(): boolean;
						public isPrepend(): boolean;
						public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.PDPageContentStream.AppendMode>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDPageTree extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDPageTree>;
					public getCount(): number;
					public spliterator(): java.util.Spliterator<any>;
					public remove(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public static getInheritableAttribute(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSBase;
					public insertBefore(param0: com.tom_roush.pdfbox.pdmodel.PDPage, param1: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public iterator(): java.util.Iterator<com.tom_roush.pdfbox.pdmodel.PDPage>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public add(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public iterator(): java.util.Iterator<any>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public insertAfter(param0: com.tom_roush.pdfbox.pdmodel.PDPage, param1: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public get(param0: number): com.tom_roush.pdfbox.pdmodel.PDPage;
					public remove(param0: number): void;
					public forEach(param0: any /* any*/): void;
					public indexOf(param0: com.tom_roush.pdfbox.pdmodel.PDPage): number;
				}
				export namespace PDPageTree {
					export class PageIterator extends java.util.Iterator<com.tom_roush.pdfbox.pdmodel.PDPage> {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDPageTree.PageIterator>;
						public next(): com.tom_roush.pdfbox.pdmodel.PDPage;
						public hasNext(): boolean;
						public remove(): void;
					}
					export class SearchContext extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDPageTree.SearchContext>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDPatternContentStream extends com.tom_roush.pdfbox.pdmodel.PDAbstractContentStream {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDPatternContentStream>;
					public close(): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDTilingPattern);
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDResources extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDResources>;
					public put(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): void;
					public hasColorSpace(param0: com.tom_roush.pdfbox.cos.COSName): boolean;
					public getFontNames(): java.lang.Iterable<com.tom_roush.pdfbox.cos.COSName>;
					public add(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): com.tom_roush.pdfbox.cos.COSName;
					public getColorSpaceNames(): java.lang.Iterable<com.tom_roush.pdfbox.cos.COSName>;
					public getExtGStateNames(): java.lang.Iterable<com.tom_roush.pdfbox.cos.COSName>;
					public put(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern): void;
					public getXObject(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.graphics.PDXObject;
					public getFont(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.font.PDFont;
					public getExtGState(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
					public add(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): com.tom_roush.pdfbox.cos.COSName;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public put(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject): void;
					public add(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject): com.tom_roush.pdfbox.cos.COSName;
					public add(param0: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject, param1: string): com.tom_roush.pdfbox.cos.COSName;
					public put(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState): void;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public put(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public put(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont): void;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.pdmodel.ResourceCache);
					public getShading(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading;
					public getPattern(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern;
					public add(param0: com.tom_roush.pdfbox.pdmodel.font.PDFont): com.tom_roush.pdfbox.cos.COSName;
					public getShadingNames(): java.lang.Iterable<com.tom_roush.pdfbox.cos.COSName>;
					public isImageXObject(param0: com.tom_roush.pdfbox.cos.COSName): boolean;
					public add(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState): com.tom_roush.pdfbox.cos.COSName;
					public getPropertiesNames(): java.lang.Iterable<com.tom_roush.pdfbox.cos.COSName>;
					public getPatternNames(): java.lang.Iterable<com.tom_roush.pdfbox.cos.COSName>;
					public getXObjectNames(): java.lang.Iterable<com.tom_roush.pdfbox.cos.COSName>;
					public put(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading): void;
					public getProperties(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList;
					public add(param0: com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern): com.tom_roush.pdfbox.cos.COSName;
					public add(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject): com.tom_roush.pdfbox.cos.COSName;
					public getColorSpace(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
					public getColorSpace(param0: com.tom_roush.pdfbox.cos.COSName, param1: boolean): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
					public add(param0: com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading): com.tom_roush.pdfbox.cos.COSName;
					public getResourceCache(): com.tom_roush.pdfbox.pdmodel.ResourceCache;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PDStructureElementNameTreeNode extends com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement> {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PDStructureElementNameTreeNode>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
					public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<any>;
					public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					public constructor();
					public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): any;
					public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement>;
					public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PageLayout {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PageLayout>;
					public static SINGLE_PAGE: com.tom_roush.pdfbox.pdmodel.PageLayout;
					public static ONE_COLUMN: com.tom_roush.pdfbox.pdmodel.PageLayout;
					public static TWO_COLUMN_LEFT: com.tom_roush.pdfbox.pdmodel.PageLayout;
					public static TWO_COLUMN_RIGHT: com.tom_roush.pdfbox.pdmodel.PageLayout;
					public static TWO_PAGE_LEFT: com.tom_roush.pdfbox.pdmodel.PageLayout;
					public static TWO_PAGE_RIGHT: com.tom_roush.pdfbox.pdmodel.PageLayout;
					public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.PageLayout;
					public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.PageLayout>;
					public static fromString(param0: string): com.tom_roush.pdfbox.pdmodel.PageLayout;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
					public stringValue(): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class PageMode {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.PageMode>;
					public static USE_NONE: com.tom_roush.pdfbox.pdmodel.PageMode;
					public static USE_OUTLINES: com.tom_roush.pdfbox.pdmodel.PageMode;
					public static USE_THUMBS: com.tom_roush.pdfbox.pdmodel.PageMode;
					public static FULL_SCREEN: com.tom_roush.pdfbox.pdmodel.PageMode;
					public static USE_OPTIONAL_CONTENT: com.tom_roush.pdfbox.pdmodel.PageMode;
					public static USE_ATTACHMENTS: com.tom_roush.pdfbox.pdmodel.PageMode;
					public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.PageMode;
					public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.PageMode>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
					public static fromString(param0: string): com.tom_roush.pdfbox.pdmodel.PageMode;
					public stringValue(): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export class ResourceCache extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.ResourceCache>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.ResourceCache interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getFont(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.font.PDFont;
						getColorSpace(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
						getExtGState(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
						getShading(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading;
						getPattern(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern;
						getProperties(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList;
						getXObject(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.PDXObject;
						put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont): void;
						put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
						put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState): void;
						put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading): void;
						put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern): void;
						put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): void;
						put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject): void;
					});
					public constructor();
					public getFont(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.font.PDFont;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject): void;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): void;
					public getExtGState(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
					public getPattern(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
					public getColorSpace(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading): void;
					public getShading(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading;
					public getXObject(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.graphics.PDXObject;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont): void;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern): void;
					public put(param0: com.tom_roush.pdfbox.cos.COSObject, param1: com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState): void;
					public getProperties(param0: com.tom_roush.pdfbox.cos.COSObject): com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class COSArrayList<E>  extends java.util.List<any> {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.COSArrayList<any>>;
						public forEach(param0: any /* any*/): void;
						public toArray(param0: androidNative.Array<any>): androidNative.Array<any>;
						public listIterator(): java.util.ListIterator<any>;
						public constructor(param0: java.util.List<any>, param1: com.tom_roush.pdfbox.cos.COSArray);
						public iterator(): java.util.Iterator<any>;
						public add(param0: any): boolean;
						public constructor(param0: any, param1: com.tom_roush.pdfbox.cos.COSBase, param2: com.tom_roush.pdfbox.cos.COSDictionary, param3: com.tom_roush.pdfbox.cos.COSName);
						public stream(): java.util.stream.Stream<any>;
						public replaceAll(param0: any /* any*/): void;
						public equals(param0: any): boolean;
						public hashCode(): number;
						public static convertIntegerCOSArrayToList(param0: com.tom_roush.pdfbox.cos.COSArray): java.util.List<java.lang.Integer>;
						public listIterator(param0: number): java.util.ListIterator<any>;
						public static copyOf(param0: java.util.Collection<any>): java.util.List<any>;
						public addAll(param0: java.util.Collection<any>): boolean;
						public retainAll(param0: java.util.Collection<any>): boolean;
						public static convertCOSStringCOSArrayToList(param0: com.tom_roush.pdfbox.cos.COSArray): java.util.List<string>;
						/** @deprecated */
						public toList(): com.tom_roush.pdfbox.cos.COSArray;
						public spliterator(): java.util.Spliterator<any>;
						public static convertStringListToCOSNameCOSArray(param0: java.util.List<string>): com.tom_roush.pdfbox.cos.COSArray;
						public set(param0: number, param1: any): any;
						public static converterToCOSArray(param0: java.util.List<any>): com.tom_roush.pdfbox.cos.COSArray;
						public isEmpty(): boolean;
						public get(param0: number): any;
						public size(): number;
						public static convertFloatCOSArrayToList(param0: com.tom_roush.pdfbox.cos.COSArray): java.util.List<java.lang.Float>;
						public removeAll(param0: java.util.Collection<any>): boolean;
						public toArray(param0: any /* any*/): androidNative.Array<any>;
						public constructor();
						public static convertCOSNameCOSArrayToList(param0: com.tom_roush.pdfbox.cos.COSArray): java.util.List<string>;
						public contains(param0: any): boolean;
						public lastIndexOf(param0: any): number;
						public getCOSArray(): com.tom_roush.pdfbox.cos.COSArray;
						public toArray(): androidNative.Array<any>;
						public subList(param0: number, param1: number): java.util.List<any>;
						public parallelStream(): java.util.stream.Stream<any>;
						public toString(): string;
						public remove(param0: any): boolean;
						public add(param0: number, param1: any): void;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.cos.COSName);
						public static convertStringListToCOSStringCOSArray(param0: java.util.List<string>): com.tom_roush.pdfbox.cos.COSArray;
						public indexOf(param0: any): number;
						public removeIf(param0: any /* any*/): boolean;
						public remove(param0: number): any;
						public clear(): void;
						public addAll(param0: number, param1: java.util.Collection<any>): boolean;
						public sort(param0: java.util.Comparator<any>): void;
						public containsAll(param0: java.util.Collection<any>): boolean;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class COSDictionaryMap<K, V>  extends java.util.Map<any,any> {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.COSDictionaryMap<any,any>>;
						public put(param0: any, param1: any): any;
						public remove(param0: any): any;
						public entrySet(): java.util.Set<java.util.Map.Entry<any,any>>;
						public replace(param0: any, param1: any): any;
						public equals(param0: any): boolean;
						public hashCode(): number;
						public getOrDefault(param0: any, param1: any): any;
						public values(): java.util.Collection<any>;
						public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
						public static copyOf(param0: java.util.Map<any,any>): java.util.Map<any,any>;
						public putAll(param0: java.util.Map<any,any>): void;
						public isEmpty(): boolean;
						public static entry(param0: any, param1: any): java.util.Map.Entry<any,any>;
						public remove(param0: any, param1: any): boolean;
						public size(): number;
						public putIfAbsent(param0: any, param1: any): any;
						public merge(param0: any, param1: any, param2: any /* any<any,any,any>*/): any;
						public forEach(param0: any /* any<any,any>*/): void;
						public computeIfAbsent(param0: any, param1: any /* any<any,any>*/): any;
						public get(param0: any): any;
						public computeIfPresent(param0: any, param1: any /* any<any,any,any>*/): any;
						public containsValue(param0: any): boolean;
						public static convertBasicTypesToMap(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.COSDictionaryMap<string,any>;
						public containsKey(param0: any): boolean;
						public toString(): string;
						public constructor(param0: java.util.Map<any,any>, param1: com.tom_roush.pdfbox.cos.COSDictionary);
						public compute(param0: any, param1: any /* any<any,any,any>*/): any;
						public replaceAll(param0: any /* any<any,any,any>*/): void;
						public static convert(param0: java.util.Map<string,any>): com.tom_roush.pdfbox.cos.COSDictionary;
						public clear(): void;
						public replace(param0: any, param1: any, param2: any): boolean;
						public keySet(): java.util.Set<any>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class COSObjectable extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.COSObjectable>;
						/**
						 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.common.COSObjectable interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						});
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDDestinationOrAction extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDDestinationOrAction>;
						/**
						 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.common.PDDestinationOrAction interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						});
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDDictionaryWrapper extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDDictionaryWrapper>;
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public equals(param0: any): boolean;
						public hashCode(): number;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDMetadata extends com.tom_roush.pdfbox.pdmodel.common.PDStream {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDMetadata>;
						public importXMPMetadata(param0: androidNative.Array<number>): void;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.cos.COSName);
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.cos.COSArray);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDocument);
						public exportXMPMetadata(): java.io.InputStream;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSStream);
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream);
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export abstract class PDNameTreeNode<T>  extends com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<any>>;
						public constructor();
						public setKids(param0: java.util.List<any>): void;
						public setParent(param0: com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<any>): void;
						public getNames(): java.util.Map<string,any>;
						public getKids(): java.util.List<com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<any>>;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setNames(param0: java.util.Map<string,any>): void;
						public getParent(): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<any>;
						public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<any>;
						public getValue(param0: string): any;
						public getLowerLimit(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getUpperLimit(): string;
						public isRootNode(): boolean;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): any;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDNumberTreeNode extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDNumberTreeNode>;
						public createChildNode(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.common.PDNumberTreeNode;
						public getUpperLimit(): java.lang.Integer;
						public setKids(param0: java.util.List<any>): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setNumbers(param0: java.util.Map<java.lang.Integer,any>): void;
						public constructor(param0: java.lang.Class<any>);
						public getKids(): java.util.List<com.tom_roush.pdfbox.pdmodel.common.PDNumberTreeNode>;
						public convertCOSToPD(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.common.COSObjectable;
						public getNumbers(): java.util.Map<java.lang.Integer,com.tom_roush.pdfbox.pdmodel.common.COSObjectable>;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getValue(param0: java.lang.Integer): any;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: java.lang.Class<any>);
						public getLowerLimit(): java.lang.Integer;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDObjectStream extends com.tom_roush.pdfbox.pdmodel.common.PDStream {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDObjectStream>;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.cos.COSName);
						public getNumberOfObjects(): number;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDocument);
						public getType(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSStream);
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream);
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.cos.COSArray);
						public setFirstByteOffset(param0: number): void;
						public setExtends(param0: com.tom_roush.pdfbox.pdmodel.common.PDObjectStream): void;
						public static createStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): com.tom_roush.pdfbox.pdmodel.common.PDObjectStream;
						public setNumberOfObjects(param0: number): void;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
						public getFirstByteOffset(): number;
						public getExtends(): com.tom_roush.pdfbox.pdmodel.common.PDObjectStream;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDPageLabelRange extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDPageLabelRange>;
						public static STYLE_DECIMAL: string = "D";
						public static STYLE_ROMAN_UPPER: string = "R";
						public static STYLE_ROMAN_LOWER: string = "r";
						public static STYLE_LETTERS_UPPER: string = "A";
						public static STYLE_LETTERS_LOWER: string = "a";
						public setPrefix(param0: string): void;
						public constructor();
						public getStyle(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public setStart(param0: number): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getStart(): number;
						public getPrefix(): string;
						public setStyle(param0: string): void;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDPageLabels extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDPageLabels>;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.cos.COSDictionary);
						public getPageRangeCount(): number;
						public getPageLabelRange(param0: number): com.tom_roush.pdfbox.pdmodel.common.PDPageLabelRange;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setLabelItem(param0: number, param1: com.tom_roush.pdfbox.pdmodel.common.PDPageLabelRange): void;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
						public getLabelsByPageIndices(): androidNative.Array<string>;
						public getPageIndicesByLabels(): java.util.Map<string,java.lang.Integer>;
						public getPageIndices(): java.util.NavigableSet<java.lang.Integer>;
					}
					export namespace PDPageLabels {
						export class LabelGenerator extends java.util.Iterator<string> {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDPageLabels.LabelGenerator>;
							public hasNext(): boolean;
							public next(): string;
							public remove(): void;
						}
						export class LabelHandler extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDPageLabels.LabelHandler>;
							/**
							 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.common.PDPageLabels$LabelHandler interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								newLabel(param0: number, param1: string): void;
							});
							public constructor();
							public newLabel(param0: number, param1: string): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDRange extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDRange>;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSArray, param1: number);
						public constructor();
						public setMin(param0: number): void;
						public setMax(param0: number): void;
						public getCOSArray(): com.tom_roush.pdfbox.cos.COSArray;
						public getMin(): number;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
						public getMax(): number;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDRectangle extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDRectangle>;
						public static LETTER: com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public static LEGAL: com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public toGeneralPath(): globalAndroid.graphics.Path;
						public constructor();
						public contains(param0: number, param1: number): boolean;
						public getCOSArray(): com.tom_roush.pdfbox.cos.COSArray;
						public getLowerLeftX(): number;
						public setLowerLeftY(param0: number): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getHeight(): number;
						public toString(): string;
						public constructor(param0: number, param1: number, param2: number, param3: number);
						public constructor(param0: com.tom_roush.fontbox.util.BoundingBox);
						public createRetranslatedRectangle(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public getUpperRightY(): number;
						public getLowerLeftY(): number;
						public setUpperRightY(param0: number): void;
						public setUpperRightX(param0: number): void;
						public getWidth(): number;
						public transform(param0: com.tom_roush.pdfbox.util.Matrix): globalAndroid.graphics.Path;
						public setLowerLeftX(param0: number): void;
						public constructor(param0: number, param1: number);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
						public getUpperRightX(): number;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDStream extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDStream>;
						public createOutputStream(): java.io.OutputStream;
						public createInputStream(param0: java.util.List<string>): java.io.InputStream;
						public getFileDecodeParams(): java.util.List<any>;
						/** @deprecated */
						public getStream(): com.tom_roush.pdfbox.cos.COSStream;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getLength(): number;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSStream);
						public setFileFilters(param0: java.util.List<string>): void;
						public createOutputStream(param0: com.tom_roush.pdfbox.cos.COSName): java.io.OutputStream;
						public createInputStream(): com.tom_roush.pdfbox.cos.COSInputStream;
						public setFileDecodeParams(param0: java.util.List<any>): void;
						public setDecodeParms(param0: java.util.List<any>): void;
						public getDecodedStreamLength(): number;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
						public createInputStream(param0: com.tom_roush.pdfbox.filter.DecodeOptions): com.tom_roush.pdfbox.cos.COSInputStream;
						public setFilters(param0: java.util.List<com.tom_roush.pdfbox.cos.COSName>): void;
						public setMetadata(param0: com.tom_roush.pdfbox.pdmodel.common.PDMetadata): void;
						/** @deprecated */
						public addCompression(): void;
						public getMetadata(): com.tom_roush.pdfbox.pdmodel.common.PDMetadata;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.cos.COSName);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDocument);
						public getFilters(): java.util.List<com.tom_roush.pdfbox.cos.COSName>;
						public getFileFilters(): java.util.List<string>;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream);
						public getDecodeParms(): java.util.List<any>;
						public setDecodedStreamLength(param0: number): void;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.cos.COSArray);
						public toByteArray(): androidNative.Array<number>;
						public getFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
						public setFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export class PDTypedDictionaryWrapper extends com.tom_roush.pdfbox.pdmodel.common.PDDictionaryWrapper {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.PDTypedDictionaryWrapper>;
						public constructor();
						public getType(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public constructor(param0: string);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export namespace filespecification {
						export class PDComplexFileSpecification extends com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.filespecification.PDComplexFileSpecification>;
							public getFileUnicode(): string;
							public getEmbeddedFileDos(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile;
							public setFile(param0: string): void;
							public getFile(): string;
							public getFileDos(): string;
							public setEmbeddedFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile): void;
							/** @deprecated */
							public setFileMac(param0: string): void;
							public setVolatile(param0: boolean): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getEmbeddedFileUnicode(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile;
							/** @deprecated */
							public setEmbeddedFileDos(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile): void;
							public getEmbeddedFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile;
							public constructor();
							public getFileUnix(): string;
							public setEmbeddedFileUnicode(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile): void;
							public getFileDescription(): string;
							public getFileMac(): string;
							public setFileUnicode(param0: string): void;
							public getEmbeddedFileMac(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile;
							public getEmbeddedFileUnix(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile;
							/** @deprecated */
							public setFileDos(param0: string): void;
							public isVolatile(): boolean;
							/** @deprecated */
							public setEmbeddedFileUnix(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile): void;
							public setFileDescription(param0: string): void;
							public getFilename(): string;
							/** @deprecated */
							public setFileUnix(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							/** @deprecated */
							public setEmbeddedFileMac(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export namespace filespecification {
						export class PDEmbeddedFile extends com.tom_roush.pdfbox.pdmodel.common.PDStream {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream);
							public setMacCreator(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.cos.COSName);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.cos.COSArray);
							public setSubtype(param0: string): void;
							public getMacSubtype(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
							public getSubtype(): string;
							public getMacResFork(): string;
							public setSize(param0: number): void;
							public setModDate(param0: java.util.Calendar): void;
							public getModDate(): java.util.Calendar;
							public setCreationDate(param0: java.util.Calendar): void;
							public getCheckSum(): string;
							public getCreationDate(): java.util.Calendar;
							public getMacCreator(): string;
							public setMacResFork(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream);
							public getSize(): number;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
							public setMacSubtype(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDocument);
							public setCheckSum(param0: string): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export namespace filespecification {
						export abstract class PDFileSpecification extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification>;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public static createFS(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
							public setFile(param0: string): void;
							public getFile(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace common {
					export namespace filespecification {
						export class PDSimpleFileSpecification extends com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.common.filespecification.PDSimpleFileSpecification>;
							public constructor();
							public constructor(param0: com.tom_roush.pdfbox.cos.COSString);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setFile(param0: string): void;
							public getFile(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export abstract class PDAttributeObject extends com.tom_roush.pdfbox.pdmodel.common.PDDictionaryWrapper {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject>;
							public constructor();
							public static arrayToString(param0: androidNative.Array<number>): string;
							public static arrayToString(param0: androidNative.Array<any>): string;
							public getOwner(): string;
							public setStructureElement(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement): void;
							public toString(): string;
							public potentiallyNotifyChanged(param0: com.tom_roush.pdfbox.cos.COSBase, param1: com.tom_roush.pdfbox.cos.COSBase): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setOwner(param0: string): void;
							public static create(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public isEmpty(): boolean;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public notifyChanged(): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class PDDefaultAttributeObject extends com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDDefaultAttributeObject>;
							public constructor();
							public setAttribute(param0: string, param1: com.tom_roush.pdfbox.cos.COSBase): void;
							public getAttributeValue(param0: string, param1: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.cos.COSBase;
							public getAttributeNames(): java.util.List<string>;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getAttributeValue(param0: string): com.tom_roush.pdfbox.cos.COSBase;
							public toString(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class PDMarkInfo extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDMarkInfo>;
							public constructor();
							public setSuspect(param0: boolean): void;
							public setMarked(param0: boolean): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public usesUserProperties(): boolean;
							public setUserProperties(param0: boolean): void;
							public isMarked(): boolean;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public isSuspect(): boolean;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class PDMarkedContentReference extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDMarkedContentReference>;
							public static TYPE: string = "MCR";
							public constructor();
							public getMCID(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
							public setMCID(param0: number): void;
							public toString(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getPage(): com.tom_roush.pdfbox.pdmodel.PDPage;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class PDObjectReference extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDObjectReference>;
							public static TYPE: string = "OBJR";
							public constructor();
							public getReferencedObject(): com.tom_roush.pdfbox.pdmodel.common.COSObjectable;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setReferencedObject(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setReferencedObject(param0: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class PDParentTreeValue extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDParentTreeValue>;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
							public toString(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class PDStructureElement extends com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureNode {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement>;
							public static TYPE: string = "StructElem";
							public insertBefore(param0: com.tom_roush.pdfbox.cos.COSInteger, param1: any): void;
							public appendKid(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDMarkedContent): void;
							public setActualText(param0: string): void;
							public incrementRevisionNumber(): void;
							public appendKid(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDMarkedContentReference): void;
							public removeAttribute(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject): void;
							public removeKid(param0: com.tom_roush.pdfbox.cos.COSInteger): void;
							public insertBefore(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDMarkedContentReference, param1: any): void;
							public constructor(param0: string);
							public setRevisionNumber(param0: number): void;
							public insertBefore(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDObjectReference, param1: any): void;
							public getPage(): com.tom_roush.pdfbox.pdmodel.PDPage;
							public getAttributes(): com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.Revisions<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject>;
							public getParent(): com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureNode;
							public removeKid(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDObjectReference): void;
							public addClassName(param0: string): void;
							public removeKid(param0: com.tom_roush.pdfbox.cos.COSBase): boolean;
							public setAttributes(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.Revisions<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject>): void;
							public getClassNames(): com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.Revisions<string>;
							public setClassNames(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.Revisions<string>): void;
							public addAttribute(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject): void;
							public setElementIdentifier(param0: string): void;
							public setStructureType(param0: string): void;
							public setExpandedForm(param0: string): void;
							public setAlternateDescription(param0: string): void;
							public insertBefore(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement, param1: any): void;
							public setLanguage(param0: string): void;
							public getStructureType(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public removeKid(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement): boolean;
							public getElementIdentifier(): string;
							public getAlternateDescription(): string;
							public getExpandedForm(): string;
							public getRevisionNumber(): number;
							public appendKid(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement): void;
							public appendKid(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDObjectReference): void;
							public appendKid(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public insertBefore(param0: com.tom_roush.pdfbox.cos.COSBase, param1: any): void;
							public getTitle(): string;
							public getActualText(): string;
							public constructor(param0: string, param1: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureNode);
							public getStandardStructureType(): string;
							public setParent(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureNode): void;
							public setTitle(param0: string): void;
							public getLanguage(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
							public removeClassName(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public attributeChanged(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject): void;
							public removeKid(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDMarkedContentReference): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export abstract class PDStructureNode extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureNode>;
							public getKids(): java.util.List<any>;
							public static create(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureNode;
							public appendObjectableKid(param0: com.tom_roush.pdfbox.pdmodel.common.COSObjectable): void;
							public appendKid(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public insertBefore(param0: com.tom_roush.pdfbox.cos.COSBase, param1: any): void;
							public insertObjectableBefore(param0: com.tom_roush.pdfbox.pdmodel.common.COSObjectable, param1: any): void;
							public insertBefore(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement, param1: any): void;
							public removeKid(param0: com.tom_roush.pdfbox.cos.COSBase): boolean;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public removeKid(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement): boolean;
							public constructor(param0: string);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setKids(param0: java.util.List<any>): void;
							public createObject(param0: com.tom_roush.pdfbox.cos.COSBase): any;
							public removeObjectableKid(param0: com.tom_roush.pdfbox.pdmodel.common.COSObjectable): boolean;
							public appendKid(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getType(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class PDStructureTreeRoot extends com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureNode {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureTreeRoot>;
							public constructor();
							public setParentTreeNextKey(param0: number): void;
							public setRoleMap(param0: java.util.Map<string,string>): void;
							public getRoleMap(): java.util.Map<string,any>;
							public getParentTree(): com.tom_roush.pdfbox.pdmodel.common.PDNumberTreeNode;
							public getParentTreeNextKey(): number;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setParentTree(param0: com.tom_roush.pdfbox.pdmodel.common.PDNumberTreeNode): void;
							public constructor(param0: string);
							public setK(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setIDTree(param0: com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement>): void;
							public getK(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getIDTree(): com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement>;
							/** @deprecated */
							public getKArray(): com.tom_roush.pdfbox.cos.COSArray;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class PDUserAttributeObject extends com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDUserAttributeObject>;
							public static OWNER_USER_PROPERTIES: string = "UserProperties";
							public constructor();
							public userPropertyChanged(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDUserProperty): void;
							public addUserProperty(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDUserProperty): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public removeUserProperty(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDUserProperty): void;
							public getOwnerUserProperties(): java.util.List<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDUserProperty>;
							public toString(): string;
							public setUserProperties(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDUserProperty>): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class PDUserProperty extends com.tom_roush.pdfbox.pdmodel.common.PDDictionaryWrapper {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDUserProperty>;
							public constructor();
							public setHidden(param0: boolean): void;
							public hashCode(): number;
							public setFormattedValue(param0: string): void;
							public setName(param0: string): void;
							public toString(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDUserAttributeObject);
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setValue(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public isHidden(): boolean;
							public getValue(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDUserAttributeObject);
							public getName(): string;
							public getFormattedValue(): string;
							public equals(param0: any): boolean;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace logicalstructure {
						export class Revisions<T>  extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.Revisions<any>>;
							public constructor();
							public size(): number;
							public getObject(param0: number): T;
							public getRevisionNumber(param0: number): number;
							public toString(): string;
							public setRevisionNumber(param0: T, param1: number): void;
							public addObject(param0: T, param1: number): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace markedcontent {
						export class PDMarkedContent extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDMarkedContent>;
							public getProperties(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getActualText(): string;
							public toString(): string;
							public static create(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDMarkedContent;
							public addMarkedContent(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDMarkedContent): void;
							public getTag(): string;
							public addText(param0: com.tom_roush.pdfbox.text.TextPosition): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSDictionary);
							public getLanguage(): string;
							public getAlternateDescription(): string;
							public getExpandedForm(): string;
							public addXObject(param0: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject): void;
							public getMCID(): number;
							public getContents(): java.util.List<any>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace markedcontent {
						export class PDPropertyList extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList>;
							public dict: com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor();
							public static create(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace prepress {
						export class PDBoxStyle extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.prepress.PDBoxStyle>;
							public static GUIDELINE_STYLE_SOLID: string = "S";
							public static GUIDELINE_STYLE_DASHED: string = "D";
							public constructor();
							public setGuideLineColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public setGuidelineStyle(param0: string): void;
							public getGuidelineWidth(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getGuidelineStyle(): string;
							public getLineDashPattern(): com.tom_roush.pdfbox.pdmodel.graphics.PDLineDashPattern;
							public setGuidelineWidth(param0: number): void;
							public setLineDashPattern(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public getGuidelineColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace taggedpdf {
						export class PDArtifactMarkedContent extends com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDMarkedContent {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDArtifactMarkedContent>;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSDictionary);
							public isBottomAttached(): boolean;
							public getSubtype(): string;
							public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public isRightAttached(): boolean;
							public isLeftAttached(): boolean;
							public getType(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public isTopAttached(): boolean;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace taggedpdf {
						export class PDExportFormatAttributeObject extends com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDLayoutAttributeObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDExportFormatAttributeObject>;
							public static OWNER_XML_1_00: string = "XML-1.00";
							public static OWNER_HTML_3_20: string = "HTML-3.2";
							public static OWNER_HTML_4_01: string = "HTML-4.01";
							public static OWNER_OEB_1_00: string = "OEB-1.00";
							public static OWNER_RTF_1_05: string = "RTF-1.05";
							public static OWNER_CSS_1_00: string = "CSS-1.00";
							public static OWNER_CSS_2_00: string = "CSS-2.00";
							public constructor();
							public setHeaders(param0: androidNative.Array<string>): void;
							public setRowSpan(param0: number): void;
							public getRowSpan(): number;
							public setListNumbering(param0: string): void;
							public toString(): string;
							public getScope(): string;
							public setScope(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getListNumbering(): string;
							public getSummary(): string;
							public setSummary(param0: string): void;
							public constructor(param0: string);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setColSpan(param0: number): void;
							public getHeaders(): androidNative.Array<string>;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getColSpan(): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace taggedpdf {
						export class PDFourColours extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDFourColours>;
							public constructor();
							public setBeforeColour(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getAfterColour(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma;
							public getStartColour(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
							public getEndColour(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma;
							public setStartColour(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
							public setEndColour(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
							public getBeforeColour(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma;
							public setAfterColour(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace taggedpdf {
						export class PDLayoutAttributeObject extends com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDStandardAttributeObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDLayoutAttributeObject>;
							public static OWNER_LAYOUT: string = "Layout";
							public static PLACEMENT_BLOCK: string = "Block";
							public static PLACEMENT_INLINE: string = "Inline";
							public static PLACEMENT_BEFORE: string = "Before";
							public static PLACEMENT_START: string = "Start";
							public static PLACEMENT_END: string = "End";
							public static WRITING_MODE_LRTB: string = "LrTb";
							public static WRITING_MODE_RLTB: string = "RlTb";
							public static WRITING_MODE_TBRL: string = "TbRl";
							public static BORDER_STYLE_NONE: string = "None";
							public static BORDER_STYLE_HIDDEN: string = "Hidden";
							public static BORDER_STYLE_DOTTED: string = "Dotted";
							public static BORDER_STYLE_DASHED: string = "Dashed";
							public static BORDER_STYLE_SOLID: string = "Solid";
							public static BORDER_STYLE_DOUBLE: string = "Double";
							public static BORDER_STYLE_GROOVE: string = "Groove";
							public static BORDER_STYLE_RIDGE: string = "Ridge";
							public static BORDER_STYLE_INSET: string = "Inset";
							public static BORDER_STYLE_OUTSET: string = "Outset";
							public static TEXT_ALIGN_START: string = "Start";
							public static TEXT_ALIGN_CENTER: string = "Center";
							public static TEXT_ALIGN_END: string = "End";
							public static TEXT_ALIGN_JUSTIFY: string = "Justify";
							public static WIDTH_AUTO: string = "Auto";
							public static HEIGHT_AUTO: string = "Auto";
							public static BLOCK_ALIGN_BEFORE: string = "Before";
							public static BLOCK_ALIGN_MIDDLE: string = "Middle";
							public static BLOCK_ALIGN_AFTER: string = "After";
							public static BLOCK_ALIGN_JUSTIFY: string = "Justify";
							public static INLINE_ALIGN_START: string = "Start";
							public static INLINE_ALIGN_CENTER: string = "Center";
							public static INLINE_ALIGN_END: string = "End";
							public static LINE_HEIGHT_NORMAL: string = "Normal";
							public static LINE_HEIGHT_AUTO: string = "Auto";
							public static TEXT_DECORATION_TYPE_NONE: string = "None";
							public static TEXT_DECORATION_TYPE_UNDERLINE: string = "Underline";
							public static TEXT_DECORATION_TYPE_OVERLINE: string = "Overline";
							public static TEXT_DECORATION_TYPE_LINE_THROUGH: string = "LineThrough";
							public static RUBY_ALIGN_START: string = "Start";
							public static RUBY_ALIGN_CENTER: string = "Center";
							public static RUBY_ALIGN_END: string = "End";
							public static RUBY_ALIGN_JUSTIFY: string = "Justify";
							public static RUBY_ALIGN_DISTRIBUTE: string = "Distribute";
							public static RUBY_POSITION_BEFORE: string = "Before";
							public static RUBY_POSITION_AFTER: string = "After";
							public static RUBY_POSITION_WARICHU: string = "Warichu";
							public static RUBY_POSITION_INLINE: string = "Inline";
							public static GLYPH_ORIENTATION_VERTICAL_AUTO: string = "Auto";
							public static GLYPH_ORIENTATION_VERTICAL_MINUS_180_DEGREES: string = "-180";
							public static GLYPH_ORIENTATION_VERTICAL_MINUS_90_DEGREES: string = "-90";
							public static GLYPH_ORIENTATION_VERTICAL_ZERO_DEGREES: string = "0";
							public static GLYPH_ORIENTATION_VERTICAL_90_DEGREES: string = "90";
							public static GLYPH_ORIENTATION_VERTICAL_180_DEGREES: string = "180";
							public static GLYPH_ORIENTATION_VERTICAL_270_DEGREES: string = "270";
							public static GLYPH_ORIENTATION_VERTICAL_360_DEGREES: string = "360";
							public setWidthAuto(): void;
							public setBorderStyles(param0: androidNative.Array<string>): void;
							public setLineHeightAuto(): void;
							public getBorderStyle(): any;
							public getBackgroundColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma;
							public getBaselineShift(): number;
							public setLineHeightNormal(): void;
							public setBackgroundColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
							public setAllBorderStyles(param0: string): void;
							public getColumnCount(): number;
							public setAllBorderColors(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
							public getRubyAlign(): string;
							public setTBorderStyles(param0: androidNative.Array<string>): void;
							public setAllTPaddings(param0: number): void;
							public setHeightAuto(): void;
							public setAllBorderThicknesses(param0: number): void;
							public setTextDecorationColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
							public getTextDecorationThickness(): number;
							public setAllPaddings(param0: number): void;
							public setBaselineShift(param0: number): void;
							public setWritingMode(param0: string): void;
							public setBorderThicknesses(param0: androidNative.Array<number>): void;
							public getWritingMode(): string;
							public setInlineAlign(param0: string): void;
							public setTextDecorationType(param0: string): void;
							public getBorderColors(): any;
							public setRubyPosition(param0: string): void;
							public setAllColumnWidths(param0: number): void;
							public getBlockAlign(): string;
							public getGlyphOrientationVertical(): string;
							public getTPadding(): any;
							public getTextAlign(): string;
							public getRubyPosition(): string;
							public setPaddings(param0: androidNative.Array<number>): void;
							public setWidth(param0: number): void;
							public setEndIndent(param0: number): void;
							public getHeight(): any;
							public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public setTextDecorationThickness(param0: number): void;
							public getTBorderStyle(): any;
							public toString(): string;
							public setPlacement(param0: string): void;
							public getPadding(): any;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setBlockAlign(param0: string): void;
							public setRubyAlign(param0: string): void;
							public getSpaceAfter(): number;
							public getColor(param0: string): com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma;
							public setColumnCount(param0: number): void;
							public getEndIndent(): number;
							public setSpaceBefore(param0: number): void;
							public setBorderColors(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDFourColours): void;
							public getTextDecorationType(): string;
							public setTextIndent(param0: number): void;
							public setHeight(param0: number): void;
							public getLineHeight(): any;
							public getColumnWidths(): any;
							public constructor();
							public setStartIndent(param0: number): void;
							public setAllTBorderStyles(param0: string): void;
							public setColor(param0: string, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
							public getColumnGap(): any;
							public getSpaceBefore(): number;
							public setBBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
							public getPlacement(): string;
							public setTPaddings(param0: androidNative.Array<number>): void;
							public setLineHeight(param0: number): void;
							public setColumnGap(param0: number): void;
							public setColumnGaps(param0: androidNative.Array<number>): void;
							public setGlyphOrientationVertical(param0: string): void;
							public getTextIndent(): number;
							public getColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma;
							public setColumnWidths(param0: androidNative.Array<number>): void;
							public getBorderThickness(): any;
							public setColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getStartIndent(): number;
							public setSpaceAfter(param0: number): void;
							public getInlineAlign(): string;
							public getWidth(): any;
							public setTextAlign(param0: string): void;
							public getTextDecorationColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace taggedpdf {
						export class PDListAttributeObject extends com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDStandardAttributeObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDListAttributeObject>;
							public static OWNER_LIST: string = "List";
							public static LIST_NUMBERING: string = "ListNumbering";
							public static LIST_NUMBERING_CIRCLE: string = "Circle";
							public static LIST_NUMBERING_DECIMAL: string = "Decimal";
							public static LIST_NUMBERING_DISC: string = "Disc";
							public static LIST_NUMBERING_LOWER_ALPHA: string = "LowerAlpha";
							public static LIST_NUMBERING_LOWER_ROMAN: string = "LowerRoman";
							public static LIST_NUMBERING_NONE: string = "None";
							public static LIST_NUMBERING_SQUARE: string = "Square";
							public static LIST_NUMBERING_UPPER_ALPHA: string = "UpperAlpha";
							public static LIST_NUMBERING_UPPER_ROMAN: string = "UpperRoman";
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setListNumbering(param0: string): void;
							public toString(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getListNumbering(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace taggedpdf {
						export class PDPrintFieldAttributeObject extends com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDStandardAttributeObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDPrintFieldAttributeObject>;
							public static OWNER_PRINT_FIELD: string = "PrintField";
							public static ROLE_RB: string = "rb";
							public static ROLE_CB: string = "cb";
							public static ROLE_PB: string = "pb";
							public static ROLE_TV: string = "tv";
							public static CHECKED_STATE_ON: string = "on";
							public static CHECKED_STATE_OFF: string = "off";
							public static CHECKED_STATE_NEUTRAL: string = "neutral";
							public constructor();
							public setCheckedState(param0: string): void;
							public getAlternateName(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getRole(): string;
							public setRole(param0: string): void;
							public toString(): string;
							public setAlternateName(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getCheckedState(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace taggedpdf {
						export abstract class PDStandardAttributeObject extends com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDAttributeObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDStandardAttributeObject>;
							public static UNSPECIFIED: number = -1.0;
							public getArrayOfString(param0: string): androidNative.Array<string>;
							public getNumber(param0: string, param1: number): number;
							public setFourColors(param0: string, param1: com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDFourColours): void;
							public setString(param0: string, param1: string): void;
							public setArrayOfNumber(param0: string, param1: androidNative.Array<number>): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setArrayOfName(param0: string, param1: androidNative.Array<string>): void;
							public getName(param0: string): string;
							public getName(param0: string, param1: string): string;
							public getNameOrArrayOfName(param0: string, param1: string): any;
							public getColor(param0: string): com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma;
							public setInteger(param0: string, param1: number): void;
							public constructor();
							public setArrayOfString(param0: string, param1: androidNative.Array<string>): void;
							public getNumber(param0: string): number;
							public setName(param0: string, param1: string): void;
							public setColor(param0: string, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma): void;
							public isSpecified(param0: string): boolean;
							public getInteger(param0: string, param1: number): number;
							public getNumberOrName(param0: string, param1: string): any;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getString(param0: string): string;
							public getNumberOrArrayOfNumber(param0: string, param1: number): any;
							public getColorOrFourColors(param0: string): any;
							public setNumber(param0: string, param1: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace taggedpdf {
						export class PDTableAttributeObject extends com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDStandardAttributeObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.PDTableAttributeObject>;
							public static OWNER_TABLE: string = "Table";
							public static ROW_SPAN: string = "RowSpan";
							public static COL_SPAN: string = "ColSpan";
							public static HEADERS: string = "Headers";
							public static SCOPE: string = "Scope";
							public static SUMMARY: string = "Summary";
							public static SCOPE_BOTH: string = "Both";
							public static SCOPE_COLUMN: string = "Column";
							public static SCOPE_ROW: string = "Row";
							public constructor();
							public setHeaders(param0: androidNative.Array<string>): void;
							public setRowSpan(param0: number): void;
							public getRowSpan(): number;
							public toString(): string;
							public getScope(): string;
							public setScope(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getSummary(): string;
							public setSummary(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setColSpan(param0: number): void;
							public getHeaders(): androidNative.Array<string>;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getColSpan(): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace documentinterchange {
					export namespace taggedpdf {
						export class StandardStructureTypes extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.documentinterchange.taggedpdf.StandardStructureTypes>;
							public static DOCUMENT: string = "Document";
							public static PART: string = "Part";
							public static ART: string = "Art";
							public static SECT: string = "Sect";
							public static DIV: string = "Div";
							public static BLOCK_QUOTE: string = "BlockQuote";
							public static CAPTION: string = "Caption";
							public static TOC: string = "TOC";
							public static TOCI: string = "TOCI";
							public static INDEX: string = "Index";
							public static NON_STRUCT: string = "NonStruct";
							public static PRIVATE: string = "Private";
							public static LBL: string = "Lbl";
							public static L_BODY: string = "LBody";
							public static TABLE: string = "Table";
							public static T_HEAD: string = "THead";
							public static T_BODY: string = "TBody";
							public static T_FOOT: string = "TFoot";
							public static SPAN: string = "Span";
							public static QUOTE: string = "Quote";
							public static NOTE: string = "Note";
							public static REFERENCE: string = "Reference";
							public static BIB_ENTRY: string = "BibEntry";
							public static CODE: string = "Code";
							public static LINK: string = "Link";
							public static ANNOT: string = "Annot";
							public static RUBY: string = "Ruby";
							public static WARICHU: string = "Warichu";
							public static Figure: string = "Figure";
							public static FORMULA: string = "Formula";
							public static FORM: string = "Form";
							public static types: java.util.List<string>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class AccessPermission extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission>;
						public canAssembleDocument(): boolean;
						public canExtractContent(): boolean;
						public setCanExtractForAccessibility(param0: boolean): void;
						public setReadOnly(): void;
						public setCanModify(param0: boolean): void;
						public setCanExtractContent(param0: boolean): void;
						public constructor(param0: androidNative.Array<number>);
						public canPrint(): boolean;
						public getPermissionBytes(): number;
						public setCanModifyAnnotations(param0: boolean): void;
						public isReadOnly(): boolean;
						public constructor();
						public hasAnyRevision3PermissionSet(): boolean;
						public canModifyAnnotations(): boolean;
						public setCanFillInForm(param0: boolean): void;
						public setCanAssembleDocument(param0: boolean): void;
						public setCanPrint(param0: boolean): void;
						public getPermissionBytesForPublicKey(): number;
						/** @deprecated */
						public setCanPrintDegraded(param0: boolean): void;
						/** @deprecated */
						public canPrintDegraded(): boolean;
						public static getOwnerAccessPermission(): com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission;
						public canExtractForAccessibility(): boolean;
						public isOwnerPermission(): boolean;
						public constructor(param0: number);
						public canPrintFaithful(): boolean;
						public setCanPrintFaithful(param0: boolean): void;
						public canModify(): boolean;
						public canFillInForm(): boolean;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export abstract class DecryptionMaterial extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.DecryptionMaterial>;
						public constructor();
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class InvalidPasswordException extends java.io.IOException {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.InvalidPasswordException>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class MessageDigests extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.MessageDigests>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class PDCryptFilterDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.PDCryptFilterDictionary>;
						public cryptFilterDictionary: com.tom_roush.pdfbox.cos.COSDictionary;
						public constructor();
						public setEncryptMetaData(param0: boolean): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getLength(): number;
						public setLength(param0: number): void;
						public setCryptFilterMethod(param0: com.tom_roush.pdfbox.cos.COSName): void;
						public isEncryptMetaData(): boolean;
						public getCryptFilterMethod(): com.tom_roush.pdfbox.cos.COSName;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						/** @deprecated */
						public getCOSDictionary(): com.tom_roush.pdfbox.cos.COSDictionary;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class PDEncryption extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.PDEncryption>;
						public static VERSION0_UNDOCUMENTED_UNSUPPORTED: number = 0;
						public static VERSION1_40_BIT_ALGORITHM: number = 1;
						public static VERSION2_VARIABLE_LENGTH_ALGORITHM: number = 2;
						public static VERSION3_UNPUBLISHED_ALGORITHM: number = 3;
						public static VERSION4_SECURITY_HANDLER: number = 4;
						public static DEFAULT_NAME: string = "Standard";
						public static DEFAULT_LENGTH: number = 40;
						public static DEFAULT_VERSION: number = 0;
						public setFilter(param0: string): void;
						public setUserKey(param0: androidNative.Array<number>): void;
						public getUserEncryptionKey(): androidNative.Array<number>;
						public getRecipientStringAt(param0: number): com.tom_roush.pdfbox.cos.COSString;
						public getSubFilter(): string;
						public getStdCryptFilterDictionary(): com.tom_roush.pdfbox.pdmodel.encryption.PDCryptFilterDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setVersion(param0: number): void;
						public getLength(): number;
						public getDefaultCryptFilterDictionary(): com.tom_roush.pdfbox.pdmodel.encryption.PDCryptFilterDictionary;
						public setOwnerKey(param0: androidNative.Array<number>): void;
						public setDefaultCryptFilterDictionary(param0: com.tom_roush.pdfbox.pdmodel.encryption.PDCryptFilterDictionary): void;
						/** @deprecated */
						public getCOSDictionary(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getUserKey(): androidNative.Array<number>;
						public getRecipientsLength(): number;
						public getFilter(): string;
						public setStdCryptFilterDictionary(param0: com.tom_roush.pdfbox.pdmodel.encryption.PDCryptFilterDictionary): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getStringFilterName(): com.tom_roush.pdfbox.cos.COSName;
						public setUserEncryptionKey(param0: androidNative.Array<number>): void;
						public isEncryptMetaData(): boolean;
						public setOwnerEncryptionKey(param0: androidNative.Array<number>): void;
						public setCryptFilterDictionary(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.encryption.PDCryptFilterDictionary): void;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public constructor();
						public getPermissions(): number;
						public getStreamFilterName(): com.tom_roush.pdfbox.cos.COSName;
						public setStringFilterName(param0: com.tom_roush.pdfbox.cos.COSName): void;
						public getVersion(): number;
						public setPerms(param0: androidNative.Array<number>): void;
						public setPermissions(param0: number): void;
						public setRecipients(param0: androidNative.Array<androidNative.Array<number>>): void;
						public getSecurityHandler(): com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandler;
						public setSubFilter(param0: string): void;
						public setStreamFilterName(param0: com.tom_roush.pdfbox.cos.COSName): void;
						public getCryptFilterDictionary(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.encryption.PDCryptFilterDictionary;
						public removeV45filters(): void;
						public getRevision(): number;
						public getOwnerKey(): androidNative.Array<number>;
						public getOwnerEncryptionKey(): androidNative.Array<number>;
						public setRevision(param0: number): void;
						public getPerms(): androidNative.Array<number>;
						public setSecurityHandler(param0: com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandler): void;
						public setLength(param0: number): void;
						public hasSecurityHandler(): boolean;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class PDEncryptionDictionary extends com.tom_roush.pdfbox.pdmodel.encryption.PDEncryption {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.PDEncryptionDictionary>;
						public constructor();
						/** @deprecated */
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						/** @deprecated */
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export abstract class ProtectionPolicy extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.ProtectionPolicy>;
						public getEncryptionKeyLength(): number;
						public constructor();
						public isPreferAES(): boolean;
						public setPreferAES(param0: boolean): void;
						public setEncryptionKeyLength(param0: number): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class PublicKeyDecryptionMaterial extends com.tom_roush.pdfbox.pdmodel.encryption.DecryptionMaterial {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.PublicKeyDecryptionMaterial>;
						public constructor();
						public getPassword(): string;
						public constructor(param0: java.security.KeyStore, param1: string, param2: string);
						public getPrivateKey(): java.security.Key;
						public getCertificate(): java.security.cert.X509Certificate;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class PublicKeyProtectionPolicy extends com.tom_roush.pdfbox.pdmodel.encryption.ProtectionPolicy {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.PublicKeyProtectionPolicy>;
						public setDecryptionCertificate(param0: java.security.cert.X509Certificate): void;
						public constructor();
						public getDecryptionCertificate(): java.security.cert.X509Certificate;
						public removeRecipient(param0: com.tom_roush.pdfbox.pdmodel.encryption.PublicKeyRecipient): boolean;
						public getRecipientsIterator(): java.util.Iterator<com.tom_roush.pdfbox.pdmodel.encryption.PublicKeyRecipient>;
						public addRecipient(param0: com.tom_roush.pdfbox.pdmodel.encryption.PublicKeyRecipient): void;
						public getNumberOfRecipients(): number;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class PublicKeyRecipient extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.PublicKeyRecipient>;
						public constructor();
						public getPermission(): com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission;
						public setPermission(param0: com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission): void;
						public getX509(): java.security.cert.X509Certificate;
						public setX509(param0: java.security.cert.X509Certificate): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class PublicKeySecurityHandler extends com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandler {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.PublicKeySecurityHandler>;
						public static FILTER: string = "Adobe.PubSec";
						public prepareForDecryption(param0: com.tom_roush.pdfbox.pdmodel.encryption.PDEncryption, param1: com.tom_roush.pdfbox.cos.COSArray, param2: com.tom_roush.pdfbox.pdmodel.encryption.DecryptionMaterial): void;
						public constructor();
						public prepareDocumentForEncryption(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.encryption.PublicKeyProtectionPolicy);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class RC4Cipher extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.RC4Cipher>;
						public write(param0: number, param1: java.io.OutputStream): void;
						public write(param0: androidNative.Array<number>, param1: number, param2: number, param3: java.io.OutputStream): void;
						public setKey(param0: androidNative.Array<number>): void;
						public write(param0: androidNative.Array<number>, param1: java.io.OutputStream): void;
						public write(param0: java.io.InputStream, param1: java.io.OutputStream): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class SaslPrep extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.SaslPrep>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export abstract class SecurityHandler extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandler>;
						public keyLength: number;
						public encryptionKey: androidNative.Array<number>;
						public isDecryptMetadata(): boolean;
						public decryptStream(param0: com.tom_roush.pdfbox.cos.COSStream, param1: number, param2: number): void;
						public setDecryptMetadata(param0: boolean): void;
						public setEncryptionKey(param0: androidNative.Array<number>): void;
						public encryptString(param0: com.tom_roush.pdfbox.cos.COSString, param1: number, param2: number): void;
						public setProtectionPolicy(param0: com.tom_roush.pdfbox.pdmodel.encryption.ProtectionPolicy): void;
						public decrypt(param0: com.tom_roush.pdfbox.cos.COSBase, param1: number, param2: number): void;
						public prepareDocumentForEncryption(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
						public setCustomSecureRandom(param0: java.security.SecureRandom): void;
						public constructor();
						public encryptStream(param0: com.tom_roush.pdfbox.cos.COSStream, param1: number, param2: number): void;
						public hasProtectionPolicy(): boolean;
						public getKeyLength(): number;
						public setStringFilterName(param0: com.tom_roush.pdfbox.cos.COSName): void;
						public isAES(): boolean;
						public computeVersionNumber(): number;
						public encryptDataRC4(param0: androidNative.Array<number>, param1: java.io.InputStream, param2: java.io.OutputStream): void;
						public getCurrentAccessPermission(): com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission;
						public getEncryptionKey(): androidNative.Array<number>;
						public setStreamFilterName(param0: com.tom_roush.pdfbox.cos.COSName): void;
						public setAES(param0: boolean): void;
						public prepareForDecryption(param0: com.tom_roush.pdfbox.pdmodel.encryption.PDEncryption, param1: com.tom_roush.pdfbox.cos.COSArray, param2: com.tom_roush.pdfbox.pdmodel.encryption.DecryptionMaterial): void;
						public getProtectionPolicy(): com.tom_roush.pdfbox.pdmodel.encryption.ProtectionPolicy;
						public setKeyLength(param0: number): void;
						public setCurrentAccessPermission(param0: com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission): void;
						public encryptDataRC4(param0: androidNative.Array<number>, param1: androidNative.Array<number>, param2: java.io.OutputStream): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class SecurityHandlerFactory extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandlerFactory>;
						public static INSTANCE: com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandlerFactory;
						public newSecurityHandlerForFilter(param0: string): com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandler;
						public newSecurityHandlerForPolicy(param0: com.tom_roush.pdfbox.pdmodel.encryption.ProtectionPolicy): com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandler;
						public registerHandler(param0: string, param1: java.lang.Class<any>, param2: java.lang.Class<any>): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class SecurityProvider extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.SecurityProvider>;
						public static setProvider(param0: java.security.Provider): void;
						public static getProvider(): java.security.Provider;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class StandardDecryptionMaterial extends com.tom_roush.pdfbox.pdmodel.encryption.DecryptionMaterial {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.StandardDecryptionMaterial>;
						public constructor();
						public getPassword(): string;
						public constructor(param0: string);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class StandardProtectionPolicy extends com.tom_roush.pdfbox.pdmodel.encryption.ProtectionPolicy {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.StandardProtectionPolicy>;
						public getOwnerPassword(): string;
						public constructor();
						public setPermissions(param0: com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission): void;
						public constructor(param0: string, param1: string, param2: com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission);
						public setOwnerPassword(param0: string): void;
						public setUserPassword(param0: string): void;
						public getUserPassword(): string;
						public getPermissions(): com.tom_roush.pdfbox.pdmodel.encryption.AccessPermission;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace encryption {
					export class StandardSecurityHandler extends com.tom_roush.pdfbox.pdmodel.encryption.SecurityHandler {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.encryption.StandardSecurityHandler>;
						public static FILTER: string = "Standard";
						public static PROTECTION_POLICY_CLASS: java.lang.Class<any>;
						public prepareForDecryption(param0: com.tom_roush.pdfbox.pdmodel.encryption.PDEncryption, param1: com.tom_roush.pdfbox.cos.COSArray, param2: com.tom_roush.pdfbox.pdmodel.encryption.DecryptionMaterial): void;
						public constructor();
						public computeUserPassword(param0: androidNative.Array<number>, param1: androidNative.Array<number>, param2: number, param3: androidNative.Array<number>, param4: number, param5: number, param6: boolean): androidNative.Array<number>;
						public isUserPassword(param0: string, param1: androidNative.Array<number>, param2: androidNative.Array<number>, param3: number, param4: androidNative.Array<number>, param5: number, param6: number, param7: boolean): boolean;
						public isUserPassword(param0: androidNative.Array<number>, param1: androidNative.Array<number>, param2: androidNative.Array<number>, param3: number, param4: androidNative.Array<number>, param5: number, param6: number, param7: boolean): boolean;
						public getUserPassword(param0: androidNative.Array<number>, param1: androidNative.Array<number>, param2: number, param3: number): androidNative.Array<number>;
						public isOwnerPassword(param0: string, param1: androidNative.Array<number>, param2: androidNative.Array<number>, param3: number, param4: androidNative.Array<number>, param5: number, param6: number, param7: boolean): boolean;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.encryption.StandardProtectionPolicy);
						public computeEncryptedKey(param0: androidNative.Array<number>, param1: androidNative.Array<number>, param2: androidNative.Array<number>, param3: androidNative.Array<number>, param4: androidNative.Array<number>, param5: number, param6: androidNative.Array<number>, param7: number, param8: number, param9: boolean, param10: boolean): androidNative.Array<number>;
						public computeOwnerPassword(param0: androidNative.Array<number>, param1: androidNative.Array<number>, param2: number, param3: number): androidNative.Array<number>;
						public prepareDocumentForEncryption(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
						public isOwnerPassword(param0: androidNative.Array<number>, param1: androidNative.Array<number>, param2: androidNative.Array<number>, param3: number, param4: androidNative.Array<number>, param5: number, param6: number, param7: boolean): boolean;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export abstract class FDFAnnotation extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation>;
						public annot: com.tom_roush.pdfbox.cos.COSDictionary;
						public getCreationDate(): java.util.Calendar;
						public setBorderEffect(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderEffectDictionary): void;
						public setToggleNoView(param0: boolean): void;
						public isLockedContents(): boolean;
						public static create(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation;
						public setSubject(param0: string): void;
						public getRichContents(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public isReadOnly(): boolean;
						public setRectangle(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
						public getBorderStyle(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary;
						public constructor(param0: org.w3c.dom.Element);
						public getColor(): com.tom_roush.harmony.awt.AWTColor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public isNoView(): boolean;
						public setOpacity(param0: number): void;
						public constructor();
						public setInvisible(param0: boolean): void;
						public getContents(): string;
						public setContents(param0: string): void;
						public isToggleNoView(): boolean;
						public setTitle(param0: string): void;
						public isPrinted(): boolean;
						public getRectangle(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public isNoZoom(): boolean;
						public setLocked(param0: boolean): void;
						public setHidden(param0: boolean): void;
						public getIntent(): string;
						public isNoRotate(): boolean;
						public setPrinted(param0: boolean): void;
						public getDate(): string;
						public getSubject(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setDate(param0: string): void;
						public setNoZoom(param0: boolean): void;
						public setPage(param0: number): void;
						public getName(): string;
						public setReadOnly(param0: boolean): void;
						public setRichContents(param0: string): void;
						public getStringOrStream(param0: com.tom_roush.pdfbox.cos.COSBase): string;
						public getBorderEffect(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderEffectDictionary;
						public setNoView(param0: boolean): void;
						public setBorderStyle(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary): void;
						public getPage(): java.lang.Integer;
						public setNoRotate(param0: boolean): void;
						public setName(param0: string): void;
						public isLocked(): boolean;
						public setIntent(param0: string): void;
						public getOpacity(): number;
						public setCreationDate(param0: java.util.Calendar): void;
						public getTitle(): string;
						public isHidden(): boolean;
						public setLockedContents(param0: boolean): void;
						public isInvisible(): boolean;
						public setColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationCaret extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationCaret>;
						public static SUBTYPE: string = "Caret";
						public constructor();
						public setSymbol(param0: string): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setFringe(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
						public getSymbol(): string;
						public getFringe(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationCircle extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationCircle>;
						public static SUBTYPE: string = "Circle";
						public constructor();
						public setInteriorColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setFringe(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
						public getFringe(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public constructor(param0: org.w3c.dom.Element);
						public getInteriorColor(): com.tom_roush.harmony.awt.AWTColor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationFileAttachment extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationFileAttachment>;
						public static SUBTYPE: string = "FileAttachment";
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationFreeText extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationFreeText>;
						public static SUBTYPE: string = "FreeText";
						public setDefaultAppearance(param0: string): void;
						public constructor();
						public getJustification(): string;
						public setDefaultStyle(param0: string): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setFringe(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
						public getDefaultAppearance(): string;
						public setLineEndingStyle(param0: string): void;
						public getFringe(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public setJustification(param0: string): void;
						public getRotation(): string;
						public getDefaultStyle(): string;
						public getCallout(): androidNative.Array<number>;
						public setRotation(param0: number): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public setCallout(param0: androidNative.Array<number>): void;
						public constructor(param0: org.w3c.dom.Element);
						public getLineEndingStyle(): string;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationHighlight extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationTextMarkup {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationHighlight>;
						public static SUBTYPE: string = "Highlight";
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationInk extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationInk>;
						public static SUBTYPE: string = "Ink";
						public setInkList(param0: java.util.List<androidNative.Array<number>>): void;
						public getInkList(): java.util.List<androidNative.Array<number>>;
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationLine extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationLine>;
						public static SUBTYPE: string = "Line";
						public getLeaderExtend(): number;
						public setLeaderLength(param0: number): void;
						public setCaptionStyle(param0: string): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setLeaderOffset(param0: number): void;
						public getEndPointEndingStyle(): string;
						public setStartPointEndingStyle(param0: string): void;
						public getStartPointEndingStyle(): string;
						public getCaption(): boolean;
						public setLeaderExtend(param0: number): void;
						public getCaptionHorizontalOffset(): number;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public setEndPointEndingStyle(param0: string): void;
						public constructor(param0: org.w3c.dom.Element);
						public getInteriorColor(): com.tom_roush.harmony.awt.AWTColor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public setCaptionVerticalOffset(param0: number): void;
						public constructor();
						public setLine(param0: androidNative.Array<number>): void;
						public getLine(): androidNative.Array<number>;
						public setInteriorColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
						public getLeaderLength(): number;
						public getCaptionStyle(): string;
						public setCaption(param0: boolean): void;
						public getLeaderOffset(): number;
						public setCaptionHorizontalOffset(param0: number): void;
						public getCaptionVerticalOffset(): number;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationLink extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationLink>;
						public static SUBTYPE: string = "Link";
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationPolygon extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationPolygon>;
						public static SUBTYPE: string = "Polygon";
						public constructor();
						public setInteriorColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
						public getVertices(): androidNative.Array<number>;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setVertices(param0: androidNative.Array<number>): void;
						public constructor(param0: org.w3c.dom.Element);
						public getInteriorColor(): com.tom_roush.harmony.awt.AWTColor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationPolyline extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationPolyline>;
						public static SUBTYPE: string = "Polyline";
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getEndPointEndingStyle(): string;
						public setStartPointEndingStyle(param0: string): void;
						public setInteriorColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
						public getVertices(): androidNative.Array<number>;
						public getStartPointEndingStyle(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public setVertices(param0: androidNative.Array<number>): void;
						public setEndPointEndingStyle(param0: string): void;
						public constructor(param0: org.w3c.dom.Element);
						public getInteriorColor(): com.tom_roush.harmony.awt.AWTColor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationSound extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationSound>;
						public static SUBTYPE: string = "Sound";
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationSquare extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationSquare>;
						public static SUBTYPE: string = "Square";
						public constructor();
						public setInteriorColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setFringe(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
						public getFringe(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public constructor(param0: org.w3c.dom.Element);
						public getInteriorColor(): com.tom_roush.harmony.awt.AWTColor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationSquiggly extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationTextMarkup {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationSquiggly>;
						public static SUBTYPE: string = "Squiggly";
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationStamp extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationStamp>;
						public static SUBTYPE: string = "Stamp";
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationStrikeOut extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationTextMarkup {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationStrikeOut>;
						public static SUBTYPE: string = "StrikeOut";
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationText extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationText>;
						public static SUBTYPE: string = "Text";
						public getIcon(): string;
						public setStateModel(param0: string): void;
						public constructor();
						public getState(): string;
						public getStateModel(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setIcon(param0: string): void;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public setState(param0: string): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export abstract class FDFAnnotationTextMarkup extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationTextMarkup>;
						public constructor();
						public setCoords(param0: androidNative.Array<number>): void;
						public getCoords(): androidNative.Array<number>;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFAnnotationUnderline extends com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationTextMarkup {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotationUnderline>;
						public static SUBTYPE: string = "Underline";
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFCatalog extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFCatalog>;
						public getFDF(): com.tom_roush.pdfbox.pdmodel.fdf.FDFDictionary;
						public constructor();
						public getVersion(): string;
						public setVersion(param0: string): void;
						public setSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getSignature(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;
						public setFDF(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFDictionary): void;
						public constructor(param0: org.w3c.dom.Element);
						public writeXML(param0: java.io.Writer): void;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFDictionary>;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setID(param0: com.tom_roush.pdfbox.cos.COSArray): void;
						public setFields(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFField>): void;
						public getTarget(): string;
						public writeXML(param0: java.io.Writer): void;
						public getFields(): java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFField>;
						public getJavaScript(): com.tom_roush.pdfbox.pdmodel.fdf.FDFJavaScript;
						public getEmbeddedFDFs(): java.util.List<com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification>;
						public setTarget(param0: string): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getEncoding(): string;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public constructor();
						public getPages(): java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFPage>;
						public setAnnotations(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation>): void;
						public setJavaScript(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFJavaScript): void;
						public setDifferences(param0: com.tom_roush.pdfbox.cos.COSStream): void;
						public getID(): com.tom_roush.pdfbox.cos.COSArray;
						public getStatus(): string;
						public setPages(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFPage>): void;
						public setEmbeddedFDFs(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification>): void;
						public getDifferences(): com.tom_roush.pdfbox.cos.COSStream;
						public getFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
						public setStatus(param0: string): void;
						public setEncoding(param0: string): void;
						public setFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
						public getAnnotations(): java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFAnnotation>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFDocument extends java.lang.Object implements java.io.Closeable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument>;
						public static load(param0: java.io.File): com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument;
						public save(param0: java.io.File): void;
						public constructor();
						public static load(param0: string): com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDocument);
						public close(): void;
						public saveXFDF(param0: java.io.File): void;
						public getDocument(): com.tom_roush.pdfbox.cos.COSDocument;
						public setCatalog(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFCatalog): void;
						public constructor(param0: org.w3c.dom.Document);
						public static load(param0: java.io.InputStream): com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument;
						public writeXML(param0: java.io.Writer): void;
						public static loadXFDF(param0: java.io.File): com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument;
						public save(param0: java.io.OutputStream): void;
						public saveXFDF(param0: java.io.Writer): void;
						public static loadXFDF(param0: string): com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument;
						public save(param0: string): void;
						public saveXFDF(param0: string): void;
						public static loadXFDF(param0: java.io.InputStream): com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument;
						public getCatalog(): com.tom_roush.pdfbox.pdmodel.fdf.FDFCatalog;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFField extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFField>;
						public setOptions(param0: java.util.List<any>): void;
						public setSetWidgetFieldFlags(param0: number): void;
						public setFieldFlags(param0: java.lang.Integer): void;
						public setSetFieldFlags(param0: number): void;
						public getPartialFieldName(): string;
						public getValue(): any;
						public setClearWidgetFieldFlags(param0: java.lang.Integer): void;
						public setRichText(param0: com.tom_roush.pdfbox.cos.COSStream): void;
						public getFieldFlags(): java.lang.Integer;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public writeXML(param0: java.io.Writer): void;
						public getCOSValue(): com.tom_roush.pdfbox.cos.COSBase;
						public setWidgetFieldFlags(param0: java.lang.Integer): void;
						public getClearWidgetFieldFlags(): java.lang.Integer;
						public setValue(param0: any): void;
						public setValue(param0: com.tom_roush.pdfbox.cos.COSBase): void;
						public setIconFit(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFIconFit): void;
						public setSetFieldFlags(param0: java.lang.Integer): void;
						public getClearFieldFlags(): java.lang.Integer;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getWidgetFieldFlags(): java.lang.Integer;
						public getOptions(): java.util.List<any>;
						public constructor(param0: org.w3c.dom.Element);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public setAppearanceDictionary(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceDictionary): void;
						public constructor();
						public setAdditionalActions(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAdditionalActions): void;
						public getKids(): java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFField>;
						public setKids(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFField>): void;
						public setClearWidgetFieldFlags(param0: number): void;
						public setWidgetFieldFlags(param0: number): void;
						public getSetWidgetFieldFlags(): java.lang.Integer;
						public getAction(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
						public setClearFieldFlags(param0: number): void;
						public getRichText(): string;
						public setPartialFieldName(param0: string): void;
						public getIconFit(): com.tom_roush.pdfbox.pdmodel.fdf.FDFIconFit;
						public getAppearanceDictionary(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceDictionary;
						public setAction(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
						public setFieldFlags(param0: number): void;
						public setClearFieldFlags(param0: java.lang.Integer): void;
						public getAppearanceStreamReference(): com.tom_roush.pdfbox.pdmodel.fdf.FDFNamedPageReference;
						public getAdditionalActions(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAdditionalActions;
						public setSetWidgetFieldFlags(param0: java.lang.Integer): void;
						public setRichText(param0: com.tom_roush.pdfbox.cos.COSString): void;
						public getSetFieldFlags(): java.lang.Integer;
						public setAppearanceStreamReference(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFNamedPageReference): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFIconFit extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFIconFit>;
						public static SCALE_OPTION_ALWAYS: string = "A";
						public static SCALE_OPTION_ONLY_WHEN_ICON_IS_BIGGER: string = "B";
						public static SCALE_OPTION_ONLY_WHEN_ICON_IS_SMALLER: string = "S";
						public static SCALE_OPTION_NEVER: string = "N";
						public static SCALE_TYPE_ANAMORPHIC: string = "A";
						public static SCALE_TYPE_PROPORTIONAL: string = "P";
						public getScaleType(): string;
						public getScaleOption(): string;
						public getFractionalSpaceToAllocate(): com.tom_roush.pdfbox.pdmodel.common.PDRange;
						public constructor();
						public setScaleType(param0: string): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setFractionalSpaceToAllocate(param0: com.tom_roush.pdfbox.pdmodel.common.PDRange): void;
						public setScaleOption(param0: string): void;
						public shouldScaleToFitAnnotation(): boolean;
						public setScaleToFitAnnotation(param0: boolean): void;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFJavaScript extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFJavaScript>;
						public getDoc(): java.util.Map<string,com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript>;
						public constructor();
						public setAfter(param0: string): void;
						public setDoc(param0: java.util.Map<string,com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript>): void;
						public getAfter(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setBefore(param0: string): void;
						public getBefore(): string;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFNamedPageReference extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFNamedPageReference>;
						public constructor();
						public setName(param0: string): void;
						public setFileSpecification(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getName(): string;
						public getFileSpecification(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFOptionElement extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFOptionElement>;
						public constructor();
						public setOption(param0: string): void;
						public getCOSArray(): com.tom_roush.pdfbox.cos.COSArray;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getDefaultAppearanceString(): string;
						public setDefaultAppearanceString(param0: string): void;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
						public getOption(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFPage extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFPage>;
						public constructor();
						public setPageInfo(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFPageInfo): void;
						public getPageInfo(): com.tom_roush.pdfbox.pdmodel.fdf.FDFPageInfo;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public setTemplates(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFTemplate>): void;
						public getTemplates(): java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFTemplate>;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFPageInfo extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFPageInfo>;
						public constructor();
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class FDFTemplate extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.FDFTemplate>;
						public setTemplateReference(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFNamedPageReference): void;
						public constructor();
						public setRename(param0: boolean): void;
						public shouldRename(): boolean;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getTemplateReference(): com.tom_roush.pdfbox.pdmodel.fdf.FDFNamedPageReference;
						public setFields(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFField>): void;
						public getFields(): java.util.List<com.tom_roush.pdfbox.pdmodel.fdf.FDFField>;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fdf {
					export class XMLUtil extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fdf.XMLUtil>;
						public static getNodeValue(param0: org.w3c.dom.Element): string;
						public static parse(param0: java.io.InputStream): org.w3c.dom.Document;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fixup {
					export abstract class AbstractFixup extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.fixup.PDDocumentFixup {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fixup.AbstractFixup>;
						public document: com.tom_roush.pdfbox.pdmodel.PDDocument;
						public apply(): void;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fixup {
					export class AcroFormDefaultFixup extends com.tom_roush.pdfbox.pdmodel.fixup.AbstractFixup {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fixup.AcroFormDefaultFixup>;
						public apply(): void;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fixup {
					export class PDDocumentFixup extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fixup.PDDocumentFixup>;
						/**
						 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.fixup.PDDocumentFixup interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							apply(): void;
						});
						public constructor();
						public apply(): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fixup {
					export namespace processor {
						export abstract class AbstractProcessor extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.fixup.processor.PDDocumentProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fixup.processor.AbstractProcessor>;
							public document: com.tom_roush.pdfbox.pdmodel.PDDocument;
							public process(): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fixup {
					export namespace processor {
						export class AcroFormDefaultsProcessor extends com.tom_roush.pdfbox.pdmodel.fixup.processor.AbstractProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fixup.processor.AcroFormDefaultsProcessor>;
							public process(): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fixup {
					export namespace processor {
						export class AcroFormGenerateAppearancesProcessor extends com.tom_roush.pdfbox.pdmodel.fixup.processor.AbstractProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fixup.processor.AcroFormGenerateAppearancesProcessor>;
							public process(): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fixup {
					export namespace processor {
						export class AcroFormOrphanWidgetsProcessor extends com.tom_roush.pdfbox.pdmodel.fixup.processor.AbstractProcessor {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fixup.processor.AcroFormOrphanWidgetsProcessor>;
							public process(): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace fixup {
					export namespace processor {
						export class PDDocumentProcessor extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.fixup.processor.PDDocumentProcessor>;
							/**
							 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.fixup.processor.PDDocumentProcessor interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								process(): void;
							});
							public constructor();
							public process(): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class CIDFontMapping extends com.tom_roush.pdfbox.pdmodel.font.FontMapping<com.tom_roush.fontbox.ttf.OpenTypeFont> {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.CIDFontMapping>;
						public constructor(param0: any, param1: boolean);
						public getTrueTypeFont(): com.tom_roush.fontbox.FontBoxFont;
						public constructor(param0: com.tom_roush.fontbox.ttf.OpenTypeFont, param1: com.tom_roush.fontbox.FontBoxFont, param2: boolean);
						public isCIDFont(): boolean;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class CIDSystemInfo extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.CIDSystemInfo>;
						public getOrdering(): string;
						public getRegistry(): string;
						public constructor(param0: string, param1: string, param2: number);
						public getSupplement(): number;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class CMapManager extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.CMapManager>;
						public static parseCMap(param0: java.io.InputStream): com.tom_roush.fontbox.cmap.CMap;
						public static getPredefinedCMap(param0: string): com.tom_roush.fontbox.cmap.CMap;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class FileSystemFontProvider extends com.tom_roush.pdfbox.pdmodel.font.FontProvider {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FileSystemFontProvider>;
						public toDebugString(): string;
						public getFontInfo(): java.util.List<any>;
					}
					export namespace FileSystemFontProvider {
						export class FSFontInfo extends com.tom_roush.pdfbox.pdmodel.font.FontInfo {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FileSystemFontProvider.FSFontInfo>;
							public getPostScriptName(): string;
							public getWeightClass(): number;
							public getCIDSystemInfo(): com.tom_roush.pdfbox.pdmodel.font.CIDSystemInfo;
							public getMacStyle(): number;
							public getPanose(): com.tom_roush.pdfbox.pdmodel.font.PDPanoseClassification;
							public toString(): string;
							public getFamilyClass(): number;
							public getCodePageRange2(): number;
							public getFormat(): com.tom_roush.pdfbox.pdmodel.font.FontFormat;
							public getCodePageRange1(): number;
							public getFont(): com.tom_roush.fontbox.FontBoxFont;
						}
						export class FSIgnored extends com.tom_roush.pdfbox.pdmodel.font.FileSystemFontProvider.FSFontInfo {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FileSystemFontProvider.FSIgnored>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class FontCache extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontCache>;
						public constructor();
						public getFont(param0: com.tom_roush.pdfbox.pdmodel.font.FontInfo): com.tom_roush.fontbox.FontBoxFont;
						public addFont(param0: com.tom_roush.pdfbox.pdmodel.font.FontInfo, param1: com.tom_roush.fontbox.FontBoxFont): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class FontFormat {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontFormat>;
						public static TTF: com.tom_roush.pdfbox.pdmodel.font.FontFormat;
						public static OTF: com.tom_roush.pdfbox.pdmodel.font.FontFormat;
						public static PFB: com.tom_roush.pdfbox.pdmodel.font.FontFormat;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.font.FontFormat;
						public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.font.FontFormat>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export abstract class FontInfo extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontInfo>;
						public getMacStyle(): number;
						public getFormat(): com.tom_roush.pdfbox.pdmodel.font.FontFormat;
						public getWeightClass(): number;
						public constructor();
						public getFont(): com.tom_roush.fontbox.FontBoxFont;
						public getCodePageRange1(): number;
						public getCIDSystemInfo(): com.tom_roush.pdfbox.pdmodel.font.CIDSystemInfo;
						public getPanose(): com.tom_roush.pdfbox.pdmodel.font.PDPanoseClassification;
						public getPostScriptName(): string;
						public getCodePageRange2(): number;
						public getFamilyClass(): number;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class FontMapper extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontMapper>;
						/**
						 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.font.FontMapper interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getTrueTypeFont(param0: string, param1: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor): com.tom_roush.pdfbox.pdmodel.font.FontMapping<com.tom_roush.fontbox.ttf.TrueTypeFont>;
							getFontBoxFont(param0: string, param1: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor): com.tom_roush.pdfbox.pdmodel.font.FontMapping<com.tom_roush.fontbox.FontBoxFont>;
							getCIDFont(param0: string, param1: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor, param2: com.tom_roush.pdfbox.pdmodel.font.PDCIDSystemInfo): com.tom_roush.pdfbox.pdmodel.font.CIDFontMapping;
						});
						public constructor();
						public getFontBoxFont(param0: string, param1: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor): com.tom_roush.pdfbox.pdmodel.font.FontMapping<com.tom_roush.fontbox.FontBoxFont>;
						public getTrueTypeFont(param0: string, param1: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor): com.tom_roush.pdfbox.pdmodel.font.FontMapping<com.tom_roush.fontbox.ttf.TrueTypeFont>;
						public getCIDFont(param0: string, param1: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor, param2: com.tom_roush.pdfbox.pdmodel.font.PDCIDSystemInfo): com.tom_roush.pdfbox.pdmodel.font.CIDFontMapping;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class FontMapperImpl extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.font.FontMapper {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontMapperImpl>;
						public getProvider(): com.tom_roush.pdfbox.pdmodel.font.FontProvider;
						public getFontCache(): com.tom_roush.pdfbox.pdmodel.font.FontCache;
						public getFontBoxFont(param0: string, param1: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor): com.tom_roush.pdfbox.pdmodel.font.FontMapping<com.tom_roush.fontbox.FontBoxFont>;
						public getTrueTypeFont(param0: string, param1: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor): com.tom_roush.pdfbox.pdmodel.font.FontMapping<com.tom_roush.fontbox.ttf.TrueTypeFont>;
						public addSubstitute(param0: string, param1: string): void;
						public getCIDFont(param0: string, param1: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor, param2: com.tom_roush.pdfbox.pdmodel.font.PDCIDSystemInfo): com.tom_roush.pdfbox.pdmodel.font.CIDFontMapping;
						public setProvider(param0: com.tom_roush.pdfbox.pdmodel.font.FontProvider): void;
					}
					export namespace FontMapperImpl {
						export class DefaultFontProvider extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontMapperImpl.DefaultFontProvider>;
						}
						export class FontMatch extends java.lang.Comparable<com.tom_roush.pdfbox.pdmodel.font.FontMapperImpl.FontMatch> {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontMapperImpl.FontMatch>;
							public compareTo(param0: com.tom_roush.pdfbox.pdmodel.font.FontMapperImpl.FontMatch): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class FontMappers extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontMappers>;
						public static instance(): com.tom_roush.pdfbox.pdmodel.font.FontMapper;
						public static set(param0: com.tom_roush.pdfbox.pdmodel.font.FontMapper): void;
					}
					export namespace FontMappers {
						export class DefaultFontMapper extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontMappers.DefaultFontMapper>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class FontMapping<T>  extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontMapping<any>>;
						public getFont(): T;
						public constructor(param0: T, param1: boolean);
						public isFallback(): boolean;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export abstract class FontProvider extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.FontProvider>;
						public constructor();
						public toDebugString(): string;
						public getFontInfo(): java.util.List<any>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export abstract class PDCIDFont extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable, com.tom_roush.pdfbox.pdmodel.font.PDFontLike, com.tom_roush.pdfbox.pdmodel.font.PDVectorFont {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDCIDFont>;
						public parent: com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public dict: com.tom_roush.pdfbox.cos.COSDictionary;
						public hasExplicitWidth(param0: number): boolean;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public codeToCID(param0: number): number;
						public codeToGID(param0: number): number;
						public encode(param0: number): androidNative.Array<number>;
						public hasGlyph(param0: number): boolean;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getVerticalDisplacementVectorY(param0: number): number;
						public getCIDSystemInfo(): com.tom_roush.pdfbox.pdmodel.font.PDCIDSystemInfo;
						public getPath(param0: number): globalAndroid.graphics.Path;
						public getName(): string;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getWidth(param0: number): number;
						public getAverageFontWidth(): number;
						public isDamaged(): boolean;
						public isEmbedded(): boolean;
						public getBaseFont(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getParent(): com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public getWidthFromFont(param0: number): number;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDCIDFontType0 extends com.tom_roush.pdfbox.pdmodel.font.PDCIDFont {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType0>;
						public getFontBoxFont(): com.tom_roush.fontbox.FontBoxFont;
						public hasExplicitWidth(param0: number): boolean;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.pdmodel.font.PDType0Font);
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public getCFFFont(): com.tom_roush.fontbox.cff.CFFFont;
						public codeToCID(param0: number): number;
						public codeToGID(param0: number): number;
						public hasGlyph(param0: number): boolean;
						public encode(param0: number): androidNative.Array<number>;
						public getHeight(param0: number): number;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getPath(param0: number): globalAndroid.graphics.Path;
						public getName(): string;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getWidth(param0: number): number;
						public getAverageFontWidth(): number;
						public isDamaged(): boolean;
						public isEmbedded(): boolean;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getType2CharString(param0: number): com.tom_roush.fontbox.cff.Type2CharString;
						public getWidthFromFont(param0: number): number;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
					export namespace PDCIDFontType0 {
						export class FF3ByteSource extends java.lang.Object implements com.tom_roush.fontbox.cff.CFFParser.ByteSource {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType0.FF3ByteSource>;
							public getBytes(): androidNative.Array<number>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDCIDFontType2 extends com.tom_roush.pdfbox.pdmodel.font.PDCIDFont {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType2>;
						public hasExplicitWidth(param0: number): boolean;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.pdmodel.font.PDType0Font);
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public codeToCID(param0: number): number;
						public codeToGID(param0: number): number;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.pdmodel.font.PDType0Font, param2: com.tom_roush.fontbox.ttf.TrueTypeFont);
						public encode(param0: number): androidNative.Array<number>;
						public hasGlyph(param0: number): boolean;
						public getHeight(param0: number): number;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getTrueTypeFont(): com.tom_roush.fontbox.ttf.TrueTypeFont;
						public getPath(param0: number): globalAndroid.graphics.Path;
						public getName(): string;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getWidth(param0: number): number;
						public getAverageFontWidth(): number;
						public isDamaged(): boolean;
						public isEmbedded(): boolean;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getWidthFromFont(param0: number): number;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDCIDFontType2Embedder extends com.tom_roush.pdfbox.pdmodel.font.TrueTypeEmbedder {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType2Embedder>;
						public subset(): void;
						public getCIDFont(): com.tom_roush.pdfbox.pdmodel.font.PDCIDFont;
						public addToSubset(param0: number): void;
						public buildSubset(param0: java.io.InputStream, param1: string, param2: java.util.Map<java.lang.Integer,java.lang.Integer>): void;
					}
					export namespace PDCIDFontType2Embedder {
						export class State {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType2Embedder.State>;
							public static FIRST: com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType2Embedder.State;
							public static BRACKET: com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType2Embedder.State;
							public static SERIAL: com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType2Embedder.State;
							public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
							public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType2Embedder.State>;
							public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.font.PDCIDFontType2Embedder.State;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDCIDSystemInfo extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDCIDSystemInfo>;
						public getOrdering(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getRegistry(): string;
						public getSupplement(): number;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export abstract class PDFont extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable, com.tom_roush.pdfbox.pdmodel.font.PDFontLike {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDFont>;
						public static DEFAULT_FONT_MATRIX: com.tom_roush.pdfbox.util.Matrix;
						public dict: com.tom_roush.pdfbox.cos.COSDictionary;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public isStandard14(): boolean;
						public toUnicode(param0: number): string;
						public getType(): string;
						public equals(param0: any): boolean;
						public hashCode(): number;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getName(): string;
						public readCMap(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.fontbox.cmap.CMap;
						public getWidth(param0: number): number;
						public encode(param0: string): androidNative.Array<number>;
						public isDamaged(): boolean;
						public subset(): void;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getStringWidth(param0: string): number;
						public addToSubset(param0: number): void;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public getSubType(): string;
						public isVertical(): boolean;
						public hasExplicitWidth(param0: number): boolean;
						public getStandard14AFM(): com.tom_roush.fontbox.afm.FontMetrics;
						public encode(param0: number): androidNative.Array<number>;
						public readCode(param0: java.io.InputStream): number;
						public getDisplacement(param0: number): com.tom_roush.pdfbox.util.Vector;
						public toUnicode(param0: number, param1: com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList): string;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						public getStandard14Width(param0: number): number;
						public toString(): string;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getAverageFontWidth(): number;
						public getWidths(): java.util.List<java.lang.Float>;
						public getToUnicodeCMap(): com.tom_roush.fontbox.cmap.CMap;
						public isEmbedded(): boolean;
						public setFontDescriptor(param0: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor): void;
						public willBeSubset(): boolean;
						public getWidthFromFont(param0: number): number;
						public getSpaceWidth(): number;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDFontDescriptor extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor>;
						public isItalic(): boolean;
						public isNonSymbolic(): boolean;
						public getAscent(): number;
						public setCharacterSet(param0: string): void;
						public setFontStretch(param0: string): void;
						public setMissingWidth(param0: number): void;
						public setStemV(param0: number): void;
						public getFontBoundingBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public getFontName(): string;
						public setNonSymbolic(param0: boolean): void;
						public setSerif(param0: boolean): void;
						public setFontBoundingBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
						public getMissingWidth(): number;
						public setFontFile2(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream): void;
						public getMaxWidth(): number;
						public getFontFile(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
						public getStemV(): number;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getCapHeight(): number;
						public setForceBold(param0: boolean): void;
						public setSymbolic(param0: boolean): void;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public setCIDSet(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream): void;
						public isFixedPitch(): boolean;
						public setXHeight(param0: number): void;
						public getItalicAngle(): number;
						public setFlags(param0: number): void;
						public getAverageWidth(): number;
						public isScript(): boolean;
						public setAscent(param0: number): void;
						public getDescent(): number;
						public isForceBold(): boolean;
						public getFontWeight(): number;
						public getStemH(): number;
						public getFontFile2(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
						public getFontFamily(): string;
						public setFixedPitch(param0: boolean): void;
						public getPanose(): com.tom_roush.pdfbox.pdmodel.font.PDPanose;
						public getFontStretch(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public isSymbolic(): boolean;
						public setItalic(param0: boolean): void;
						public isAllCap(): boolean;
						public setCapHeight(param0: number): void;
						public setAllCap(param0: boolean): void;
						public setSmallCap(param0: boolean): void;
						public setFontWeight(param0: number): void;
						public setFontName(param0: string): void;
						public isSmallCap(): boolean;
						public getFlags(): number;
						public hasWidths(): boolean;
						public setStemH(param0: number): void;
						public getCharSet(): string;
						public setScript(param0: boolean): void;
						public hasMissingWidth(): boolean;
						public setItalicAngle(param0: number): void;
						public setLeading(param0: number): void;
						public setMaxWidth(param0: number): void;
						public setAverageWidth(param0: number): void;
						public setFontFile(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream): void;
						public setFontFile3(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream): void;
						public getCIDSet(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
						public setFontFamily(param0: string): void;
						public getXHeight(): number;
						public isSerif(): boolean;
						public getLeading(): number;
						public getFontFile3(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
						public setDescent(param0: number): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDFontFactory extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDFontFactory>;
						public static createFont(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.font.PDFont;
						public static createFont(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.pdmodel.ResourceCache): com.tom_roush.pdfbox.pdmodel.font.PDFont;
						/** @deprecated */
						public static createDefaultFont(): com.tom_roush.pdfbox.pdmodel.font.PDFont;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDFontLike extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDFontLike>;
						/**
						 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.font.PDFontLike interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getName(): string;
							getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
							getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
							getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
							getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
							getHeight(param0: number): number;
							getWidth(param0: number): number;
							hasExplicitWidth(param0: number): boolean;
							getWidthFromFont(param0: number): number;
							isEmbedded(): boolean;
							isDamaged(): boolean;
							getAverageFontWidth(): number;
						});
						public constructor();
						public getAverageFontWidth(): number;
						public hasExplicitWidth(param0: number): boolean;
						public isDamaged(): boolean;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public isEmbedded(): boolean;
						public getWidthFromFont(param0: number): number;
						public getName(): string;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
						public getWidth(param0: number): number;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDMMType1Font extends com.tom_roush.pdfbox.pdmodel.font.PDType1Font {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDMMType1Font>;
						public hasExplicitWidth(param0: number): boolean;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding);
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getHeight(param0: number): number;
						public getName(): string;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						/** @deprecated */
						public getHeight(param0: number): number;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream);
						public getWidth(param0: number): number;
						public getAverageFontWidth(): number;
						public isDamaged(): boolean;
						public isEmbedded(): boolean;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getWidthFromFont(param0: number): number;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDPanose extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDPanose>;
						public static LENGTH: number = 12;
						public constructor(param0: androidNative.Array<number>);
						public getPanose(): com.tom_roush.pdfbox.pdmodel.font.PDPanoseClassification;
						public getFamilyClass(): number;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDPanoseClassification extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDPanoseClassification>;
						public static LENGTH: number = 10;
						public getArmStyle(): number;
						public getContrast(): number;
						public getStrokeVariation(): number;
						public getMidline(): number;
						public getLetterform(): number;
						public toString(): string;
						public getFamilyKind(): number;
						public constructor(param0: androidNative.Array<number>);
						public getXHeight(): number;
						public getWeight(): number;
						public getSerifStyle(): number;
						public getBytes(): androidNative.Array<number>;
						public getProportion(): number;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export abstract class PDSimpleFont extends com.tom_roush.pdfbox.pdmodel.font.PDFont {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDSimpleFont>;
						public encoding: com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
						public glyphList: com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList;
						public getPath(param0: string): globalAndroid.graphics.Path;
						public getFontBoxFont(): com.tom_roush.fontbox.FontBoxFont;
						public readEncoding(): void;
						public isStandard14(): boolean;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public toUnicode(param0: number): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public isSymbolic(): boolean;
						public isFontSymbolic(): java.lang.Boolean;
						public getName(): string;
						public getEncoding(): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
						public getWidth(param0: number): number;
						public isDamaged(): boolean;
						public subset(): void;
						public getGlyphList(): com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList;
						public readEncodingFromFont(): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public addToSubset(param0: number): void;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public getSymbolicFlag(): java.lang.Boolean;
						public isVertical(): boolean;
						public hasExplicitWidth(param0: number): boolean;
						public hasGlyph(param0: string): boolean;
						public toUnicode(param0: number, param1: com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList): string;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						public getStandard14Width(param0: number): number;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getAverageFontWidth(): number;
						public isEmbedded(): boolean;
						public willBeSubset(): boolean;
						public getWidthFromFont(param0: number): number;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDTrueTypeFont extends com.tom_roush.pdfbox.pdmodel.font.PDSimpleFont implements com.tom_roush.pdfbox.pdmodel.font.PDVectorFont {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDTrueTypeFont>;
						public getPath(param0: string): globalAndroid.graphics.Path;
						public getFontBoxFont(): com.tom_roush.fontbox.FontBoxFont;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public codeToGID(param0: number): number;
						public hasGlyph(param0: number): boolean;
						public static load(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.File, param2: com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding): com.tom_roush.pdfbox.pdmodel.font.PDTrueTypeFont;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getTrueTypeFont(): com.tom_roush.fontbox.ttf.TrueTypeFont;
						public getName(): string;
						public getWidth(param0: number): number;
						public isDamaged(): boolean;
						public encode(param0: string): androidNative.Array<number>;
						/** @deprecated */
						public static loadTTF(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream): com.tom_roush.pdfbox.pdmodel.font.PDTrueTypeFont;
						public getBaseFont(): string;
						public readEncodingFromFont(): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public hasExplicitWidth(param0: number): boolean;
						public hasGlyph(param0: string): boolean;
						public encode(param0: number): androidNative.Array<number>;
						public readCode(param0: java.io.InputStream): number;
						public getHeight(param0: number): number;
						public getPath(param0: number): globalAndroid.graphics.Path;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						/** @deprecated */
						public static loadTTF(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.File): com.tom_roush.pdfbox.pdmodel.font.PDTrueTypeFont;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getAverageFontWidth(): number;
						public static load(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding): com.tom_roush.pdfbox.pdmodel.font.PDTrueTypeFont;
						public getGIDToCode(): java.util.Map<java.lang.Integer,java.lang.Integer>;
						public isEmbedded(): boolean;
						public static load(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.fontbox.ttf.TrueTypeFont, param2: com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding): com.tom_roush.pdfbox.pdmodel.font.PDTrueTypeFont;
						public getWidthFromFont(param0: number): number;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDTrueTypeFontEmbedder extends com.tom_roush.pdfbox.pdmodel.font.TrueTypeEmbedder {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDTrueTypeFontEmbedder>;
						public subset(): void;
						public getFontEncoding(): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
						public addToSubset(param0: number): void;
						public buildSubset(param0: java.io.InputStream, param1: string, param2: java.util.Map<java.lang.Integer,java.lang.Integer>): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDType0Font extends com.tom_roush.pdfbox.pdmodel.font.PDFont implements com.tom_roush.pdfbox.pdmodel.font.PDVectorFont {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDType0Font>;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public isStandard14(): boolean;
						public toUnicode(param0: number): string;
						public codeToCID(param0: number): number;
						public codeToGID(param0: number): number;
						public hasGlyph(param0: number): boolean;
						public static load(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.fontbox.ttf.TrueTypeFont, param2: boolean): com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public static loadVertical(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: boolean): com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public getName(): string;
						public getWidth(param0: number): number;
						public static load(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.File): com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public encode(param0: string): androidNative.Array<number>;
						public isDamaged(): boolean;
						public subset(): void;
						public static load(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream): com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public getBaseFont(): string;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public addToSubset(param0: number): void;
						public static loadVertical(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream): com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public isVertical(): boolean;
						public hasExplicitWidth(param0: number): boolean;
						public encode(param0: number): androidNative.Array<number>;
						public getCMap(): com.tom_roush.fontbox.cmap.CMap;
						public static loadVertical(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.fontbox.ttf.TrueTypeFont, param2: boolean): com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public getHeight(param0: number): number;
						public readCode(param0: java.io.InputStream): number;
						public getDisplacement(param0: number): com.tom_roush.pdfbox.util.Vector;
						public toUnicode(param0: number, param1: com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList): string;
						public getPath(param0: number): globalAndroid.graphics.Path;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						public getStandard14Width(param0: number): number;
						public toString(): string;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getAverageFontWidth(): number;
						public getDescendantFont(): com.tom_roush.pdfbox.pdmodel.font.PDCIDFont;
						public static loadVertical(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.File): com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public isEmbedded(): boolean;
						public willBeSubset(): boolean;
						public static load(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: boolean): com.tom_roush.pdfbox.pdmodel.font.PDType0Font;
						public getWidthFromFont(param0: number): number;
						public getCMapUCS2(): com.tom_roush.fontbox.cmap.CMap;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDType1CFont extends com.tom_roush.pdfbox.pdmodel.font.PDSimpleFont {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDType1CFont>;
						public getFontBoxFont(): com.tom_roush.fontbox.FontBoxFont;
						public getPath(param0: string): globalAndroid.graphics.Path;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getName(): string;
						public codeToName(param0: number): string;
						public getWidth(param0: number): number;
						public isDamaged(): boolean;
						public encode(param0: string): androidNative.Array<number>;
						public getBaseFont(): string;
						public readEncodingFromFont(): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getStringWidth(param0: string): number;
						public getCFFType1Font(): com.tom_roush.fontbox.cff.CFFType1Font;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public hasExplicitWidth(param0: number): boolean;
						public hasGlyph(param0: string): boolean;
						public encode(param0: number): androidNative.Array<number>;
						public readCode(param0: java.io.InputStream): number;
						public getHeight(param0: number): number;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getAverageFontWidth(): number;
						public isEmbedded(): boolean;
						public getWidthFromFont(param0: number): number;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
					export namespace PDType1CFont {
						export class FF3ByteSource extends java.lang.Object implements com.tom_roush.fontbox.cff.CFFParser.ByteSource {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDType1CFont.FF3ByteSource>;
							public getBytes(): androidNative.Array<number>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDType1Font extends com.tom_roush.pdfbox.pdmodel.font.PDSimpleFont {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDType1Font>;
						public static TIMES_ROMAN: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static TIMES_BOLD: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static TIMES_ITALIC: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static TIMES_BOLD_ITALIC: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static HELVETICA: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static HELVETICA_BOLD: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static HELVETICA_OBLIQUE: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static HELVETICA_BOLD_OBLIQUE: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static COURIER: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static COURIER_BOLD: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static COURIER_OBLIQUE: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static COURIER_BOLD_OBLIQUE: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static SYMBOL: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public static ZAPF_DINGBATS: com.tom_roush.pdfbox.pdmodel.font.PDType1Font;
						public getFontBoxFont(): com.tom_roush.fontbox.FontBoxFont;
						public getPath(param0: string): globalAndroid.graphics.Path;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding);
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getName(): string;
						public codeToName(param0: number): string;
						public getWidth(param0: number): number;
						public encode(param0: string): androidNative.Array<number>;
						public isDamaged(): boolean;
						public getBaseFont(): string;
						public readEncodingFromFont(): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public getType1Font(): com.tom_roush.fontbox.type1.Type1Font;
						public hasExplicitWidth(param0: number): boolean;
						public hasGlyph(param0: string): boolean;
						public encode(param0: number): androidNative.Array<number>;
						public getHeight(param0: number): number;
						public readCode(param0: java.io.InputStream): number;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						/** @deprecated */
						public getHeight(param0: number): number;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream);
						public getAverageFontWidth(): number;
						public isEmbedded(): boolean;
						public getWidthFromFont(param0: number): number;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDType1FontEmbedder extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDType1FontEmbedder>;
						public getType1Font(): com.tom_roush.fontbox.type1.Type1Font;
						public getGlyphList(): com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList;
						public getFontEncoding(): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDType3CharProc extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable, com.tom_roush.pdfbox.contentstream.PDContentStream {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDType3CharProc>;
						public getContentStream(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
						public getMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public getGlyphBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public getWidth(): number;
						public getFont(): com.tom_roush.pdfbox.pdmodel.font.PDType3Font;
						public getContents(): java.io.InputStream;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.font.PDType3Font, param1: com.tom_roush.pdfbox.cos.COSStream);
						public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDType3Font extends com.tom_roush.pdfbox.pdmodel.font.PDSimpleFont {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDType3Font>;
						public getPath(param0: string): globalAndroid.graphics.Path;
						public getFontBoxFont(): com.tom_roush.fontbox.FontBoxFont;
						public readEncoding(): void;
						public getFontMatrix(): com.tom_roush.pdfbox.util.Matrix;
						public isStandard14(): boolean;
						public getCharProc(param0: number): com.tom_roush.pdfbox.pdmodel.font.PDType3CharProc;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getName(): string;
						public isFontSymbolic(): java.lang.Boolean;
						public getWidth(param0: number): number;
						public encode(param0: string): androidNative.Array<number>;
						public isDamaged(): boolean;
						public readEncodingFromFont(): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						public hasExplicitWidth(param0: number): boolean;
						public getFontBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
						public hasGlyph(param0: string): boolean;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.pdmodel.ResourceCache);
						public encode(param0: number): androidNative.Array<number>;
						public getHeight(param0: number): number;
						public readCode(param0: java.io.InputStream): number;
						public getDisplacement(param0: number): com.tom_roush.pdfbox.util.Vector;
						public getPositionVector(param0: number): com.tom_roush.pdfbox.util.Vector;
						/** @deprecated */
						public getHeight(param0: number): number;
						public getAverageFontWidth(): number;
						public isEmbedded(): boolean;
						public getCharProcs(): com.tom_roush.pdfbox.cos.COSDictionary;
						public getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
						public getWidthFromFont(param0: number): number;
						public getBoundingBox(): com.tom_roush.fontbox.util.BoundingBox;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class PDVectorFont extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.PDVectorFont>;
						/**
						 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.font.PDVectorFont interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getPath(param0: number): globalAndroid.graphics.Path;
							hasGlyph(param0: number): boolean;
						});
						public constructor();
						public hasGlyph(param0: number): boolean;
						public getPath(param0: number): globalAndroid.graphics.Path;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class Standard14Fonts extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.Standard14Fonts>;
						public static getAFM(param0: string): com.tom_roush.fontbox.afm.FontMetrics;
						public static getMappedFontName(param0: string): string;
						public static containsName(param0: string): boolean;
						public static getNames(): java.util.Set<string>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class Subsetter extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.Subsetter>;
						/**
						 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.font.Subsetter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							addToSubset(param0: number): void;
							subset(): void;
						});
						public constructor();
						public subset(): void;
						public addToSubset(param0: number): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class ToUnicodeWriter extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.ToUnicodeWriter>;
						public setWMode(param0: number): void;
						public add(param0: number, param1: string): void;
						public writeTo(param0: java.io.OutputStream): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export abstract class TrueTypeEmbedder extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.font.Subsetter {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.TrueTypeEmbedder>;
						public ttf: com.tom_roush.fontbox.ttf.TrueTypeFont;
						public fontDescriptor: com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public cmap: com.tom_roush.fontbox.ttf.CmapSubtable;
						public cmapLookup: com.tom_roush.fontbox.ttf.CmapLookup;
						public subset(): void;
						public getTag(param0: java.util.Map<java.lang.Integer,java.lang.Integer>): string;
						public buildFontFile2(param0: java.io.InputStream): void;
						public addToSubset(param0: number): void;
						public needsSubset(): boolean;
						/** @deprecated */
						public getTrueTypeFont(): com.tom_roush.fontbox.ttf.TrueTypeFont;
						public getFontDescriptor(): com.tom_roush.pdfbox.pdmodel.font.PDFontDescriptor;
						public buildSubset(param0: java.io.InputStream, param1: string, param2: java.util.Map<java.lang.Integer,java.lang.Integer>): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export class UniUtil extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.UniUtil>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class BuiltInEncoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.BuiltInEncoding>;
							public constructor();
							public constructor(param0: java.util.Map<java.lang.Integer,string>);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getEncodingName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class DictionaryEncoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.DictionaryEncoding>;
							public constructor();
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: boolean, param2: com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getBaseEncoding(): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
							public getDifferences(): java.util.Map<java.lang.Integer,string>;
							public getEncodingName(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSArray);
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export abstract class Encoding extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding>;
							public static CHAR_CODE: number = 0;
							public static CHAR_NAME: number = 1;
							public codeToName: java.util.Map<java.lang.Integer,string>;
							public inverted: java.util.Map<string,java.lang.Integer>;
							public constructor();
							public getCodeToNameMap(): java.util.Map<java.lang.Integer,string>;
							public getName(param0: number): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getNameToCodeMap(): java.util.Map<string,java.lang.Integer>;
							public contains(param0: number): boolean;
							public getEncodingName(): string;
							public overwrite(param0: number, param1: string): void;
							public add(param0: number, param1: string): void;
							public contains(param0: string): boolean;
							public static getInstance(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class GlyphList extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList, param1: java.io.InputStream);
							public static getZapfDingbats(): com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList;
							public codePointToName(param0: number): string;
							public static getAdobeGlyphList(): com.tom_roush.pdfbox.pdmodel.font.encoding.GlyphList;
							public constructor(param0: java.io.InputStream, param1: number);
							public toUnicode(param0: string): string;
							public sequenceToName(param0: string): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class MacExpertEncoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.MacExpertEncoding>;
							public static INSTANCE: com.tom_roush.pdfbox.pdmodel.font.encoding.MacExpertEncoding;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getEncodingName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class MacOSRomanEncoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.MacRomanEncoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.MacOSRomanEncoding>;
							public static INSTANCE: com.tom_roush.pdfbox.pdmodel.font.encoding.MacOSRomanEncoding;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class MacRomanEncoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.MacRomanEncoding>;
							public static INSTANCE: com.tom_roush.pdfbox.pdmodel.font.encoding.MacRomanEncoding;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getEncodingName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class StandardEncoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.StandardEncoding>;
							public static INSTANCE: com.tom_roush.pdfbox.pdmodel.font.encoding.StandardEncoding;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getEncodingName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class SymbolEncoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.SymbolEncoding>;
							public static INSTANCE: com.tom_roush.pdfbox.pdmodel.font.encoding.SymbolEncoding;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getEncodingName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class Type1Encoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.Type1Encoding>;
							public constructor();
							public static fromFontBox(param0: com.tom_roush.fontbox.encoding.Encoding): com.tom_roush.pdfbox.pdmodel.font.encoding.Type1Encoding;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getEncodingName(): string;
							public constructor(param0: com.tom_roush.fontbox.afm.FontMetrics);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class WinAnsiEncoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.WinAnsiEncoding>;
							public static INSTANCE: com.tom_roush.pdfbox.pdmodel.font.encoding.WinAnsiEncoding;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getEncodingName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace font {
					export namespace encoding {
						export class ZapfDingbatsEncoding extends com.tom_roush.pdfbox.pdmodel.font.encoding.Encoding {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.font.encoding.ZapfDingbatsEncoding>;
							public static INSTANCE: com.tom_roush.pdfbox.pdmodel.font.encoding.ZapfDingbatsEncoding;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getEncodingName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export class PDFontSetting extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.PDFontSetting>;
						public constructor();
						public setFont(param0: com.tom_roush.pdfbox.pdmodel.font.PDFont): void;
						public getFontSize(): number;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public getFont(): com.tom_roush.pdfbox.pdmodel.font.PDFont;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
						public setFontSize(param0: number): void;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export class PDLineDashPattern extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.PDLineDashPattern>;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSArray, param1: number);
						public constructor();
						public getPhase(): number;
						public getDashArray(): androidNative.Array<number>;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export class PDPostScriptXObject extends com.tom_roush.pdfbox.pdmodel.graphics.PDXObject {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.PDPostScriptXObject>;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.cos.COSName);
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.cos.COSName);
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.cos.COSName);
						public constructor(param0: com.tom_roush.pdfbox.cos.COSStream);
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export class PDXObject extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
						public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.PDXObject>;
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.cos.COSName);
						/** @deprecated */
						public getPDStream(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
						public getStream(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
						/** @deprecated */
						public getCOSStream(): com.tom_roush.pdfbox.cos.COSStream;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
						public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.cos.COSName);
						public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.cos.COSName);
						public static createXObject(param0: com.tom_roush.pdfbox.cos.COSBase, param1: com.tom_roush.pdfbox.pdmodel.PDResources): com.tom_roush.pdfbox.pdmodel.graphics.PDXObject;
						public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace blend {
						export abstract class BlendMode extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.blend.BlendMode>;
							public static NORMAL: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static COMPATIBLE: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static MULTIPLY: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static SCREEN: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static OVERLAY: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static DARKEN: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static LIGHTEN: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static COLOR_DODGE: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static COLOR_BURN: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static HARD_LIGHT: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static SOFT_LIGHT: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static DIFFERENCE: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static EXCLUSION: com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode;
							public static HUE: com.tom_roush.pdfbox.pdmodel.graphics.blend.NonSeparableBlendMode;
							public static SATURATION: com.tom_roush.pdfbox.pdmodel.graphics.blend.NonSeparableBlendMode;
							public static COLOR: com.tom_roush.pdfbox.pdmodel.graphics.blend.NonSeparableBlendMode;
							public static LUMINOSITY: com.tom_roush.pdfbox.pdmodel.graphics.blend.NonSeparableBlendMode;
							public static getCOSName(param0: com.tom_roush.pdfbox.pdmodel.graphics.blend.BlendMode): com.tom_roush.pdfbox.cos.COSName;
							public static getInstance(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.graphics.blend.BlendMode;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace blend {
						export abstract class NonSeparableBlendMode extends com.tom_roush.pdfbox.pdmodel.graphics.blend.BlendMode {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.blend.NonSeparableBlendMode>;
							public blend(param0: androidNative.Array<number>, param1: androidNative.Array<number>, param2: androidNative.Array<number>): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace blend {
						export abstract class SeparableBlendMode extends com.tom_roush.pdfbox.pdmodel.graphics.blend.BlendMode {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.blend.SeparableBlendMode>;
							public blendChannel(param0: number, param1: number): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace color {
						export class PDColor extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor>;
							public toCOSArray(): com.tom_roush.pdfbox.cos.COSArray;
							public getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public constructor(param0: androidNative.Array<number>, param1: com.tom_roush.pdfbox.cos.COSName, param2: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace);
							public getComponents(): androidNative.Array<number>;
							public getPatternName(): com.tom_roush.pdfbox.cos.COSName;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace);
							public toString(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSArray, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace);
							public constructor(param0: androidNative.Array<number>, param1: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace);
							public isPattern(): boolean;
							public toRGB(): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace color {
						export abstract class PDColorSpace extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace>;
							public array: com.tom_roush.pdfbox.cos.COSArray;
							public constructor();
							public toRGBImage(param0: globalAndroid.graphics.Bitmap): globalAndroid.graphics.Bitmap;
							public getNumberOfComponents(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getName(): string;
							public static create(param0: com.tom_roush.pdfbox.cos.COSBase, param1: com.tom_roush.pdfbox.pdmodel.PDResources, param2: boolean): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public getDefaultDecode(param0: number): androidNative.Array<number>;
							public static create(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public getInitialColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public toRGB(param0: androidNative.Array<number>): androidNative.Array<number>;
							public static create(param0: com.tom_roush.pdfbox.cos.COSBase, param1: com.tom_roush.pdfbox.pdmodel.PDResources): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace color {
						export abstract class PDDeviceColorSpace extends com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.color.PDDeviceColorSpace>;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public toString(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace color {
						export class PDDeviceGray extends com.tom_roush.pdfbox.pdmodel.graphics.color.PDDeviceColorSpace {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.color.PDDeviceGray>;
							public static INSTANCE: com.tom_roush.pdfbox.pdmodel.graphics.color.PDDeviceGray;
							public toRGBImage(param0: globalAndroid.graphics.Bitmap): globalAndroid.graphics.Bitmap;
							public getNumberOfComponents(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getName(): string;
							public getDefaultDecode(param0: number): androidNative.Array<number>;
							public getInitialColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public toRGB(param0: androidNative.Array<number>): androidNative.Array<number>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace color {
						export class PDDeviceRGB extends com.tom_roush.pdfbox.pdmodel.graphics.color.PDDeviceColorSpace {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.color.PDDeviceRGB>;
							public static INSTANCE: com.tom_roush.pdfbox.pdmodel.graphics.color.PDDeviceRGB;
							public toRGBImage(param0: globalAndroid.graphics.Bitmap): globalAndroid.graphics.Bitmap;
							public getNumberOfComponents(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getName(): string;
							public getDefaultDecode(param0: number): androidNative.Array<number>;
							public getInitialColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public toRGB(param0: androidNative.Array<number>): androidNative.Array<number>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace color {
						export class PDGamma extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.color.PDGamma>;
							public constructor();
							public setB(param0: number): void;
							public setG(param0: number): void;
							public getB(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getG(): number;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
							public setR(param0: number): void;
							public getCOSArray(): com.tom_roush.pdfbox.cos.COSArray;
							public getR(): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace color {
						export class PDJPXColorSpace extends com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.color.PDJPXColorSpace>;
							public constructor();
							public toRGBImage(param0: globalAndroid.graphics.Bitmap): globalAndroid.graphics.Bitmap;
							public getNumberOfComponents(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public constructor(param0: globalAndroid.graphics.ColorSpace);
							public getName(): string;
							public getDefaultDecode(param0: number): androidNative.Array<number>;
							public getInitialColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public toRGB(param0: androidNative.Array<number>): androidNative.Array<number>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace color {
						export class PDOutputIntent extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.color.PDOutputIntent>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream);
							public getInfo(): string;
							public getDestOutputIntent(): com.tom_roush.pdfbox.cos.COSStream;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getOutputConditionIdentifier(): string;
							public setOutputCondition(param0: string): void;
							public getRegistryName(): string;
							public setInfo(param0: string): void;
							public getOutputCondition(): string;
							public setOutputConditionIdentifier(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setRegistryName(param0: string): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace color {
						export class PDTristimulus extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.color.PDTristimulus>;
							public constructor();
							public getY(): number;
							public getZ(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setY(param0: number): void;
							public setZ(param0: number): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
							public setX(param0: number): void;
							public getX(): number;
							public constructor(param0: androidNative.Array<number>);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace form {
						export class PDFormXObject extends com.tom_roush.pdfbox.pdmodel.graphics.PDXObject implements com.tom_roush.pdfbox.contentstream.PDContentStream {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.cos.COSName);
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.pdmodel.ResourceCache);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.cos.COSName);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
							public setResources(param0: com.tom_roush.pdfbox.pdmodel.PDResources): void;
							public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public getGroup(): com.tom_roush.pdfbox.pdmodel.graphics.form.PDTransparencyGroupAttributes;
							public setBBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
							public getContentStream(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
							public getStructParents(): number;
							public getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
							public getMatrix(): com.tom_roush.pdfbox.util.Matrix;
							public getFormType(): number;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
							public setOptionalContent(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.cos.COSName);
							public setFormType(param0: number): void;
							public getOptionalContent(): com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList;
							public setMatrix(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
							public getContents(): java.io.InputStream;
							public setStructParents(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace form {
						export class PDTransparencyGroup extends com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.form.PDTransparencyGroup>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.cos.COSName);
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.pdmodel.ResourceCache);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.cos.COSName);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
							public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
							public getMatrix(): com.tom_roush.pdfbox.util.Matrix;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.cos.COSName);
							public getContents(): java.io.InputStream;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace form {
						export class PDTransparencyGroupAttributes extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.form.PDTransparencyGroupAttributes>;
							public constructor();
							public getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public isKnockout(): boolean;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public isIsolated(): boolean;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getColorSpace(param0: com.tom_roush.pdfbox.pdmodel.PDResources): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace image {
						export class CCITTFactory extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.image.CCITTFactory>;
							public static createFromImage(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: globalAndroid.graphics.Bitmap): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public static createFromFile(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.File): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							/** @deprecated */
							public static createFromRandomAccess(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.io.RandomAccess, param2: number): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public static createFromFile(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.File, param2: number): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							/** @deprecated */
							public static createFromRandomAccess(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.io.RandomAccess): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public static createFromByteArray(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: androidNative.Array<number>): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public static createFromByteArray(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: androidNative.Array<number>, param2: number): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace image {
						export class JPEGFactory extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.image.JPEGFactory>;
							public static createFromImage(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: globalAndroid.graphics.Bitmap): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public static createFromImage(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: globalAndroid.graphics.Bitmap, param2: number): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public static createFromStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public static createFromImage(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: globalAndroid.graphics.Bitmap, param2: number, param3: number): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public static createFromByteArray(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: androidNative.Array<number>): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
						}
						export namespace JPEGFactory {
							export class Dimensions extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.image.JPEGFactory.Dimensions>;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace image {
						export class LosslessFactory extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.image.LosslessFactory>;
							public static createFromImage(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: globalAndroid.graphics.Bitmap): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
						}
						export namespace LosslessFactory {
							export class PredictorEncoder extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.image.LosslessFactory.PredictorEncoder>;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace image {
						export class PDImage extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.image.PDImage>;
							/**
							 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.graphics.image.PDImage interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								getImage(): globalAndroid.graphics.Bitmap;
								getImage(param0: globalAndroid.graphics.Rect, param1: number): globalAndroid.graphics.Bitmap;
								getStencilImage(param0: globalAndroid.graphics.Paint): globalAndroid.graphics.Bitmap;
								createInputStream(): java.io.InputStream;
								createInputStream(param0: java.util.List<string>): java.io.InputStream;
								createInputStream(param0: com.tom_roush.pdfbox.filter.DecodeOptions): java.io.InputStream;
								isEmpty(): boolean;
								isStencil(): boolean;
								setStencil(param0: boolean): void;
								getBitsPerComponent(): number;
								setBitsPerComponent(param0: number): void;
								getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
								setColorSpace(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
								getHeight(): number;
								setHeight(param0: number): void;
								getWidth(): number;
								setWidth(param0: number): void;
								setDecode(param0: com.tom_roush.pdfbox.cos.COSArray): void;
								getDecode(): com.tom_roush.pdfbox.cos.COSArray;
								getInterpolate(): boolean;
								setInterpolate(param0: boolean): void;
								getSuffix(): string;
								getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							});
							public constructor();
							public getWidth(): number;
							public getDecode(): com.tom_roush.pdfbox.cos.COSArray;
							public getStencilImage(param0: globalAndroid.graphics.Paint): globalAndroid.graphics.Bitmap;
							public setDecode(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public getBitsPerComponent(): number;
							public setColorSpace(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
							public getSuffix(): string;
							public getHeight(): number;
							public getImage(param0: globalAndroid.graphics.Rect, param1: number): globalAndroid.graphics.Bitmap;
							public getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public createInputStream(): java.io.InputStream;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public isStencil(): boolean;
							public getImage(): globalAndroid.graphics.Bitmap;
							public setInterpolate(param0: boolean): void;
							public setBitsPerComponent(param0: number): void;
							public isEmpty(): boolean;
							public setHeight(param0: number): void;
							public setWidth(param0: number): void;
							public getInterpolate(): boolean;
							public createInputStream(param0: java.util.List<string>): java.io.InputStream;
							public createInputStream(param0: com.tom_roush.pdfbox.filter.DecodeOptions): java.io.InputStream;
							public setStencil(param0: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace image {
						export class PDImageXObject extends com.tom_roush.pdfbox.pdmodel.graphics.PDXObject implements com.tom_roush.pdfbox.pdmodel.graphics.image.PDImage {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject>;
							public getWidth(): number;
							public getDecode(): com.tom_roush.pdfbox.cos.COSArray;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.cos.COSName);
							public getStencilImage(param0: globalAndroid.graphics.Paint): globalAndroid.graphics.Bitmap;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.cos.COSName);
							public getColorKeyMask(): com.tom_roush.pdfbox.cos.COSArray;
							public getBitsPerComponent(): number;
							public getSuffix(): string;
							public setStructParent(param0: number): void;
							public getMask(): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public getHeight(): number;
							public getImage(param0: globalAndroid.graphics.Rect, param1: number): globalAndroid.graphics.Bitmap;
							public getOpaqueImage(): globalAndroid.graphics.Bitmap;
							public setMetadata(param0: com.tom_roush.pdfbox.pdmodel.common.PDMetadata): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.cos.COSName);
							public getStructParent(): number;
							public setHeight(param0: number): void;
							public getInterpolate(): boolean;
							public createInputStream(param0: com.tom_roush.pdfbox.filter.DecodeOptions): java.io.InputStream;
							public setDecode(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
							public static createFromByteArray(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: androidNative.Array<number>, param2: string): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public setColorSpace(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: com.tom_roush.pdfbox.cos.COSBase, param3: number, param4: number, param5: number, param6: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.pdmodel.PDResources);
							public static createFromFileByContent(param0: java.io.File, param1: com.tom_roush.pdfbox.pdmodel.PDDocument): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public getSoftMask(): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public static createThumbnail(param0: com.tom_roush.pdfbox.cos.COSStream): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
							public getMetadata(): com.tom_roush.pdfbox.pdmodel.common.PDMetadata;
							public createInputStream(): java.io.InputStream;
							public setOptionalContent(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public isStencil(): boolean;
							public static createFromFile(param0: string, param1: com.tom_roush.pdfbox.pdmodel.PDDocument): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public getImage(): globalAndroid.graphics.Bitmap;
							public setInterpolate(param0: boolean): void;
							public getOptionalContent(): com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList;
							public setBitsPerComponent(param0: number): void;
							public static createFromFileByExtension(param0: java.io.File, param1: com.tom_roush.pdfbox.pdmodel.PDDocument): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
							public isEmpty(): boolean;
							public setWidth(param0: number): void;
							public createInputStream(param0: java.util.List<string>): java.io.InputStream;
							public setStencil(param0: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace image {
						export class PDInlineImage extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.graphics.image.PDImage {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.image.PDInlineImage>;
							public getWidth(): number;
							public getDecode(): com.tom_roush.pdfbox.cos.COSArray;
							public getStencilImage(param0: globalAndroid.graphics.Paint): globalAndroid.graphics.Bitmap;
							public setFilters(param0: java.util.List<string>): void;
							public getBitsPerComponent(): number;
							public getSuffix(): string;
							public getHeight(): number;
							public getImage(param0: globalAndroid.graphics.Rect, param1: number): globalAndroid.graphics.Bitmap;
							/** @deprecated */
							public getColorKeyMask(): com.tom_roush.pdfbox.cos.COSArray;
							public setHeight(param0: number): void;
							public getInterpolate(): boolean;
							public createInputStream(param0: com.tom_roush.pdfbox.filter.DecodeOptions): java.io.InputStream;
							public getData(): androidNative.Array<number>;
							public getFilters(): java.util.List<string>;
							public setDecode(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: androidNative.Array<number>, param2: com.tom_roush.pdfbox.pdmodel.PDResources);
							public setColorSpace(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
							public getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public createInputStream(): java.io.InputStream;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public isStencil(): boolean;
							public getImage(): globalAndroid.graphics.Bitmap;
							public setInterpolate(param0: boolean): void;
							public setBitsPerComponent(param0: number): void;
							public setWidth(param0: number): void;
							public isEmpty(): boolean;
							public createInputStream(param0: java.util.List<string>): java.io.InputStream;
							public setStencil(param0: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace image {
						export class SampledImageReader extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.image.SampledImageReader>;
							public static getStencilImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImage, param1: globalAndroid.graphics.Paint): globalAndroid.graphics.Bitmap;
							public static getRGBImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImage, param1: com.tom_roush.pdfbox.cos.COSArray): globalAndroid.graphics.Bitmap;
							public static getRGBImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImage, param1: globalAndroid.graphics.Rect, param2: number, param3: com.tom_roush.pdfbox.cos.COSArray): globalAndroid.graphics.Bitmap;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace optionalcontent {
						export class PDOptionalContentGroup extends com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup>;
							public constructor();
							public constructor(param0: string);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getName(): string;
							public getRenderState(param0: com.tom_roush.pdfbox.rendering.RenderDestination): com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup.RenderState;
							public setName(param0: string): void;
							public toString(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
						export namespace PDOptionalContentGroup {
							export class RenderState {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup.RenderState>;
								public static OFF: com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup.RenderState;
								public static valueOf(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup.RenderState;
								public getName(): com.tom_roush.pdfbox.cos.COSName;
								public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
								public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup.RenderState;
								public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup.RenderState>;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace optionalcontent {
						export class PDOptionalContentMembershipDictionary extends com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentMembershipDictionary>;
							public constructor();
							public getVisibilityPolicy(): com.tom_roush.pdfbox.cos.COSName;
							public setVisibilityPolicy(param0: com.tom_roush.pdfbox.cos.COSName): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getOCGs(): java.util.List<com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList>;
							public setOCGs(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList>): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace optionalcontent {
						export class PDOptionalContentProperties extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties>;
							public constructor();
							public isGroupEnabled(param0: com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup): boolean;
							public hasGroup(param0: string): boolean;
							public addGroup(param0: com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup): void;
							public getGroup(param0: string): com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getGroupNames(): androidNative.Array<string>;
							public setGroupEnabled(param0: string, param1: boolean): boolean;
							public getBaseState(): com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties.BaseState;
							public isGroupEnabled(param0: string): boolean;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setBaseState(param0: com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties.BaseState): void;
							public setGroupEnabled(param0: com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup, param1: boolean): boolean;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getOptionalContentGroups(): java.util.Collection<com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup>;
						}
						export namespace PDOptionalContentProperties {
							export class BaseState {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties.BaseState>;
								public static OFF: com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties.BaseState;
								public static UNCHANGED: com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties.BaseState;
								public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties.BaseState>;
								public getName(): com.tom_roush.pdfbox.cos.COSName;
								public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
								public static valueOf(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties.BaseState;
								public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentProperties.BaseState;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace pattern {
						export abstract class PDAbstractPattern extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern>;
							public static TYPE_TILING_PATTERN: number = 1;
							public static TYPE_SHADING_PATTERN: number = 2;
							public static create(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern;
							public static create(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.pdmodel.ResourceCache): com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern;
							public constructor();
							public setPatternType(param0: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setMatrix(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
							public getPatternType(): number;
							public getMatrix(): com.tom_roush.pdfbox.util.Matrix;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getType(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setPaintType(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace pattern {
						export class PDShadingPattern extends com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDShadingPattern>;
							public constructor();
							public getShading(): com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading;
							public getExtendedGraphicsState(): com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
							public setShading(param0: com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setExtendedGraphicsState(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState): void;
							public getPatternType(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace pattern {
						export class PDTilingPattern extends com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDAbstractPattern implements com.tom_roush.pdfbox.contentstream.PDContentStream {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.pattern.PDTilingPattern>;
							public static PAINT_COLORED: number = 1;
							public static PAINT_UNCOLORED: number = 2;
							public static TILING_CONSTANT_SPACING: number = 1;
							public static TILING_NO_DISTORTION: number = 2;
							public static TILING_CONSTANT_SPACING_FASTER_TILING: number = 3;
							public constructor();
							public setXStep(param0: number): void;
							public setResources(param0: com.tom_roush.pdfbox.pdmodel.PDResources): void;
							public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public setBBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
							public getContentStream(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
							public getPatternType(): number;
							public setTilingType(param0: number): void;
							public getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
							public getMatrix(): com.tom_roush.pdfbox.util.Matrix;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setPaintType(param0: number): void;
							public getPaintType(): number;
							public getXStep(): number;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary, param1: com.tom_roush.pdfbox.pdmodel.ResourceCache);
							public getTilingType(): number;
							public setYStep(param0: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getContents(): java.io.InputStream;
							public getYStep(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class CoonsPatch extends com.tom_roush.pdfbox.pdmodel.graphics.shading.Patch {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.CoonsPatch>;
							public getFlag2Edge(): androidNative.Array<globalAndroid.graphics.PointF>;
							public constructor(param0: androidNative.Array<globalAndroid.graphics.PointF>, param1: androidNative.Array<androidNative.Array<number>>);
							public getFlag1Edge(): androidNative.Array<globalAndroid.graphics.PointF>;
							public getFlag3Edge(): androidNative.Array<globalAndroid.graphics.PointF>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class CoordinateColorPair extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.CoordinateColorPair>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class Line extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.Line>;
							public linePoints: java.util.Set<globalAndroid.graphics.Point>;
							public calcColor(param0: globalAndroid.graphics.Point): androidNative.Array<number>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export abstract class PDMeshBasedShadingType extends com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShadingType4 {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDMeshBasedShadingType>;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getBounds(param0: com.tom_roush.harmony.awt.geom.AffineTransform, param1: com.tom_roush.pdfbox.util.Matrix): globalAndroid.graphics.RectF;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public readPatch(param0: com.tom_roush.harmony.javax.imageio.stream.ImageInputStream, param1: boolean, param2: androidNative.Array<globalAndroid.graphics.PointF>, param3: androidNative.Array<androidNative.Array<number>>, param4: number, param5: number, param6: com.tom_roush.pdfbox.pdmodel.common.PDRange, param7: com.tom_roush.pdfbox.pdmodel.common.PDRange, param8: androidNative.Array<com.tom_roush.pdfbox.pdmodel.common.PDRange>, param9: com.tom_roush.pdfbox.util.Matrix, param10: com.tom_roush.harmony.awt.geom.AffineTransform, param11: number): com.tom_roush.pdfbox.pdmodel.graphics.shading.Patch;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export abstract class PDShading extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading>;
							public static SHADING_TYPE1: number = 1;
							public static SHADING_TYPE2: number = 2;
							public static SHADING_TYPE3: number = 3;
							public static SHADING_TYPE4: number = 4;
							public static SHADING_TYPE5: number = 5;
							public static SHADING_TYPE6: number = 6;
							public static SHADING_TYPE7: number = 7;
							public constructor();
							public setFunction(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public evalFunction(param0: number): androidNative.Array<number>;
							public setBBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
							public setColorSpace(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setBackground(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public getAntiAlias(): boolean;
							public getColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public getShadingType(): number;
							public getBackground(): com.tom_roush.pdfbox.cos.COSArray;
							public setAntiAlias(param0: boolean): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getFunction(): any;
							public evalFunction(param0: androidNative.Array<number>): androidNative.Array<number>;
							public getBounds(param0: com.tom_roush.harmony.awt.geom.AffineTransform, param1: com.tom_roush.pdfbox.util.Matrix): globalAndroid.graphics.RectF;
							public static create(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading;
							public setFunction(param0: any): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getType(): string;
							public setShadingType(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class PDShadingType1 extends com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShadingType1>;
							public constructor();
							public getShadingType(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getDomain(): com.tom_roush.pdfbox.cos.COSArray;
							public setMatrix(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
							public getMatrix(): com.tom_roush.pdfbox.util.Matrix;
							public setDomain(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class PDShadingType2 extends com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShadingType2>;
							public constructor();
							public getShadingType(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCoords(): com.tom_roush.pdfbox.cos.COSArray;
							public getDomain(): com.tom_roush.pdfbox.cos.COSArray;
							public setExtend(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public setDomain(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setCoords(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getExtend(): com.tom_roush.pdfbox.cos.COSArray;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class PDShadingType3 extends com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShadingType2 {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShadingType3>;
							public constructor();
							public getShadingType(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class PDShadingType4 extends com.tom_roush.pdfbox.pdmodel.graphics.shading.PDTriangleBasedShadingType {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShadingType4>;
							public constructor();
							public getBitsPerFlag(): number;
							public getShadingType(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setBitsPerFlag(param0: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class PDShadingType5 extends com.tom_roush.pdfbox.pdmodel.graphics.shading.PDTriangleBasedShadingType {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShadingType5>;
							public constructor();
							public getShadingType(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setVerticesPerRow(param0: number): void;
							public getVerticesPerRow(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class PDShadingType6 extends com.tom_roush.pdfbox.pdmodel.graphics.shading.PDMeshBasedShadingType {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShadingType6>;
							public constructor();
							public generatePatch(param0: androidNative.Array<globalAndroid.graphics.PointF>, param1: androidNative.Array<androidNative.Array<number>>): com.tom_roush.pdfbox.pdmodel.graphics.shading.Patch;
							public getShadingType(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getBounds(param0: com.tom_roush.harmony.awt.geom.AffineTransform, param1: com.tom_roush.pdfbox.util.Matrix): globalAndroid.graphics.RectF;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class PDShadingType7 extends com.tom_roush.pdfbox.pdmodel.graphics.shading.PDMeshBasedShadingType {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShadingType7>;
							public constructor();
							public generatePatch(param0: androidNative.Array<globalAndroid.graphics.PointF>, param1: androidNative.Array<androidNative.Array<number>>): com.tom_roush.pdfbox.pdmodel.graphics.shading.Patch;
							public getShadingType(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getBounds(param0: com.tom_roush.harmony.awt.geom.AffineTransform, param1: com.tom_roush.pdfbox.util.Matrix): globalAndroid.graphics.RectF;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export abstract class PDTriangleBasedShadingType extends com.tom_roush.pdfbox.pdmodel.graphics.shading.PDShading {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.PDTriangleBasedShadingType>;
							public getNumberOfColorComponents(): number;
							public readVertex(param0: com.tom_roush.harmony.javax.imageio.stream.ImageInputStream, param1: number, param2: number, param3: com.tom_roush.pdfbox.pdmodel.common.PDRange, param4: com.tom_roush.pdfbox.pdmodel.common.PDRange, param5: androidNative.Array<com.tom_roush.pdfbox.pdmodel.common.PDRange>, param6: com.tom_roush.pdfbox.util.Matrix, param7: com.tom_roush.harmony.awt.geom.AffineTransform): com.tom_roush.pdfbox.pdmodel.graphics.shading.Vertex;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getBitsPerCoordinate(): number;
							public getBitsPerComponent(): number;
							public getDecodeForParameter(param0: number): com.tom_roush.pdfbox.pdmodel.common.PDRange;
							public getBounds(param0: com.tom_roush.harmony.awt.geom.AffineTransform, param1: com.tom_roush.pdfbox.util.Matrix): globalAndroid.graphics.RectF;
							public setBitsPerComponent(param0: number): void;
							public interpolate(param0: number, param1: number, param2: number, param3: number): number;
							public setBitsPerCoordinate(param0: number): void;
							public setDecodeValues(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export abstract class Patch extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.Patch>;
							public controlPoints: androidNative.Array<androidNative.Array<globalAndroid.graphics.PointF>>;
							public cornerColor: androidNative.Array<androidNative.Array<number>>;
							public level: androidNative.Array<number>;
							public listOfTriangles: java.util.List<com.tom_roush.pdfbox.pdmodel.graphics.shading.ShadedTriangle>;
							public getFlag2Edge(): androidNative.Array<globalAndroid.graphics.PointF>;
							public getLen(param0: globalAndroid.graphics.PointF, param1: globalAndroid.graphics.PointF): number;
							public getFlag1Color(): androidNative.Array<androidNative.Array<number>>;
							public getFlag2Color(): androidNative.Array<androidNative.Array<number>>;
							public getFlag3Color(): androidNative.Array<androidNative.Array<number>>;
							public getShadedTriangles(param0: androidNative.Array<androidNative.Array<com.tom_roush.pdfbox.pdmodel.graphics.shading.CoordinateColorPair>>): java.util.List<com.tom_roush.pdfbox.pdmodel.graphics.shading.ShadedTriangle>;
							public getFlag1Edge(): androidNative.Array<globalAndroid.graphics.PointF>;
							public isEdgeALine(param0: androidNative.Array<globalAndroid.graphics.PointF>): boolean;
							public getFlag3Edge(): androidNative.Array<globalAndroid.graphics.PointF>;
							public edgeEquationValue(param0: globalAndroid.graphics.PointF, param1: globalAndroid.graphics.PointF, param2: globalAndroid.graphics.PointF): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class ShadedTriangle extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.ShadedTriangle>;
							public corner: androidNative.Array<globalAndroid.graphics.PointF>;
							public color: androidNative.Array<androidNative.Array<number>>;
							public getLine(): com.tom_roush.pdfbox.pdmodel.graphics.shading.Line;
							public getDeg(): number;
							public contains(param0: globalAndroid.graphics.PointF): boolean;
							public calcColor(param0: globalAndroid.graphics.PointF): androidNative.Array<number>;
							public getBoundary(): androidNative.Array<number>;
							public toString(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class TensorPatch extends com.tom_roush.pdfbox.pdmodel.graphics.shading.Patch {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.TensorPatch>;
							public getFlag2Edge(): androidNative.Array<globalAndroid.graphics.PointF>;
							public constructor(param0: androidNative.Array<globalAndroid.graphics.PointF>, param1: androidNative.Array<androidNative.Array<number>>);
							public getFlag1Edge(): androidNative.Array<globalAndroid.graphics.PointF>;
							public getFlag3Edge(): androidNative.Array<globalAndroid.graphics.PointF>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace shading {
						export class Vertex extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.shading.Vertex>;
							public point: globalAndroid.graphics.PointF;
							public color: androidNative.Array<number>;
							public toString(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace state {
						export class PDExtendedGraphicsState extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState>;
							public setNonStrokingOverprintControl(param0: boolean): void;
							public getTransfer(): com.tom_roush.pdfbox.cos.COSBase;
							public setLineCapStyle(param0: number): void;
							public setNonStrokingAlphaConstant(param0: java.lang.Float): void;
							public copyIntoGraphicsState(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.PDGraphicsState): void;
							public getTextKnockoutFlag(): boolean;
							public setTextKnockoutFlag(param0: boolean): void;
							public setMiterLimit(param0: java.lang.Float): void;
							public getOverprintMode(): java.lang.Float;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getNonStrokingOverprintControl(): boolean;
							public getFlatnessTolerance(): java.lang.Float;
							public setTransfer2(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public getLineDashPattern(): com.tom_roush.pdfbox.pdmodel.graphics.PDLineDashPattern;
							public getTransfer2(): com.tom_roush.pdfbox.cos.COSBase;
							public setLineWidth(param0: java.lang.Float): void;
							public getSoftMask(): com.tom_roush.pdfbox.pdmodel.graphics.state.PDSoftMask;
							public setTransfer(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public constructor();
							public setFlatnessTolerance(param0: java.lang.Float): void;
							public getMiterLimit(): java.lang.Float;
							public setStrokingOverprintControl(param0: boolean): void;
							public setFontSetting(param0: com.tom_roush.pdfbox.pdmodel.graphics.PDFontSetting): void;
							public getAutomaticStrokeAdjustment(): boolean;
							public getNonStrokingAlphaConstant(): java.lang.Float;
							public getLineCapStyle(): globalAndroid.graphics.Paint.Cap;
							public getAlphaSourceFlag(): boolean;
							public setAlphaSourceFlag(param0: boolean): void;
							public getRenderingIntent(): com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent;
							public setOverprintMode(param0: java.lang.Float): void;
							public setLineJoinStyle(param0: number): void;
							public setLineDashPattern(param0: com.tom_roush.pdfbox.pdmodel.graphics.PDLineDashPattern): void;
							public getLineJoinStyle(): globalAndroid.graphics.Paint.Join;
							public getSmoothnessTolerance(): java.lang.Float;
							public setAutomaticStrokeAdjustment(param0: boolean): void;
							public getBlendMode(): com.tom_roush.pdfbox.pdmodel.graphics.blend.BlendMode;
							public getFontSetting(): com.tom_roush.pdfbox.pdmodel.graphics.PDFontSetting;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getStrokingOverprintControl(): boolean;
							public setBlendMode(param0: com.tom_roush.pdfbox.pdmodel.graphics.blend.BlendMode): void;
							public getLineWidth(): java.lang.Float;
							public getStrokingAlphaConstant(): java.lang.Float;
							public setStrokingAlphaConstant(param0: java.lang.Float): void;
							public setRenderingIntent(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setSmoothnessTolerance(param0: java.lang.Float): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace state {
						export class PDGraphicsState extends java.lang.Object implements java.lang.Cloneable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.state.PDGraphicsState>;
							public getTextState(): com.tom_roush.pdfbox.pdmodel.graphics.state.PDTextState;
							public setMiterLimit(param0: number): void;
							public getOverprintMode(): number;
							public getSmoothness(): number;
							public setNonStrokeAlphaConstant(param0: number): void;
							public setNonStrokingColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public setLineJoin(param0: globalAndroid.graphics.Paint.Join): void;
							public setNonStrokingColorSpace(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
							public getLineJoin(): globalAndroid.graphics.Paint.Join;
							public setNonStrokingOverprint(param0: boolean): void;
							public setSmoothness(param0: number): void;
							public intersectClippingPath(param0: globalAndroid.graphics.Region): void;
							public isAlphaSource(): boolean;
							public setLineCap(param0: globalAndroid.graphics.Paint.Cap): void;
							/** @deprecated */
							public getNonStrokeAlphaConstants(): number;
							/** @deprecated */
							public setNonStrokeAlphaConstants(param0: number): void;
							public intersectClippingPath(param0: globalAndroid.graphics.Path): void;
							public setLineDashPattern(param0: com.tom_roush.pdfbox.pdmodel.graphics.PDLineDashPattern): void;
							public clone(): any;
							public getBlendMode(): com.tom_roush.pdfbox.pdmodel.graphics.blend.BlendMode;
							public getNonStrokingColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getCurrentClippingPaths(): java.util.List<globalAndroid.graphics.Path>;
							public setBlendMode(param0: com.tom_roush.pdfbox.pdmodel.graphics.blend.BlendMode): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle);
							public setOverprintMode(param0: number): void;
							public getCurrentTransformationMatrix(): com.tom_roush.pdfbox.util.Matrix;
							public getNonStrokingColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public setStrokeAdjustment(param0: boolean): void;
							public getTransfer(): com.tom_roush.pdfbox.cos.COSBase;
							public setStrokingColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public clone(): com.tom_roush.pdfbox.pdmodel.graphics.state.PDGraphicsState;
							public setCurrentTransformationMatrix(param0: com.tom_roush.pdfbox.util.Matrix): void;
							public setOverprint(param0: boolean): void;
							public setTextState(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.PDTextState): void;
							public setSoftMask(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.PDSoftMask): void;
							public setAlphaConstant(param0: number): void;
							public setLineWidth(param0: number): void;
							public getLineDashPattern(): com.tom_roush.pdfbox.pdmodel.graphics.PDLineDashPattern;
							public setStrokingColorSpace(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace): void;
							public getSoftMask(): com.tom_roush.pdfbox.pdmodel.graphics.state.PDSoftMask;
							public getStrokingColorSpace(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColorSpace;
							public setTransfer(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public isStrokeAdjustment(): boolean;
							public isNonStrokingOverprint(): boolean;
							public getCurrentClippingPath(): globalAndroid.graphics.Region;
							public isOverprint(): boolean;
							public getNonStrokeAlphaConstant(): number;
							public getLineWidth(): number;
							public getRenderingIntent(): com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent;
							public setAlphaSource(param0: boolean): void;
							public getFlatness(): number;
							public setFlatness(param0: number): void;
							public getMiterLimit(): number;
							public getLineCap(): globalAndroid.graphics.Paint.Cap;
							public setRenderingIntent(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent): void;
							public getAlphaConstant(): number;
							public getStrokingColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace state {
						export class PDSoftMask extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.state.PDSoftMask>;
							public getSubType(): com.tom_roush.pdfbox.cos.COSName;
							public getTransferFunction(): any;
							public getInitialTransformationMatrix(): com.tom_roush.pdfbox.util.Matrix;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public static create(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.graphics.state.PDSoftMask;
							public getGroup(): com.tom_roush.pdfbox.pdmodel.graphics.form.PDTransparencyGroup;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getBackdropColor(): com.tom_roush.pdfbox.cos.COSArray;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace state {
						export class PDTextState extends java.lang.Object implements java.lang.Cloneable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.state.PDTextState>;
							public constructor();
							public clone(): com.tom_roush.pdfbox.pdmodel.graphics.state.PDTextState;
							public setFontSize(param0: number): void;
							public getKnockoutFlag(): boolean;
							public getWordSpacing(): number;
							public setRise(param0: number): void;
							public getHorizontalScaling(): number;
							public setWordSpacing(param0: number): void;
							public setFont(param0: com.tom_roush.pdfbox.pdmodel.font.PDFont): void;
							public setRenderingMode(param0: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode): void;
							public getLeading(): number;
							public getFontSize(): number;
							public setKnockoutFlag(param0: boolean): void;
							public clone(): any;
							public getCharacterSpacing(): number;
							public setCharacterSpacing(param0: number): void;
							public getRenderingMode(): com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public getFont(): com.tom_roush.pdfbox.pdmodel.font.PDFont;
							public getRise(): number;
							public setHorizontalScaling(param0: number): void;
							public setLeading(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace state {
						export class RenderingIntent {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent>;
							public static ABSOLUTE_COLORIMETRIC: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent;
							public static RELATIVE_COLORIMETRIC: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent;
							public static SATURATION: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent;
							public static PERCEPTUAL: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent;
							public static fromString(param0: string): com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent;
							public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
							public stringValue(): string;
							public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent;
							public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingIntent>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace graphics {
					export namespace state {
						export class RenderingMode {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode>;
							public static FILL: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public static STROKE: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public static FILL_STROKE: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public static NEITHER: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public static FILL_CLIP: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public static STROKE_CLIP: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public static FILL_STROKE_CLIP: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public static NEITHER_CLIP: com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode>;
							public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
							public isStroke(): boolean;
							public isClip(): boolean;
							public intValue(): number;
							public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public static fromInt(param0: number): com.tom_roush.pdfbox.pdmodel.graphics.state.RenderingMode;
							public isFill(): boolean;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class OpenMode {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode>;
							public static USER_PREFERENCE: com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode;
							public static SAME_WINDOW: com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode;
							public static NEW_WINDOW: com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode;
							public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
							public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode>;
							public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export abstract class PDAction extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.PDDestinationOrAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction>;
							public static TYPE: string = "Action";
							public action: com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor();
							public setSubType(param0: string): void;
							public setType(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getSubType(): string;
							public setNext(param0: java.util.List<any>): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getType(): string;
							public getNext(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction>;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionEmbeddedGoTo extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionEmbeddedGoTo>;
							public static SUB_TYPE: string = "GoToE";
							public constructor();
							public getTargetDirectory(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDTargetDirectory;
							public setDestination(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination): void;
							public setFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
							public setOpenInNewWindow(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode): void;
							public setTargetDirectory(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDTargetDirectory): void;
							public getOpenInNewWindow(): com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode;
							public getDestination(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination;
							public getFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionFactory extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionFactory>;
							public static createAction(param0: com.tom_roush.pdfbox.cos.COSDictionary): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionGoTo extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionGoTo>;
							public static SUB_TYPE: string = "GoTo";
							public constructor();
							public setDestination(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination): void;
							public getDestination(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionHide extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionHide>;
							public static SUB_TYPE: string = "Hide";
							public constructor();
							public setT(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public getT(): com.tom_roush.pdfbox.cos.COSBase;
							public setH(param0: boolean): void;
							public getH(): boolean;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionImportData extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionImportData>;
							public static SUB_TYPE: string = "ImportData";
							public constructor();
							public setFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
							public getFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionJavaScript extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript>;
							public static SUB_TYPE: string = "JavaScript";
							public constructor();
							public setAction(param0: string): void;
							public constructor(param0: string);
							public getAction(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionLaunch extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionLaunch>;
							public static SUB_TYPE: string = "Launch";
							public constructor();
							public getO(): string;
							public setWinLaunchParams(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDWindowsLaunchParams): void;
							public setF(param0: string): void;
							public setP(param0: string): void;
							public setO(param0: string): void;
							public setFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
							/** @deprecated */
							public shouldOpenInNewWindow(): boolean;
							public setOpenInNewWindow(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode): void;
							/** @deprecated */
							public setOpenInNewWindow(param0: boolean): void;
							public getOpenInNewWindow(): com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode;
							public setD(param0: string): void;
							public getFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getWinLaunchParams(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDWindowsLaunchParams;
							public getP(): string;
							public getF(): string;
							public getD(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionMovie extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionMovie>;
							public static SUB_TYPE: string = "Movie";
							public constructor();
							/** @deprecated */
							public getS(): string;
							/** @deprecated */
							public setS(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionNamed extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionNamed>;
							public static SUB_TYPE: string = "Named";
							public constructor();
							public setN(param0: string): void;
							public getN(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionRemoteGoTo extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionRemoteGoTo>;
							public static SUB_TYPE: string = "GoToR";
							public constructor();
							public getD(): com.tom_roush.pdfbox.cos.COSBase;
							/** @deprecated */
							public getS(): string;
							/** @deprecated */
							public setS(param0: string): void;
							public setFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
							public setD(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							/** @deprecated */
							public shouldOpenInNewWindow(): boolean;
							public setOpenInNewWindow(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode): void;
							/** @deprecated */
							public setOpenInNewWindow(param0: boolean): void;
							public getOpenInNewWindow(): com.tom_roush.pdfbox.pdmodel.interactive.action.OpenMode;
							public getFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionResetForm extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionResetForm>;
							public static SUB_TYPE: string = "ResetForm";
							public constructor();
							public setFlags(param0: number): void;
							public getFields(): com.tom_roush.pdfbox.cos.COSArray;
							public getFlags(): number;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setFields(param0: com.tom_roush.pdfbox.cos.COSArray): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionSound extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionSound>;
							public static SUB_TYPE: string = "Sound";
							public constructor();
							public setVolume(param0: number): void;
							public getMix(): boolean;
							public getRepeat(): boolean;
							/** @deprecated */
							public getS(): string;
							/** @deprecated */
							public setS(param0: string): void;
							public getVolume(): number;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setSound(param0: com.tom_roush.pdfbox.cos.COSStream): void;
							public getSound(): com.tom_roush.pdfbox.cos.COSStream;
							public setMix(param0: boolean): void;
							public getSynchronous(): boolean;
							public setRepeat(param0: boolean): void;
							public setSynchronous(param0: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionSubmitForm extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionSubmitForm>;
							public static SUB_TYPE: string = "SubmitForm";
							public constructor();
							public setFlags(param0: number): void;
							public setFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
							public getFields(): com.tom_roush.pdfbox.cos.COSArray;
							public getFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
							public getFlags(): number;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setFields(param0: com.tom_roush.pdfbox.cos.COSArray): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionThread extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionThread>;
							public static SUB_TYPE: string = "Thread";
							public constructor();
							public getD(): com.tom_roush.pdfbox.cos.COSBase;
							public setB(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public getB(): com.tom_roush.pdfbox.cos.COSBase;
							public setD(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public setFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
							public getFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDActionURI extends com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionURI>;
							public static SUB_TYPE: string = "URI";
							public constructor();
							public getURI(): string;
							public setTrackMousePosition(param0: boolean): void;
							public shouldTrackMousePosition(): boolean;
							/** @deprecated */
							public getS(): string;
							/** @deprecated */
							public setS(param0: string): void;
							public setURI(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDAdditionalActions extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDAdditionalActions>;
							public constructor();
							public getF(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setF(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDAnnotationAdditionalActions extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDAnnotationAdditionalActions>;
							public constructor();
							public setBl(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getPC(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getBl(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public setE(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setU(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getPO(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getE(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getD(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public setPV(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getFo(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setFo(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getPV(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public setX(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setD(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setPC(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getPI(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getX(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getU(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setPI(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setPO(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDDocumentCatalogAdditionalActions extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDDocumentCatalogAdditionalActions>;
							public constructor();
							public getWC(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public setDP(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setWP(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getDS(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public setDS(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getWS(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setWC(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setWS(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getDP(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getWP(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDFormFieldAdditionalActions extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDFormFieldAdditionalActions>;
							public constructor();
							public getK(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getF(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setK(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setF(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setV(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setC(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getC(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getV(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDPageAdditionalActions extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDPageAdditionalActions>;
							public constructor();
							public getO(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setO(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public setC(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getC(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDTargetDirectory extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDTargetDirectory>;
							public constructor();
							public setRelationship(param0: com.tom_roush.pdfbox.cos.COSName): void;
							public setFilename(param0: string): void;
							public setAnnotationIndex(param0: number): void;
							public getPageNumber(): number;
							public getRelationship(): com.tom_roush.pdfbox.cos.COSName;
							public setNamedDestination(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDNamedDestination): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getFilename(): string;
							public setPageNumber(param0: number): void;
							public getNamedDestination(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDNamedDestination;
							public getAnnotationIndex(): number;
							public setAnnotationName(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getTargetDirectory(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDTargetDirectory;
							public setTargetDirectory(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDTargetDirectory): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getAnnotationName(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDURIDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDURIDictionary>;
							public constructor();
							public setBase(param0: string): void;
							public getBase(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace action {
						export class PDWindowsLaunchParams extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.action.PDWindowsLaunchParams>;
							public static OPERATION_OPEN: string = "open";
							public static OPERATION_PRINT: string = "print";
							public params: com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor();
							public setOperation(param0: string): void;
							public setExecuteParam(param0: string): void;
							public setFilename(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getDirectory(): string;
							public setDirectory(param0: string): void;
							public getExecuteParam(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getFilename(): string;
							public getOperation(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class AnnotationFilter extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.AnnotationFilter>;
							/**
							 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.interactive.annotation.AnnotationFilter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								accept(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation): boolean;
							});
							public constructor();
							public accept(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation): boolean;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export abstract class PDAnnotation extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation>;
							public setReadOnly(param0: boolean): void;
							public setLockedContents(param0: boolean): void;
							public setInvisible(param0: boolean): void;
							public getAppearanceState(): com.tom_roush.pdfbox.cos.COSName;
							public setModifiedDate(param0: string): void;
							public setModifiedDate(param0: java.util.Calendar): void;
							public setColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public isLockedContents(): boolean;
							public isToggleNoView(): boolean;
							public isLocked(): boolean;
							public getPage(): com.tom_roush.pdfbox.pdmodel.PDPage;
							public getAnnotationName(): string;
							public getRectangle(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public getColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public setAppearance(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceDictionary): void;
							public getNormalAppearanceStream(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream;
							public isNoView(): boolean;
							public setPrinted(param0: boolean): void;
							public setContents(param0: string): void;
							public getColor(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public setToggleNoView(param0: boolean): void;
							public setAnnotationFlags(param0: number): void;
							public getBorder(): com.tom_roush.pdfbox.cos.COSArray;
							public setLocked(param0: boolean): void;
							public isReadOnly(): boolean;
							public setOptionalContent(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList): void;
							public equals(param0: any): boolean;
							public isPrinted(): boolean;
							public getContents(): string;
							public hashCode(): number;
							public setHidden(param0: boolean): void;
							public setNoZoom(param0: boolean): void;
							public getSubtype(): string;
							public constructAppearances(): void;
							public setBorder(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public isNoRotate(): boolean;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setAppearanceState(param0: string): void;
							public setStructParent(param0: number): void;
							public isHidden(): boolean;
							public static createAnnotation(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation;
							public getModifiedDate(): string;
							public setAnnotationName(param0: string): void;
							public getAnnotationFlags(): number;
							public setNoRotate(param0: boolean): void;
							public getStructParent(): number;
							public isInvisible(): boolean;
							public constructor();
							public setNoView(param0: boolean): void;
							public setRectangle(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
							public constructAppearances(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
							public isNoZoom(): boolean;
							public getAppearance(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceDictionary;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
							public getOptionalContent(): com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDPropertyList;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationFileAttachment extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationMarkup {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationFileAttachment>;
							public static ATTACHMENT_NAME_PUSH_PIN: string = "PushPin";
							public static ATTACHMENT_NAME_GRAPH: string = "Graph";
							public static ATTACHMENT_NAME_PAPERCLIP: string = "Paperclip";
							public static ATTACHMENT_NAME_TAG: string = "Tag";
							public static SUB_TYPE: string = "FileAttachment";
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							/** @deprecated */
							public setAttachementName(param0: string): void;
							public setAttachmentName(param0: string): void;
							public setFile(param0: com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification): void;
							public getAttachmentName(): string;
							public getFile(): com.tom_roush.pdfbox.pdmodel.common.filespecification.PDFileSpecification;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationLine extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationMarkup {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationLine>;
							public static IT_LINE_ARROW: string = "LineArrow";
							public static IT_LINE_DIMENSION: string = "LineDimension";
							public static LE_SQUARE: string = "Square";
							public static LE_CIRCLE: string = "Circle";
							public static LE_DIAMOND: string = "Diamond";
							public static LE_OPEN_ARROW: string = "OpenArrow";
							public static LE_CLOSED_ARROW: string = "ClosedArrow";
							public static LE_NONE: string = "None";
							public static LE_BUTT: string = "Butt";
							public static LE_R_OPEN_ARROW: string = "ROpenArrow";
							public static LE_R_CLOSED_ARROW: string = "RClosedArrow";
							public static LE_SLASH: string = "Slash";
							public static SUB_TYPE: string = "Line";
							public setCaptionHorizontalOffset(param0: number): void;
							public getBorderStyle(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary;
							public getLeaderLineOffsetLength(): number;
							public setBorderStyle(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary): void;
							public getLeaderLineExtensionLength(): number;
							public setLeaderLineOffsetLength(param0: number): void;
							public setCaptionVerticalOffset(param0: number): void;
							public setCustomAppearanceHandler(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAppearanceHandler): void;
							public constructAppearances(): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setLeaderLineLength(param0: number): void;
							public getCaption(): boolean;
							public getCaptionVerticalOffset(): number;
							public getLine(): androidNative.Array<number>;
							public constructor();
							public setLine(param0: androidNative.Array<number>): void;
							public getLeaderLineLength(): number;
							public getStartPointEndingStyle(): string;
							public constructAppearances(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
							public setCaptionPositioning(param0: string): void;
							public setStartPointEndingStyle(param0: string): void;
							public setInteriorColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public getCaptionPositioning(): string;
							public getCaptionHorizontalOffset(): number;
							public getInteriorColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setEndPointEndingStyle(param0: string): void;
							public setLeaderLineExtensionLength(param0: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setCaption(param0: boolean): void;
							public getEndPointEndingStyle(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationLink extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationLink>;
							public static HIGHLIGHT_MODE_NONE: string = "N";
							public static HIGHLIGHT_MODE_INVERT: string = "I";
							public static HIGHLIGHT_MODE_OUTLINE: string = "O";
							public static HIGHLIGHT_MODE_PUSH: string = "P";
							public static SUB_TYPE: string = "Link";
							public constructor();
							public getPreviousURI(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionURI;
							public getBorderStyle(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary;
							public setBorderStyle(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary): void;
							public setCustomAppearanceHandler(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAppearanceHandler): void;
							public constructAppearances(): void;
							public setDestination(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination): void;
							public constructAppearances(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
							public getHighlightMode(): string;
							public setPreviousURI(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionURI): void;
							public setAction(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setQuadPoints(param0: androidNative.Array<number>): void;
							public setHighlightMode(param0: string): void;
							public getQuadPoints(): androidNative.Array<number>;
							public getDestination(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getAction(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationMarkup extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationMarkup>;
							public static SUB_TYPE_FREETEXT: string = "FreeText";
							public static SUB_TYPE_POLYGON: string = "Polygon";
							public static SUB_TYPE_POLYLINE: string = "PolyLine";
							public static SUB_TYPE_CARET: string = "Caret";
							public static SUB_TYPE_INK: string = "Ink";
							public static SUB_TYPE_SOUND: string = "Sound";
							public static IT_FREE_TEXT: string = "FreeText";
							public static IT_FREE_TEXT_CALLOUT: string = "FreeTextCallout";
							public static IT_FREE_TEXT_TYPE_WRITER: string = "FreeTextTypeWriter";
							public static RT_REPLY: string = "R";
							public static RT_GROUP: string = "Group";
							public setCallout(param0: androidNative.Array<number>): void;
							public getVertices(): androidNative.Array<number>;
							public getBorderStyle(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary;
							public setBorderEffect(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderEffectDictionary): void;
							public getQ(): number;
							public getBorderEffect(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderEffectDictionary;
							public getConstantOpacity(): number;
							public setRichContents(param0: string): void;
							public getIntent(): string;
							public setInkList(param0: androidNative.Array<androidNative.Array<number>>): void;
							public getInkList(): androidNative.Array<androidNative.Array<number>>;
							public getInReplyTo(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation;
							public getExternalData(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDExternalDataDictionary;
							public setLineEndingStyle(param0: string): void;
							public setRectDifference(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
							public getCallout(): androidNative.Array<number>;
							public setReplyType(param0: string): void;
							public setCreationDate(param0: java.util.Calendar): void;
							public getDefaultStyleString(): string;
							public setPopup(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationPopup): void;
							public setConstantOpacity(param0: number): void;
							public setEndPointEndingStyle(param0: string): void;
							public setSubject(param0: string): void;
							public getReplyType(): string;
							public getEndPointEndingStyle(): string;
							public getRichContents(): string;
							public setIntent(param0: string): void;
							public setBorderStyle(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary): void;
							public setCustomAppearanceHandler(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAppearanceHandler): void;
							public constructAppearances(): void;
							public getCreationDate(): java.util.Calendar;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setTitlePopup(param0: string): void;
							public setRectDifferences(param0: number): void;
							public setVertices(param0: androidNative.Array<number>): void;
							public getDefaultAppearance(): string;
							public setRectDifferences(param0: number, param1: number, param2: number, param3: number): void;
							public getRectDifferences(): androidNative.Array<number>;
							public setInReplyTo(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation): void;
							public setDefaultAppearance(param0: string): void;
							public constructor();
							public setExternalData(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDExternalDataDictionary): void;
							public getStartPointEndingStyle(): string;
							public constructAppearances(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
							public getLineEndingStyle(): string;
							public setStartPointEndingStyle(param0: string): void;
							public setInteriorColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public setDefaultStyleString(param0: string): void;
							public getSubject(): string;
							public getInteriorColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getRectDifference(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getTitlePopup(): string;
							public getPopup(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationPopup;
							public getPath(): androidNative.Array<androidNative.Array<number>>;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setQ(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationPopup extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationPopup>;
							public static SUB_TYPE: string = "Popup";
							public constructor();
							public getOpen(): boolean;
							public setParent(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationMarkup): void;
							public getParent(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationMarkup;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setOpen(param0: boolean): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationRubberStamp extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationMarkup {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationRubberStamp>;
							public static NAME_APPROVED: string = "Approved";
							public static NAME_EXPERIMENTAL: string = "Experimental";
							public static NAME_NOT_APPROVED: string = "NotApproved";
							public static NAME_AS_IS: string = "AsIs";
							public static NAME_EXPIRED: string = "Expired";
							public static NAME_NOT_FOR_PUBLIC_RELEASE: string = "NotForPublicRelease";
							public static NAME_FOR_PUBLIC_RELEASE: string = "ForPublicRelease";
							public static NAME_DRAFT: string = "Draft";
							public static NAME_FOR_COMMENT: string = "ForComment";
							public static NAME_TOP_SECRET: string = "TopSecret";
							public static NAME_DEPARTMENTAL: string = "Departmental";
							public static NAME_CONFIDENTIAL: string = "Confidential";
							public static NAME_FINAL: string = "Final";
							public static NAME_SOLD: string = "Sold";
							public static SUB_TYPE: string = "Stamp";
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getName(): string;
							public setName(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationSquareCircle extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationMarkup {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationSquareCircle>;
							public static SUB_TYPE_SQUARE: string = "Square";
							public static SUB_TYPE_CIRCLE: string = "Circle";
							public constructor();
							public setSubtype(param0: string): void;
							public getBorderStyle(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary;
							public setRectDifference(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
							public getSubtype(): string;
							public setBorderStyle(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary): void;
							public setCustomAppearanceHandler(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAppearanceHandler): void;
							public constructAppearances(): void;
							public setBorderEffect(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderEffectDictionary): void;
							public constructAppearances(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
							public getBorderEffect(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderEffectDictionary;
							public setInteriorColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getInteriorColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getRectDifference(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public setRectDifferences(param0: number): void;
							public constructor(param0: string);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setRectDifferences(param0: number, param1: number, param2: number, param3: number): void;
							public getRectDifferences(): androidNative.Array<number>;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationText extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationMarkup {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationText>;
							public static NAME_COMMENT: string = "Comment";
							public static NAME_KEY: string = "Key";
							public static NAME_NOTE: string = "Note";
							public static NAME_HELP: string = "Help";
							public static NAME_NEW_PARAGRAPH: string = "NewParagraph";
							public static NAME_PARAGRAPH: string = "Paragraph";
							public static NAME_INSERT: string = "Insert";
							public static NAME_CIRCLE: string = "Circle";
							public static NAME_CROSS: string = "Cross";
							public static NAME_STAR: string = "Star";
							public static NAME_CHECK: string = "Check";
							public static NAME_RIGHT_ARROW: string = "RightArrow";
							public static NAME_RIGHT_POINTER: string = "RightPointer";
							public static NAME_UP_ARROW: string = "UpArrow";
							public static NAME_UP_LEFT_ARROW: string = "UpLeftArrow";
							public static NAME_CROSS_HAIRS: string = "CrossHairs";
							public static SUB_TYPE: string = "Text";
							public constructor();
							public setStateModel(param0: string): void;
							public getState(): string;
							public setCustomAppearanceHandler(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAppearanceHandler): void;
							public constructAppearances(): void;
							public constructAppearances(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
							public setName(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setState(param0: string): void;
							public getOpen(): boolean;
							public getStateModel(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getName(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setOpen(param0: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationTextMarkup extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationMarkup {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationTextMarkup>;
							public static SUB_TYPE_HIGHLIGHT: string = "Highlight";
							public static SUB_TYPE_UNDERLINE: string = "Underline";
							public static SUB_TYPE_SQUIGGLY: string = "Squiggly";
							public static SUB_TYPE_STRIKEOUT: string = "StrikeOut";
							public constructor();
							public setSubtype(param0: string): void;
							public constructor(param0: string);
							public getSubtype(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setCustomAppearanceHandler(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAppearanceHandler): void;
							public constructAppearances(): void;
							public setQuadPoints(param0: androidNative.Array<number>): void;
							public constructAppearances(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
							public getQuadPoints(): androidNative.Array<number>;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationUnknown extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationUnknown>;
							public constructor();
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAnnotationWidget extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationWidget>;
							public static SUB_TYPE: string = "Widget";
							public constructor();
							public getAppearanceCharacteristics(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceCharacteristicsDictionary;
							public getActions(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAnnotationAdditionalActions;
							public getBorderStyle(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary;
							public setParent(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDTerminalField): void;
							public setBorderStyle(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary): void;
							public getHighlightingMode(): string;
							public setAction(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setHighlightingMode(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setAppearanceCharacteristics(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceCharacteristicsDictionary): void;
							public setActions(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAnnotationAdditionalActions): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getAction(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAppearanceCharacteristicsDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceCharacteristicsDictionary>;
							public setBackground(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public getNormalIcon(): com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject;
							public getBackground(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getRolloverCaption(): string;
							public getRotation(): number;
							public setRolloverCaption(param0: string): void;
							public getAlternateCaption(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setNormalCaption(param0: string): void;
							public setBorderColour(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
							public getNormalCaption(): string;
							public getRolloverIcon(): com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject;
							public getBorderColour(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setAlternateCaption(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setRotation(param0: number): void;
							public getAlternateIcon(): com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAppearanceDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceDictionary>;
							public constructor();
							public getDownAppearance(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceEntry;
							public setDownAppearance(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceEntry): void;
							public setNormalAppearance(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream): void;
							public setDownAppearance(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream): void;
							public setRolloverAppearance(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setNormalAppearance(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceEntry): void;
							public setRolloverAppearance(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceEntry): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getRolloverAppearance(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceEntry;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getNormalAppearance(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceEntry;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAppearanceEntry extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceEntry>;
							public getAppearanceStream(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSBase);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public isSubDictionary(): boolean;
							public isStream(): boolean;
							public getSubDictionary(): java.util.Map<com.tom_roush.pdfbox.cos.COSName,com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDAppearanceStream extends com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceStream>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.cos.COSName);
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.pdmodel.ResourceCache);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.cos.COSName);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSStream;
							public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public getResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
							public getMatrix(): com.tom_roush.pdfbox.util.Matrix;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSStream, param1: com.tom_roush.pdfbox.cos.COSName);
							public getContents(): java.io.InputStream;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDBorderEffectDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderEffectDictionary>;
							public static STYLE_SOLID: string = "S";
							public static STYLE_CLOUDY: string = "C";
							public constructor();
							public getStyle(): string;
							public getIntensity(): number;
							public setStyle(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setIntensity(param0: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDBorderStyleDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDBorderStyleDictionary>;
							public static STYLE_SOLID: string = "S";
							public static STYLE_DASHED: string = "D";
							public static STYLE_BEVELED: string = "B";
							public static STYLE_INSET: string = "I";
							public static STYLE_UNDERLINE: string = "U";
							public constructor();
							public getWidth(): number;
							public getStyle(): string;
							public setDashStyle(param0: com.tom_roush.pdfbox.cos.COSArray): void;
							public setStyle(param0: string): void;
							public getDashStyle(): com.tom_roush.pdfbox.pdmodel.graphics.PDLineDashPattern;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setWidth(param0: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export class PDExternalDataDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDExternalDataDictionary>;
							public constructor();
							public setSubtype(param0: string): void;
							public getSubtype(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getType(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class AnnotationBorder extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.AnnotationBorder>;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class CloudyBorder extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.CloudyBorder>;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export abstract class PDAbstractAppearanceHandler extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler>;
								public document: com.tom_roush.pdfbox.pdmodel.PDDocument;
								public static SHORT_STYLES: java.util.Set<string>;
								public static INTERIOR_COLOR_STYLES: java.util.Set<string>;
								public static ANGLED_STYLES: java.util.Set<string>;
								public createCOSStream(): com.tom_roush.pdfbox.cos.COSStream;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateAppearanceStreams(): void;
								public generateNormalAppearance(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDAppearanceHandler extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAppearanceHandler>;
								/**
								 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAppearanceHandler interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
								 */
								public constructor(implementation: {
									generateAppearanceStreams(): void;
									generateNormalAppearance(): void;
									generateRolloverAppearance(): void;
									generateDownAppearance(): void;
								});
								public constructor();
								public generateAppearanceStreams(): void;
								public generateNormalAppearance(): void;
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDCaretAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDCaretAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDCircleAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDCircleAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDFileAttachmentAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDFileAttachmentAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDFreeTextAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDFreeTextAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDHighlightAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDHighlightAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDInkAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDInkAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDLineAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDLineAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDLinkAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDLinkAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDPolygonAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDPolygonAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDPolylineAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDPolylineAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDSoundAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDSoundAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDSquareAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDSquareAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDSquigglyAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDSquigglyAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDStrikeoutAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDStrikeoutAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDTextAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDTextAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace handlers {
							export class PDUnderlineAppearanceHandler extends com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDAbstractAppearanceHandler {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.handlers.PDUnderlineAppearanceHandler>;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation, param1: com.tom_roush.pdfbox.pdmodel.PDDocument);
								public generateNormalAppearance(): void;
								public generateAppearanceStreams(): void;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation);
								public generateRolloverAppearance(): void;
								public generateDownAppearance(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace layout {
							export class AppearanceStyle extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.AppearanceStyle>;
								public setFontSize(param0: number): void;
								public setFont(param0: com.tom_roush.pdfbox.pdmodel.font.PDFont): void;
								public constructor();
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace layout {
							export class PlainText extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainText>;
								public constructor(param0: java.util.List<string>);
								public constructor(param0: string);
							}
							export namespace PlainText {
								export class Line extends java.lang.Object {
									public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainText.Line>;
								}
								export class Paragraph extends java.lang.Object {
									public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainText.Paragraph>;
								}
								export class TextAttribute extends java.text.AttributedCharacterIterator.Attribute {
									public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainText.TextAttribute>;
									public static WIDTH: java.text.AttributedCharacterIterator.Attribute;
									public constructor(param0: string);
								}
								export class Word extends java.lang.Object {
									public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainText.Word>;
								}
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace annotation {
						export namespace layout {
							export class PlainTextFormatter extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter>;
								public format(): void;
							}
							export namespace PlainTextFormatter {
								export class Builder extends java.lang.Object {
									public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.Builder>;
									public initialOffset(param0: number, param1: number): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.Builder;
									public width(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.Builder;
									public build(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter;
									public style(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.AppearanceStyle): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.Builder;
									public wrapLines(param0: boolean): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.Builder;
									public textAlign(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.TextAlign): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.Builder;
									public textAlign(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.Builder;
									public text(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainText): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.Builder;
									public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDAppearanceContentStream);
								}
								export class TextAlign {
									public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.TextAlign>;
									public static LEFT: com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.TextAlign;
									public static CENTER: com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.TextAlign;
									public static RIGHT: com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.TextAlign;
									public static JUSTIFY: com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.TextAlign;
									public static valueOf(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.TextAlign;
									public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.TextAlign>;
									public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
									public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.annotation.layout.PlainTextFormatter.TextAlign;
								}
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class COSFilterInputStream extends java.io.FilterInputStream {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.COSFilterInputStream>;
							public constructor();
							public read(param0: androidNative.Array<number>): number;
							public close(): void;
							public constructor(param0: java.io.InputStream);
							public constructor(param0: java.io.InputStream, param1: androidNative.Array<number>);
							public read(): number;
							public toByteArray(): androidNative.Array<number>;
							public constructor(param0: androidNative.Array<number>, param1: androidNative.Array<number>);
							public read(param0: androidNative.Array<number>, param1: number, param2: number): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class ExternalSigningSupport extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.ExternalSigningSupport>;
							/**
							 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.ExternalSigningSupport interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								getContent(): java.io.InputStream;
								setSignature(param0: androidNative.Array<number>): void;
							});
							public constructor();
							public getContent(): java.io.InputStream;
							public setSignature(param0: androidNative.Array<number>): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class PDPropBuild extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuild>;
							public constructor();
							public getApp(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuildDataDict;
							public setPDPropBuildFilter(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuildDataDict): void;
							public getPubSec(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuildDataDict;
							public setPDPropBuildPubSec(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuildDataDict): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getFilter(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuildDataDict;
							public setPDPropBuildApp(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuildDataDict): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class PDPropBuildDataDict extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuildDataDict>;
							public constructor();
							public setDate(param0: string): void;
							public setNonEFontNoWarn(param0: boolean): void;
							public getDate(): string;
							public getMinimumRevision(): number;
							public setPreRelease(param0: boolean): void;
							public setName(param0: string): void;
							public getRevision(): number;
							public setOS(param0: string): void;
							public setMinimumRevision(param0: number): void;
							public getPreRelease(): boolean;
							public getNonEFontNoWarn(): boolean;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setVersion(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getName(): string;
							public setRevision(param0: number): void;
							public setTrustedMode(param0: boolean): void;
							public getTrustedMode(): boolean;
							public getOS(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getVersion(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class PDSeedValue extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValue>;
							public static FLAG_FILTER: number = 1;
							public static FLAG_SUBFILTER: number = 2;
							public static FLAG_V: number = 4;
							public static FLAG_REASON: number = 8;
							public static FLAG_LEGAL_ATTESTATION: number = 16;
							public static FLAG_ADD_REV_INFO: number = 32;
							public static FLAG_DIGEST_METHOD: number = 64;
							public isSubFilterRequired(): boolean;
							public setLegalAttestation(param0: java.util.List<string>): void;
							public setV(param0: number): void;
							public setSubFilter(param0: java.util.List<com.tom_roush.pdfbox.cos.COSName>): void;
							public setFilter(param0: com.tom_roush.pdfbox.cos.COSName): void;
							public isVRequired(): boolean;
							public getDigestMethod(): java.util.List<string>;
							public getReasons(): java.util.List<string>;
							public setTimeStamp(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValueTimeStamp): void;
							public setAddRevInfoRequired(param0: boolean): void;
							public setSubFilterRequired(param0: boolean): void;
							public getSeedValueCertificate(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValueCertificate;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getSubFilter(): java.util.List<string>;
							public setMPD(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValueMDP): void;
							/** @deprecated */
							public setReasonsd(param0: java.util.List<string>): void;
							public getFilter(): string;
							public getV(): number;
							public setSeedValueCertificate(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValueCertificate): void;
							public constructor();
							public setLegalAttestationRequired(param0: boolean): void;
							public isFilterRequired(): boolean;
							public setReasonRequired(param0: boolean): void;
							public isLegalAttestationRequired(): boolean;
							public getLegalAttestation(): java.util.List<string>;
							public setReasons(param0: java.util.List<string>): void;
							public setFilterRequired(param0: boolean): void;
							public setVRequired(param0: boolean): void;
							public isAddRevInfoRequired(): boolean;
							public setDigestMethodRequired(param0: boolean): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public isDigestMethodRequired(): boolean;
							public setDigestMethod(param0: java.util.List<com.tom_roush.pdfbox.cos.COSName>): void;
							public isReasonRequired(): boolean;
							public getTimeStamp(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValueTimeStamp;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getMDP(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValueMDP;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class PDSeedValueCertificate extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValueCertificate>;
							public static FLAG_SUBJECT: number = 1;
							public static FLAG_ISSUER: number = 2;
							public static FLAG_OID: number = 4;
							public static FLAG_SUBJECT_DN: number = 8;
							public static FLAG_KEY_USAGE: number = 32;
							public static FLAG_URL: number = 64;
							public addSubject(param0: androidNative.Array<number>): void;
							public setSubjectDNRequired(param0: boolean): void;
							public setSubject(param0: java.util.List<androidNative.Array<number>>): void;
							public addIssuer(param0: androidNative.Array<number>): void;
							public isURLRequired(): boolean;
							public removeKeyUsage(param0: string): void;
							public removeSubject(param0: androidNative.Array<number>): void;
							public setURLType(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setURLRequired(param0: boolean): void;
							public getURL(): string;
							public setIssuerRequired(param0: boolean): void;
							public isIssuerRequired(): boolean;
							public isOIDRequired(): boolean;
							public addKeyUsage(param0: string): void;
							public setURL(param0: string): void;
							public isKeyUsageRequired(): boolean;
							public setOID(param0: java.util.List<androidNative.Array<number>>): void;
							public setIssuer(param0: java.util.List<androidNative.Array<number>>): void;
							public getKeyUsage(): java.util.List<string>;
							public removeOID(param0: androidNative.Array<number>): void;
							public setSubjectRequired(param0: boolean): void;
							public constructor();
							public getSubject(): java.util.List<androidNative.Array<number>>;
							public getURLType(): string;
							public isSubjectRequired(): boolean;
							public isSubjectDNRequired(): boolean;
							public getOID(): java.util.List<androidNative.Array<number>>;
							public setOIDRequired(param0: boolean): void;
							public addKeyUsage(param0: string, param1: string, param2: string, param3: string, param4: string, param5: string, param6: string, param7: string, param8: string): void;
							public getIssuer(): java.util.List<androidNative.Array<number>>;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getSubjectDN(): java.util.List<java.util.Map<string,string>>;
							public addOID(param0: androidNative.Array<number>): void;
							public setKeyUsageRequired(param0: boolean): void;
							public setSubjectDN(param0: java.util.List<java.util.Map<string,string>>): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public removeIssuer(param0: androidNative.Array<number>): void;
							public setKeyUsage(param0: java.util.List<string>): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class PDSeedValueMDP extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValueMDP>;
							public constructor();
							public getP(): number;
							public setP(param0: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class PDSeedValueTimeStamp extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValueTimeStamp>;
							public constructor();
							public isTimestampRequired(): boolean;
							public setTimestampRequired(param0: boolean): void;
							public setURL(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getURL(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class PDSignature extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature>;
							public static FILTER_ADOBE_PPKLITE: com.tom_roush.pdfbox.cos.COSName;
							public static FILTER_ENTRUST_PPKEF: com.tom_roush.pdfbox.cos.COSName;
							public static FILTER_CICI_SIGNIT: com.tom_roush.pdfbox.cos.COSName;
							public static FILTER_VERISIGN_PPKVS: com.tom_roush.pdfbox.cos.COSName;
							public static SUBFILTER_ADBE_X509_RSA_SHA1: com.tom_roush.pdfbox.cos.COSName;
							public static SUBFILTER_ADBE_PKCS7_DETACHED: com.tom_roush.pdfbox.cos.COSName;
							public static SUBFILTER_ETSI_CADES_DETACHED: com.tom_roush.pdfbox.cos.COSName;
							public static SUBFILTER_ADBE_PKCS7_SHA1: com.tom_roush.pdfbox.cos.COSName;
							public getContents(param0: java.io.InputStream): androidNative.Array<number>;
							public setFilter(param0: com.tom_roush.pdfbox.cos.COSName): void;
							public getSignedContent(param0: java.io.InputStream): androidNative.Array<number>;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setType(param0: com.tom_roush.pdfbox.cos.COSName): void;
							public getSignedContent(param0: androidNative.Array<number>): androidNative.Array<number>;
							public setSubFilter(param0: com.tom_roush.pdfbox.cos.COSName): void;
							public getContactInfo(): string;
							public getPropBuild(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuild;
							public setContactInfo(param0: string): void;
							public getLocation(): string;
							public getContents(param0: androidNative.Array<number>): androidNative.Array<number>;
							public getFilter(): string;
							public constructor();
							public getSubFilter(): string;
							public getByteRange(): androidNative.Array<number>;
							public setContents(param0: androidNative.Array<number>): void;
							public setName(param0: string): void;
							public getSignDate(): java.util.Calendar;
							public setByteRange(param0: androidNative.Array<number>): void;
							public getContents(): androidNative.Array<number>;
							public setReason(param0: string): void;
							public getReason(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getName(): string;
							public setPropBuild(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDPropBuild): void;
							public setLocation(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setSignDate(param0: java.util.Calendar): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class SignatureInterface extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureInterface>;
							/**
							 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureInterface interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								sign(param0: java.io.InputStream): androidNative.Array<number>;
							});
							public constructor();
							public sign(param0: java.io.InputStream): androidNative.Array<number>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class SignatureOptions extends java.lang.Object implements java.io.Closeable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SignatureOptions>;
							public static DEFAULT_SIGNATURE_SIZE: number = 9472;
							public constructor();
							public getPreferredSignatureSize(): number;
							public setVisualSignature(param0: java.io.InputStream): void;
							public close(): void;
							public getPage(): number;
							public setVisualSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigProperties): void;
							public setPage(param0: number): void;
							public setVisualSignature(param0: java.io.File): void;
							public getVisualSignature(): com.tom_roush.pdfbox.cos.COSDocument;
							public setPreferredSignatureSize(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export class SigningSupport extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.ExternalSigningSupport, java.io.Closeable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.SigningSupport>;
							public close(): void;
							public getContent(): java.io.InputStream;
							public constructor(param0: com.tom_roush.pdfbox.pdfwriter.COSWriter);
							public setSignature(param0: androidNative.Array<number>): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export namespace visible {
							export class PDFTemplateBuilder extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateBuilder>;
								/**
								 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateBuilder interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
								 */
								public constructor(implementation: {
									createAffineTransform(param0: androidNative.Array<number>): void;
									createAffineTransform(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
									createPage(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): void;
									createTemplate(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
									createAcroForm(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
									createSignatureField(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm): void;
									createSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: string): void;
									createAcroFormDictionary(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm, param1: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField): void;
									createSignatureRectangle(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField, param1: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): void;
									createProcSetArray(): void;
									createSignatureImage(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: globalAndroid.graphics.Bitmap): void;
									createFormatterRectangle(param0: androidNative.Array<number>): void;
									createFormatterRectangle(param0: androidNative.Array<number>): void;
									createHolderFormStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
									createHolderFormResources(): void;
									createHolderForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.common.PDStream, param2: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
									createAppearanceDictionary(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param1: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField): void;
									createInnerFormStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
									createInnerFormResource(): void;
									createInnerForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.common.PDStream, param2: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
									insertInnerFormToHolderResources(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param1: com.tom_roush.pdfbox.pdmodel.PDResources): void;
									createImageFormStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
									createImageFormResources(): void;
									createImageForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.PDResources, param2: com.tom_roush.pdfbox.pdmodel.common.PDStream, param3: com.tom_roush.pdfbox.pdmodel.common.PDRectangle, param4: com.tom_roush.harmony.awt.geom.AffineTransform, param5: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject): void;
									createBackgroundLayerForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
									injectProcSetArray(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: com.tom_roush.pdfbox.pdmodel.PDResources, param3: com.tom_roush.pdfbox.pdmodel.PDResources, param4: com.tom_roush.pdfbox.pdmodel.PDResources, param5: com.tom_roush.pdfbox.cos.COSArray): void;
									injectAppearanceStreams(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.pdmodel.common.PDStream, param2: com.tom_roush.pdfbox.pdmodel.common.PDStream, param3: com.tom_roush.pdfbox.cos.COSName, param4: com.tom_roush.pdfbox.cos.COSName, param5: com.tom_roush.pdfbox.cos.COSName, param6: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): void;
									createVisualSignature(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
									createWidgetDictionary(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField, param1: com.tom_roush.pdfbox.pdmodel.PDResources): void;
									getStructure(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateStructure;
									closeTemplate(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								});
								public constructor();
								public createSignatureRectangle(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField, param1: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): void;
								public createSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: string): void;
								public createAcroFormDictionary(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm, param1: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField): void;
								public createInnerForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.common.PDStream, param2: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
								public createHolderFormResources(): void;
								/** @deprecated */
								public createAffineTransform(param0: androidNative.Array<number>): void;
								public createAcroForm(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public createInnerFormResource(): void;
								public injectAppearanceStreams(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.pdmodel.common.PDStream, param2: com.tom_roush.pdfbox.pdmodel.common.PDStream, param3: com.tom_roush.pdfbox.cos.COSName, param4: com.tom_roush.pdfbox.cos.COSName, param5: com.tom_roush.pdfbox.cos.COSName, param6: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): void;
								public createPage(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): void;
								public createAffineTransform(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
								public createFormatterRectangle(param0: androidNative.Array<number>): void;
								public closeTemplate(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public createVisualSignature(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public createWidgetDictionary(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField, param1: com.tom_roush.pdfbox.pdmodel.PDResources): void;
								public createImageFormResources(): void;
								public createProcSetArray(): void;
								public createBackgroundLayerForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
								public createAppearanceDictionary(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param1: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField): void;
								public getStructure(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateStructure;
								public createHolderFormStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public createImageForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.PDResources, param2: com.tom_roush.pdfbox.pdmodel.common.PDStream, param3: com.tom_roush.pdfbox.pdmodel.common.PDRectangle, param4: com.tom_roush.harmony.awt.geom.AffineTransform, param5: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject): void;
								/** @deprecated */
								public createFormatterRectangle(param0: androidNative.Array<number>): void;
								public injectProcSetArray(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: com.tom_roush.pdfbox.pdmodel.PDResources, param3: com.tom_roush.pdfbox.pdmodel.PDResources, param4: com.tom_roush.pdfbox.pdmodel.PDResources, param5: com.tom_roush.pdfbox.cos.COSArray): void;
								public createTemplate(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
								public createSignatureImage(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: globalAndroid.graphics.Bitmap): void;
								public createHolderForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.common.PDStream, param2: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
								public createSignatureField(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm): void;
								public createInnerFormStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public insertInnerFormToHolderResources(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param1: com.tom_roush.pdfbox.pdmodel.PDResources): void;
								public createImageFormStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export namespace visible {
							export class PDFTemplateCreator extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateCreator>;
								public buildPDF(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): java.io.InputStream;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateBuilder);
								public getPdfStructure(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateStructure;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export namespace visible {
							export class PDFTemplateStructure extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateStructure>;
								public setProcSet(param0: com.tom_roush.pdfbox.cos.COSArray): void;
								public getSignatureField(): com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField;
								public getImageForm(): com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject;
								public getAppearanceDictionary(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceDictionary;
								public setImageName(param0: com.tom_roush.pdfbox.cos.COSName): void;
								public setImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject): void;
								public setPdSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature): void;
								public getImage(): com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
								public setImageFormStream(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream): void;
								public getInnerFormResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
								public setInnerForm(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject): void;
								public getHolderFormStream(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
								public setHolderFormStream(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream): void;
								public setImageFormResources(param0: com.tom_roush.pdfbox.pdmodel.PDResources): void;
								public setTemplate(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public setHolderFormResources(param0: com.tom_roush.pdfbox.pdmodel.PDResources): void;
								public getInnerFormName(): com.tom_roush.pdfbox.cos.COSName;
								public getInnerForm(): com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject;
								public getWidgetDictionary(): com.tom_roush.pdfbox.cos.COSDictionary;
								public constructor();
								public setAcroFormDictionary(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
								public setImageFormName(param0: com.tom_roush.pdfbox.cos.COSName): void;
								public getProcSet(): com.tom_roush.pdfbox.cos.COSArray;
								public setInnerFormResources(param0: com.tom_roush.pdfbox.pdmodel.PDResources): void;
								public getImageFormResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
								/** @deprecated */
								public getTemplateAppearanceStream(): java.io.ByteArrayInputStream;
								public setSignatureField(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField): void;
								public setHolderForm(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject): void;
								public getPdSignature(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;
								public getSignatureRectangle(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
								public getAcroFormFields(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>;
								public setAcroFormFields(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>): void;
								public getAcroForm(): com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm;
								public getImageName(): com.tom_roush.pdfbox.cos.COSName;
								public getImageFormStream(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
								public setImageForm(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject): void;
								public getAcroFormDictionary(): com.tom_roush.pdfbox.cos.COSDictionary;
								public getPage(): com.tom_roush.pdfbox.pdmodel.PDPage;
								public setAppearanceDictionary(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAppearanceDictionary): void;
								public setFormatterRectangle(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
								public getVisualSignature(): com.tom_roush.pdfbox.cos.COSDocument;
								public getAffineTransform(): com.tom_roush.harmony.awt.geom.AffineTransform;
								public getHolderForm(): com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject;
								public getHolderFormResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
								public setAcroForm(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm): void;
								public setPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
								public getInnerFormStream(): com.tom_roush.pdfbox.pdmodel.common.PDStream;
								public setAffineTransform(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
								public setInnterFormStream(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream): void;
								public getFormatterRectangle(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
								public setWidgetDictionary(param0: com.tom_roush.pdfbox.cos.COSDictionary): void;
								public setInnerFormName(param0: com.tom_roush.pdfbox.cos.COSName): void;
								public setVisualSignature(param0: com.tom_roush.pdfbox.cos.COSDocument): void;
								public getTemplate(): com.tom_roush.pdfbox.pdmodel.PDDocument;
								public setSignatureRectangle(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
								public getImageFormName(): com.tom_roush.pdfbox.cos.COSName;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export namespace visible {
							export class PDVisibleSigBuilder extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateBuilder {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigBuilder>;
								public createSignatureRectangle(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField, param1: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): void;
								public createSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: string): void;
								public createAcroFormDictionary(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm, param1: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField): void;
								public createInnerForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.common.PDStream, param2: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
								public createHolderFormResources(): void;
								public createAcroForm(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								/** @deprecated */
								public createAffineTransform(param0: androidNative.Array<number>): void;
								public createInnerFormResource(): void;
								public injectAppearanceStreams(param0: com.tom_roush.pdfbox.pdmodel.common.PDStream, param1: com.tom_roush.pdfbox.pdmodel.common.PDStream, param2: com.tom_roush.pdfbox.pdmodel.common.PDStream, param3: com.tom_roush.pdfbox.cos.COSName, param4: com.tom_roush.pdfbox.cos.COSName, param5: com.tom_roush.pdfbox.cos.COSName, param6: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): void;
								public createPage(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): void;
								public createAffineTransform(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
								public createFormatterRectangle(param0: androidNative.Array<number>): void;
								public closeTemplate(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public createVisualSignature(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public createWidgetDictionary(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField, param1: com.tom_roush.pdfbox.pdmodel.PDResources): void;
								public createImageFormResources(): void;
								public createProcSetArray(): void;
								public createBackgroundLayerForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
								public getStructure(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDFTemplateStructure;
								public createAppearanceDictionary(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param1: com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField): void;
								public constructor();
								public createHolderFormStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public createImageForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.PDResources, param2: com.tom_roush.pdfbox.pdmodel.common.PDStream, param3: com.tom_roush.pdfbox.pdmodel.common.PDRectangle, param4: com.tom_roush.harmony.awt.geom.AffineTransform, param5: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject): void;
								/** @deprecated */
								public createFormatterRectangle(param0: androidNative.Array<number>): void;
								public injectProcSetArray(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param1: com.tom_roush.pdfbox.pdmodel.PDPage, param2: com.tom_roush.pdfbox.pdmodel.PDResources, param3: com.tom_roush.pdfbox.pdmodel.PDResources, param4: com.tom_roush.pdfbox.pdmodel.PDResources, param5: com.tom_roush.pdfbox.cos.COSArray): void;
								public createTemplate(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
								public createSignatureImage(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: globalAndroid.graphics.Bitmap): void;
								public createHolderForm(param0: com.tom_roush.pdfbox.pdmodel.PDResources, param1: com.tom_roush.pdfbox.pdmodel.common.PDStream, param2: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
								public createSignatureField(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm): void;
								public appendRawCommands(param0: java.io.OutputStream, param1: string): void;
								public createInnerFormStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
								public insertInnerFormToHolderResources(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject, param1: com.tom_roush.pdfbox.pdmodel.PDResources): void;
								public createImageFormStream(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export namespace visible {
							export class PDVisibleSigProperties extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigProperties>;
								public getSignatureReason(): string;
								public signerLocation(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigProperties;
								public getSignerName(): string;
								public getSignerLocation(): string;
								public constructor();
								public preferredSize(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigProperties;
								public signerName(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigProperties;
								public signatureReason(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigProperties;
								public setPdVisibleSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigProperties;
								public getPage(): number;
								public getPdVisibleSignature(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public getPreferredSize(): number;
								public setVisibleSignature(param0: java.io.InputStream): void;
								public page(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigProperties;
								public visualSignEnabled(param0: boolean): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSigProperties;
								public buildSignature(): void;
								public isVisualSignEnabled(): boolean;
								public getVisibleSignature(): java.io.InputStream;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace digitalsignature {
						export namespace visible {
							export class PDVisibleSignDesigner extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner>;
								/** @deprecated */
								public getAffineTransformParams(): androidNative.Array<number>;
								public constructor(param0: java.io.InputStream, param1: java.io.InputStream, param2: number);
								public width(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public getSignatureText(): string;
								public getTransform(): com.tom_roush.harmony.awt.geom.AffineTransform;
								public getyAxis(): number;
								/** @deprecated */
								public affineTransformParams(param0: androidNative.Array<number>): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public coordinates(param0: number, param1: number): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								/** @deprecated */
								public getFormatterRectangleParams(): androidNative.Array<number>;
								public pageWidth(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public getHeight(): number;
								public constructor(param0: string, param1: globalAndroid.graphics.Bitmap, param2: number);
								public signatureImage(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public getWidth(): number;
								public adjustForRotation(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								/** @deprecated */
								public formatterRectangleParams(param0: androidNative.Array<number>): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public height(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public signatureFieldName(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public getTemplateHeight(): number;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: globalAndroid.graphics.Bitmap, param2: number);
								public constructor(param0: java.io.InputStream, param1: globalAndroid.graphics.Bitmap, param2: number);
								public formatterRectangleParameters(param0: androidNative.Array<number>): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public constructor(param0: string, param1: java.io.InputStream, param2: number);
								public getFormatterRectangleParameters(): androidNative.Array<number>;
								public zoom(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.InputStream, param2: number);
								public getImage(): globalAndroid.graphics.Bitmap;
								public imageSizeInPercents(param0: number): void;
								public xAxis(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public getImageSizeInPercents(): number;
								public constructor(param0: java.io.InputStream);
								public getxAxis(): number;
								public getPageHeight(): number;
								public signatureText(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public yAxis(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
								public getPageWidth(): number;
								public getSignatureFieldName(): string;
								public transform(param0: com.tom_roush.harmony.awt.geom.AffineTransform): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.visible.PDVisibleSignDesigner;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace destination {
							export abstract class PDDestination extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.PDDestinationOrAction {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination>;
								public static create(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination;
								public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
								public constructor();
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace destination {
							export class PDNamedDestination extends com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDNamedDestination>;
								public constructor(param0: com.tom_roush.pdfbox.cos.COSString);
								public constructor(param0: com.tom_roush.pdfbox.cos.COSName);
								public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
								public setNamedDestination(param0: string): void;
								public constructor();
								public constructor(param0: string);
								public getNamedDestination(): string;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace destination {
							export abstract class PDPageDestination extends com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination>;
								public array: com.tom_roush.pdfbox.cos.COSArray;
								public setPageNumber(param0: number): void;
								public retrievePageNumber(): number;
								public getPage(): com.tom_roush.pdfbox.pdmodel.PDPage;
								public setPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
								/** @deprecated */
								public findPageNumber(): number;
								public constructor();
								public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
								public getPageNumber(): number;
								public getCOSObject(): com.tom_roush.pdfbox.cos.COSArray;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace destination {
							export class PDPageFitDestination extends com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageFitDestination>;
								public static TYPE: string = "Fit";
								public static TYPE_BOUNDED: string = "FitB";
								public fitBoundingBox(): boolean;
								public constructor();
								public setFitBoundingBox(param0: boolean): void;
								public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace destination {
							export class PDPageFitHeightDestination extends com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageFitHeightDestination>;
								public static TYPE: string = "FitV";
								public static TYPE_BOUNDED: string = "FitBV";
								public setLeft(param0: number): void;
								public getLeft(): number;
								public fitBoundingBox(): boolean;
								public constructor();
								public setFitBoundingBox(param0: boolean): void;
								public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace destination {
							export class PDPageFitRectangleDestination extends com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageFitRectangleDestination>;
								public static TYPE: string = "FitR";
								public setLeft(param0: number): void;
								public setBottom(param0: number): void;
								public getTop(): number;
								public getRight(): number;
								public setRight(param0: number): void;
								public getLeft(): number;
								public setTop(param0: number): void;
								public constructor();
								public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
								public getBottom(): number;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace destination {
							export class PDPageFitWidthDestination extends com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageFitWidthDestination>;
								public static TYPE: string = "FitH";
								public static TYPE_BOUNDED: string = "FitBH";
								public getTop(): number;
								public setTop(param0: number): void;
								public fitBoundingBox(): boolean;
								public constructor();
								public setFitBoundingBox(param0: boolean): void;
								public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace destination {
							export class PDPageXYZDestination extends com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageXYZDestination>;
								public static TYPE: string = "XYZ";
								public setLeft(param0: number): void;
								public setZoom(param0: number): void;
								public getTop(): number;
								public getLeft(): number;
								public setTop(param0: number): void;
								public constructor();
								public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
								public getZoom(): number;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace outline {
							export class PDDocumentOutline extends com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineNode {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDDocumentOutline>;
								public closeNode(): void;
								public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
								public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
								public constructor();
								public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
								public isNodeOpen(): boolean;
								public openNode(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace outline {
							export class PDOutlineItem extends com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineNode {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem>;
								public getAction(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction;
								public findDestinationPage(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): com.tom_roush.pdfbox.pdmodel.PDPage;
								public setItalic(param0: boolean): void;
								public getPreviousSibling(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
								public setDestination(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
								public setTextColor(param0: com.tom_roush.harmony.awt.AWTColor): void;
								public setStructureElement(param0: com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement): void;
								public setDestination(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination): void;
								public setAction(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDAction): void;
								public insertSiblingAfter(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem): void;
								public insertSiblingBefore(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem): void;
								public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
								public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
								public constructor();
								public isItalic(): boolean;
								public getNextSibling(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
								public getTextColor(): com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor;
								public getTitle(): string;
								public isBold(): boolean;
								public setTitle(param0: string): void;
								public setTextColor(param0: com.tom_roush.pdfbox.pdmodel.graphics.color.PDColor): void;
								public setBold(param0: boolean): void;
								public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
								public getStructureElement(): com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.PDStructureElement;
								public getDestination(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace outline {
							export class PDOutlineItemIterator extends java.util.Iterator<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem> {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItemIterator>;
								public next(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
								public hasNext(): boolean;
								public remove(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace documentnavigation {
						export namespace outline {
							export abstract class PDOutlineNode extends com.tom_roush.pdfbox.pdmodel.common.PDDictionaryWrapper {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineNode>;
								public getLastChild(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
								public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
								public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
								public getFirstChild(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
								public constructor();
								public isNodeOpen(): boolean;
								public openNode(): void;
								public addFirst(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem): void;
								public closeNode(): void;
								public children(): java.lang.Iterable<com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem>;
								public getOpenCount(): number;
								public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
								public hasChildren(): boolean;
								public addLast(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class AppearanceGeneratorHelper extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.AppearanceGeneratorHelper>;
							public setAppearanceValue(param0: string): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class AppearanceStyle extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.AppearanceStyle>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class FieldUtils extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.FieldUtils>;
						}
						export namespace FieldUtils {
							export class KeyValue extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.FieldUtils.KeyValue>;
								public toString(): string;
								public getKey(): string;
								public getValue(): string;
							}
							export class KeyValueKeyComparator extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.FieldUtils.KeyValueKeyComparator>;
								public static reverseOrder(): java.util.Comparator<any>;
								public static naturalOrder(): java.util.Comparator<any>;
								public thenComparing(param0: java.util.Comparator<any>): java.util.Comparator<any>;
								public equals(param0: any): boolean;
								public static nullsFirst(param0: java.util.Comparator<any>): java.util.Comparator<any>;
								public thenComparing(param0: any /* any*/, param1: java.util.Comparator<any>): java.util.Comparator<any>;
								public thenComparingInt(param0: any /* any*/): java.util.Comparator<any>;
								public static comparingInt(param0: any /* any*/): java.util.Comparator<any>;
								public static nullsLast(param0: java.util.Comparator<any>): java.util.Comparator<any>;
								public static comparing(param0: any /* any*/): java.util.Comparator<any>;
								public thenComparing(param0: any /* any*/): java.util.Comparator<any>;
								public static comparing(param0: any /* any*/, param1: java.util.Comparator<any>): java.util.Comparator<any>;
								public static comparingDouble(param0: any /* any*/): java.util.Comparator<any>;
								public compare(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.FieldUtils.KeyValue, param1: com.tom_roush.pdfbox.pdmodel.interactive.form.FieldUtils.KeyValue): number;
								public thenComparingDouble(param0: any /* any*/): java.util.Comparator<any>;
								public static comparingLong(param0: any /* any*/): java.util.Comparator<any>;
								public compare(param0: any, param1: any): number;
								public reversed(): java.util.Comparator<any>;
								public thenComparingLong(param0: any /* any*/): java.util.Comparator<any>;
							}
							export class KeyValueValueComparator extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.FieldUtils.KeyValueValueComparator>;
								public static reverseOrder(): java.util.Comparator<any>;
								public static naturalOrder(): java.util.Comparator<any>;
								public thenComparing(param0: java.util.Comparator<any>): java.util.Comparator<any>;
								public equals(param0: any): boolean;
								public static nullsFirst(param0: java.util.Comparator<any>): java.util.Comparator<any>;
								public thenComparing(param0: any /* any*/, param1: java.util.Comparator<any>): java.util.Comparator<any>;
								public thenComparingInt(param0: any /* any*/): java.util.Comparator<any>;
								public static comparingInt(param0: any /* any*/): java.util.Comparator<any>;
								public static nullsLast(param0: java.util.Comparator<any>): java.util.Comparator<any>;
								public static comparing(param0: any /* any*/): java.util.Comparator<any>;
								public thenComparing(param0: any /* any*/): java.util.Comparator<any>;
								public static comparing(param0: any /* any*/, param1: java.util.Comparator<any>): java.util.Comparator<any>;
								public static comparingDouble(param0: any /* any*/): java.util.Comparator<any>;
								public compare(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.FieldUtils.KeyValue, param1: com.tom_roush.pdfbox.pdmodel.interactive.form.FieldUtils.KeyValue): number;
								public thenComparingDouble(param0: any /* any*/): java.util.Comparator<any>;
								public static comparingLong(param0: any /* any*/): java.util.Comparator<any>;
								public compare(param0: any, param1: any): number;
								public reversed(): java.util.Comparator<any>;
								public thenComparingLong(param0: any /* any*/): java.util.Comparator<any>;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDAcroForm extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm>;
							public refreshAppearances(): void;
							public setFields(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>): void;
							public xfaIsDynamic(): boolean;
							public getScriptingHandler(): com.tom_roush.pdfbox.pdmodel.interactive.form.ScriptingHandler;
							public setXFA(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDXFAResource): void;
							public getQ(): number;
							public isAppendOnly(): boolean;
							public setCacheFields(param0: boolean): void;
							public getFieldIterator(): java.util.Iterator<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: com.tom_roush.pdfbox.cos.COSDictionary);
							public setSignaturesExist(param0: boolean): void;
							public refreshAppearances(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>): void;
							public flatten(): void;
							public isSignaturesExist(): boolean;
							public setAppendOnly(param0: boolean): void;
							public getDefaultAppearance(): string;
							public getXFA(): com.tom_roush.pdfbox.pdmodel.interactive.form.PDXFAResource;
							public hasXFA(): boolean;
							public setDefaultAppearance(param0: string): void;
							public setScriptingHandler(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.ScriptingHandler): void;
							public isCachingFields(): boolean;
							public getDefaultResources(): com.tom_roush.pdfbox.pdmodel.PDResources;
							public getField(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.form.PDField;
							public importFDF(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument): void;
							public exportFDF(): com.tom_roush.pdfbox.pdmodel.fdf.FDFDocument;
							public getFields(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
							public setNeedAppearances(param0: java.lang.Boolean): void;
							public setDefaultResources(param0: com.tom_roush.pdfbox.pdmodel.PDResources): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getNeedAppearances(): boolean;
							public setQ(param0: number): void;
							public flatten(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>, param1: boolean): void;
							public getFieldTree(): com.tom_roush.pdfbox.pdmodel.interactive.form.PDFieldTree;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export abstract class PDButton extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDTerminalField {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDButton>;
							public setDefaultValue(param0: string): void;
							public getDefaultValue(): string;
							public getExportValues(): java.util.List<string>;
							public getValue(): string;
							public setValue(param0: number): void;
							public isRadioButton(): boolean;
							public isPushButton(): boolean;
							public getOnValues(): java.util.Set<string>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public getValueAsString(): string;
							public setValue(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							/** @deprecated */
							public setPushButton(param0: boolean): void;
							/** @deprecated */
							public setRadioButton(param0: boolean): void;
							public setExportValues(param0: java.util.List<string>): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDCheckBox extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDButton {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDCheckBox>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public check(): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public isChecked(): boolean;
							public getOnValue(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public unCheck(): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export abstract class PDChoice extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDVariableText {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDChoice>;
							public getOptionsExportValues(): java.util.List<string>;
							public setValue(param0: java.util.List<string>): void;
							public getValue(): java.util.List<string>;
							public setSelectedOptionsIndex(param0: java.util.List<java.lang.Integer>): void;
							public setSort(param0: boolean): void;
							public setCommitOnSelChange(param0: boolean): void;
							public getSelectedOptionsIndex(): java.util.List<java.lang.Integer>;
							public isMultiSelect(): boolean;
							public setOptions(param0: java.util.List<string>, param1: java.util.List<string>): void;
							public isSort(): boolean;
							public isCommitOnSelChange(): boolean;
							public setDefaultValue(param0: string): void;
							public isCombo(): boolean;
							public getOptionsDisplayValues(): java.util.List<string>;
							public isDoNotSpellCheck(): boolean;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public setCombo(param0: boolean): void;
							public getValueAsString(): string;
							public getOptions(): java.util.List<string>;
							public setValue(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getDefaultValue(): java.util.List<string>;
							public setOptions(param0: java.util.List<string>): void;
							public setMultiSelect(param0: boolean): void;
							public setDoNotSpellCheck(param0: boolean): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDComboBox extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDChoice {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDComboBox>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public isEdit(): boolean;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setEdit(param0: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDDefaultAppearanceString extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDDefaultAppearanceString>;
							public getFontSize(): number;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export abstract class PDField extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>;
							public setReadOnly(param0: boolean): void;
							public setAlternateFieldName(param0: string): void;
							public getPartialName(): string;
							public toString(): string;
							public getInheritableAttribute(param0: com.tom_roush.pdfbox.cos.COSName): com.tom_roush.pdfbox.cos.COSBase;
							public getAlternateFieldName(): string;
							public setNoExport(param0: boolean): void;
							public getParent(): com.tom_roush.pdfbox.pdmodel.interactive.form.PDNonTerminalField;
							public isNoExport(): boolean;
							public setMappingName(param0: string): void;
							public getAcroForm(): com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm;
							public getFullyQualifiedName(): string;
							public isRequired(): boolean;
							public getFieldType(): string;
							public getWidgets(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationWidget>;
							public setFieldFlags(param0: number): void;
							public getMappingName(): string;
							public getValueAsString(): string;
							public isReadOnly(): boolean;
							public setValue(param0: string): void;
							public getActions(): com.tom_roush.pdfbox.pdmodel.interactive.action.PDFormFieldAdditionalActions;
							public setPartialName(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setRequired(param0: boolean): void;
							public getFieldFlags(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDFieldFactory extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDFieldFactory>;
							public static createField(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm, param1: com.tom_roush.pdfbox.cos.COSDictionary, param2: com.tom_roush.pdfbox.pdmodel.interactive.form.PDNonTerminalField): com.tom_roush.pdfbox.pdmodel.interactive.form.PDField;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDFieldTree extends java.lang.Iterable<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField> {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDFieldTree>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public iterator(): java.util.Iterator<any>;
							public spliterator(): java.util.Spliterator<any>;
							public iterator(): java.util.Iterator<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>;
							public forEach(param0: any /* any*/): void;
						}
						export namespace PDFieldTree {
							export class FieldIterator extends java.util.Iterator<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField> {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDFieldTree.FieldIterator>;
								public next(): com.tom_roush.pdfbox.pdmodel.interactive.form.PDField;
								public hasNext(): boolean;
								public remove(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDListBox extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDChoice {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDListBox>;
							public getTopIndex(): number;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public setTopIndex(param0: java.lang.Integer): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDNonTerminalField extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDField {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDNonTerminalField>;
							public getDefaultValue(): com.tom_roush.pdfbox.cos.COSBase;
							public getFieldType(): string;
							public getWidgets(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationWidget>;
							public getChildren(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>;
							public setChildren(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.form.PDField>): void;
							public setValue(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public getValueAsString(): string;
							public getValue(): com.tom_roush.pdfbox.cos.COSBase;
							public setValue(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getFieldFlags(): number;
							public setDefaultValue(param0: com.tom_roush.pdfbox.cos.COSBase): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDPushButton extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDButton {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDPushButton>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public getValueAsString(): string;
							public getExportValues(): java.util.List<string>;
							public getDefaultValue(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getValue(): string;
							public setExportValues(param0: java.util.List<string>): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getOnValues(): java.util.Set<string>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDRadioButton extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDButton {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDRadioButton>;
							public getSelectedExportValues(): java.util.List<string>;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public isRadiosInUnison(): boolean;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getSelectedIndex(): number;
							public setRadiosInUnison(param0: boolean): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDSignatureField extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDTerminalField {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDSignatureField>;
							public getValue(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;
							public setDefaultValue(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public getValueAsString(): string;
							public setSeedValue(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValue): void;
							public setValue(param0: string): void;
							public getDefaultValue(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setValue(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature): void;
							/** @deprecated */
							public setSignature(param0: com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature): void;
							public getSeedValue(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSeedValue;
							public getSignature(): com.tom_roush.pdfbox.pdmodel.interactive.digitalsignature.PDSignature;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export abstract class PDTerminalField extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDField {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDTerminalField>;
							public applyChange(): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public setWidgets(param0: java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationWidget>): void;
							public importFDF(param0: com.tom_roush.pdfbox.pdmodel.fdf.FDFField): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getFieldType(): string;
							public getFieldFlags(): number;
							public getWidgets(): java.util.List<com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationWidget>;
							/** @deprecated */
							public getWidget(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotationWidget;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setActions(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDFormFieldAdditionalActions): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDTextField extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDVariableText {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDTextField>;
							public doNotScroll(): boolean;
							public setDefaultValue(param0: string): void;
							public getDefaultValue(): string;
							public getMaxLen(): number;
							public getValue(): string;
							public isPassword(): boolean;
							public setPassword(param0: boolean): void;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm);
							public getValueAsString(): string;
							public setDoNotScroll(param0: boolean): void;
							public setFileSelect(param0: boolean): void;
							public setValue(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public isRichText(): boolean;
							public setRichText(param0: boolean): void;
							public setMultiline(param0: boolean): void;
							public setComb(param0: boolean): void;
							public isComb(): boolean;
							public isMultiline(): boolean;
							public doNotSpellCheck(): boolean;
							public setDoNotSpellCheck(param0: boolean): void;
							public setMaxLen(param0: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public isFileSelect(): boolean;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export abstract class PDVariableText extends com.tom_roush.pdfbox.pdmodel.interactive.form.PDTerminalField {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDVariableText>;
							public static QUADDING_LEFT: number = 0;
							public static QUADDING_CENTERED: number = 1;
							public static QUADDING_RIGHT: number = 2;
							public setRichTextValue(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getDefaultAppearance(): string;
							public getQ(): number;
							public getRichTextValue(): string;
							public getDefaultStyleString(): string;
							public setDefaultAppearance(param0: string): void;
							public getStringOrStream(param0: com.tom_roush.pdfbox.cos.COSBase): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setQ(param0: number): void;
							public setDefaultStyleString(param0: string): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PDXFAResource extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PDXFAResource>;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSBase);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getDocument(): org.w3c.dom.Document;
							public getBytes(): androidNative.Array<number>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PlainText extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PlainText>;
						}
						export namespace PlainText {
							export class Line extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PlainText.Line>;
							}
							export class Paragraph extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PlainText.Paragraph>;
							}
							export class TextAttribute extends java.text.AttributedCharacterIterator.Attribute {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PlainText.TextAttribute>;
								public static WIDTH: java.text.AttributedCharacterIterator.Attribute;
								public constructor(param0: string);
							}
							export class Word extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PlainText.Word>;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class PlainTextFormatter extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter>;
							public format(): void;
						}
						export namespace PlainTextFormatter {
							export class Builder extends java.lang.Object {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter.Builder>;
							}
							export class TextAlign {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter.TextAlign>;
								public static LEFT: com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter.TextAlign;
								public static CENTER: com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter.TextAlign;
								public static RIGHT: com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter.TextAlign;
								public static JUSTIFY: com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter.TextAlign;
								public static valueOf(param0: number): com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter.TextAlign;
								public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter.TextAlign;
								public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
								public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.form.PlainTextFormatter.TextAlign>;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace form {
						export class ScriptingHandler extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.form.ScriptingHandler>;
							/**
							 * Constructs a new instance of the com.tom_roush.pdfbox.pdmodel.interactive.form.ScriptingHandler interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								keyboard(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript, param1: string): string;
								format(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript, param1: string): string;
								validate(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript, param1: string): boolean;
								calculate(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript, param1: string): string;
							});
							public constructor();
							public format(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript, param1: string): string;
							public calculate(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript, param1: string): string;
							public keyboard(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript, param1: string): string;
							public validate(param0: com.tom_roush.pdfbox.pdmodel.interactive.action.PDActionJavaScript, param1: string): boolean;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace measurement {
						export class PDMeasureDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDMeasureDictionary>;
							public static TYPE: string = "Measure";
							public constructor();
							public setSubtype(param0: string): void;
							public getSubtype(): string;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getType(): string;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace measurement {
						export class PDNumberFormatDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>;
							public static TYPE: string = "NumberFormat";
							public static LABEL_SUFFIX_TO_VALUE: string = "S";
							public static LABEL_PREFIX_TO_VALUE: string = "P";
							public static FRACTIONAL_DISPLAY_DECIMAL: string = "D";
							public static FRACTIONAL_DISPLAY_FRACTION: string = "F";
							public static FRACTIONAL_DISPLAY_ROUND: string = "R";
							public static FRACTIONAL_DISPLAY_TRUNCATE: string = "T";
							public getUnits(): string;
							public setDenominator(param0: number): void;
							public setFractionalDisplay(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setUnits(param0: string): void;
							public isFD(): boolean;
							public setLabelSuffixString(param0: string): void;
							public setFD(param0: boolean): void;
							public getLabelPrefixString(): string;
							public getType(): string;
							public constructor();
							public setConversionFactor(param0: number): void;
							public getLabelPositionToValue(): string;
							public getDenominator(): number;
							public setLabelPositionToValue(param0: string): void;
							public getFractionalDisplay(): string;
							public getThousandsSeparator(): string;
							public setThousandsSeparator(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getLabelSuffixString(): string;
							public setLabelPrefixString(param0: string): void;
							public getConversionFactor(): number;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public setDecimalSeparator(param0: string): void;
							public getDecimalSeparator(): string;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace measurement {
						export class PDRectlinearMeasureDictionary extends com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDMeasureDictionary {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDRectlinearMeasureDictionary>;
							public static SUBTYPE: string = "RL";
							public constructor();
							public getScaleRatio(): string;
							public setDistances(param0: androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>): void;
							public getLineSloaps(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>;
							public setCoordSystemOrigin(param0: androidNative.Array<number>): void;
							public getCYX(): number;
							public getDistances(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>;
							public getAngles(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>;
							public getChangeYs(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>;
							public getAreas(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>;
							public setAngles(param0: androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setScaleRatio(param0: string): void;
							public getCoordSystemOrigin(): androidNative.Array<number>;
							public setLineSloaps(param0: androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>): void;
							public setCYX(param0: number): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setChangeYs(param0: androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>): void;
							public setAreas(param0: androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>): void;
							public setChangeXs(param0: androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getChangeXs(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDNumberFormatDictionary>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace measurement {
						export class PDViewportDictionary extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDViewportDictionary>;
							public static TYPE: string = "Viewport";
							public constructor();
							public setMeasure(param0: com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDMeasureDictionary): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getBBox(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public getName(): string;
							public setBBox(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
							public setName(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getType(): string;
							public getMeasure(): com.tom_roush.pdfbox.pdmodel.interactive.measurement.PDMeasureDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace pagenavigation {
						export class PDThread extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThread>;
							public constructor();
							public setThreadInfo(param0: com.tom_roush.pdfbox.pdmodel.PDDocumentInformation): void;
							public getFirstBead(): com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getThreadInfo(): com.tom_roush.pdfbox.pdmodel.PDDocumentInformation;
							public setFirstBead(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace pagenavigation {
						export class PDThreadBead extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead>;
							public constructor();
							public setThread(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThread): void;
							public getThread(): com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThread;
							public getRectangle(): com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
							public setNextBead(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead): void;
							public setRectangle(param0: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
							public getPreviousBead(): com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getNextBead(): com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public setPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
							public setPreviousBead(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public appendBead(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead): void;
							public getPage(): com.tom_roush.pdfbox.pdmodel.PDPage;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace pagenavigation {
						export class PDTransition extends com.tom_roush.pdfbox.pdmodel.common.PDDictionaryWrapper {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransition>;
							public constructor();
							public setDirection(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection): void;
							public setDuration(param0: number): void;
							public setFlyScale(param0: number): void;
							public setMotion(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionMotion): void;
							public getFlyScale(): number;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public getStyle(): string;
							public constructor(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle);
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							public getDirection(): com.tom_roush.pdfbox.cos.COSBase;
							public isFlyAreaOpaque(): boolean;
							public getDuration(): number;
							public getMotion(): string;
							public setDimension(param0: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDimension): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							public getDimension(): string;
							public setFlyAreaOpaque(param0: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace pagenavigation {
						export class PDTransitionDimension {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDimension>;
							public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
							public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDimension>;
							public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDimension;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace pagenavigation {
						export class PDTransitionDirection {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection>;
							public static LEFT_TO_RIGHT: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection;
							public static BOTTOM_TO_TOP: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection;
							public static RIGHT_TO_LEFT: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection;
							public static TOP_TO_BOTTOM: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection;
							public static TOP_LEFT_TO_BOTTOM_RIGHT: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection;
							public static NONE: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection;
							public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
							public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection;
							public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionDirection>;
							public getCOSBase(): com.tom_roush.pdfbox.cos.COSBase;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace pagenavigation {
						export class PDTransitionMotion {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionMotion>;
							public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
							public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionMotion;
							public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionMotion>;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace pagenavigation {
						export class PDTransitionStyle {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle>;
							public static Split: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Blinds: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Box: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Wipe: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Dissolve: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Glitter: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static R: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Fly: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Push: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Cover: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Uncover: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static Fade: com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
							public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
							public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle>;
							public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.pagenavigation.PDTransitionStyle;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace pdmodel {
				export namespace interactive {
					export namespace viewerpreferences {
						export class PDViewerPreferences extends java.lang.Object implements com.tom_roush.pdfbox.pdmodel.common.COSObjectable {
							public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences>;
							public static NON_FULL_SCREEN_PAGE_MODE_USE_NONE: string = "UseNone";
							public static NON_FULL_SCREEN_PAGE_MODE_USE_OUTLINES: string = "UseOutlines";
							public static NON_FULL_SCREEN_PAGE_MODE_USE_THUMBS: string = "UseThumbs";
							public static NON_FULL_SCREEN_PAGE_MODE_USE_OPTIONAL_CONTENT: string = "UseOC";
							public static READING_DIRECTION_L2R: string = "L2R";
							public static READING_DIRECTION_R2L: string = "R2L";
							public static BOUNDARY_MEDIA_BOX: string = "MediaBox";
							public static BOUNDARY_CROP_BOX: string = "CropBox";
							public static BOUNDARY_BLEED_BOX: string = "BleedBox";
							public static BOUNDARY_TRIM_BOX: string = "TrimBox";
							public static BOUNDARY_ART_BOX: string = "ArtBox";
							public setHideMenubar(param0: boolean): void;
							public centerWindow(): boolean;
							public setCenterWindow(param0: boolean): void;
							/** @deprecated */
							public setPrintArea(param0: string): void;
							public getPrintScaling(): string;
							public getReadingDirection(): string;
							public getViewClip(): string;
							/** @deprecated */
							public setPrintClip(param0: string): void;
							/** @deprecated */
							public setReadingDirection(param0: string): void;
							public constructor(param0: com.tom_roush.pdfbox.cos.COSDictionary);
							public setDisplayDocTitle(param0: boolean): void;
							/** @deprecated */
							public setNonFullScreenPageMode(param0: string): void;
							public hideToolbar(): boolean;
							public setDuplex(param0: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.DUPLEX): void;
							public setHideToolbar(param0: boolean): void;
							public setFitWindow(param0: boolean): void;
							public setViewClip(param0: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY): void;
							public setPrintClip(param0: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY): void;
							public getNonFullScreenPageMode(): string;
							public setNonFullScreenPageMode(param0: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.NON_FULL_SCREEN_PAGE_MODE): void;
							public fitWindow(): boolean;
							public getPrintClip(): string;
							public getViewArea(): string;
							public setPrintArea(param0: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY): void;
							public setPrintScaling(param0: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.PRINT_SCALING): void;
							public setViewArea(param0: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY): void;
							public hideWindowUI(): boolean;
							public getPrintArea(): string;
							public displayDocTitle(): boolean;
							public hideMenubar(): boolean;
							public getDuplex(): string;
							public setHideWindowUI(param0: boolean): void;
							public setReadingDirection(param0: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.READING_DIRECTION): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSBase;
							/** @deprecated */
							public setViewArea(param0: string): void;
							public getCOSObject(): com.tom_roush.pdfbox.cos.COSDictionary;
							/** @deprecated */
							public setViewClip(param0: string): void;
						}
						export namespace PDViewerPreferences {
							export class BOUNDARY {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY>;
								public static MediaBox: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY;
								public static CropBox: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY;
								public static BleedBox: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY;
								public static TrimBox: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY;
								public static ArtBox: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY;
								public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY>;
								public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
								public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.BOUNDARY;
							}
							export class DUPLEX {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.DUPLEX>;
								public static Simplex: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.DUPLEX;
								public static DuplexFlipShortEdge: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.DUPLEX;
								public static DuplexFlipLongEdge: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.DUPLEX;
								public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.DUPLEX;
								public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
								public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.DUPLEX>;
							}
							export class NON_FULL_SCREEN_PAGE_MODE {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.NON_FULL_SCREEN_PAGE_MODE>;
								public static UseNone: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.NON_FULL_SCREEN_PAGE_MODE;
								public static UseOutlines: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.NON_FULL_SCREEN_PAGE_MODE;
								public static UseThumbs: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.NON_FULL_SCREEN_PAGE_MODE;
								public static UseOC: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.NON_FULL_SCREEN_PAGE_MODE;
								public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.NON_FULL_SCREEN_PAGE_MODE>;
								public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
								public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.NON_FULL_SCREEN_PAGE_MODE;
							}
							export class PRINT_SCALING {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.PRINT_SCALING>;
								public static None: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.PRINT_SCALING;
								public static AppDefault: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.PRINT_SCALING;
								public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.PRINT_SCALING;
								public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
								public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.PRINT_SCALING>;
							}
							export class READING_DIRECTION {
								public static class: java.lang.Class<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.READING_DIRECTION>;
								public static L2R: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.READING_DIRECTION;
								public static R2L: com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.READING_DIRECTION;
								public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
								public static values(): androidNative.Array<com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.READING_DIRECTION>;
								public static valueOf(param0: string): com.tom_roush.pdfbox.pdmodel.interactive.viewerpreferences.PDViewerPreferences.READING_DIRECTION;
							}
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace rendering {
				export class CIDType0Glyph2D extends java.lang.Object implements com.tom_roush.pdfbox.rendering.Glyph2D {
					public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.CIDType0Glyph2D>;
					public dispose(): void;
					public getPathForCharacterCode(param0: number): globalAndroid.graphics.Path;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace rendering {
				export class Glyph2D extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.Glyph2D>;
					/**
					 * Constructs a new instance of the com.tom_roush.pdfbox.rendering.Glyph2D interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getPathForCharacterCode(param0: number): globalAndroid.graphics.Path;
						dispose(): void;
					});
					public constructor();
					public dispose(): void;
					public getPathForCharacterCode(param0: number): globalAndroid.graphics.Path;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace rendering {
				export abstract class ImageType {
					public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.ImageType>;
					public static BINARY: com.tom_roush.pdfbox.rendering.ImageType;
					public static GRAY: com.tom_roush.pdfbox.rendering.ImageType;
					public static RGB: com.tom_roush.pdfbox.rendering.ImageType;
					public static ARGB: com.tom_roush.pdfbox.rendering.ImageType;
					public static BGR: com.tom_roush.pdfbox.rendering.ImageType;
					public static valueOf(param0: string): com.tom_roush.pdfbox.rendering.ImageType;
					public static values(): androidNative.Array<com.tom_roush.pdfbox.rendering.ImageType>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace rendering {
				export class PDFRenderer extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.PDFRenderer>;
					public document: com.tom_roush.pdfbox.pdmodel.PDDocument;
					public renderPageToGraphics(param0: number, param1: globalAndroid.graphics.Paint, param2: globalAndroid.graphics.Canvas, param3: number): void;
					public renderPageToGraphics(param0: number, param1: globalAndroid.graphics.Paint, param2: globalAndroid.graphics.Canvas, param3: number, param4: number, param5: com.tom_roush.pdfbox.rendering.RenderDestination): void;
					public createPageDrawer(param0: com.tom_roush.pdfbox.rendering.PageDrawerParameters): com.tom_roush.pdfbox.rendering.PageDrawer;
					public getAnnotationsFilter(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.AnnotationFilter;
					public setAnnotationsFilter(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.AnnotationFilter): void;
					public renderImage(param0: number, param1: number, param2: com.tom_roush.pdfbox.rendering.ImageType): globalAndroid.graphics.Bitmap;
					public setDefaultDestination(param0: com.tom_roush.pdfbox.rendering.RenderDestination): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDDocument);
					public renderImage(param0: number, param1: number): globalAndroid.graphics.Bitmap;
					public renderImage(param0: number, param1: number, param2: com.tom_roush.pdfbox.rendering.ImageType, param3: com.tom_roush.pdfbox.rendering.RenderDestination): globalAndroid.graphics.Bitmap;
					public isGroupEnabled(param0: com.tom_roush.pdfbox.pdmodel.graphics.optionalcontent.PDOptionalContentGroup): boolean;
					public renderImage(param0: number): globalAndroid.graphics.Bitmap;
					public isSubsamplingAllowed(): boolean;
					public renderImageWithDPI(param0: number, param1: number, param2: com.tom_roush.pdfbox.rendering.ImageType): globalAndroid.graphics.Bitmap;
					public renderPageToGraphics(param0: number, param1: globalAndroid.graphics.Paint, param2: globalAndroid.graphics.Canvas): void;
					public setSubsamplingAllowed(param0: boolean): void;
					public renderImageWithDPI(param0: number, param1: number): globalAndroid.graphics.Bitmap;
					public getImageDownscalingOptimizationThreshold(): number;
					public renderPageToGraphics(param0: number, param1: globalAndroid.graphics.Paint, param2: globalAndroid.graphics.Canvas, param3: number, param4: number): void;
					public getDefaultDestination(): com.tom_roush.pdfbox.rendering.RenderDestination;
					public setImageDownscalingOptimizationThreshold(param0: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace rendering {
				export class PageDrawer extends com.tom_roush.pdfbox.contentstream.PDFGraphicsStreamEngine {
					public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.PageDrawer>;
					/** @deprecated */
					public showType3Glyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDType3Font, param2: number, param3: string, param4: com.tom_roush.pdfbox.util.Vector): void;
					public endPath(): void;
					public getCanvas(): globalAndroid.graphics.Canvas;
					public getLinePath(): globalAndroid.graphics.Path;
					public getRenderer(): com.tom_roush.pdfbox.rendering.PDFRenderer;
					public strokePath(): void;
					/** @deprecated */
					public showFontGlyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont, param2: number, param3: string, param4: com.tom_roush.pdfbox.util.Vector): void;
					public fillPath(param0: globalAndroid.graphics.Path.FillType): void;
					public fillAndStrokePath(param0: globalAndroid.graphics.Path.FillType): void;
					public endMarkedContentSequence(): void;
					public drawPage(param0: globalAndroid.graphics.Paint, param1: globalAndroid.graphics.Canvas, param2: com.tom_roush.pdfbox.pdmodel.common.PDRectangle): void;
					public curveTo(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number): void;
					public constructor();
					public setStroke(param0: globalAndroid.graphics.Paint, param1: number, param2: globalAndroid.graphics.Paint.Cap, param3: globalAndroid.graphics.Paint.Join, param4: number, param5: androidNative.Array<number>, param6: number): void;
					public constructor(param0: com.tom_roush.pdfbox.pdmodel.PDPage);
					public lineTo(param0: number, param1: number): void;
					public appendRectangle(param0: globalAndroid.graphics.PointF, param1: globalAndroid.graphics.PointF, param2: globalAndroid.graphics.PointF, param3: globalAndroid.graphics.PointF): void;
					public getNonStrokingColor(): number;
					public closePath(): void;
					public showTransparencyGroup(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDTransparencyGroup): void;
					public constructor(param0: com.tom_roush.pdfbox.rendering.PageDrawerParameters);
					public endText(): void;
					public showFontGlyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont, param2: number, param3: com.tom_roush.pdfbox.util.Vector): void;
					public moveTo(param0: number, param1: number): void;
					public getCurrentPoint(): globalAndroid.graphics.PointF;
					public getAnnotationFilter(): com.tom_roush.pdfbox.pdmodel.interactive.annotation.AnnotationFilter;
					public setAnnotationFilter(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.AnnotationFilter): void;
					public beginText(): void;
					public clip(param0: globalAndroid.graphics.Path.FillType): void;
					public shadingFill(param0: com.tom_roush.pdfbox.cos.COSName): void;
					public showTransparencyGroupOnCanvas(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDTransparencyGroup, param1: globalAndroid.graphics.Canvas): void;
					public showType3Glyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDType3Font, param2: number, param3: com.tom_roush.pdfbox.util.Vector): void;
					public showAnnotation(param0: com.tom_roush.pdfbox.pdmodel.interactive.annotation.PDAnnotation): void;
					public showForm(param0: com.tom_roush.pdfbox.pdmodel.graphics.form.PDFormXObject): void;
					public setClip(): void;
					public beginMarkedContentSequence(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public drawImage(param0: com.tom_roush.pdfbox.pdmodel.graphics.image.PDImage): void;
				}
				export namespace PageDrawer {
					export class TransparencyGroup extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.PageDrawer.TransparencyGroup>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace rendering {
				export class PageDrawerParameters extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.PageDrawerParameters>;
					public isSubsamplingAllowed(): boolean;
					public getImageDownscalingOptimizationThreshold(): number;
					public getPage(): com.tom_roush.pdfbox.pdmodel.PDPage;
					public getDestination(): com.tom_roush.pdfbox.rendering.RenderDestination;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace rendering {
				export class RenderDestination {
					public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.RenderDestination>;
					public static EXPORT: com.tom_roush.pdfbox.rendering.RenderDestination;
					public static VIEW: com.tom_roush.pdfbox.rendering.RenderDestination;
					public static PRINT: com.tom_roush.pdfbox.rendering.RenderDestination;
					public static values(): androidNative.Array<com.tom_roush.pdfbox.rendering.RenderDestination>;
					public static valueOf(param0: string): com.tom_roush.pdfbox.rendering.RenderDestination;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace rendering {
				export class TTFGlyph2D extends java.lang.Object implements com.tom_roush.pdfbox.rendering.Glyph2D {
					public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.TTFGlyph2D>;
					public dispose(): void;
					public getPathForGID(param0: number, param1: number): globalAndroid.graphics.Path;
					public getPathForCharacterCode(param0: number): globalAndroid.graphics.Path;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace rendering {
				export class Type1Glyph2D extends java.lang.Object implements com.tom_roush.pdfbox.rendering.Glyph2D {
					public static class: java.lang.Class<com.tom_roush.pdfbox.rendering.Type1Glyph2D>;
					public dispose(): void;
					public getPathForCharacterCode(param0: number): globalAndroid.graphics.Path;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace text {
				export class LegacyPDFStreamEngine extends com.tom_roush.pdfbox.contentstream.PDFStreamEngine {
					public static class: java.lang.Class<com.tom_roush.pdfbox.text.LegacyPDFStreamEngine>;
					public processPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					/** @deprecated */
					public showGlyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont, param2: number, param3: string, param4: com.tom_roush.pdfbox.util.Vector): void;
					public showGlyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont, param2: number, param3: string, param4: com.tom_roush.pdfbox.util.Vector): void;
					public computeFontHeight(param0: com.tom_roush.pdfbox.pdmodel.font.PDFont): number;
					public showGlyph(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.pdmodel.font.PDFont, param2: number, param3: com.tom_roush.pdfbox.util.Vector): void;
					public processTextPosition(param0: com.tom_roush.pdfbox.text.TextPosition): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace text {
				export class PDFMarkedContentExtractor extends com.tom_roush.pdfbox.text.LegacyPDFStreamEngine {
					public static class: java.lang.Class<com.tom_roush.pdfbox.text.PDFMarkedContentExtractor>;
					public isSuppressDuplicateOverlappingText(): boolean;
					public endMarkedContentSequence(): void;
					public getMarkedContents(): java.util.List<com.tom_roush.pdfbox.pdmodel.documentinterchange.markedcontent.PDMarkedContent>;
					public constructor(param0: string);
					public constructor();
					public xobject(param0: com.tom_roush.pdfbox.pdmodel.graphics.PDXObject): void;
					public beginMarkedContentSequence(param0: com.tom_roush.pdfbox.cos.COSName, param1: com.tom_roush.pdfbox.cos.COSDictionary): void;
					public setSuppressDuplicateOverlappingText(param0: boolean): void;
					public processTextPosition(param0: com.tom_roush.pdfbox.text.TextPosition): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace text {
				export class PDFTextStripper extends com.tom_roush.pdfbox.text.LegacyPDFStreamEngine {
					public static class: java.lang.Class<com.tom_roush.pdfbox.text.PDFTextStripper>;
					public LINE_SEPARATOR: string;
					public charactersByArticle: java.util.ArrayList<java.util.List<com.tom_roush.pdfbox.text.TextPosition>>;
					public document: com.tom_roush.pdfbox.pdmodel.PDDocument;
					public output: java.io.Writer;
					public setPageEnd(param0: string): void;
					public processPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public setEndBookmark(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem): void;
					public writePage(): void;
					public getArticleEnd(): string;
					public getEndBookmark(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
					public writeCharacters(param0: com.tom_roush.pdfbox.text.TextPosition): void;
					public getAddMoreFormatting(): boolean;
					public getText(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): string;
					public writeString(param0: string): void;
					public constructor();
					public getIndentThreshold(): number;
					public getAverageCharTolerance(): number;
					public getParagraphStart(): string;
					public writeString(param0: string, param1: java.util.List<com.tom_roush.pdfbox.text.TextPosition>): void;
					public getOutput(): java.io.Writer;
					public getPageStart(): string;
					public endDocument(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public getCharactersByArticle(): java.util.List<java.util.List<com.tom_roush.pdfbox.text.TextPosition>>;
					public setEndPage(param0: number): void;
					public startDocument(param0: com.tom_roush.pdfbox.pdmodel.PDDocument): void;
					public getSpacingTolerance(): number;
					public getLineSeparator(): string;
					public writeLineSeparator(): void;
					public setShouldSeparateByBeads(param0: boolean): void;
					public startArticle(param0: boolean): void;
					public setWordSeparator(param0: string): void;
					public setAverageCharTolerance(param0: number): void;
					public getCurrentPageNo(): number;
					public processPages(param0: com.tom_roush.pdfbox.pdmodel.PDPageTree): void;
					public setAddMoreFormatting(param0: boolean): void;
					public static matchPattern(param0: string, param1: java.util.List<java.util.regex.Pattern>): java.util.regex.Pattern;
					public endPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public getPageEnd(): string;
					public setArticleEnd(param0: string): void;
					public startPage(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public setLineSeparator(param0: string): void;
					public processTextPosition(param0: com.tom_roush.pdfbox.text.TextPosition): void;
					public writeParagraphSeparator(): void;
					public setDropThreshold(param0: number): void;
					public setStartPage(param0: number): void;
					public writeParagraphEnd(): void;
					public getWordSeparator(): string;
					public getArticleStart(): string;
					public getDropThreshold(): number;
					public writeText(param0: com.tom_roush.pdfbox.pdmodel.PDDocument, param1: java.io.Writer): void;
					public setArticleStart(param0: string): void;
					public getListItemPatterns(): java.util.List<java.util.regex.Pattern>;
					public setSortByPosition(param0: boolean): void;
					public getStartBookmark(): com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
					public setPageStart(param0: string): void;
					public setParagraphEnd(param0: string): void;
					public getStartPage(): number;
					public setStartBookmark(param0: com.tom_roush.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem): void;
					public startArticle(): void;
					public setSpacingTolerance(param0: number): void;
					public setSuppressDuplicateOverlappingText(param0: boolean): void;
					public setParagraphStart(param0: string): void;
					public getEndPage(): number;
					public getParagraphEnd(): string;
					public writePageEnd(): void;
					public writeWordSeparator(): void;
					public writeParagraphStart(): void;
					public setIndentThreshold(param0: number): void;
					public getSeparateByBeads(): boolean;
					public writePageStart(): void;
					public setListItemPatterns(param0: java.util.List<java.util.regex.Pattern>): void;
					public getSortByPosition(): boolean;
					public endArticle(): void;
					public getSuppressDuplicateOverlappingText(): boolean;
				}
				export namespace PDFTextStripper {
					export class LineItem extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.text.PDFTextStripper.LineItem>;
						public static WORD_SEPARATOR: com.tom_roush.pdfbox.text.PDFTextStripper.LineItem;
						public isWordSeparator(): boolean;
						public static getWordSeparator(): com.tom_roush.pdfbox.text.PDFTextStripper.LineItem;
						public getTextPosition(): com.tom_roush.pdfbox.text.TextPosition;
					}
					export class PositionWrapper extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.text.PDFTextStripper.PositionWrapper>;
						public setLineStart(): void;
						public setParagraphStart(): void;
						public setArticleStart(): void;
						public setPageBreak(): void;
						public isLineStart(): boolean;
						public isHangingIndent(): boolean;
						public isArticleStart(): boolean;
						public isPageBreak(): boolean;
						public getTextPosition(): com.tom_roush.pdfbox.text.TextPosition;
						public setHangingIndent(): void;
						public isParagraphStart(): boolean;
					}
					export class WordWithTextPositions extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.text.PDFTextStripper.WordWithTextPositions>;
						public getTextPositions(): java.util.List<com.tom_roush.pdfbox.text.TextPosition>;
						public getText(): string;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace text {
				export class PDFTextStripperByArea extends com.tom_roush.pdfbox.text.PDFTextStripper {
					public static class: java.lang.Class<com.tom_roush.pdfbox.text.PDFTextStripperByArea>;
					public writePage(): void;
					public constructor();
					public getTextForRegion(param0: string): string;
					public setShouldSeparateByBeads(param0: boolean): void;
					public addRegion(param0: string, param1: globalAndroid.graphics.RectF): void;
					public getRegions(): java.util.List<string>;
					public extractRegions(param0: com.tom_roush.pdfbox.pdmodel.PDPage): void;
					public removeRegion(param0: string): void;
					public processTextPosition(param0: com.tom_roush.pdfbox.text.TextPosition): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace text {
				export class TextPosition extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.text.TextPosition>;
					public getX(): number;
					public mergeDiacritic(param0: com.tom_roush.pdfbox.text.TextPosition): void;
					public getEndY(): number;
					public getDir(): number;
					public constructor(param0: number, param1: number, param2: number, param3: com.tom_roush.pdfbox.util.Matrix, param4: number, param5: number, param6: number, param7: number, param8: number, param9: string, param10: androidNative.Array<number>, param11: com.tom_roush.pdfbox.pdmodel.font.PDFont, param12: number, param13: number);
					public getXScale(): number;
					public getWidthDirAdj(): number;
					public toString(): string;
					public getWidthOfSpace(): number;
					public hashCode(): number;
					public getUnicode(): string;
					public getFont(): com.tom_roush.pdfbox.pdmodel.font.PDFont;
					public getPageHeight(): number;
					public getYDirAdj(): number;
					public contains(param0: com.tom_roush.pdfbox.text.TextPosition): boolean;
					public getIndividualWidths(): androidNative.Array<number>;
					public isDiacritic(): boolean;
					public getTextMatrix(): com.tom_roush.pdfbox.util.Matrix;
					public getHeight(): number;
					public getWidth(): number;
					public getY(): number;
					public getHeightDir(): number;
					public getXDirAdj(): number;
					public getCharacterCodes(): androidNative.Array<number>;
					public equals(param0: any): boolean;
					public getRotation(): number;
					public getFontSizeInPt(): number;
					public getYScale(): number;
					public getEndX(): number;
					public getPageWidth(): number;
					public getFontSize(): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace text {
				export class TextPositionComparator extends java.util.Comparator<com.tom_roush.pdfbox.text.TextPosition> {
					public static class: java.lang.Class<com.tom_roush.pdfbox.text.TextPositionComparator>;
					public compare(param0: any, param1: any): number;
					public static comparing(param0: any /* any*/): java.util.Comparator<any>;
					public static nullsFirst(param0: java.util.Comparator<any>): java.util.Comparator<any>;
					public thenComparingDouble(param0: any /* any*/): java.util.Comparator<any>;
					public static comparingLong(param0: any /* any*/): java.util.Comparator<any>;
					public thenComparing(param0: java.util.Comparator<any>): java.util.Comparator<any>;
					public thenComparingInt(param0: any /* any*/): java.util.Comparator<any>;
					public static reverseOrder(): java.util.Comparator<any>;
					public thenComparingLong(param0: any /* any*/): java.util.Comparator<any>;
					public static nullsLast(param0: java.util.Comparator<any>): java.util.Comparator<any>;
					public static comparingDouble(param0: any /* any*/): java.util.Comparator<any>;
					public equals(param0: any): boolean;
					public static comparing(param0: any /* any*/, param1: java.util.Comparator<any>): java.util.Comparator<any>;
					public thenComparing(param0: any /* any*/, param1: java.util.Comparator<any>): java.util.Comparator<any>;
					public constructor();
					public reversed(): java.util.Comparator<any>;
					public static naturalOrder(): java.util.Comparator<any>;
					public thenComparing(param0: any /* any*/): java.util.Comparator<any>;
					public static comparingInt(param0: any /* any*/): java.util.Comparator<any>;
					public compare(param0: com.tom_roush.pdfbox.text.TextPosition, param1: com.tom_roush.pdfbox.text.TextPosition): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class Charsets extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.Charsets>;
					public static US_ASCII: java.nio.charset.Charset;
					public static UTF_16BE: java.nio.charset.Charset;
					public static UTF_16LE: java.nio.charset.Charset;
					public static ISO_8859_1: java.nio.charset.Charset;
					public static WINDOWS_1252: java.nio.charset.Charset;
					public static UTF_8: java.nio.charset.Charset;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class DateConverter extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.DateConverter>;
					public static toISO8601(param0: java.util.Calendar): string;
					public toString(): string;
					public static toString(param0: java.util.Calendar): string;
					public static toCalendar(param0: com.tom_roush.pdfbox.cos.COSString): java.util.Calendar;
					public static toCalendar(param0: string): java.util.Calendar;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class GraphicsUtil extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.GraphicsUtil>;
					public constructor();
					public static getPathRegion(param0: globalAndroid.graphics.Path): globalAndroid.graphics.Region;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class Hex extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.Hex>;
					public static writeHexBytes(param0: androidNative.Array<number>, param1: java.io.OutputStream): void;
					public static getBytes(param0: androidNative.Array<number>): androidNative.Array<number>;
					public static decodeHex(param0: string): androidNative.Array<number>;
					public static getString(param0: number): string;
					public static getString(param0: androidNative.Array<number>): string;
					public static getBytes(param0: number): androidNative.Array<number>;
					public static getCharsUTF16BE(param0: string): androidNative.Array<string>;
					public static decodeBase64(param0: string): androidNative.Array<number>;
					public static getChars(param0: number): androidNative.Array<string>;
					public static writeHexByte(param0: number, param1: java.io.OutputStream): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class IterativeMergeSort extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.IterativeMergeSort>;
					public static sort(param0: java.util.List<any>, param1: java.util.Comparator<any>): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class Matrix extends java.lang.Object implements java.lang.Cloneable {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.Matrix>;
					public static SIZE: number = 9;
					public getScalingFactorY(): number;
					/** @deprecated */
					public static getTranslatingInstance(param0: number, param1: number): com.tom_roush.pdfbox.util.Matrix;
					public constructor(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number);
					public constructor(param0: com.tom_roush.harmony.awt.geom.AffineTransform);
					public createAffineTransform(): com.tom_roush.harmony.awt.geom.AffineTransform;
					public static getTranslateInstance(param0: number, param1: number): com.tom_roush.pdfbox.util.Matrix;
					/** @deprecated */
					public extractScaling(): com.tom_roush.pdfbox.util.Matrix;
					public toString(): string;
					public rotate(param0: number): void;
					public clone(): any;
					public constructor();
					public getValues(): androidNative.Array<androidNative.Array<number>>;
					/** @deprecated */
					public extractTranslating(): com.tom_roush.pdfbox.util.Matrix;
					/** @deprecated */
					public getXPosition(): number;
					public static concatenate(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.util.Matrix): com.tom_roush.pdfbox.util.Matrix;
					/** @deprecated */
					public getYPosition(): number;
					public hashCode(): number;
					public translate(param0: com.tom_roush.pdfbox.util.Vector): void;
					/** @deprecated */
					public setFromAffineTransform(param0: com.tom_roush.harmony.awt.geom.AffineTransform): void;
					public multiply(param0: com.tom_roush.pdfbox.util.Matrix): com.tom_roush.pdfbox.util.Matrix;
					public getScaleY(): number;
					public getTranslateY(): number;
					/** @deprecated */
					public reset(): void;
					public static getRotateInstance(param0: number, param1: number, param2: number): com.tom_roush.pdfbox.util.Matrix;
					public transformPoint(param0: number, param1: number): globalAndroid.graphics.PointF;
					public getShearX(): number;
					public translate(param0: number, param1: number): void;
					/** @deprecated */
					public multiply(param0: com.tom_roush.pdfbox.util.Matrix, param1: com.tom_roush.pdfbox.util.Matrix): com.tom_roush.pdfbox.util.Matrix;
					/** @deprecated */
					public getValuesAsDouble(): androidNative.Array<androidNative.Array<number>>;
					public static getScaleInstance(param0: number, param1: number): com.tom_roush.pdfbox.util.Matrix;
					/** @deprecated */
					public constructor(param0: com.tom_roush.pdfbox.cos.COSArray);
					public concatenate(param0: com.tom_roush.pdfbox.util.Matrix): void;
					public getTranslateX(): number;
					public equals(param0: any): boolean;
					public clone(): com.tom_roush.pdfbox.util.Matrix;
					public getScaleX(): number;
					public transform(param0: globalAndroid.graphics.PointF): void;
					public getValue(param0: number, param1: number): number;
					public getScalingFactorX(): number;
					public scale(param0: number, param1: number): void;
					public getShearY(): number;
					public transform(param0: com.tom_roush.pdfbox.util.Vector): com.tom_roush.pdfbox.util.Vector;
					public toCOSArray(): com.tom_roush.pdfbox.cos.COSArray;
					public static createMatrix(param0: com.tom_roush.pdfbox.cos.COSBase): com.tom_roush.pdfbox.util.Matrix;
					public setValue(param0: number, param1: number, param2: number): void;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class NumberFormatUtil extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.NumberFormatUtil>;
					public static formatFloatFast(param0: number, param1: number, param2: androidNative.Array<number>): number;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class SmallMap<K, V>  extends java.util.Map<any,any> {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.SmallMap<any,any>>;
					public replace(param0: any, param1: any): any;
					public isEmpty(): boolean;
					public computeIfPresent(param0: any, param1: any /* any<any,any,any>*/): any;
					public forEach(param0: any /* any<any,any>*/): void;
					public static copyOf(param0: java.util.Map<any,any>): java.util.Map<any,any>;
					public size(): number;
					public merge(param0: any, param1: any, param2: any /* any<any,any,any>*/): any;
					public put(param0: any, param1: any): any;
					public getOrDefault(param0: any, param1: any): any;
					public putAll(param0: java.util.Map<any,any>): void;
					public replace(param0: any, param1: any, param2: any): boolean;
					public containsValue(param0: any): boolean;
					public remove(param0: any): any;
					public constructor();
					public keySet(): java.util.Set<any>;
					public clear(): void;
					public hashCode(): number;
					public putIfAbsent(param0: any, param1: any): any;
					public remove(param0: any, param1: any): boolean;
					public computeIfAbsent(param0: any, param1: any /* any<any,any>*/): any;
					public constructor(param0: java.util.Map<any,any>);
					public values(): java.util.Collection<any>;
					public static ofEntries(param0: androidNative.Array<java.util.Map.Entry<any,any>>): java.util.Map<any,any>;
					public static entry(param0: any, param1: any): java.util.Map.Entry<any,any>;
					public equals(param0: any): boolean;
					public containsKey(param0: any): boolean;
					public entrySet(): java.util.Set<java.util.Map.Entry<any,any>>;
					public compute(param0: any, param1: any /* any<any,any,any>*/): any;
					public replaceAll(param0: any /* any<any,any,any>*/): void;
					public get(param0: any): any;
				}
				export namespace SmallMap {
					export class SmallMapEntry extends java.util.Map.Entry<any,any> {
						public static class: java.lang.Class<com.tom_roush.pdfbox.util.SmallMap.SmallMapEntry>;
						public setValue(param0: any): any;
						public getValue(): any;
						public getKey(): any;
						public static comparingByValue(): java.util.Comparator<any>;
						public static comparingByKey(param0: java.util.Comparator<any>): java.util.Comparator<any>;
						public hashCode(): number;
						public equals(param0: any): boolean;
						public static comparingByKey(): java.util.Comparator<any>;
						public static comparingByValue(param0: java.util.Comparator<any>): java.util.Comparator<any>;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class Vector extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.Vector>;
					public toString(): string;
					public getX(): number;
					public getY(): number;
					public constructor(param0: number, param1: number);
					public scale(param0: number): com.tom_roush.pdfbox.util.Vector;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class Version extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.Version>;
					public static getVersion(): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export class XMLUtil extends java.lang.Object {
					public static class: java.lang.Class<com.tom_roush.pdfbox.util.XMLUtil>;
					public static parse(param0: java.io.InputStream, param1: boolean): org.w3c.dom.Document;
					public static parse(param0: java.io.InputStream): org.w3c.dom.Document;
					public static getNodeValue(param0: org.w3c.dom.Element): string;
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export namespace filetypedetector {
					export class ByteTrie<T>  extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.util.filetypedetector.ByteTrie<any>>;
						public setDefaultValue(param0: T): void;
						public find(param0: androidNative.Array<number>): T;
						public addPath(param0: T, param1: androidNative.Array<androidNative.Array<number>>): void;
						public getMaxDepth(): number;
					}
					export namespace ByteTrie {
						export class ByteTrieNode<T>  extends java.lang.Object {
							public static class: java.lang.Class<com.tom_roush.pdfbox.util.filetypedetector.ByteTrie.ByteTrieNode<any>>;
							public getValue(): T;
							public setValue(param0: T): void;
						}
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export namespace filetypedetector {
					export class FileType {
						public static class: java.lang.Class<com.tom_roush.pdfbox.util.filetypedetector.FileType>;
						public static UNKNOWN: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static JPEG: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static TIFF: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static PSD: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static PNG: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static BMP: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static GIF: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static ICO: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static PCX: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static RIFF: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static ARW: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static CRW: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static CR2: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static NEF: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static ORF: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static RAF: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static RW2: com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static values(): androidNative.Array<com.tom_roush.pdfbox.util.filetypedetector.FileType>;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static valueOf(param0: string): com.tom_roush.pdfbox.util.filetypedetector.FileType;
					}
				}
			}
		}
	}
}

declare namespace com {
	export namespace tom_roush {
		export namespace pdfbox {
			export namespace util {
				export namespace filetypedetector {
					export class FileTypeDetector extends java.lang.Object {
						public static class: java.lang.Class<com.tom_roush.pdfbox.util.filetypedetector.FileTypeDetector>;
						public static detectFileType(param0: androidNative.Array<number>): com.tom_roush.pdfbox.util.filetypedetector.FileType;
						public static detectFileType(param0: java.io.BufferedInputStream): com.tom_roush.pdfbox.util.filetypedetector.FileType;
					}
				}
			}
		}
	}
}

//Generics information:
//com.tom_roush.pdfbox.pdmodel.common.COSArrayList:1
//com.tom_roush.pdfbox.pdmodel.common.COSDictionaryMap:2
//com.tom_roush.pdfbox.pdmodel.common.PDNameTreeNode:1
//com.tom_roush.pdfbox.pdmodel.documentinterchange.logicalstructure.Revisions:1
//com.tom_roush.pdfbox.pdmodel.font.FontMapping:1
//com.tom_roush.pdfbox.util.SmallMap:2
//com.tom_roush.pdfbox.util.filetypedetector.ByteTrie:1
//com.tom_roush.pdfbox.util.filetypedetector.ByteTrie.ByteTrieNode:1

