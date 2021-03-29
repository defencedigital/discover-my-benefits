import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import EmailIcon from '../../images/svg/email.svg';
import FBIcon from '../../images/svg/facebook.svg';
import LinkIcon from '../../images/svg/link.svg';
import PrinterIcon from '../../images/svg/printer.svg';
import TWIcon from '../../images/svg/twitter.svg';

const ShareandPrintBar = ({ service, category, benefit }) => {
  const [copied, setCopied] = useState(false);
  const windowURL = window.location.href;
  // URL patterns for Social media sites share functionalities
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${windowURL}`;
  const twitterUrl = `https://twitter.com/share?text=${service.name} ${category.name} : ${benefit.title} &url=${windowURL}`;

  const copyToClipboard = url => {
    const tempInput = document.createElement('input');
    tempInput.style = 'position: absolute; left: -1000px; top: -1000px';
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    setCopied(true);
  };

  const printWindow = () => {
    window.print();
  };

  return (
    <Row>
      <Col xs="12" md="12">
        <div className="print-share-bar">
          <div className="print-links">
            <button
              type="button"
              className="print-link btn btn-sm"
              onClick={() => {
                printWindow();
              }}
            >
              <PrinterIcon />
              <span className="print-link-txt">Print this Page</span>
            </button>
          </div>
          <div className="share-links">
            <span className="share-txt">Share:</span>
            <a className="share-link" target="_blank" href={facebookUrl}>
              <FBIcon />
              <span>Facebook</span>
            </a>
            <a className="share-link" target="_blank" href={twitterUrl}>
              <TWIcon />
              <span>Twitter</span>
            </a>
            <a
              className="email-link share-link"
              target="_blank"
              href={`mailto:%20?subject=${service.name} ${category.name} : ${benefit.title}&body=Here is a link to ${benefit.title} ${windowURL}`}
            >
              <EmailIcon />
              <span>Email</span>
            </a>
            <button
              type="button"
              className="share-link"
              onClick={() => {
                copyToClipboard(windowURL);
              }}
            >
              <LinkIcon /> <span>{copied ? 'Copied!' : 'Copy link'}</span>
            </button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

ShareandPrintBar.propTypes = {
  service: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  benefit: PropTypes.object.isRequired,
};

export default ShareandPrintBar;
