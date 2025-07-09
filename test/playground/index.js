const GCSAPI = require('../../lib/gcs-api')
console.log('JAG-GOOGLE-STORAGE Test Playground running...')
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS)
const bucketName = 'ntv-virtual-inventory'
const fileName = 'test.txt'
const srcFilePath = '.private/' + fileName
const dlFilePath = '.private/downloads/' + fileName
const gcs = new GCSAPI()

async function run() {
    try {
        console.info('Testing GCSAPI.listFiles')
        let files = await gcs.listFiles(bucketName)

        if (files.length > 0) {
            console.table(files.map((file) => file.name))

            console.info('Deleting ', bucketName + '/' + fileName)
            const rsp = await gcs.deleteFile(bucketName, fileName)
            console.info('File deleted successfully')
        }

        console.info('Uploading', srcFilePath)
        const upRes = await gcs.uploadFile(bucketName, srcFilePath, fileName)
        console.info('Upload successfull')

        console.info('Make sure the file was uploaded by calling listFiles again.')
        files = await gcs.listFiles(bucketName)
        if (files.length > 0) {
            console.table(files.map((file) => file.name))
        }

        console.info('Testing fileExists: ', fileName)
        const exits = await gcs.fileExists(bucketName, fileName)
        console.info(fileName, 'exists:', exits)

        console.info('Downloading', fileName, 'to', dlFilePath)
        await gcs.downloadFile(bucketName, fileName, dlFilePath)
        console.log(`gs://${bucketName}/${fileName} downloaded to ${dlFilePath}.`);
    } catch (err) {
        console.error(bucketName, err)
    }

    console.log('JAG-GOOGLE-STORAGE exiting Test Playground.')
}

run()
