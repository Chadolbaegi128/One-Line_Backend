const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");
const { getAuth } = require("../config").firebase;

// Firebase ID 토큰 검증 미들웨어
const verifyIdToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const firebaseAuth = getAuth();

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(commonErrors.authError, 401, "토큰이 없습니다."));
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    req.idToken = idToken;
    next();
  } catch (error) {
    return next(
      new AppError(commonErrors.authError, 401, "토큰이 유효하지 않습니다.")
    );
  }
};

const verifyAdmin = async (req, res, nex) => {
  const authHeader = req.headers["authorization"];
  const firebaseAuth = getAuth();

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(commonErrors.authError, 401, "토큰이 없습니다."));
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const admin = decodedToken.admin;
    if (admin !== 1) {
      next(
        new AppError(
          commonErrors.authorizationError,
          403,
          "권한이 없는 사용자입니다."
        )
      );
    }

    next();
  } catch (error) {
    return next(
      new AppError(commonErrors.authError, 401, "토큰이 유효하지 않습니다.")
    );
  }
};

module.exports = {
  verifyIdToken,
  verifyAdmin,
};
