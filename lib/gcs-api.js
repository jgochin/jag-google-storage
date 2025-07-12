const { Storage } = require('@google-cloud/storage');
const GCSAPIError = require('./gcs-api-error')

module.exports = class GCSAPI {
    constructor() {
        this.storage = new Storage()
    }

    // GCS Direct API Calls
    async listFiles(bucketName) {
        try {
            const [files] = await this.storage.bucket(bucketName).getFiles()

            return files

        } catch (err) {
            throw new GCSAPIError("LF01", { cause: err })
        }
    }

    async uploadFile(bucketName, srcFilePath, destFileName) {

        const options = {
            destination: destFileName,
            // Optional:
            // Set a generation-match precondition to avoid potential race conditions
            // and data corruptions. The request to upload is aborted if the object's
            // generation number does not match your precondition. For a destination
            // object that does not yet exist, set the ifGenerationMatch precondition to 0
            // If the destination object already exists in your bucket, set instead a
            // generation-match precondition using its generation number.
            // preconditionOpts: { ifGenerationMatch: fileConfig.generationMatchPrecondition },
        };

        try {
            return await this.storage.bucket(bucketName).upload(srcFilePath, options)
        } catch (err) {
            throw new GCSAPIError("UF01", { cause: `uploadFile: ${srcFilePath} already exits.` })
        }
    }

    async downloadFile(bucketName, fileName, destFileName) {
        try {
            const options = {
                destination: destFileName,
            };

            // Downloads the file
            return await this.storage.bucket(bucketName).file(fileName).download(options);

        } catch (err) {
            throw new GCSAPIError("DF01", { cause: `${fileConfig.filePath} not found.` })
        }
    }

    async deleteFile(bucketName, fileName) {
        const deleteOptions = {
            ifGenerationMatch: 0
        }

        try {
            return await this.storage.bucket(bucketName).file(fileName).delete()

        } catch (err) {
            throw new GCSAPIError("XF01", { cause: err })
        }
    }

    //Helper functions
    async fileExists(bucketName, targetFileName) {
        try {
            const files = await this.listFiles(bucketName)
            const foundFile = files.find((f) => f.name === targetFileName)

            return !!foundFile
        } catch (err) {
            throw new GCSAPIError("FE01", { cause: err })
        }
    }

}