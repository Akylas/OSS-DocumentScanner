import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from '@akylas/typeorm/browser';
import { ImageSource } from '@nativescript/core';
import { Imgcodecs, Mat, MatOfByte, imageFromMat, matFromImage } from 'nativescript-opencv';
import OCRPage from './OCRPage';
@Entity()
export default class OCRImage extends BaseEntity {
    @PrimaryColumn()
    id: string;
    @Column('blob', { nullable: false })
    data: any;

    @Column('int', { nullable: false })
    width: number;

    @Column('int', { nullable: false })
    height: number;

    @OneToOne((type) => OCRPage, (page) => page.image)
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
        // if (!this._imageSource) {
        this._imageSource = new ImageSource(nimage);
        // } else {
        //     this._imageSource.setNativeSource(nimage);
        // }
        const byteArrayOutputStream = new java.io.ByteArrayOutputStream();
        nimage.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        this.data = byteArrayOutputStream.toByteArray();
    }
}
