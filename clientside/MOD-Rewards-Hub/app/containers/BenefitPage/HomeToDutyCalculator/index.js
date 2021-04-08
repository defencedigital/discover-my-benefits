import React from 'react';
import { Col, Row } from 'reactstrap';
import FormBuilder from '../../../components/FormBuilder';

export class HTDTC extends React.PureComponent {
  // getSubmitButton() {
  //   return [
  //     {
  //       id: 'home-to-duty',
  //       // you need to pass an id to get the button to show
  //       type: 'button',
  //       value: 'Calculate HTDT',
  //     },
  //   ];
  // }

  constructor(props) {
    super(props);
    this.state = {
      accommodationType: 3,
      transportType: 0.25,
      distance: 15,
      total: null,
    };

    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.calculateHTD();
  }

  getAccommodationTypeQuestion = () => {
    const { accommodationType } = this.state;
    return [
      {
        id: 'AccommodationType',
        name: 'accommodationType',
        type: 'radio',
        label: 'Accommodation Type:',
        options: [
          {
            id: '1',
            value: 3,
            name: 'Service Accommodation',
            selected: true,
          },
          {
            id: '2',
            value: 9,
            name: 'Private Accommodation',
          },
        ],
        value: accommodationType,
      },
    ];
  };

  getTransportTypeQuestion = () => {
    const { transportType } = this.state;
    return [
      {
        id: 'TransportType',
        name: 'transportType',
        type: 'radio',
        label: 'Transport type:',
        options: [
          {
            id: '3',
            value: 0.25,
            name: 'Car',
            selected: true,
          },
          {
            id: '4',
            value: 0.15,
            name: 'Bicycle',
          },
        ],
        value: transportType,
      },
    ];
  };

  getDistanceQuestion = () => {
    const { distance } = this.state;
    return [
      {
        type: 'number',
        name: 'distance',
        label: 'Distance from Duty Station (using Google maps):',
        value: distance,
        icon: 'Miles',
        max: 50,
        min: 1,
        validation: [
          currentAnswer => {
            if (typeof currentAnswer === 'undefined') {
              return true;
            }

            const min = 1;
            const max = 50;

            if (currentAnswer % 1 !== 0) {
              return `Your distance must be a whole number and not contain any decimals`;
            }

            if (
              !currentAnswer ||
              currentAnswer.length === 0 ||
              parseFloat(currentAnswer) < min ||
              parseFloat(currentAnswer) > max
            ) {
              return `Your distance must be between ${min} and ${max} miles`;
            }

            return true;
          },
        ],
      },
    ];
  };

  getForm = () => [
    this.getAccommodationTypeQuestion(),
    this.getDistanceQuestion(),
    this.getTransportTypeQuestion(),
  ];

  getPersonalContribution(transport, accommodation) {
    // The PC for public accommodation auto is: £0.25 x 6 (3 miles contribution each way) x 18 x 12/365 = £0.89
    // do we have to times this daily rate by 18 Assuming the 18 days in a month? because when we do this we get a different value compared to not doing the 12/365 part.

    // const dailyRate = (transport * accommodation * 2 * 18 * 12) / 365;
    const monthlyRate = transport * accommodation * 2 * 18;
    return monthlyRate;
  }

  calculateHTD() {
    const { distance, transportType, accommodationType } = this.state;

    if (transportType !== null && accommodationType !== null) {
      const personalContribution = this.getPersonalContribution(transportType, accommodationType);

      if (accommodationType === 3 || (distance <= 27 && accommodationType === 9)) {
        const HDTMonthly = transportType * (distance * 2) * 18;
        let total = (HDTMonthly - personalContribution).toFixed(2);

        if (total <= 0) {
          total = 0;
        }

        this.setState({
          total,
        });
      }

      if (distance >= 28 && accommodationType === 9) {
        const A = transportType * 2 * 27;
        const B = transportType * 2 * (distance - 27) * (1 / 3);
        let total = ((A + B) * 18 - personalContribution).toFixed(2);

        if (total <= 0) {
          total = 0;
        }
        // const daily = (A + B) * 18 * 12/365;

        this.setState({
          total,
        });
      }
    }

    // return false;
  }

  handleFormUpdated = result => {
    if (result.transportType !== null) {
      this.setState({ transportType: result.transportType }, this.calculateHTD);
    }

    if (result.accommodationType !== null) {
      this.setState({ accommodationType: result.accommodationType }, this.calculateHTD);
    }
    if (result.distance !== null && result.distance !== '') {
      const distNum = parseInt(result.distance, 10);
      this.setState({ distance: distNum }, this.calculateHTD);
    }
  };

  render() {
    const { total, accommodationType, distance } = this.state;

    return (
      <>
        <div className="modal-inner wysiwyg">
          <Row>
            <Col md="12">
              <div className="home-to-duty-calc">
                <h2>Calculator</h2>
                <p>Use this to find out how much you could receive to cover Home to Duty travel.</p>
                <hr className="sep first" />
                <Row>
                  <Col xs="12" md="12">
                    <FormBuilder
                      formOptions={{ className: null, questionHeading: false }}
                      id="home-to-duty"
                      ref={this.myRef}
                      form={this.getForm()}
                      options={[]}
                      dependencies={[]}
                      onUpdate={this.handleFormUpdated}
                      chunkBy={1}
                    />
                    <hr className="sep last" />
                  </Col>
                </Row>
                <Row className="htd__pc">
                  {accommodationType && (
                    <>
                      <Col xs="12" md="10">
                        <p>
                          <b>Your personal contribution:</b>
                        </p>
                      </Col>
                      <Col xs="12" md="2">
                        <p className="h3">{accommodationType} miles</p>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        {total !== null && total >= 0 && distance > 0 && distance < 51 && distance !== '' && (
          <>
            <div className="htd__total">
              <Row className="htd-total__inner">
                <Col md="12" lg="10">
                  <p className="htd-total__txt h3">Monthly allowance* we{`'`}ll pay you for Home to Duty:</p>
                </Col>
                <Col md="12" lg="2">
                  <p className="htd-total__total h1">£{total}</p>
                </Col>
              </Row>
            </div>
            <div className="modal-inner wysiwyg">
              <Row>
                <Col md="12">
                  <p>
                    The automated monthly allowance assumes that you are a Regular or FTRS (FC), travelling on
                    average 18 days per month (this is paid daily and takes into account leave). Source: JSP
                    rates on Chapter 7, section 0325.
                  </p>
                </Col>
              </Row>
            </div>
          </>
        )}
      </>
    );
  }
}

export default HTDTC;
