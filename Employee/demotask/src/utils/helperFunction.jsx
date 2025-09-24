export const downloadFileFromUrl = async (
  fileUrl,
  filename = "downloaded-file"
) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      toast.error("Failed to download file. Please try again.");
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};
