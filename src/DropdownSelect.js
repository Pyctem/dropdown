import React from 'react';
import { capitalize } from 'lodash';

export class DropdownSelect extends React.Component {
  render() {
    const { refSelect, toggle, value, label, className, disabled } = this.props;
    let cls = 'select';
    if (className) {
      cls += ` ${className}`;
    }
    if (disabled) {
      cls += ' is-disabled';
    }
    return (
      <div ref={refSelect} className={cls} onClick={toggle}>
        {label && <span className="select-label">{capitalize(label)}</span>}
        <span className="select-text">{value}</span>
        <span className="select-arrow" />
      </div>
    );
  }
}