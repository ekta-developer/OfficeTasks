import { useNavigate } from "react-router";
import { toast } from "react-toastify";

//! MY FUNCTIONS
const getToken = () => {
  const token = localStorage.getItem("authToken");
  console.log(token, "YTYTYTYYTTTTYYTT token");

  
  return localStorage.getItem("authToken");
};

const getLanguage = () => {
  return localStorage.getItem("language") || "en";
};

export const createHeaderWithoutToken = () => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Language: getLanguage(),
    },
  };
};

export const createHeaders = () => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      Language: getLanguage(),
    },
  };
};

export const createFormHeaders = () => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
      Language: getLanguage(),
    },
  };
};
export const createHeadersAdmin = () => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };
};
export const createFormHeadersAdmin = () => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  };
};

export const validateDrivingLicense = (value) => {
  const pattern = /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/;
  return pattern.test(value);
};
export const isValidEmail = (email) => {
  // const pattern = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._]*@(?=[a-zA-Z])([a-zA-Z]+\.[a-zA-Z]{2,})$/;
  const pattern =
    /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._]*[a-zA-Z0-9]@[a-zA-Z][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

export function ValidateImg(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }
    // File signature check
    const isPng = header === "89504e47"; // PNG signature
    const isJpeg =
      header === "ffd8ffe0" || // JPEG signature
      header === "ffd8ffe1" ||
      header === "ffd8ffe2" ||
      header === "ffd8ffe3" ||
      header === "ffd8ffe8";

    const isValidImage = isPng || isJpeg;
    callback(isValidImage); // Pass the result to the callback function
  };
  reader.onerror = function () {
    callback(false); // In case of an error, return false
  };
  reader.readAsArrayBuffer(file.slice(0, 4)); // Read the first 4 bytes of the file
}
export function ValidateImgWithSize(file, callback) {
  const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
  const requiredWidth = 1920;
  const requiredHeight = 566;

  //  Step 1: Check file size
  if (file.size > maxSizeInBytes) {
    return callback(false, "File size must be less than or equal to 1MB");
  }

  //  Step 2: Check file type via magic number
  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }

    const isPng = header === "89504e47";
    const isJpeg =
      header === "ffd8ffe0" ||
      header === "ffd8ffe1" ||
      header === "ffd8ffe2" ||
      header === "ffd8ffe3" ||
      header === "ffd8ffe8";

    const isValidImage = isPng || isJpeg;

    if (!isValidImage) {
      return callback(
        false,
        "Invalid file type. Only PNG and JPEG images are allowed"
      );
    }

    //  Step 3: Check dimensions
    const imgReader = new FileReader();
    imgReader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        if (img.width === requiredWidth && img.height === requiredHeight) {
          callback(true, "Image is valid");
        } else {
          callback(
            false,
            `Invalid image dimensions. Required: ${requiredWidth}x${requiredHeight}px`
          );
        }
      };
      img.onerror = function () {
        callback(false, "Unable to read image dimensions");
      };
      img.src = e.target.result;
    };
    imgReader.onerror = function () {
      callback(false, "Failed to load image for dimension check");
    };
    imgReader.readAsDataURL(file);
  };

  reader.onerror = function () {
    callback(false, "Error reading file header");
  };

  reader.readAsArrayBuffer(file.slice(0, 4));
}
export function ValidateImgWithSizeVIPbanner(file, callback) {
  const requiredWidth = 200;
  const requiredHeight = 200;

  //  Step 2: Check file type via magic number
  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }

    const isPng = header === "89504e47";
    const isJpeg =
      header === "ffd8ffe0" ||
      header === "ffd8ffe1" ||
      header === "ffd8ffe2" ||
      header === "ffd8ffe3" ||
      header === "ffd8ffe8";

    const isValidImage = isPng || isJpeg;

    if (!isValidImage) {
      return callback(
        false,
        "Invalid file type. Only PNG and JPEG images are allowed"
      );
    }

    //  Step 3: Check dimensions
    const imgReader = new FileReader();
    imgReader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        if (img.width === requiredWidth && img.height === requiredHeight) {
          callback(true, "Image is valid");
        } else {
          callback(
            false,
            `Invalid image dimensions. Required: ${requiredWidth}x${requiredHeight}px`
          );
        }
      };
      img.onerror = function () {
        callback(false, "Unable to read image dimensions");
      };
      img.src = e.target.result;
    };
    imgReader.onerror = function () {
      callback(false, "Failed to load image for dimension check");
    };
    imgReader.readAsDataURL(file);
  };

  reader.onerror = function () {
    callback(false, "Error reading file header");
  };

  reader.readAsArrayBuffer(file.slice(0, 4));
}
export function ValidateImgPdfwithSize(file, cmWidth, cmHeight, callback) {
  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

  if (!allowedTypes.includes(file.type)) {
    return callback(false, "Invalid file format.");
  }

  const cmToPx = (cm) => Math.round(cm * 37.79); // 1 cm ≅ 37.79 px at 96 DPI
  const requiredWidth = cmToPx(cmWidth);
  const requiredHeight = cmToPx(cmHeight);

  const reader = new FileReader();

  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }
    const isPdf = header === "25504446";
    if (isPdf) {
      return callback(true, "Valid PDF.");
    }
    const isImage =
      header === "89504e47" ||
      header === "ffd8ffe0" ||
      header === "ffd8ffe1" ||
      header === "ffd8ffe2" ||
      header === "ffd8ffe3" ||
      header === "ffd8ffe8";

    if (!isImage) {
      return callback(false, "Invalid file format.");
    }
    // Validate dimensions
    const imgReader = new FileReader();

    imgReader.onload = function (e) {
      const img = new Image();

      img.onload = function () {
        if (img.width === requiredWidth && img.height === requiredHeight) {
          callback(true, "Valid image.");
        } else {
          callback(
            false,
            `Invalid dimensions. Required: ${requiredWidth}px (width) x ${requiredHeight}px (height)`
          );
        }
      };
      img.onerror = function () {
        callback(false, "Unable to read image dimensions.");
      };
      img.src = e.target.result;
    };
    imgReader.onerror = function () {
      callback(false, "Failed to load image.");
    };
    imgReader.readAsDataURL(file);
  };
  reader.onerror = function () {
    callback(false, "Error reading file.");
  };
  reader.readAsArrayBuffer(file.slice(0, 4));
}
// to show email in  karamveer[dot]yadav[at]nic[dot]in format
export const obfuscateEmail = (email) => {
  return email.replace(/@/g, "[at]").replace(/\./g, "[dot]");
};
// export function ValidateImgPdf(file, callback) {
//   const reader = new FileReader();
//   reader.onloadend = function (event) {
//     const arr = new Uint8Array(event.target.result).subarray(0, 4);
//     let header = "";
//     for (let i = 0; i < arr.length; i++) {
//       header += arr[i].toString(16);
//     }
//     // File signature check
//     const isPng = header === "89504e47"; // PNG signature
//     const isJpeg =
//       header === "ffd8ffe0" || // JPEG signature
//       header === "ffd8ffe1" ||
//       header === "ffd8ffe2" ||
//       header === "ffd8ffe3" ||
//       header === "ffd8ffe8";
//     const isPdf = header === "25504446";

//     const isValidImage = isPng || isJpeg || isPdf;
//     callback(isValidImage); // Pass the result to the callback function
//   };
//   reader.onerror = function () {
//     callback(false); // In case of an error, return false
//   };
//   reader.readAsArrayBuffer(file.slice(0, 4)); // Read the first 4 bytes of the file
// }
export function ValidateImgPdf(file, callback) {
  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
  const allowedExtensions = /\.(png|jpe?g|pdf)$/i;

  // Basic MIME and extension check first
  if (!allowedTypes.includes(file.type) || !allowedExtensions.test(file.name)) {
    return callback(false);
  }

  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }

    const isPng = header === "89504e47"; // PNG
    const isJpeg =
      header === "ffd8ffe0" ||
      header === "ffd8ffe1" ||
      header === "ffd8ffe2" ||
      header === "ffd8ffe3" ||
      header === "ffd8ffe8";
    const isPdf = header === "25504446"; // PDF

    const isValid = isPng || isJpeg || isPdf;
    callback(isValid);
  };

  reader.onerror = function () {
    callback(false);
  };

  // Read the first 4 bytes of the file
  reader.readAsArrayBuffer(file.slice(0, 4));
}

export function ValidatePdf(file, callback) {
  const pdfMagicNumber = "255044462d"; // PDF magic number

  // Step 1: Check file type via magic number
  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 8);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }

    const isPdf = header.startsWith(pdfMagicNumber);

    if (!isPdf) {
      return callback(false, "Invalid file type. Only PDF files are allowed");
    }

    callback(true, "File is a valid PDF");
  };

  reader.onerror = function () {
    callback(false, "Error reading file header");
  };

  reader.readAsArrayBuffer(file.slice(0, 8));
}

export function ValidateDocFile(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 8);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16).padStart(2, "0"); // Proper padding
    }

    const isDoc = header.startsWith("d0cf11e0"); // Legacy .doc

    // Common ZIP signatures used by .docx files
    const zipSignatures = ["504b0304", "504b0506", "504b0708"];
    const isDocx = zipSignatures.some((sig) => header.startsWith(sig));

    const isValidDoc = isDoc || isDocx;

    if (!isValidDoc) {
      callback(false, "Invalid file type. Only DOC or DOCX files are allowed.");
    } else {
      callback(true, "File is a valid DOC/DOCX");
    }
  };

  reader.onerror = function () {
    callback(false, "Error reading file header");
  };

  reader.readAsArrayBuffer(file.slice(0, 8)); // Read more bytes for better accuracy
}

const useLogout = () => {
  const navigate = useNavigate();

  const logoutAction = (msg = null, role) => {
    // Clear localStorage
    localStorage.removeItem("IMAGE_BASE_URL");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("sideBar");
    localStorage.removeItem("userDetail");
    localStorage.removeItem("studentFormNumber");

    // Show toast only if msg is provided
    if (msg) {
      toast.error(msg);
    }

    // Navigate based on role
    if (role === "student") {
      navigate("/student-login");
    } else if (role === "nodal") {
      navigate("/nodal-login");
    } else {
      // Default fallback if role is not recognized
      navigate("/admin/auth-login");
    }
  };

  return logoutAction;
};

// ImageUpload.jsx validation function
export function ValidateFile(file, cmWidth, cmHeight, callback) {
  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

  if (!allowedTypes.includes(file.type)) {
    return callback(
      false,
      "Invalid file format. Only PNG, JPEG, JPG, or PDF files are allowed."
    );
  }

  const cmToPx = (cm) => Math.round(cm * 37.79); // 1 cm ≅ 37.79 px at 96 DPI
  const requiredWidth = cmToPx(cmWidth);
  const requiredHeight = cmToPx(cmHeight);

  const reader = new FileReader();

  reader.onloadend = function (event) {
    const arr = new Uint8Array(event.target.result).subarray(0, 4);
    let header = "";
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16);
    }

    const isPdf = header === "25504446";
    const isPng = header === "89504e47";
    const isJpeg =
      header === "ffd8ffe0" ||
      header === "ffd8ffe1" ||
      header === "ffd8ffe2" ||
      header === "ffd8ffe3" ||
      header === "ffd8ffe8";

    if (isPdf) {
      return callback(true, "Valid PDF.");
    }

    if (isPng || isJpeg) {
      const imgReader = new FileReader();

      imgReader.onload = function (e) {
        const img = new Image();

        img.onload = function () {
          if (img.width === requiredWidth && img.height === requiredHeight) {
            callback(true, "Valid image.");
          } else {
            callback(
              false,
              `Invalid dimensions. Required: ${requiredWidth}px (width) x ${requiredHeight}px (height)`
            );
          }
        };

        img.onerror = function () {
          callback(false, "Unable to read image dimensions.");
        };

        img.src = e.target.result;
      };

      imgReader.onerror = function () {
        callback(false, "Failed to load image.");
      };

      imgReader.readAsDataURL(file);
    } else {
      callback(false, "Invalid file signature.");
    }
  };

  reader.onerror = function () {
    callback(false, "Error reading file.");
  };

  reader.readAsArrayBuffer(file.slice(0, 4));
}

export default useLogout;
