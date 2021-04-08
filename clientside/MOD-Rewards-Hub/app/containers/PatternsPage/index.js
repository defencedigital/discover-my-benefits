/*
 * PatternsPage
 */

import React from 'react';
import { Row, Col } from 'reactstrap';

import Intro from '../../components/Intro';
import Page from '../../components/Page';
import Card from '../../components/Card';
import Breadcrumb from '../../components/Breadcrumb';
import FormBuilder from '../../components/FormBuilder';
import Masthead from '../../components/Masthead';
import ContainerInner from '../../components/ContainerInner';
import SearchPanel from '../../components/SearchPanel';
import FloatingFooter from '../../components/FloatingFooter';
import services from '../../json/squidex/services.json';
import Jumbotron from '../../components/Jumbotron';
import FormCta from '../../components/FormCta';

const PatternsPage = () => (
  <Page title="Patterns Page" description="sdfasdf" service={services[1]}>
    <ContainerInner className="no-padding-lrg">
      <Row>
        <Col xs="12">
          <br />
          <br />
          <Breadcrumb
            items={[
              {
                text: 'Home',
                slug: '/',
                active: true,
                icon: 'home',
              },
              {
                text: 'Library',
                slug: '/library',
                active: true,
                icon: 'grid',
              },
              {
                text: 'Boostrap',
                active: false,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <Intro
            title="This is an Intro Component"
            tagName="h2"
            subtitle="This is an optional subtitle"
            text="Intro text here"
          />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <FormBuilder
            formOptions={{ className: null, questionHeading: false }}
            form={[
              [
                {
                  type: 'text',
                  value: null,
                  label: 'Email address',
                  id: 'email',
                  name: 'email',
                  error: 'error text',
                  placeholder: 'placeholder text here',
                },
              ],
              [
                {
                  type: 'select',
                  value: null,
                  label: 'Age',
                  id: 'age',
                  name: 'age',
                  options: [
                    {
                      id: 1,
                      value: 1,
                      name: '1',
                    },
                    {
                      id: 2,
                      value: 2,
                      name: '2',
                    },
                  ],
                },
                {
                  type: 'date',
                  name: 'date',
                  label: 'Choose a date',
                  value: null,
                  id: 'date',
                  hint: 'hint text',
                },
              ],
              [
                {
                  type: 'radio',
                  name: 'radio',
                  value: null,
                  label: 'Radios',
                  id: 'radio',
                  options: [
                    {
                      id: 1,
                      value: 1,
                      text: 'One',
                    },
                    {
                      id: 2,
                      value: 2,
                      text: 'Two',
                    },
                    {
                      id: 3,
                      value: 3,
                      text: 'Three',
                    },
                    {
                      id: 4,
                      value: 4,
                      text: 'Four',
                    },
                    {
                      id: 5,
                      value: 5,
                      text: 'Five',
                    },
                    {
                      id: 6,
                      value: 6,
                      text: 'Six',
                    },
                  ],
                },
              ],
              [
                {
                  type: 'button',
                  value: 'submit button',
                },
              ],
            ]}
            options={[]}
            dependencies={[]}
          />
          <br />
          <br />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <Masthead imgSrc="https://dummyimage.com/1300x313/000/fff"></Masthead>
          <br />
          <br />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <SearchPanel
            bgColor="bg-gray"
            title="Welcome"
            text="Explore all of your personal benefits, entitlements and allowances."
            service={services[1]}
          />
          <br />
          <br />
        </Col>
      </Row>
      <Row>
        <Col xs="6">
          <Card
            image="https://www.army.mod.uk/media/3123/13403170_571187559720130_7697391771638481446_o.jpg?anchor=center&mode=crop&width=480&height=270&rnd=131653478000000000"
            className="card-sm"
            title="ARMY"
            link="/army"
            buttonText="Go to Army"
          />
        </Col>
        <Col xs="6">
          <Card
            image="https://www.royalnavy.mod.uk/-/media/careers-section-redesign/homepage/joining/favourites/fav_480x270-assets/fav_480x270_5.jpg"
            title="NAVY"
            link="/navy"
            buttonText="Go to Navy"
            className="card-sm"
          />
        </Col>
        <br />
        <br />
      </Row>
      <Row>
        <Col xs="12">
          <br />
          <br />
          <Jumbotron>
            <p> test</p>
          </Jumbotron>
          <br />
          <br />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <br />
          <br />
          <FormCta link="/test" />
          <br />
          <br />
        </Col>
      </Row>
    </ContainerInner>
    <Row>
      <Col xs="12">
        <FloatingFooter service={services[1]} />
      </Col>
    </Row>
  </Page>
);

export default PatternsPage;
