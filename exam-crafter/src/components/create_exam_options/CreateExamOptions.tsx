import React, { useRef, useCallback } from 'react';
import './CreateExamOptions.scss';
import { useAppContext } from '@/app/context';
import {
  OptionsSettingType,
  ShowPartsType,
  ChangedOptionType
} from '@/app/drafting/functions';

type RadioButtonType = {
  piece: string;
  checked: boolean;
  onChange: (value: string) => void;
};

type partType = {
  title: string;
  field: string;
};

type CreateExamOptionsType = {
  part: partType;
  options: string[];
  showParts: ShowPartsType;
  setShowParts: (
    value: ShowPartsType | ((prevState: ShowPartsType) => ShowPartsType)
  ) => void;
  setShowModal: (value: boolean | ((prevState: boolean) => boolean)) => void;
  setChangedOption: (
    value:
      | ChangedOptionType
      | ((prevState: ChangedOptionType) => ChangedOptionType)
  ) => void;
  setCollectedOptions: (
    value: string[][] | ((prevState: string[][]) => string[][])
  ) => void;
  setOptionsSetting: (
    value:
      | OptionsSettingType
      | ((prevState: OptionsSettingType) => OptionsSettingType)
  ) => void;
};

function CreateExamOptions({
  part,
  options,
  showParts,
  setShowParts,
  setShowModal,
  setChangedOption,
  setCollectedOptions,
  setOptionsSetting
}: CreateExamOptionsType) {
  const { title, field }: partType = part;
  const elementRef = useRef(null);
  const { selectedOptions, setSelectedOptions, generatedQuestions } =
    useAppContext();

  const RadioButton = ({ piece, checked, onChange }: RadioButtonType) => {
    return (
      <div
        className={`container ${checked ? 'checked' : ''}`}
        onClick={() => onChange(piece)}
        tabIndex={0}
        aria-checked={checked}
        role="radio"
        style={{ outline: 'none', width: 'auto' }}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            onChange(piece);
          }
        }}
      >
        <span className="checkmark"></span>
        <label className="label">{piece}</label>
      </div>
    );
  };

  const handlePieceChange = useCallback(
    (field: string, value: string) => {
      if (
        (showParts[field] === false && selectedOptions[field] === value) ||
        showParts[field]
      ) {
        setSelectedOptions(prevState => ({ ...prevState, [field]: value }));
      } else {
        setChangedOption({ champ: field, value });
        setShowModal(true);
      }
    },
    [
      showParts,
      selectedOptions,
      setChangedOption,
      setShowModal,
      setSelectedOptions
    ]
  );

  const scrollToElement = useCallback(
    (elementRef: React.RefObject<HTMLDivElement>) => {
      if (elementRef.current) {
        elementRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    },
    []
  );

  const handleKeyPress = useCallback(
    (event: { key: string; preventDefault: () => void }) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    },
    []
  );

  return (
    <div
      ref={elementRef}
      role="radiogroup"
      aria-labelledby="access-options"
      className="overflow-hidden transition-max-height ease-in-out mb-6 w-full"
    >
      <hr className={`${field === 'classe' ? 'hidden' : 'w-100 mb-3'}`} />

      <h3 id="access-options" className="text-xl mb-4">
        {title}
      </h3>
      <div
        className={`flex flex-wrap gap-3 ${
          field === 'classe' || field === 'questions' ? 'justify-center' : ''
        }`}
      >
        {options[0] !== 'true' ? (
          options.map((option, index) => (
            <RadioButton
              key={index}
              piece={option}
              checked={Object.values(selectedOptions).includes(option)}
              onChange={value => handlePieceChange(field, value)}
            />
          ))
        ) : (
          <div>
            <p className="text-black">
              Indiquez le chapitre sur lequel vous souhaitez passer l&#39;examen
            </p>
            <input
              type="text"
              value={selectedOptions[field]}
              className="CreateExamOptions_input"
              placeholder="exemple: Première Guerre Mondiale"
              maxLength={50}
              onChange={event => handlePieceChange(field, event.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        )}
      </div>
      <button
        className={`${
          field === 'questions'
            ? `${generatedQuestions?.length ? 'hidden' : ''} ${
                selectedOptions[field] && selectedOptions[field].length > 0
                  ? 'Drafting_button_create flex mx-auto mt-16'
                  : 'Drafting_button_create_close flex mx-auto mt-16'
              }`
            : `${
                showParts[field]
                  ? `flex ml-auto border-2 rounded-md p-2 mt-8 g-violet-500 ${
                      selectedOptions[field] &&
                      selectedOptions[field].length > 0
                        ? 'bg-violet-500 hover:bg-violet-700'
                        : 'bg-violet-300'
                    } text-white`
                  : 'hidden'
              }`
        }`}
        type={`${field === 'questions' ? 'submit' : 'button'}`}
        onClick={() => {
          setShowParts(prevState => ({ ...prevState, [field]: false }));
          if (field === 'classe') {
            setOptionsSetting({
              bound_to: selectedOptions[field],
              classe: ''
            });
          } else if (field === 'filiere') {
            setOptionsSetting(prevState => {
              if (
                ['Seconde', 'Première', 'Terminale'].includes(
                  prevState.bound_to
                )
              ) {
                return {
                  classe: prevState.bound_to,
                  bound_to: selectedOptions[field]
                };
              } else {
                return {
                  ...prevState,
                  bound_to: selectedOptions[field]
                };
              }
            });
          } else if (field === 'matiere') {
            setCollectedOptions(prevState => [...prevState, ['true']]);
          } else if (field === 'chapitre') {
            setCollectedOptions(prevState => [...prevState, ['5', '10', '15']]);
          }

          scrollToElement(elementRef);
        }}
        disabled={!(selectedOptions[field]?.length > 0)}
      >
        {field === 'questions' ? 'Créer Examen' : 'Continuer'}
      </button>
    </div>
  );
}

export default CreateExamOptions;
