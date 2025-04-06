const config = {
    development: { Url: "http://localhost:5000/api/v1" },
    production: { Url:process.env.NEXT_PUBLIC_BACKEND_API_URL },
};

console.log("Config:", config);
console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_API_URL);
export default config;
