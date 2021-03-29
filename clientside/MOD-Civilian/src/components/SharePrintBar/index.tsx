import React, { useState } from 'react';
import EmailIcon from '@svgs/email.svg';
import FBIcon from '@svgs/facebook.svg';
import LinkIcon from '@svgs/link.svg';
import PrinterIcon from '@svgs/printer.svg';
import TWIcon from '@svgs/twitter.svg';
import { isBrowser } from '@utils/helpers';

interface ISharePrintBarProps {
  category: string;
  benefit: string;
}

const SharePrintBar = ({ category, benefit }: ISharePrintBarProps) => {
  const [copied, setCopied] = useState(false);
  const windowURL = isBrowser ? window.location.href : null;
  // URL patterns for Social media sites share functionalities
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${windowURL}`;
  const twitterUrl = `https://twitter.com/share?text=${category} : ${benefit} &url=${windowURL}`;

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
    <div className="flex flex-row w-full py-2 px-4 lg:px-0 items-center">
      <button
        type="button"
        className="w-36 flex flex-row items-center text-secondary hover:text-primary"
        onClick={() => {
          printWindow();
        }}
      >
        <PrinterIcon className="w-6" />
        <span className="ml-1 md:ml-4 underline text-sm">Print this Page</span>
      </button>
      <span className="ml-0 md:ml-12">Share:</span>
      <a className="w-6 mx-1 md:mx-2 text-secondary hover:text-primary" target="_blank" href={facebookUrl}>
        <FBIcon />
      </a>
      <a className="w-6 mx-1 md:mx-2 text-secondary hover:text-primary" target="_blank" href={twitterUrl}>
        <TWIcon />
      </a>
      <a
        className="w-6 mx-1 md:mx-2 text-secondary hover:text-primary"
        target="_blank"
        href={`mailto:%20?subject=${category} : ${benefit}&body=Here is a link to ${benefit} ${windowURL}`}
      >
        <EmailIcon />
      </a>
      <button
        type="button"
        className="w-18 flex flex-col items-center text-secondary hover:text-primary"
        onClick={() => {
          copyToClipboard(windowURL);
        }}
      >
        <span className="">
          <LinkIcon className="w-4" />
        </span>
        <span className="text-xs underline">{copied ? 'Copied!' : 'Copy link'}</span>
      </button>
    </div>
  );
};

export default SharePrintBar;
