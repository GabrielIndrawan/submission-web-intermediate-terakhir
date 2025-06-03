export class Camera{

    #stream = null;

    async startCamera(videoElement){

        this.#stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { max: 1280 },
                height: { max: 720 },
            }
        })
        videoElement.srcObject = this.#stream;
        videoElement.play();

    }

    async takePhoto(videoElement, canvasElement){
        const context = canvasElement.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const dataUrl = canvasElement.toDataURL('image/png');
        return dataUrl;
    }


    stopCamera(){
        if(this.#stream){
            this.#stream.getTracks().forEach(track => track.stop());
            this.#stream = null;
        }
    }
}