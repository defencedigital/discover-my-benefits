import React from 'react';
import { Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';

/**
 * @summary Accordion

* @property {string} accordionIndex The accordion index so scroll event can be used
* @property {func} handleAccordionClick function to handle the accordion opening/closing C
* @property {number} id ID of the accordion
* @property {string} index The index so the scroll to event can be used
* @property {string} subheading accordion subheading
* @property {children} children Child components can be passed in
* @property {string} title The accodrian title - h2
* @property {string} imgSrc The image used for the accordion

 *
 */

const Accordion = ({
  index,
  imgSrc,
  subheading,
  handleAccordionClick,
  title,
  accordionIndex,
  children,
  id,
}) => {
  function aria() {
    if (accordionIndex === index) {
      return true;
    }
    return false;
  }
  return (
    <div
      id={`COC_FORM_ID:${id}`}
      className={`accordion  ${accordionIndex !== index ? 'is-closed' : 'is-open'}`}
      data-component="accordion"
      aria-expanded={aria()}
      data-state={`${accordionIndex !== index ? 'closed' : 'open'}`}
    >
      <button
        type="button"
        data-ga-category="my details"
        data-ga-action="open"
        data-ga-label={title}
        className="accordion-trigger mb-3"
        onClick={e => handleAccordionClick(index, e, id)}
      >
        <Row className="mb-3" start="xs">
          <Col md="0" lg="3">
            <img src={imgSrc} alt={title} width="250px" className="accordion-image md-hide" />
          </Col>
          <Col md="12" lg="9" className="accordian-content-wrapper">
            <h2
              data-ga-category="my details"
              className="accordion-title"
              data-ga-action="open"
              data-ga-label={title}
            >
              {title}
            </h2>
            <p className="text-left">{subheading}</p>
          </Col>
        </Row>
      </button>
      <Row className="justify-content-end">
        <Col sm="9" className="accordion-content">
          {children}
        </Col>
      </Row>
    </div>
  );
};

Accordion.propTypes = {
  id: PropTypes.any,
  title: PropTypes.string,
  index: PropTypes.number,
  accordionIndex: PropTypes.number,
  handleAccordionClick: PropTypes.func,
  subheading: PropTypes.string,
  imgSrc: PropTypes.string,
  children: PropTypes.node,
};

export default Accordion;
