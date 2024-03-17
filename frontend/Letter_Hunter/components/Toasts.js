import Toast from "react-native-toast-message";

export const toastError = (error) => {
  console.error(error);
  Toast.show({
    type: "error",
    text1: "Error",
    text2: error.toString()
  });
}

export const toastErrorWithMsg = (msg, error) => {
  console.error(error);
  Toast.show({
    type: "error",
    text1: msg,
    text2: error.toString()
  });
}