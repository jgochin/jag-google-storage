const errorMap = {
    "LF01": "Bucket, or folder not found.",
    "UF01": "Failed to upload file.",
    "DF01": "Failed to download file.",
    "XF01": "Failed to delete file.",
    "FE01": "Failed to find file."
}

module.exports = class CGSAPIError extends Error {
    constructor(errorCode, options) {
        super(errorMap[errorCode], options)
    }
}