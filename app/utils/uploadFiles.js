const uploadFiles = (files) =>
  new Promise(function (resolve, reject) {
    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append("files", file, file.name);
    }
    console.log("formData:", formData);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ai.iamplus.services/files/upload", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        // alert('Files uploaded successfully');
        console.log("this.responseText:", this.responseText);
        let data = JSON.parse(this.responseText);
        resolve(data.urls);
      } else {
        // alert('An error occurred!');
        reject("An error occurred!");
      }
    };

    xhr.send(formData);
  });

export default uploadFiles;
