import React from 'react'
import { DropdownList } from "./DropdownList";

export class DropdownPopup extends React.Component {
  render() {
    if (!this.props.isOpen) {
      return null;
    }

    return (
      <div ref={this.props.refList} className={'option-popup'}>
        <DropdownList {...this.props} />
      </div>
    );
  }
}