import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Row, Col } from 'reactstrap';
import { COC_FORM_ID } from '../../containers/BenefitsComparator/constants';

import Label from './Label';
import Hint from './Hint';
import Success from './Success';
import Error from './Error';
import Input from './Input';
import Text from './Input/Text';
import Select from './Input/Select';
import Date from './Input/Date';
import Number from './Input/Number';
import Radio from './Input/Radio';
import Button from './Input/Button';
import Jumbotron from './Input/Jumbotron';

import { chunk } from '../../utils/array';
import { getBenefitsQuestionsWithDependenciesRemoved } from '../../containers/Benefits/helpers';

class Form extends PureComponent {
  state = {
    form: null,
    values: null,
    valuesById: null,
  };

  componentWillMount() {
    if (this.props.form !== null) {
      this.setFormAndValues(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const sameForm = this.props.id === nextProps.id;
    if (sameForm && !this.props.id.includes(COC_FORM_ID)) {
      return;
    }

    if (this.props.form !== nextProps.form) {
      if (nextProps.form === null) {
        this.setState({
          form: null,
          values: null,
          valuesById: null,
        });
        return;
      }
      this.setFormAndValues(nextProps);
    }
  }

  getValuesFromForm(form) {
    const values = {};
    const valuesById = {};

    form.forEach(row => {
      row.forEach(item => {
        if (!item.name) {
          return;
        }

        valuesById[item.id] = item.value;
        values[item.name] = item.value;
      });
    });

    return {
      values,
      valuesById,
    };
  }

  setFormAndValues = props => {
    const values = {};
    const valuesById = {};

    [].concat(...props.form).forEach(field => {
      if (!field.name) {
        return;
      }

      const item = field;

      valuesById[item.id] = item.value;
      values[item.name] = item.value;

      if (field.onChangeReset instanceof Array && field.onChangeReset.length > 0) {
        item.onChangeReset = [].concat(...props.form).filter(f => field.onChangeReset.indexOf(f.name) !== -1);
      }

      //  item.dependencies.map((dependency) => {
      //    if (!item.dependencies || item.dependencies.length < 1) {
      //      return dependency;
      //    }
      //    if (typeof dependency.value === 'function') {
      //      return Object.assign(dependency, {
      //        dependencyQuestion: [].concat(...props.form).find((i) => i.id === dependency.question),
      //      });
      //    }
      //    return dependency;
      //  });
    });

    this.setState({
      form: props.form,
      values,
      valuesById,
    });
  };

  getStatus = field => {
    const { id, name } = this.props;

    if (field.label) {
      return (
        <h2 id={id} className="question-status">
          {name}
        </h2>
      );
    }

    return null;
  };

  getLabel = field => {
    const { id } = this.props;

    if (field.label) {
      return <Label id={id} field={field} />;
    }

    return null;
  };

  getHint = field => {
    const { id } = this.props;

    if (field.type === 'radio') {
      return null;
    }

    if (field.hint) {
      // @ts-ignore
      return <Hint id={id} field={field} />;
    }

    return null;
  };

  getError = field => {
    const { id } = this.props;

    if (field.error) {
      // @ts-ignore
      return <Error id={id} field={field} />;
    }

    return null;
  };

  getSuccess = field => {
    const { id } = this.props;

    if (field.success) {
      // @ts-ignore
      return <Success id={id} field={field} />;
    }

    return null;
  };

  getText = (field, id) => <Text id={id} field={field} handleChange={this.handleChange} />;

  getSelect = (field, id) => <Select id={id} field={field} handleChange={this.handleChange} />;

  getDate = (field, id) => <Date id={id} field={field} handleChange={this.handleChange} />;

  getNumber = (field, id) => <Number id={id} field={field} handleChange={this.handleChange} />;

  getRadio = (field, id) => <Radio id={id} field={field} handleChange={this.handleChange} />;

  // @ts-ignore
  getButton = (field, id) => <Button id={id} field={field} handleChange={this.handleChange} />;

  getJumbotron = (field, id) => <Jumbotron id={id} field={field} handleChange={this.handleChange} />;

  getInput = field => {
    const { id } = this.props;

    let Element = null;

    switch (field.type) {
      case 'text':
        Element = this.getText(field, id);
        break;
      case 'select':
        Element = this.getSelect(field, id);
        break;
      case 'date':
        Element = this.getDate(field, id);
        break;
      case 'number':
        Element = this.getNumber(field, id);
        break;
      case 'radio':
        Element = this.getRadio(field, id);
        break;
      case 'button':
        Element = this.getButton(field, id);
        break;
      case 'jumbotron':
        Element = this.getJumbotron(field, id);
        break;
      default:
        Element = <small>Unknown field type: {field.type === null ? 'null' : field.type}</small>;
    }

    return (
      <Input id={id} field={field}>
        {Element}
      </Input>
    );
  };

  getFieldItem = (groupLength, field, index, formOptions) => (
    <Col
      {...(formOptions.className === 'coc-form'
        ? // props to apply
          {}
        : // an empty object to spread no props when false
          { xs: 12, md: 12 / groupLength })}
      key={field.name}
    >
      <FormGroup
        data-label={field.name}
        aria-hidden={field.name === 'profile.servingtype' && formOptions.hideLabel}
      >
        {this.getLabel(field)}
        {this.getHint(field)}
        {this.getInput(field, index)}
        {this.getError(field)}
        {this.getSuccess(field)}
      </FormGroup>
    </Col>
  );

  renderRow({ children, key }) {
    return <Row key={key}>{children}</Row>;
  }

  getFieldGroup = (group, index, formOptions) => {
    const RowWrapper =
      formOptions.className !== 'coc-form'
        ? // @ts-ignore
          ({ children }) => this.renderRow({ children, index })
        : ({ children }) => <React.Fragment>{children}</React.Fragment>;

    return (
      <RowWrapper key={`row-wrapper-${index}`}>
        {group.map((field, itemIndex) => this.getFieldItem(group.length, field, itemIndex, formOptions))}
      </RowWrapper>
    );
  };

  getFieldErrors(item) {
    let errors = false;

    if (item.validation instanceof Array) {
      item.validation.reverse().forEach(validationFunction => {
        const test = validationFunction(item.value);
        if (test !== true) {
          errors = test;
        }
      });
    }

    return errors;
  }

  checkValidation() {
    const { form } = this.state;
    const formItemsBasedOnDependencies = this.removeFormItemsBasedOnDependencies(form);

    let errorCount = 0;

    [].concat(...formItemsBasedOnDependencies).map(item => {
      const itemToUpdate = item;
      const errors = this.getFieldErrors(item);

      if (errors) {
        itemToUpdate.error = errors;
        errorCount += 1;
      } else {
        itemToUpdate.error = null;
      }

      return item;
    });

    const allValues = this.getValuesFromForm(form);

    const entries = Object.entries(allValues.values);
    // eslint-disable-next-line no-restricted-syntax
    for (const [question, value] of entries) {
      if (question === 'profile.servingtype') {
        // @ts-ignore
        window.dataLayer.push({ servingtype: value });
      }
    }

    this.setState({
      form,
      values: allValues.values,
      valuesById: allValues.valuesById,
    });

    return errorCount;
  }

  // eslint-disable-next-line consistent-return
  handleChange = (field, value) => {
    const { form } = this.state;

    const { profileBenefit, servingType, profileBenefits } = this.props;

    const allFieldsWithSameName = [].concat(...form).filter(i => i.name === field.name);

    // Wondering if this is really needed anymore?
    // Depends if question updates need to be sent to the final page
    // If this is just for the changelog page then it can be removed as we are only interested in changed benefits now
    // @ts-ignore
    let updateTitle = null;
    let updateValue = null;
    let foundOption = false;

    allFieldsWithSameName.map(f => {
      const item = f;
      item.value = value;

      const errors = this.getFieldErrors(item);

      if (errors) {
        item.error = errors;
      } else {
        item.error = null;
      }

      if (item.onChangeReset instanceof Array && item.onChangeReset.length > 0) {
        item.onChangeReset.map(changeItem => {
          const itemToReset = changeItem;
          itemToReset.value = null;

          return itemToReset;
        });
      }

      if (!foundOption) {
        const potentialUpdateValue =
          item.options &&
          item.options.find(option => option.value.toString() === value || option.value === value);

        if (potentialUpdateValue) {
          updateValue = potentialUpdateValue.name;
          foundOption = true;
        } else {
          updateValue = value;
        }
      }

      updateTitle = item.label;
      return item;
    });

    const allValues = this.getValuesFromForm(form);
    if (servingType === false) {
      return this.setState(
        {
          form,
          values: allValues.values,
          valuesById: allValues.valuesById,
          lastUpdate: {
            question: updateTitle,
            value: updateValue,
          },
        },
        () => {
          if (this.props.onUpdate) {
            this.props.onUpdate(this.state.values, profileBenefit);
          }
          if (this.props.onHistory) {
            this.props.onHistory(this.state.values);
          }
        },
      );
    }

    if (servingType) {
      return this.setState(
        {
          form,
          values: allValues.values,
          valuesById: allValues.valuesById,
          lastUpdate: {
            question: updateTitle,
            value: updateValue,
          },
        },
        () => {
          if (this.props.onUpdate) {
            // We need to provide an update/check for COC and update for non COC
            this.props.onUpdate(this.state.values, profileBenefits);
          }
          if (this.props.onHistory) {
            this.props.onHistory(this.state.values, profileBenefits);
          }
        },
      );
    }

    this.setState(
      {
        form,
        values: allValues.values,
        valuesById: allValues.valuesById,
        // eslint-disable-next-line react/no-unused-state
        lastUpdate: {
          question: updateTitle,
          value: updateValue,
        },
      },
      () => {
        if (this.props.onUpdate) {
          this.props.onUpdate(this.state.values);
        }
        if (this.props.onHistory) {
          this.props.onHistory(this.state.lastUpdate);
        }
        if (this.props.onError) {
          const currentFormErrors = this.checkValidation();
          this.props.onError(currentFormErrors);
        }
      },
    );
  };

  handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    const { onSubmit } = this.props;

    const errors = this.checkValidation();

    if (errors === 0 && onSubmit) {
      onSubmit(this.state.values);
    }
  };

  removeDuplicates(myArr, prop) {
    const hasIDs = myArr.filter(item => item.id);
    let reducedArr;
    if (hasIDs.length > 0) {
      reducedArr = myArr.filter(
        (obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos,
      );
    } else {
      reducedArr = myArr;
    }
    return reducedArr;
  }

  removeFormItemsBasedOnDependencies(form) {
    const { dependencies, options, chunkBy } = this.props;
    const { valuesById } = this.state;
    const flattenedForm = [].concat(...form);
    const formsWithDependenciesRemoved = getBenefitsQuestionsWithDependenciesRemoved(
      flattenedForm,
      valuesById,
      dependencies,
      options,
    );
    const reducedForm = this.removeDuplicates(formsWithDependenciesRemoved, 'id');
    return chunk(reducedForm, chunkBy || 2);
  }

  renderNonCocForm({ children }) {
    return (
      <Row>
        <Col xs={12}>{children}</Col>
      </Row>
    );
  }

  render() {
    const { form } = this.state;

    const formWithDependenciesCalculated = this.removeFormItemsBasedOnDependencies(form);
    const { formOptions } = this.props;

    const Wrapper =
      formOptions.className !== 'coc-form'
        ? ({ children }) => this.renderNonCocForm({ children })
        : ({ children }) => <React.Fragment>{children}</React.Fragment>;

    return (
      <form onSubmit={this.handleSubmit} className={formOptions.className}>
        <Wrapper key="wrapper">
          {formWithDependenciesCalculated.map((group, groupIndex) =>
            this.getFieldGroup(group, groupIndex, formOptions),
          )}
        </Wrapper>
      </form>
    );
  }
}

Form.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  form: PropTypes.array.isRequired,
  name: PropTypes.string,
  profileBenefit: PropTypes.object,
  benefit: PropTypes.object,
  formOptions: PropTypes.object,
  onSubmit: PropTypes.func,
  onUpdate: PropTypes.func,
  onHistory: PropTypes.func,
  onError: PropTypes.func,
  dependencies: PropTypes.array,
  options: PropTypes.array,
  chunkBy: PropTypes.number,
  servingType: PropTypes.bool,
  profileBenefits: PropTypes.array,
};

export default Form;
