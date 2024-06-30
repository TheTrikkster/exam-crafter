export type OptionsType = {
  classe: string;
  filiere: string;
  matiere: string;
  chapitre: string;
  questions: string;
  multipliedQuestions?: string;
};

export class CreateCreateExamDto {
  options: OptionsType;
}
