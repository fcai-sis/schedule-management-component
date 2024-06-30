export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOGS_PATH: process.env.LOGS_PATH,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ENROLLMENTS_API_URL: process.env.ENROLLMENTS_API_URL,
  // STUDENT_PREFERENCE_API: process.env.STUDENT_PREFERENCE_API,
};

export const isDev = env.NODE_ENV === "development";

export const validateEnvironmentVariables = () => {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      // Warn the user that the environment variable is not set
      console.warn(`Environment variable ${key} is not set!`);
    }
  });
};

export default env;
