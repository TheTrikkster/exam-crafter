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
        <meta property="og:image" content="URL_DE_VOTRE_IMAGE" /> {/* Si vous avez une image représentative pour votre site */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="URL_COMPLET_DE_LA_PAGE" /> {/* Mettre l'url de la page d'accueil */}
    </Head>
  )
}

export default Heads