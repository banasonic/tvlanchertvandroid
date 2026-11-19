(function () {
  const ENDPOINT = 'https://speed.cloudflare.com';
  const DEFAULT_BYTES = 1000000;

  async function timedFetch(url, options) {
    const started = performance.now();
    const response = await fetch(url, { cache: 'no-store', ...options });
    if (!response.ok) throw new Error(`Cloudflare speed test returned HTTP ${response.status}`);
    const body = await response.arrayBuffer();
    const elapsedSeconds = Math.max((performance.now() - started) / 1000, 0.001);
    return { bytes: body.byteLength, elapsedSeconds, mbps: (body.byteLength * 8) / elapsedSeconds / 1_000_000 };
  }

  async function run(bytes = DEFAULT_BYTES) {
    const nonce = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const download = await timedFetch(`${ENDPOINT}/__down?bytes=${bytes}&_=${nonce}`);
    const payload = new Uint8Array(bytes);
    const uploadStarted = performance.now();
    const uploadResponse = await fetch(`${ENDPOINT}/__up?_=${nonce}`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: payload
    });
    if (!uploadResponse.ok) throw new Error(`Cloudflare upload test returned HTTP ${uploadResponse.status}`);
    await uploadResponse.arrayBuffer();
    const uploadSeconds = Math.max((performance.now() - uploadStarted) / 1000, 0.001);
    return {
      downloadMbps: download.mbps,
      uploadMbps: (bytes * 8) / uploadSeconds / 1_000_000,
      downloadSeconds: download.elapsedSeconds,
      uploadSeconds,
      bytes,
      source: 'Cloudflare Speed Test',
      approximate: true
    };
  }

  window.TVSpeed = { run };
})();
