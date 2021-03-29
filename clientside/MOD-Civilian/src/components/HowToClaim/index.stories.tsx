import React from 'react';
import { storiesOf } from '@storybook/react';
import { HowToClaim } from '@components';

storiesOf('HowToClaim', module).add('HowToClaim', () => {
  const data = [
    {
      id: 'dafdc00b-7b14-47b8-8c95-e5512663d604',
      flatData: {
        name: 'Pension Scheme',
        richText: '<h2>How to Claim:</h2>\n<p>Lorem ipsum here</p>',
        steps: [
          {
            stepText:
              '<p>When you join the Civil Service you will receive an option pack giving details of the schemes that you can join.</p>',
          },
          {
            stepText:
              '<p>Visit <strong><a href="https://www.civilservicepensionscheme.org.uk/">Civil Service Pensions</a></strong> for further details on each of the schemes.</p>',
          },
          {
            stepText:
              '<p>Make a choice by completing the form contained in your New Starter Pack&nbsp; within 3 months of joining and send the completed provider application form and Pension Choices to the address given on the choices form.</p>',
          },
        ],
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="font-body">
        <HowToClaim data={data} />
      </div>
    </React.Fragment>
  );
});
