import Head from "next/head"

const Meta = ({ title, description }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <title>{title || "Vti"}</title>
      <meta property="og:description" content={description || ""} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <style jsx global>
      {`
        @font-face {
          font-family: "Noway-Medium";
          src: url("/fonts/noway/Noway-Medium.ttf") format("truetype");
          font-display: block;
        }
        @font-face {
          font-family: "Noway-Regular";
          src: url("/fonts/noway/Noway-Regular.ttf") format("truetype");
          font-display: block;
        }
      `}
    </style>
  </>
)

export default Meta
