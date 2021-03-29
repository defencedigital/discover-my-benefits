import React from 'react';
import { useToggle } from '@utils/hooks';

interface IAccordionProps {
  data: {
    title: string;
    content: string;
  };
}

const Accordion = ({ data }: IAccordionProps): JSX.Element => {
  const [isActive, toggleIsActive] = useToggle(false);
  const { title, content } = data;
  return (
    <React.Fragment>
      <div>
        <h3>
          <button
            className="underline outline-none border-none bg-transparent font-semibold focus:outline-none mb-2"
            onClick={() => toggleIsActive()}
            aria-expanded={isActive}
            aria-controls={`acc-${title}`}
            type="button"
          >
            <span className="w-4" />
            <span>{title}</span>
          </button>
        </h3>
        <div className={`${isActive ? 'visible' : 'hidden '} relative`} id={`acc-${title}`}>
          <span
            className="ml-3 w-1 h-full bg-gray-500 absolute top-0 bottom-0
          left-0"
          />
          <div className="pl-6" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Accordion;
