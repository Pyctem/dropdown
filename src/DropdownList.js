import React from 'react'
import { isEqual } from "lodash";

export class DropdownList extends React.Component {
  SCROLL_SIZE = 20;
  list = React.createRef();
  animationFrame = 0;

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      clientHeight: 0,
      scrollHeight: 0,
      scrollTop: 0,
      activeOffsetTop: 0,
      scrollToActive: true
    }
  }

  componentDidMount (prevProps, prevState) {
    document.addEventListener('click', this.onOutsideClick);
    this.list.current.addEventListener('wheel', this.listScroll, { passive: false });
    this.setState({ height: this.props.targetRect.height });
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onOutsideClick);
    this.list.current.removeEventListener('wheel', this.listScroll);
  }

  componentDidUpdate() {
    const { targetRect, setOffset } = this.props;
    const { activeOffsetTop, scrollToActive } = this.state;
    const listElement = this.list.current;
    const { clientHeight, scrollHeight } = listElement;
    const viewportHeight = window.innerHeight;
    const targetInViewport = targetRect.top >= window.pageYOffset
      && (targetRect.top + targetRect.height) <= (window.pageYOffset + window.innerHeight);

    const newState = { ...this.state, clientHeight, scrollHeight };

    if (scrollToActive) {
      const overTop = Math.abs(Math.min(0, targetRect.top - activeOffsetTop));
      const overBottom = Math.abs(Math.min(0, viewportHeight - (targetRect.top + scrollHeight - activeOffsetTop)));

      if (targetInViewport) {
        newState.height = Math.min(viewportHeight, scrollHeight - overTop - overBottom);
      }

      newState.scrollTop = overTop;
    }

    if (!isEqual(this.state, newState)) {
      this.setState(newState);
    }

    if (scrollToActive) {
      setOffset(activeOffsetTop);
    } else if (!targetInViewport) {
      setOffset(0);
    }

    listElement.scrollTop = this.state.scrollTop;
  }

  setActiveOffsetTop = (activeOffsetTop) => {
    if (activeOffsetTop !== this.state.activeOffsetTop) {
      this.setState({ activeOffsetTop })
    }
  };

  listScroll = (event) => {
    const { height, scrollTop, scrollHeight, clientHeight } = this.state;

    if (scrollHeight === height) {
      return;
    }

    const canScrollUp = scrollTop;
    const canScrollDown = scrollTop + clientHeight < scrollHeight;
    const isScrollingUp = event.deltaY < 0;
    const isScrollingDown = !isScrollingUp;
    const canExtension = height < window.innerHeight;

    if (canExtension && ((isScrollingDown && canScrollDown) || (isScrollingUp && canScrollUp))) {
      event.preventDefault();
      this.listExtension(event.deltaY);
      return;
    }

    let newScrollTop = null;

    if (isScrollingUp && canScrollUp) {
      newScrollTop = Math.max(0, scrollTop + event.deltaY);
    }

    if (isScrollingDown && canScrollDown) {
      newScrollTop = Math.min(scrollHeight - clientHeight, scrollTop + event.deltaY);
    }

    if (scrollTop !== newScrollTop && typeof newScrollTop === 'number') {
      this.setState({ scrollTop: newScrollTop, scrollToActive: false });
    }
  };

  listExtension = (delta) => {
    const { targetRect, setOffset, offsetTop } = this.props;
    const { height, scrollHeight } = this.state;
    const isDownScrolling = delta > 0;
    const scrollValue = Math.abs(delta);
    const newHeight   = Math.min(height + scrollValue, scrollHeight, document.body.offsetHeight);
    const newOffset   = Math.min(scrollHeight - (document.body.offsetHeight - targetRect.top), offsetTop + scrollValue);
    let newScrollTop  = Math.max(0, scrollHeight - newHeight);

    if (isDownScrolling) {
      newScrollTop = 0;
    }

    this.setState({ height: newHeight, scrollTop: newScrollTop, scrollToActive: false });

    if (isDownScrolling) {
      setOffset(newOffset);
    }
  };

  onArrowUpEnter = (event) => {
    const { height, scrollTop, scrollHeight } = this.state;

    const isFullHeight = scrollHeight === height;
    const canScrollUp = Boolean(scrollTop);

    if (isFullHeight || !canScrollUp) {
      this.onArrowLeave();
      return;
    }

    const canExtension = height < window.innerHeight;

    if (canExtension) {
      this.listExtension(-this.SCROLL_SIZE);
    } else {
      const newScrollTop = Math.max(0, scrollTop - this.SCROLL_SIZE);
      this.setState({ scrollTop: newScrollTop, scrollToActive: false });
    }

    this.animationFrame = requestAnimationFrame(this.onArrowUpEnter);
  };

  onArrowDownEnter = (event) => {
    const { height, scrollTop, clientHeight, scrollHeight } = this.state;

    const isFullHeight = scrollHeight === height;
    const canScrollDown = scrollTop + clientHeight < scrollHeight;

    if (isFullHeight || !canScrollDown) {
      this.onArrowLeave();
      return;
    }

    const canExtension = height < window.innerHeight;

    if (canExtension) {
      this.listExtension(this.SCROLL_SIZE);
    } else {
      const newScrollTop = Math.min(scrollHeight - clientHeight, scrollTop + this.SCROLL_SIZE);
      this.setState({ scrollTop: newScrollTop, scrollToActive: false });
    }

    this.animationFrame = requestAnimationFrame(this.onArrowDownEnter);
  };

  onArrowLeave = () => {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }
  };

  onOutsideClick = (event) => {
    const { onClose, tether } = this.props;
    if (!tether.element.contains(event.target) && !tether.target.contains(event.target)) {
      onClose();
    }
  };

  render() {
    const { height, scrollTop, clientHeight, scrollHeight } = this.state;
    const { items, value, onClose, onChange } = this.props;
    const list = this.list.current;
    const canScrollTop = list && Boolean(scrollTop);
    const canScrollBottom = list && Boolean(scrollTop + clientHeight < scrollHeight);

    return (
      <div ref={this.list} className={'option-list'} style={{ height }}>
        {canScrollTop && (
          <div
            className="dropdown-arrow arrowTop"
            onMouseEnter={this.onArrowUpEnter}
            onMouseLeave={this.onArrowLeave}
          />
        )}
        <div>
          {React.Children.map(items, (child) => (
            <child.type
              {...child.props}
              activeValue={value}
              onClose={onClose}
              onChange={onChange}
              setActiveOffsetTop={this.setActiveOffsetTop}
            />
          ))}
        </div>
        {canScrollBottom && (
          <div
            className="dropdown-arrow arrowBottom"
            onMouseEnter={this.onArrowDownEnter}
            onMouseLeave={this.onArrowLeave}
          />
        )}
      </div>
    );
  }
}