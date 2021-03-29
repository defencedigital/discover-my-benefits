/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';

import ToolTip from '../../ToolTip';
import { slugify } from '../../../utils/string';

export class Desktop extends React.PureComponent {
  state = {
    scrollLeft: 0,
    scrollWidth: 0,
    elementWidth: 0,
  };

  componentDidMount() {
    const element = document.getElementById('scrollable');
    element.addEventListener('scroll', this.scroll);

    this.scroll();
  }

  componentWillUnmount() {
    const element = document.getElementById('scrollable');
    element.removeEventListener('scroll', this.scroll);
  }

  scroll = direction => {
    const element = document.getElementById('scrollable');
    if (direction === 'left') {
      element.scrollLeft -= 250;
    } else if (direction === 'right') {
      element.scrollLeft += 250;
    }

    this.setState({
      scrollLeft: element.scrollLeft,
      scrollWidth: element.scrollWidth,
      elementWidth: element.clientWidth,
    });
  };

  render() {
    const { salary, xFactor, leave, commitmentTypes, getClasses, slug } = this.props;
    const { scrollLeft, scrollWidth, elementWidth } = this.state;
    return (
      <div className="comparator-wrap desktop-comparator">
        <Button
          type="button"
          className={`comparator-carousel-arrow comparator-carousel-arrow-left ${
            scrollLeft === 0 ? 'disabled' : ''
          }`}
          onClick={() => this.scroll('left')}
        />
        <Button
          type="button"
          className={`comparator-carousel-arrow comparator-carousel-arrow-right ${
            scrollWidth - elementWidth === scrollLeft ? 'disabled' : ''
          }`}
          onClick={() => this.scroll('right')}
        />
        <Row className="inline-row">
          <Col className="comparator-col" xs="8" lg="4">
            <Row>
              <Col xs="4" lg="4" id="comparator-headings" className="comparator-headings-col">
                <Row>
                  <Col className="comparator-cell" md="12" />
                </Row>
                <Row>
                  <Col className="comparator-cell" md="12">
                    <p>Pay</p>
                  </Col>
                </Row>
                <Row>
                  <Col className="comparator-cell" md="12">
                    <p>
                      <Link to={slug} replace={false}>
                        X-Factor
                      </Link>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col className="comparator-cell" md="12">
                    <p>Leave</p>
                  </Col>
                </Row>
              </Col>
              <Col xs="8" lg="8" id="total" className="comparator-total">
                <Row>
                  <Col className="comparator-cell" xs="12">
                    <p>Your current serving type</p>
                  </Col>
                </Row>
                <Row>
                  <Col id="total-salary" className="comparator-cell" xs="12">
                    <p>{salary}</p>
                  </Col>
                </Row>
                <Row>
                  <Col id="total-xfactor" className="comparator-cell" xs="12">
                    <p>{xFactor}</p>
                  </Col>
                </Row>
                <Row>
                  <Col id="total-leave" className="comparator-cell" xs="12">
                    <p>
                      {leave} {leave === '1' ? 'day' : 'days'}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs="12" lg="8" className="comparator-col comparator-carousel" id="scrollable">
            <Row className="comparator-carousel-row" style={{ width: `${250 * commitmentTypes.length}px` }}>
              {commitmentTypes &&
                commitmentTypes.map(commitment => {
                  const classes = getClasses(commitment, false);
                  return (
                    <Col key={commitment.id} id="rewards-table" className="comparator-info col" xs>
                      <Row>
                        <Col
                          className="comparator-cell comparator-cell-heading"
                          id={`${commitment.title.toLowerCase().replace(/ /g, '-')}`}
                          xs="12"
                        >
                          <p>
                            <Link to={commitment.slug}>{commitment.title}</Link>
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          id={`${commitment.title.toLowerCase().replace(/ /g, '-')}-salary`}
                          className={classes.salaryClasses}
                          xs="12"
                        >
                          <p>
                            {commitment.salary.tooltip && (
                              <ToolTip
                                id={`c-${commitment.id}-salary-tooltip`}
                                content={commitment.salary.tooltip}
                              />
                            )}
                            {commitment.salary.value} {commitment.salary.tooltip ? 'per day' : ''}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          id={`${commitment.title.toLowerCase().replace(/ /g, '-')}-xfactor`}
                          className={classes.xFactorClasses}
                          xs="12"
                        >
                          <p dangerouslySetInnerHTML={{ __html: commitment.xFactor.value }} />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          id={`${commitment.title.toLowerCase().replace(/ /g, '-')}-leave`}
                          className={classes.leaveClasses}
                          xs="12"
                        >
                          <p>
                            {commitment.leave.tooltip && (
                              <ToolTip
                                id={slugify(commitment.leave.tooltip)}
                                content={commitment.leave.tooltip}
                              />
                            )}
                            {commitment.leave.value} {commitment.leave.value === 1 ? 'day' : 'days'}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  );
                })}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

Desktop.propTypes = {
  salary: PropTypes.string.isRequired,
  xFactor: PropTypes.string.isRequired,
  leave: PropTypes.string.isRequired,
  commitmentTypes: PropTypes.array.isRequired,
  getClasses: PropTypes.func.isRequired,
  slug: PropTypes.string,
};

export default Desktop;
