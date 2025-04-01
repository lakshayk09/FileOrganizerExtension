
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    chrome.storage.local.get(["audio", "video", "image", "document"], (paths) => {

        const fileTypeMap = {
            audio: ["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma"],
            video: ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm", "m4v"],
            image: ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg", "webp"],
            document: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "rtf", "odt", "ods", "odp", "zip", "rar", "7zip"]
        };

        const fileExtension = downloadItem.filename.split('.').pop().toLowerCase();

        let subDir = null;

        for (const [type, extensions] of Object.entries(fileTypeMap)) {
            if (extensions.includes(fileExtension) && paths[type] && paths[type].trim() !== "") {
                subDir = paths[type].replace(/^C:\\Users\\[^\\]+\\Downloads\\?/, ''); // Keep only relative path inside Downloads
                category = type;
                break;
            }
        }

        if (subDir) {
            const suggestedPath = `${subDir}/${downloadItem.filename}`;
            suggest({ filename: suggestedPath });

            // chrome.runtime.sendMessage({
            //     type: "file_downloaded",
            //     fileType: fileExtension,
            //     fileCategory: category, 
            //     folder: `Downloads/${subDir}`,
            //     filename: downloadItem.filename
            // });

            const downloadInfo = {
                category,
                folder: `Downloads/${subDir}`,
                filename: downloadItem.filename
            };
            
            chrome.storage.session.set({ [fileExtension]: downloadInfo });

        } else {
            suggest(); // Default path
        }
    });

    return true;
});

