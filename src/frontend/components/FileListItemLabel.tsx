import classNames from "classnames";
import React from "react";

export function FileListItemLabel({children, isSelected, onClick}: {children: React.ReactNode, isSelected?: boolean, onClick: () => void}) {
    return (
        <div className={classNames(`file-list-item-label flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-200 line-clamp-1`, { 'bg-violet-200': isSelected })} onClick={onClick}>
            {children}
        </div>
    );
}
