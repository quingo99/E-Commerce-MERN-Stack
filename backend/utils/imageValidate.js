const imageValidate = (images) => {

    let imagesTable = []
// if there are more than 1 image it will create an array type
    if(Array.isArray(images)) {
        imagesTable = images
    } else {
        imagesTable.push(images)
    }

    if(imagesTable.length > 3) {
        //number of images allow to update
        return { error: "Send only 3 images at once" }
    }
    for(let image of imagesTable) {
        //check if the size greater than 1 MB
        if(image.size > 1048576) return { error: "Size too large (above 1 MB)" }

        const filetypes = /jpg|jpeg|png/
        //image.mimetype use to get file type
        const mimetype = filetypes.test(image.mimetype)
        if(!mimetype) return { error: "Incorrect mime type (should be jpg,jpeg or png" }
    }

    return { error: false }
}

module.exports = imageValidate
