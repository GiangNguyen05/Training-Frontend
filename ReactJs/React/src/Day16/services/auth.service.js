export const login = async (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === "g@gmail.com" && data.password === "000000") {
        resolve({
          token: "fake-token",
        });
      } else {
        reject(new Error("Sai email hoặc password"));
      }
    }, 1000);
  });
};
