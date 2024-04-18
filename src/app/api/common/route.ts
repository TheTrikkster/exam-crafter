import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const openai = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 1,
  modelName: "gpt-3.5-turbo-0125",
});

const differentPrompts = {
  verify: `Tu es un professeur spécialisé en pédagogie, tu as pour tâche d'analyser un texte pour déterminer s'il peut servir de base à un examen pour tes élèves. Pour cela, le texte doit présenter les caractéristiques d'une leçon structurée.
  Une leçon authentique devrait posséder:
    1. Une structure claire et organisée, avec éventuellement des titres ou des sous-titres.
    2. Des informations pédagogiques pertinentes et cohérentes sur un sujet spécifique.
    3. Une progression logique des idées permettant une compréhension aisée.
  Selon ces critères, le texte qui est fournie est-il une leçon adaptée à la création d'un examen ?
  Si c'est un cours le string doit être égal à VALID sinon INVALID`,

  createExam: `Tu es un professeur qui doit créer un examen de 10 questions pour tes élèves.
  Afin de créer ce test tu devras te basé sur le dernier cours que tu as donner à tes élèves.
  La question doit être formulée de telle manière que seule une réponse textuelle soit appropriée.
  Les questions doivent évaluer la compréhension générale du sujet sans se référer ni dépendre d'un élément, exemple ou cas particulier de la leçon. Les questions doivent pouvoir être répondue en se basant uniquement sur l'ensemble du contenu général et non sur des détails spécifiques.`,

  correction: `Tu es un professeur qui doit corriger et attribuer une note la réponse à la question d’un élève.
  Si la réponse est à fausse ou partiellement juste tu devras fournir la correction et uniquement la correction sans rien de plus à cette réponse.
  La correction ne devras pas être beaucoup trop long.
  Tu devras attribué une note à la réponse de l’élève, l’évaluation se fera ainsi: 1 point pour une réponse juste, 0,5 pour une réponse partiellement juste, et 0 pour une réponse fausse.
  Si la réponse n'est pas conforme à la question attribuez 0 point.
  Afiicher uniquement le nombre du resultat et rien d'autre.`,
  comment: `Tu es un professeur qui doit commenter la copie de l'examen d'un élève.
  Une copie d'un examen te sera fournie. Ta tâche sera d'analyser en détail chacune des questions et des réponses fournies dans cette copie. Suite à cette analyse, te devras fournir un commentaire général qui évalue l'examen dans son ensemble.
  Le commentaire doit être pertinent et doit aider l’élève à avancer.
  Afficher uniquement le commentaire général et rien d'autre.
  Le commentaire ne doit pas être très long.`,
};

const choosedPrompt = (choosedPrompt: string, prompt: string) => {
  let thePrompt = "";
  switch (choosedPrompt) {
    case "verify":
      thePrompt = differentPrompts.verify;
      break;
    case "createExam":
      thePrompt = differentPrompts.createExam;
      break;
    case "correction":
      thePrompt = differentPrompts.correction;
      break;
    case "comment":
      thePrompt = differentPrompts.comment;
  }
  return thePrompt + " " + prompt;
};

export const response = async (prompt: string) => {
  // const chatResponse = await openai.completions.create({
  //   model: "gpt-3.5-turbo-1106",
  //   messages: [{ role: "user", content: choosedPrompt("verify", prompt) }],
  // });

  const prompt1 = PromptTemplate.fromTemplate(
    `
    Tu dois créer un examen personnalisé pour qu'un étudiant le passe et que ça lui soit utile et qu'il veut le refaire. Je vais te donner des détails et un contexte pour créer l'examen:
      1. L'examen est de niveau: {classe}
      2. La matière: {matiere}
      3. Le chapitre: {chapitre}
      4. Crée {numberOfQuestions} questions pertinentes
      5. Ça doit être des questions qui peuvent être poser pendant un examen en {classe}
      6. Ça doit être uniquement des questions répondable par l'écrit
      7. Retourne uniquement les questions
    `,
  );

  const prompt2 = PromptTemplate.fromTemplate(`
    {questions}

    Choisie les {tenQuestions} meilleurs et pertinents questions, ça doit aussi être des questions qu'un étudiant en {classe} peut rencontrer lors d'un examen.`);

  const prompt3 = PromptTemplate.fromTemplate(`
    {selectedQuestions}

    Affinez ces questions pour garantir la clarté et l’alignement avec les normes de l’examen. 
    Merci de les numéroter en ordre croissant, en commençant par 1, et de les retourner dans ce format. 
  `);

  const prompt4 = PromptTemplate.fromTemplate(`
    {refinedQuestions}
    
    Effectuer une dernière vérification pour s'assurer que toutes les questions sont appropriées, prêtes pour l'examen et que tout les prompts sont respecté.
    La réponse doit être sous forme de array avec les questions à l'intérieur.
  `);

  const chain = prompt1.pipe(openai).pipe(new StringOutputParser());
  const chain2 = prompt2.pipe(openai).pipe(new StringOutputParser());
  const chain3 = prompt3.pipe(openai).pipe(new StringOutputParser());
  const chain4 = prompt4.pipe(openai).pipe(new StringOutputParser());

  const combinedChain = RunnableSequence.from([
    {
      questions: chain,
      classe: (input) => input.classe,
      tenQuestions: (input) => input.tenQuestions,
    },
    {
      selectedQuestions: chain2,
    },
    {
      refinedQuestions: chain3,
    },
    chain4,
  ]);

  const result = await combinedChain.invoke({
    classe: "Terminal STI2D",
    matiere: "Ingénierie et Développement Durable (IDD)",
    chapitre: "Éco-conception",
    numberOfQuestions: "30",
    tenQuestions: "10",
  });

  return result;
};
