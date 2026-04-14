const config = {
  port: process.env.PORT || 3000,
  trustProxy: parseInt(process.env.TRUST_PROXY || '', 10) || 1,
};

export default config;
