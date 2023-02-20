import fs from 'fs';

export default class TTSClass extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.storagePath = `${STORAGE_CONTAINER_PATH}/speak`;

    }

    exists(hash, extension) {
        const filePath = `${this.storagePath}/${hash}.${extension}`;
        return new Promise((resolve, reject) => fs.exists(filePath, e => e ? resolve() : reject()));
    }
}