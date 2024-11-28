<<<<<<< HEAD
// @ts-ignore -- This is a Vite virtual module. It will be resolved at build time.
export {default} from 'virtual:netlify-server-entry';
=======
import type {EntryContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'data:',
      'cdn.shopify.com',
      'http://localhost',
      'localhost',
      'localhost:1337',
      'http://localhost:1337',
      'https://hydrogen1-02a424e396cf1878f4cf.o2.myshopify.dev'
    ],
    imgSrc: [
      "*",
      "'self'",
      'data:',
      'cdn.shopify.com',
      'http://localhost',
      'http://70.34.196.235:5599',
      'http://70.34.196.235',
      'localhost',
      'localhost:1337',
      'http://localhost:1337',
      'https://hydrogencms.drew-k.com:81',
      'https://hydrogencms.drew-k.com:81/',
      'https://hydrogencms.drew-k.com',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  console.log("CSP header:");
  console.log(header);
  console.log(nonce);

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
>>>>>>> f8c63f65662a0f274a196ada90b2d25e4703bb85
