export function fileToBase64(file) {
    return fileToBase64Async(file).then(result => {
        var encodedImage = result;
        console.log("encodedImage:" + encodedImage)
        var data = null;
        if(file.type ==="image/jpeg" || file.type === "image/jpg" || file.type === "image/png")
            data = encodedImage.replace(/^data:image\/\w+;base64,/, "");
        else
            data = encodedImage.replace(/^data:.*?;base64,/, "")
        //data = encodedImage.replace(/^data:application\/octet-stream\/\w+;base64,/, "");
        console.log("data:" + data)

        return {
            body: {
                base64File: data,
                filename: encodeURIComponent(file.name)
            }
        }
    });

}

function fileToBase64Async(file) {
    let res = new Promise(resolve => {
        var reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result);
            //aImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
    return res;


}

export function generateTinyUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4();
  }