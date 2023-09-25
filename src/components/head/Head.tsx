import Head from 'next/head';

type HeadType = {
  title: string,
  description: string,
  keywords: string
} 

function Heads({title, description, keywords}: HeadType) {
  return (
    <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content="Exeam Crafter" />
        <meta property="og:description" content={description}  />
        <meta property="og:image" content="https://tinypic.host/image/POAhU" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://exam-crafter.com/" />
    </Head>
  )
}

export default Heads