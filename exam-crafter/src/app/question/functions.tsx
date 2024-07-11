'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { SyncLoader } from 'react-spinners';
import { QuestionType } from './[id]/page';
import './[id]/Question.scss';
import CloseIcon from '../../../public/effacer.png';
import Image from 'next/image';

export const QuestionFunctions = ({ params }: QuestionType) => {
  const id = useMemo(() => Number(params.id), [params.id]);
  const router = useRouter();
  const [response, setResponse] = useState<string>('');
  const [reponseError, setReponseError] = useState<{
    toLong: boolean;
    generation: boolean;
  }>({ toLong: false, generation: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [allResponses, setAllResponses] = useState<Record<number, string>>({});

  useEffect(() => {
    setQuestions(JSON.parse(window.localStorage.getItem('questions') || '[]'));
    setAllResponses(
      JSON.parse(window.localStorage.getItem('responses') || '{}')
    );
  }, []);

  const sendResponse = useCallback(() => {
    allResponses[id] = response;
    window.localStorage.setItem('responses', JSON.stringify(allResponses));
  }, [allResponses, id, response]);

  const request = useCallback(async () => {
    try {
      const waitResponse = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCTION_API_URL}/correct-exam`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            questions,
            responses: allResponses
          })
        }
      );
      if (!waitResponse.ok) {
        setLoading(false);
        alert('La correction a échoué');
        throw new Error('La requête a échoué');
      }

      const correctionExam = await waitResponse.json();
      return correctionExam;
    } catch (err) {
      console.error(err);
    }
  }, [questions, allResponses]);

  const fetchData = useCallback(async () => {
    try {
      const corrections = await request();
      window.localStorage.setItem('corrections', JSON.stringify(corrections));
      router.push(`/result`);
    } catch (err) {
      console.error(err);
    }
  }, [request, router]);

  const confirmOptionChange = useCallback(() => {
    setShowModal(false);
    window.localStorage.setItem('questions', JSON.stringify([]));
    window.localStorage.setItem('responses', JSON.stringify({}));
    window.localStorage.setItem('corrections', JSON.stringify([]));
    router.push(`/drafting`);
  }, [router]);

  const cancelOptionChange = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleAnswer = useCallback(
    (nextQuestionId: number) => {
      router.push(`/question/${nextQuestionId}`);
    },
    [router]
  );

  const nextQuestion = useCallback(() => {
    if (response.length < 10000) {
      sendResponse();
      if (questions.length === id) {
        setLoading(true);
        fetchData();
      } else {
        handleAnswer(id + 1);
      }
    } else {
      setReponseError(prevState => ({
        ...prevState,
        toLong: true
      }));
    }
  }, [response, questions.length, id, fetchData, handleAnswer, sendResponse]);

  if (loading) {
    return (
      <div className="Question_loading_or_do_not_exist">
        <SyncLoader color="#34495E" size={18} />
        <p className="Question_loading_text_or_do_not_exist">correction</p>
      </div>
    );
  }

  if (
    id < 1 ||
    id > questions.length ||
    Object.keys(allResponses).length !== id - 1
  ) {
    return (
      <div className="Question_loading_or_do_not_exist">
        <p className="Question_loading_text_or_do_not_exist">
          {id < 1 || id > questions.length
            ? "Cette page n'existe pas"
            : "Cette page n'est pas disponible"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showModal && (
        <div className="Question_modal">
          <div className="Question_modal_content">
            <p>
              Êtes-vous sûr de vouloir quitter ? <br /> Cela supprimera
              l&#39;examen.
            </p>
            <div className="Question_modal_buttons">
              <button onClick={confirmOptionChange}>Confirmer</button>
              <button onClick={cancelOptionChange}>Annuler</button>
            </div>
          </div>
        </div>
      )}
      <main className="Question_main">
        <div className="w-full flex items-center justify-between">
          <div className="w-9/12 mt-16 mb-10">
            <p className="text-2xl text-black font-semibold mb-5">
              Question {id}
            </p>
            {questions.length > 0 && <h3>{questions[id - 1]}</h3>}
          </div>
          <Image
            src={CloseIcon}
            alt="icon pour fermer menu"
            onClick={() => setShowModal(true)}
            className="cursor-pointer"
            width={30}
          />
        </div>
        {reponseError.toLong || reponseError.generation ? (
          <p className="Question_reponse_to_long">
            {reponseError.toLong
              ? 'Votre réponse est beaucoup trop longue'
              : 'Erreur lors de la génération de la correction'}
          </p>
        ) : null}
        <textarea
          style={{ resize: 'none', caretColor: 'auto' }}
          className="Question_response_field"
          value={response}
          placeholder="Écrivez votre réponse ici"
          onChange={event => setResponse(event.target.value)}
        />
        <div className="Question_button_container">
          <button
            className={`${
              response.length > 0 ? ' opacity-100' : 'opacity-50'
            } w-36 bg-[#E54C18] text-white rounded-3xl p-3`}
            onClick={nextQuestion}
            disabled={response.length === 0}
          >
            valider
          </button>
        </div>
      </main>
    </div>
  );
};
