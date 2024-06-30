import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
// import { OptionsType } from './create_exam/dto/create-create_exam.dto';

const openai = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 1,
  modelName: 'gpt-3.5-turbo-0125',
});

const generatedResponse = (templateString: string) => {
  const prompt = PromptTemplate.fromTemplate(templateString);

  return prompt.pipe(openai).pipe(new StringOutputParser());
};

export const GeneratedExam = async (prompt, retryCount = 3) => {
  if (retryCount === 0) {
    throw new Error('Nombre maximum de tentatives atteint.');
  }

  let result;
  try {
    if (prompt.selectedQuestion) {
      const runnablesParameters: any = [
        {
          createdQuestion: generatedResponse(`
            Voici une liste des questions qui devaient être utilisées pour un examen:
            {generatedQuestions}
    
            Tu devras créer une nouvelle question qui remplacera:
            {selectedQuestion}
    
            La nouvelle question qui sera créée doit être complètement différente de la précédente et aussi des autres qui figurent dans la liste.
            
            Voici les détails et le contexte pour créer la nouvelle question:
              1. Niveau de la question: {classe} {filiere}
              2. Matière : {matiere}
              3. Chapitre : {chapitre}
              4. La question doit être uniquement répondable à l'écrit
          `),
          classe: (input) => input.classe,
          filiere: (input) => input.filiere,
          matiere: (input) => input.matiere,
          chapitre: (input) => input.chapitre,
          multipliedQuestions: (input) => input.multipliedQuestions,
          selectedQuestion: (input) => input.selectedQuestion,
          generatedQuestions: (input) => input.generatedQuestions,
        },
        {
          refinedQuestions: generatedResponse(`
            {createdQuestion}
        
            Affinez cette question pour garantir la clarté et l’alignement avec les normes d'un examen.
            C'est une question qui sera utilisé pour un examen.
            Retourne uniquement la question.
          `),
          generatedQuestions: (input) => input.generatedQuestions,
          selectedQuestion: (input) => input.selectedQuestion,
        },
        {
          replaceQuestion: generatedResponse(`
            Voici une liste des questions qui sera utilisées pour un examen:
            {generatedQuestions}
    
            Mais tu dois remplacer cette question:
            {selectedQuestion}
    
            Tu dois la remplacer avec celle là:
            {refinedQuestions}
        
            Remplacez l'ancienne question avec la nouvelle et retournez toutes les questions dans le même ordre qu'ils étaient, retourner uniquement les questions.
    
            Consignes supplémentaires :
            - Assurez-vous de parcourir chaque question dans l'ordre.
            - Ne modifiez pas l'ordre des questions autres que celle à remplacer.
          `),
          generatedQuestions: (input) => input.generatedQuestions,
        },
        {
          checkOrder: generatedResponse(`
            Voici une liste des questions qui devaient être utilisées pour un examen:
            {generatedQuestions}
    
            Voici la nouvelle liste qui la remplace:
            {replaceQuestion}
    
            Les deux listes sont identiques sauf pour une question qui a été remplacée. Vous devez vérifier que les questions de la nouvelle liste sont les mêmes et dans le bon ordre que l'ancienne, bien entendu la question qui a été modifiée doit être à la place de l'ancienne.
            À la fin renvoie la liste des questions.
          `),
        },
        generatedResponse(`
        {checkOrder}
        
        Effectuez une dernière vérification pour vous assurer que toutes les questions sont appropriées et prêtes pour un examen. 
        La réponse doit être sous forme d'un array contenant toutes les questions, surtout ne changez pas l’ordre des questions.
        Retourner le array et rien d'autre.
      `),
      ];

      const combinedChain = RunnableSequence.from(runnablesParameters);

      result = await combinedChain.invoke({
        ...prompt.selectedOptions,
        selectedQuestion: prompt.selectedQuestion,
        generatedQuestions: prompt.allQuestions,
      });
    } else {
      const runnablesParameters: any = [
        {
          allQuestions: generatedResponse(`
            Tu dois créer un examen personnalisé pour qu'un étudiant le passe et que ça lui soit utile et qu'il veut le refaire. Je vais te donner des détails et un contexte pour créer l'examen:
              1. L'examen est de niveau: {classe} {filiere}
              2. La matière: {matiere}
              3. Le chapitre: {chapitre}
              4. Crée {multipliedQuestions} questions pertinentes
              5. Ça doit être des questions qui peuvent être poser pendant un examen en {classe}
              6. Ça doit être uniquement des questions répondable par l'écrit
              7. Retourne uniquement les questions
          `),
          classe: (input) => input.classe,
          filiere: (input) => input.filiere,
          matiere: (input) => input.matiere,
          chapitre: (input) => input.chapitre,
          multipliedQuestions: (input) => input.multipliedQuestions,
          numberOfquestions: (input) => input.questions,
        },
        {
          selectedQuestions: generatedResponse(`
            {allQuestions}
        
            Choisie les {numberOfquestions} meilleurs et pertinents questions, ça doit aussi être des questions qu'un étudiant en {classe} {filiere} peut rencontrer lors d'un examen.`),
        },
        {
          refinedQuestions: generatedResponse(`
            {selectedQuestions}
        
            Affinez ces questions pour garantir la clarté et l’alignement avec les normes de l’examen. 
          `),
        },
        generatedResponse(`
          {refinedQuestions}
          
          Effectuer une dernière vérification pour s'assurer que toutes les questions sont appropriées, prêtes pour l'examen et que tout les prompts sont respecté.
          La réponse doit être sous forme d'un array avec les questions à l'intérieur.
        `),
      ];

      const combinedChain = RunnableSequence.from(runnablesParameters);

      const numberOfQuestions = (Number(prompt.questions) * 3).toString();

      result = await combinedChain.invoke({
        ...prompt,
        multipliedQuestions: numberOfQuestions,
      });
    }

    const parsedResult = JSON.parse(result);
    if (
      Array.isArray(parsedResult) &&
      (parsedResult.length == prompt.selectedOptions?.questions ||
        prompt?.questions)
    ) {
      return result;
    } else {
      return GeneratedExam(prompt, retryCount - 1);
    }
  } catch (error: any) {
    console.error('Erreur lors de la requête OpenAI:', error.message);
    throw error;
  }
};
