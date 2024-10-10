// Accessing the environment variable
const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;

// console.log("import.meta.env.VITE_CLOUDINARY_CLOUD_NAME",import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);


export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app-file");

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  return data;
};
