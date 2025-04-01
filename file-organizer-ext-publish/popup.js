

document.addEventListener("DOMContentLoaded", () => {
  ["audio", "video", "image", "document"].forEach((type) => {
      const input = document.getElementById(type);
      
      chrome.storage.local.get(type, (data) => {
          if (data[type]) {
              input.value = data[type];
          }
      });

      input.addEventListener("input", (event) => {
          const newPath = event.target.value.trim();
          chrome.storage.local.set({ [type]: newPath });
      });
  });
});

// messages only work while popup is still open
// document.addEventListener("DOMContentLoaded", () => {

//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//       if (message.type === "file_downloaded") {
//           const { fileCategory, fileType, folder, filename } = message;

//           const responseDiv = document.getElementById(fileCategory.concat("Success"));
//           if (responseDiv) {
//               responseDiv.innerHTML = `"${filename}" file was downloaded at ${folder}/ folder`;
//           }
//       }
//   });
// });

const fileTypeMap = {
    audio: ["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma"],
    video: ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm", "m4v"],
    image: ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg", "webp"],
    document: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "rtf", "odt", "ods", "odp", "zip", "rar", "7zip"]
};

const allFileTypes = [
    ...fileTypeMap.audio,
    ...fileTypeMap.video,
    ...fileTypeMap.image,
    ...fileTypeMap.document
];


document.addEventListener("DOMContentLoaded", () => {
    const updateDownloadInfo = (fileType, data) => {
        const div = document.getElementById(data.category.concat("Success"));
        if (div) {
            div.innerHTML = `"${data.filename}" file was downloaded in "${data.folder}/" folder`;
        }
    };

    // Check storage for any recent downloads from background.js chrome.storage.session.set
    chrome.storage.session.get(allFileTypes, (result) => {
        for (const [key, value] of Object.entries(result)) {
            if (value) {
                updateDownloadInfo(key, value);
            }
        }
    });

});



