import styles from './Dropdown.less';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ChevronIcon from '../ChevronIcon/ChevronIcon';
import FieldMessage from '../private/FieldMessage/FieldMessage';
import FieldLabel from '../private/FieldLabel/FieldLabel';

function combineClassNames(props = {}, ...classNames) {
  const { className, ...restProps } = props;

  return {
    className: classnames.apply(null, [...classNames, className]), // eslint-disable-line no-useless-call
    ...restProps
  };
}

export default class Dropdown extends Component {
  static displayName = 'Dropdown';

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    valid: PropTypes.bool,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    inputProps: PropTypes.object,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([
          PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string
          })),
          PropTypes.string
        ]).isRequired,
        label: PropTypes.string
      })
    ),
    placeholder: PropTypes.string
  };

  static defaultProps = {
    className: '',
    placeholder: '',
    options: [],
    inputProps: {}
  };

  constructor() {
    super();

    this.renderSelect = this.renderSelect.bind(this);
  }

  renderOption({ value, label }) {
    return (<option
      value={value}
      key={value}
      className={styles.option}>
      { label }
    </option>);
  }

  renderSelect() {
    const { id, value, onChange, onFocus, onBlur, inputProps, options, placeholder } = this.props;
    const inputStyles = classnames({
      [styles.dropdown]: true,
      [styles.placeholderSelected]: !value && !inputProps.value
    });
    const allInputProps = {
      id,
      value,
      onChange,
      onFocus,
      onBlur,
      'aria-describedby': `${id}-message`, // Order is important here so passed in inputProps can overide this if requried
      ...combineClassNames(inputProps, inputStyles)
    };

    return (
      <select {...allInputProps}>
        <option
          value=""
          disabled={true}>
          { placeholder }
        </option>
        {
          options.map(option => {
            if (Array.isArray(option.value)) {
              return (<optgroup value="" label={option.label} key={option.label}>{option.value.map(this.renderOption)}</optgroup>);
            }
            return this.renderOption(option);
          })
        }
      </select>
    );
  }

  renderChevron() {
    return (
      <div className={styles.chevron}>
        <ChevronIcon
          svgClassName={styles.chevronSvg}
          direction="down"
        />
      </div>
    );
  }

  render() {
    const { id, className, valid } = this.props;
    const classNames = classnames({
      [styles.root]: true,
      [styles.invalid]: valid === false,
      [className]: className
    });

    // eslint-disable-next-line react/prop-types
    const { label, labelProps, secondaryLabel, tertiaryLabel, invalid, help, helpProps, message, messageProps } = this.props;

    return (
      <div className={classNames}>
        <FieldLabel {...{ id, label, labelProps, secondaryLabel, tertiaryLabel }} />
        {this.renderChevron()}
        {this.renderSelect()}
        <FieldMessage {...{ id: `${id}-message`, invalid, help, helpProps, valid, message, messageProps }} />
      </div>
    );
  }
}
