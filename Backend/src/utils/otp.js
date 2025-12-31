const crypto = require("crypto");

exports.generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = crypto.createHash("sha256").update(otp).digest("hex");

  return {
    otp,
    hash,
    expiry: new Date(Date.now() + 10 * 60 * 1000)
  };
};

exports.verifyOTP = (otp, hash) => {
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  return otpHash === hash;
};
