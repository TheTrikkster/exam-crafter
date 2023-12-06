import Head from "next/head";
import { Fragment } from "react";
import GoogleAnalytics from "@bradgarropy/next-google-analytics";

type HeadType = {
  title: string;
  description: string;
  keywords: string;
};

function Heads({ title, description, keywords }: HeadType) {
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content="Exam Crafter" />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content="https://tinypic.host/images/2023/09/25/Votre-texte-de-paragraphe.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://exam-crafter.com/" />
        <meta name="twitter:title" content="Exam Crafter" />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content="https://tinypic.host/images/2023/09/25/Votre-texte-de-paragraphe.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <GoogleAnalytics measurementId="G-VFF60048TE" />
    </Fragment>
  );
}

export default Heads;
