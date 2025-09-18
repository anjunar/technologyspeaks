import {Component, input, model, signal, ViewEncapsulation} from '@angular/core';
import {CropperPosition, ImageCroppedEvent, ImageCropperComponent, LoadedImage} from 'ngx-image-cropper';
import {AsImage, Media, Thumbnail} from "shared";

@Component({
    selector: 'as-image-process',
    imports: [
        ImageCropperComponent
    ],
    templateUrl: './as-image-process.html',
    styleUrl: './as-image-process.css',
    encapsulation: ViewEncapsulation.None
})
export class AsImageProcess {

    parent = input.required<AsImage>()

    imageChangedEvent: Event = null;

    decodeBase64 = (result: string) => {
        let base64 = /data:(\w+)\/(\w+);base64,((?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}={2}))/g
        let regexResult = base64.exec(result)
        if (regexResult) {
            let type = regexResult[1]
            let subType = regexResult[2]
            let data = regexResult[3]
            return {contentType: type + "/" + subType, data}
        }
        throw new Error("Cannot decode to Base64")
    }

    async blobToBase64(blobUrl: string): Promise<string> {
        const response = await fetch(blobUrl);
        const blob = await response.blob();

        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    resolve(reader.result as string); // Base64 Data URL
                } else {
                    reject('Error reading Blobs');
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    fileChangeEvent(event: Event): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.blobToBase64(event.objectUrl).then(base64 => {
            let decodeBase64 = this.decodeBase64(base64);
            let thumbnail = this.parent().image().thumbnail()
            thumbnail.data.set(decodeBase64.data)
            thumbnail.contentType.set(decodeBase64.contentType)
        });
    }

    imageLoaded(image: LoadedImage) {
        this.blobToBase64(image.original.objectUrl).then(base64 => {
            let decodeBase64 = this.decodeBase64(base64);
            let form = this.parent().form;
            let media = form.form.value.$instance(Media)
            let thumbnail = form.form.value.$instance(Thumbnail)
            media.thumbnail.set(thumbnail)
            media.data.set(decodeBase64.data)
            media.contentType.set(decodeBase64.contentType)
            this.parent().image.set(media)
        });
    }
}
