import './Drafting.scss';
import Head from '@/components/head/Head';
import { DraftingFunctions } from './functions';

function Drafting() {
    
  return (
    <>
      <Head 
        title="Créez votre examen sur mesure avec Exeam Crafter | Génération par IA à partir de votre leçon"
        description="Personnalisez votre examen avec Exeam Crafter. Fournissez une leçon et laissez l'IA créer un examen sur mesure pour une préparation optimale." 
        keywords="créer examen, examen sur mesure, IA, personnalisation, leçon, étude, préparation examen" />
      <DraftingFunctions />
    </>
  )
}

export default Drafting;