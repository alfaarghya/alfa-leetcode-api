const config = {
  port: process.env.PORT || 3000,
  trustProxy: parseInt(process.env.TRUST_PROXY || '', 10) || 1,
  // Your own LeetCode session, used only by /me/* routes. Leave unset to keep
  // those routes disabled. Never commit these values.
  leetcodeSession: process.env.LEETCODE_SESSION || '',
  leetcodeCsrfToken: process.env.LEETCODE_CSRF_TOKEN || '',
};

export default config;
