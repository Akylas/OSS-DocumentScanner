import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from '@akylas/typeorm/browser';
import OCRDocument from './OCRDocument';
import OCRImage from './OCRImage';
import { ImageSource, Observable } from '@nativescript/core';
import OCRRawImage from './OCRRawImage';
import { EventEmitter, applyMixins } from '~/utils/decorators';

export enum ColorType {
    NONE,
    GRAY,
    BLACK_WHITE,
}
@Entity()
@EventEmitter
class OCRPage extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column({
        type: 'simple-enum',
        enum: ColorType,
        nullable: false,
        default: ColorType.NONE,
    })
    colorType?: ColorType;

    @Column('int', { nullable: false, default: 0 })
    rotation?: number;

    @Column('int', { nullable: true, array: true })
    crop?: number[];

    @ManyToOne((type) => OCRDocument, (document) => document.pages)
    @JoinColumn()
    document: OCRDocument;

    @OneToOne((type) => OCRRawImage, { cascade: true })
    @JoinColumn()
    rawimage: Promise<OCRRawImage>;

    @OneToOne((type) => OCRImage, { cascade: true })
    @JoinColumn()
    image: Promise<OCRImage>;
    constructor(id: string) {
        super();
        this.id = id;
    }
    _imageSource: ImageSource;
    get imageSource() {
        return this._imageSource;
    }
    async getImageSource() {
        if (!this._imageSource) {
            const image = await this.image;
            if (image) {
                this._imageSource = image.imageSource;
            }
        }
        return this._imageSource;
    }
}
interface OCRPage extends Observable {}
export default OCRPage;
