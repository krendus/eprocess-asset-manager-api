import axios from 'axios';

export const uploadToCloudinary = (cloudName, uri, uniqueName, apiKey, uploadPreset, setUploadProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `${uniqueName}.jpg`,
    });
    formData.append('api_key', apiKey);
    formData.append('upload_preset', uploadPreset);
    axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
      onUploadProgress: (e) => {
        setUploadProgress(((e.loaded * 100))/e.total)
      }
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      reject(error);
    });
  })
}