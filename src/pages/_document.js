import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          {/* Aquí puedes agregar fuentes externas o metaetiquetas */}
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
          <link rel="icon" href="/images/favIcon.png" />
          <title>Star Wars App</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;