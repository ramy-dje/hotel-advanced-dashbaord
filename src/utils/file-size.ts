const formatFileSize = (sizeInBytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  // Iterate through the units until the size is less than 1024 or we reach the largest unit
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // Format the result to two decimal places for readability
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export default formatFileSize;
