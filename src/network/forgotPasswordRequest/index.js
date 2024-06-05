import firebase from "../../firebase/config";

const forgotPasswordRequest = async (email) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    return { success: true };
  } catch (error) {
    let errorMessage = "Đã xảy ra lỗi, vui lòng thử lại.";
    if (error.code === 'auth/user-not-found') {
      errorMessage = "Email này chưa được đăng ký.";
    }
    return { success: false, error: { message: errorMessage } };
  }
};

export default forgotPasswordRequest;
