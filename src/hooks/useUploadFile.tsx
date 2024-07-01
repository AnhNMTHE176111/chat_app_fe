import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { storageRef } from "../services";

interface UploadResult {
  url: string;
  size: string;
}

export const useUploadFile = () => {
  const [progressUpload, setProgressUpload] = useState<number | null>(null);
  const [downloadFileURL, setDownloadFileURL] = useState<string | null>(null);

  const handleUploadFile = async (
    file: File | null,
    fileDestination: string
  ): Promise<UploadResult | null> => {
    if (file) {
      const folderRef = ref(storageRef, fileDestination);
      const uploadTask = uploadBytesResumable(folderRef, file);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgressUpload(progress);
          },
          (error) => {
            console.log("Upload Fail", error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            const fileSizeBytes = uploadTask.snapshot.totalBytes;
            let fileSizeFormatted: string;
            if (fileSizeBytes < 1024 * 1024) {
              fileSizeFormatted = (fileSizeBytes / 1024).toFixed(2) + " KB";
            } else {
              fileSizeFormatted =
                (fileSizeBytes / (1024 * 1024)).toFixed(2) + " MB";
            }
            setDownloadFileURL(url);
            resolve({ url: url, size: fileSizeFormatted });
          }
        );
      });
    } 
    return null;
  };

  useEffect(() => {
    if (progressUpload === 100) {
      setTimeout(() => {
        setProgressUpload(null);
      }, 1000);
    }
  }, [progressUpload]);

  return {
    progressUpload,
    downloadFileURL,
    handleUploadFile,
  };
};
