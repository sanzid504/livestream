import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin={true} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800&family=Noto+Serif+Bengali:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta charset="utf-8" />

        <meta name="google-site-verification" content="a8-6z7fuYRwaqK0-5wFeVJwoTJ0UuQ8N9jrNz5j7PoU" />

        <link rel="apple-touch-icon" sizes="180x180" href="https://assets.chorcha.net/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://assets.chorcha.net/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://assets.chorcha.net/favicons/favicon-16x16.png" />
        <link rel="manifest" href="https://assets.chorcha.net/favicons/site.webmanifest" />
        <link rel="mask-icon" href="https://assets.chorcha.net/favicons/safari-pinned-tab.svg" color="#1d3557" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#FFFFFF" />

        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
      </Head>
      <body className='bg-brand' suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
