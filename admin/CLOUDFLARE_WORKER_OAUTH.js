// Cloudflare Worker — Decap CMS GitHub OAuth Proxy
// 部署到 Cloudflare Workers，設定環境變數：
//   GITHUB_OAUTH_ID     = GitHub OAuth App Client ID
//   GITHUB_OAUTH_SECRET = GitHub OAuth App Client Secret (放 Secret，不要放 Variable)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Step 1: /auth → redirect to GitHub OAuth
    if (url.pathname === '/auth') {
      const clientId = env.GITHUB_OAUTH_ID;
      const scope = 'repo,user';
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}`;
      return Response.redirect(authUrl, 302);
    }

    // Step 2: /callback → exchange code for token
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code', { status: 400 });
      }

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_OAUTH_ID,
          client_secret: env.GITHUB_OAUTH_SECRET,
          code: code,
        }),
      });

      const tokenData = await tokenRes.json();
      const token = tokenData.access_token;
      const provider = 'github';

      // Decap CMS expects this specific postMessage format
      const html = `<!DOCTYPE html>
<html><body><script>
(function() {
  function receiveMessage(e) {
    console.log("receiveMessage %o", e);
    window.opener.postMessage(
      'authorization:${provider}:success:{"token":"${token}","provider":"${provider}"}',
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:${provider}", "*");
})();
</script></body></html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
