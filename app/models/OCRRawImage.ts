import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from '@akylas/typeorm/browser';
import { ImageSource } from '@nativescript/core';
import { Mat, imageFromMat, matFromImage } from 'nativescript-opencv';
import OCRPage from './OCRPage';
@Entity()
export default class OCRRawImage extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column('blob', { nullable: false })
    data: any;

    @Column('int', { nullable: false })
    width: number;

    @Column('int', { nullable: false })
    height: number;

    @OneToOne((type) => OCRPage, (page) => page.rawimage)
    page: Promise<OCRPage>;
    constructor(id: string) {
        super();
        this.id = id;
    }
    _imageSource: ImageSource;
    get imageSource() {
        if (!this._imageSource) {
            const bmp = android.graphics.BitmapFactory.decodeByteArray(this.data, 0, this.data.length);
            this._imageSource = new ImageSource(bmp);
        }
        return this._imageSource;
    }
    _mat: Mat;
    get mat() {
        if (!this._mat) {
            if (global.isAndroid) {
                this._mat = matFromImage(this.imageSource.android);
            } else {
                this._mat = matFromImage(this.imageSource.ios);
            }
        }
        return this._mat;
    }
    set mat(value: Mat) {
        this._mat = value;
        const nimage = imageFromMat(value);
        this._imageSource = new ImageSource(nimage);
        const byteArrayOutputStream = new java.io.ByteArrayOutputStream();
        nimage.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        this.data = byteArrayOutputStream.toByteArray();
    }
}
