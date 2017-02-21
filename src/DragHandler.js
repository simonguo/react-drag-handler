import React from 'react';
import { findDOMNode } from 'react-dom';
import { DOMMouseMoveTracker, getHeight, getWidth, addStyle } from 'dom-lib';

const DragHandler = React.createClass({
    propTypes: {
        onDragMove: React.PropTypes.func,
        onDragEnd: React.PropTypes.func,
        onDragDown: React.PropTypes.func,
        embed: React.PropTypes.element,
    },
    getMouseMoveTracker() {
        return this._mouseMoveTracker || new DOMMouseMoveTracker(
            this.hanldeDragMove,
            this.hanldeDragEnd,
            document.body
        );
    },
    hanldeDragMove(deltaX, deltaY, event) {
        const { onDragMove } = this.props;
        if (this._mouseMoveTracker.isDragging()) {
            const dragmover = findDOMNode(this.dragmover);
            const height = getHeight(dragmover);
            const width = getWidth(dragmover);

            addStyle(findDOMNode(this.dragmover), {
                display: 'block',
                left: (event.clientX - (width / 2)) + 'px',
                top: (event.clientY - (height / 2)) + 'px'
            });

            onDragMove && onDragMove(deltaX, deltaY, event);
        }
    },
    hanldeDragEnd() {
        const {onDragEnd} = this.props;
        const dragmover = findDOMNode(this.dragmover);
        addStyle(findDOMNode(this.dragmover), {
            display: 'none'
        });
        this._mouseMoveTracker.releaseMouseMoves();
        onDragEnd && onDragEnd();
    },
    hanldeMouseDown(event) {
        const { onDragDown } = this.props;
        this._mouseMoveTracker = this.getMouseMoveTracker();
        this._mouseMoveTracker.captureMouseMoves(event);
        onDragDown && onDragDown();
    },
    componentWillUnmount() {
        if (this._mouseMoveTracker) {
            this._mouseMoveTracker.releaseMouseMoves();
            this._mouseMoveTracker = null;
        }
    },
    render() {
        const { embed } = this.props;
        const child = React.Children.only(this.props.children);
        const childElement = (
            <div className="drag-handler-wrapper">
                <div
                    ref={(ref) => {
                        this.dragmover = ref;
                    }}
                    className="drag-mover">
                    {child.props.children}
                </div>
                {child.props.children}
                {embed}
            </div>
        );


        return React.cloneElement(child, {
            onMouseDown: this.hanldeMouseDown
        }, childElement);
    }
});

export default DragHandler;
